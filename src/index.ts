import { config } from 'dotenv';

config();

import getLogger from './helpers/getLogger';
import getInputs from './helpers/getInputs';
import axios from 'axios';

import getLocalSwaggerFileCollection from './helpers/getLocalSwaggerFileCollection';
import getRemoteCollection from './helpers/getRemoteCollection';

const inputs = getInputs();
const logger = getLogger(inputs.isDev);

const client = axios.create({
  baseURL: 'https://api.getpostman.com',
  headers: {
    'X-Api-Key': inputs.postmanApiKey,
  },
  timeout: 15000,
});

function initializeCollection(collection: {}) {
  console.log(collection);

  // const { auth, event, variable, ...filteredCollection } = collection;

  // const basePath = getBasePathFromURN(collection.)

  const initializedCollection = {
    ...collection,
    auth: {
      bearer: [
        {
          key: 'token',
          type: 'string',
          value: '{{accessToken}}',
        },
      ],
      type: 'bearer',
    },
    variable: [
      {
        type: 'string',
        value: '{{host}}',
        key: 'path',
      },
    ],
  };

  return initializedCollection;

  // return filteredCollection;
}

function updateCollection(collection: unknown) {
  return collection;
  // const { auth, event, variable, ...filteredCollection } = collection;

  // // const newCollection = {
  // //   ...collection,
  // //   auth: {
  // //     bearer: [
  // //       {
  // //         key: 'token',
  // //         type: 'string',
  // //         value: '{{accessToken}}',
  // //       },
  // //     ],
  // //     type: 'bearer',
  // //   },
  // // };

  // return filteredCollection;
}

(async () => {
  const [localCollection, remoteCollection] = await Promise.all([
    getLocalSwaggerFileCollection(inputs.swaggerFilePath),
    getRemoteCollection(inputs.postmanCollectionId, { client, logger }),
  ]);

  let payload;

  if (remoteCollection.item.length === 0) {
    logger.info('The remote collection is empty, I will initialize it 🥳');
    payload = initializeCollection(localCollection as {});
  } else {
    logger.info(
      'The remote collection is already initiated, I will update it 💎',
    );
    payload = updateCollection(localCollection as {});
  }

  // await client.put(`/collections/${inputs.postmanCollectionId}`, {
  //   collection: payload,
  // });

  logger.info('🚀 The collection has been updated');
})();
