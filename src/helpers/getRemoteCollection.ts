import type { Axios } from 'axios';
import type { Logger } from './getLogger';
import { AxiosError } from 'axios';

interface Context {
  client: Axios;
  logger: Logger;
}

const getRemoteCollection = async (
  collectionId: string,
  { client, logger }: Context,
): Promise<any> => {
  try {
    const {
      data: { collection },
    } = await client.get(`/collections/${collectionId}`);

    return collection;
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 404) {
        logger.setFailed(`This collection does not exist: ${collectionId}`);
        return;
      }

      logger.setFailed(
        `Status ${err.response?.status} - Response: ${err.response?.data}`,
      );
    }

    throw new Error(
      `Unable to fetch Remote Collections from Postman Workspace`,
    );
  }
};

export default getRemoteCollection;
