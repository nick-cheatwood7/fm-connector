declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_NAME: string;
      DB_HOST: string;
      DB_USER: string;
      DB_PASS: string;
    }
  }
}

export {}
