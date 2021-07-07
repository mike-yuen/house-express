import moduleAlias from 'module-alias';
moduleAlias.addAliases({
  '@': `${__dirname}`,
});
// We need this in order to use @Decorators
import 'reflect-metadata';

import config from '@/crossCutting/config';
import { LoggerInstance as logger } from '@/crossCutting/logger/instance';
import bootstrap, { exitProcess, startAppServer } from '@/infrastructure/bootstrap';
import { UserService } from './ui/user/service';

export async function startServer(port: number) {
  try {
    const app = await bootstrap();
    startAppServer(app, port);
    logger.info(`
    ##############################################
    ✌️  Server listening on port: ${config.port} ✌️
    ##############################################
  `);
  } catch (error) {
    exitProcess(error);
    throw error;
  }
}

startServer(config.port);
