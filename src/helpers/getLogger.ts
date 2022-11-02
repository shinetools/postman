import { info as coreInfo, setFailed as coreSetFailed } from '@actions/core';

export interface Logger {
  info: (input: string) => void;
  setFailed: (message: string | Error) => void;
}

const getLogger = (isDev: boolean = true): Logger => {
  const info = (input: string) => {
    if (isDev) {
      console.log(input);
      return;
    }

    return coreInfo(input);
  };

  const setFailed = (message: string | Error) => {
    if (isDev) {
      console.error(message);
      return;
    }

    return coreSetFailed(message);
  };

  return {
    info,
    setFailed,
  };
};

export default getLogger;
