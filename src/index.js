const core = require('@actions/core');
const axios = require('axios');
const swaggerToCollection = require('swagger2-to-postmanv2');

const restClient = axios.create({
  baseURL: 'https://api.getpostman.com',
  headers: {
    'X-Api-Key': process.env.POSTMAN_API_KEY,
  },
  timeout: 15000,
});

// ncc build index.js -o build && git add . && git commit --amend --no-edit && git push -f

const postmanWorkspaceId = process.env.POSTMAN_WORKSPACE_ID;
const swaggerFilePath = core.getInput('swaggerFilePath');

async function readSwaggerFile() {
  try {
    const collection = await new Promise((resolve, reject) => {
      swaggerToCollection.convert(
        {
          data: swaggerFilePath,
          type: 'file',
        },
        {
          exampleParametersResolution: 'Schema',
          folderStrategy: 'Tags',
          requestNameSource: 'Fallback',
          requestParametersResolution: 'Schema',
        },
        (err, data) => {
          if (err) {
            reject(err);
          }

          resolve(data.output[0].data);
        },
      );
    });
    return collection;
  } catch (e) {
    throw new Error(`Unable to read swagger.yaml file`);
  }
}

async function loadRemotePostmanCollections() {
  try {
    const { data } = await restClient.get('/collections', {
      params: {
        workspace: postmanWorkspaceId,
      },
    });

    const remoteCollections = data.collections.filter(
      (collection) => !collection.fork,
    );

    core.info(
      `${remoteCollections.length} Non-Forked Collection(s) found for the given API Key in Remote Postman`,
    );

    return remoteCollections;
  } catch (error) {
    core.setFailed(
      `Status ${error.response?.status} - Response: ${error.response?.data}`,
    );
    throw new Error(
      `Unable to fetch Remote Collections from Postman Workspace`,
    );
  }
}

function overrideCollection(collection) {
  const { auth, event, variable, ...filteredCollection } = collection;

  // const newCollection = {
  //   ...collection,
  //   auth: {
  //     bearer: [
  //       {
  //         key: 'token',
  //         type: 'string',
  //         value: '{{accessToken}}',
  //       },
  //     ],
  //     type: 'bearer',
  //   },
  // };

  return filteredCollection;
}

async function run() {
  try {
    const [localCollection, remoteCollections] = await Promise.all([
      readSwaggerFile(),
      loadRemotePostmanCollections(),
    ]);

    const localRepositoryName = localCollection.info.name;

    const remoteCollection = remoteCollections.find(
      (remoteColl) => remoteColl.name === localRepositoryName,
    );

    core.info(JSON.stringify(remoteCollection, null, 2));

    if (!remoteCollection) {
      core.info(`I SHOULD CREATE A NEW COLLECTION !! OMG`);

      await restClient.post(`/collections?workspace=${postmanWorkspaceId}`, {
        collection: overrideCollection(localCollection),
      });
    } else {
      core.info(
        `HEY I FOUND AN EXISTING COLLECTION, WE SHOULD UPDATE IT RIGHT?`,
      );

      await restClient.put(`/collections/${remoteCollection.uid}`, {
        collection: overrideCollection(localCollection),
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
