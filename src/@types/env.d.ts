declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LOCAL_ENV: string;
      POSTMAN_API_KEY: string;
      POSTMAN_WORKSPACE_ID: string;
      SWAGGER_FILE_PATH: string;
    }
  }
}

export {};
