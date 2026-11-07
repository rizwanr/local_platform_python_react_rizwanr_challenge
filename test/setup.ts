import type { FullConfig } from '@playwright/test';

import * as dotenv from 'dotenv';

const setup = async (config: FullConfig) => {
  dotenv.config({ path: process.env.SERVER_ENV_PATH || `../code/server/.env` });
};

export default setup;
