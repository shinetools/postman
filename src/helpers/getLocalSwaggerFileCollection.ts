// @ts-ignore
import swaggerToCollection from 'swagger2-to-postmanv2';

const getLocalSwaggerFileCollection = async (
  swaggerFilePath: string,
): Promise<any> =>
  new Promise((resolve, reject) => {
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
      (err: Error, data: any) => {
        if (err) {
          reject(err);
        }

        console.log(JSON.stringify(data, null, 2));

        resolve(data.output[0].data);
      },
    );
  }).catch(() => {
    throw new Error(`Unable to read swagger.yaml file`);
  });

export default getLocalSwaggerFileCollection;
