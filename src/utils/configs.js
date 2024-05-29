import dotEnv from 'dotenv';

dotEnv.config();

const configs = {
  serverPort: process.env.SERVER_PORT,
  customSecretKey: process.env.CUSTOM_SECRET_KEY,
};

export default configs;
