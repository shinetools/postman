import { getInput } from '@actions/core';
import getExcludedOperationIds from './getExcludedOperationIds';

interface Inputs {
  isDev: boolean;
  postmanApiKey: string;
  postmanCollectionId: string;
  collectionNameSuffix: string;
  excludeOperationIds: string[];
  swaggerFilePath: string;
}

const getInputs = (): Inputs => {
  const {
    CI = 'false',
    POSTMAN_API_KEY = '',
    POSTMAN_COLLECTION_ID = '',
    SWAGGER_FILE_PATH = '',
    COLLECTION_NAME_SUFFIX = '',
    EXCLUDE_OPERATION_IDS = '',
  } = process.env;

  if (CI === 'false') {
    return {
      isDev: true,
      postmanApiKey: POSTMAN_API_KEY,
      collectionNameSuffix: COLLECTION_NAME_SUFFIX,
      postmanCollectionId: POSTMAN_COLLECTION_ID,
      excludeOperationIds: getExcludedOperationIds(EXCLUDE_OPERATION_IDS),
      swaggerFilePath: SWAGGER_FILE_PATH,
    };
  }

  return {
    isDev: false,
    swaggerFilePath: getInput('swaggerFilePath'),
    collectionNameSuffix: getInput('collectionNameSuffix'),
    excludeOperationIds: getExcludedOperationIds(
      getInput('excludeOperationIds'),
    ),
    postmanApiKey: getInput('postmanApiKey'),
    postmanCollectionId: getInput('postmanCollectionId'),
  };
};

export default getInputs;
