import dotEnv from 'dotenv';
import path from 'path';
import logger from './logger';

const configPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotEnv.config({ path: configPath });

import config from "./config";

import { server } from './server';

server({
    preTap:({request}) => logger.info(`request: ${JSON.stringify(request)}`),
    postTap:({response}) => logger.info(`response: ${JSON.stringify(response)}`),
    catchTap: error => logger.error(`error: ${JSON.stringify(error)}`),
}).listen(config.server.port, () => {
    console.log('Listening port', config.server.port);
})
