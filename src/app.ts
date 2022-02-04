import moduleAlias from 'module-alias';
moduleAlias.addAliases({
  '@': `${__dirname}`,
});
// We need this in order to use @Decorators
import 'reflect-metadata';

import config from '@/crossCutting/config';
import { LoggerInstance as logger } from '@/crossCutting/logger/instance';
import bootstrap, { exitProcess, startAppServer } from '@/infrastructure/bootstrap';
import grpcServer from '@/ui/gRPC/server';
import createPokerUser from './ui/gRPC/client';

export async function startServer(port: number) {
  try {
    const app = await bootstrap();
    startAppServer(app, port);
    logger.info(`
    ########################################
    ✌️  Server listening on port: ${port} ✌️
    ########################################
  `);
    grpcServer.start();
    logger.info(`
    #######################################################
    ✌️  gRPC server listening on port: ${config.grpcPort} ✌️
    #######################################################
  `);
  } catch (error) {
    exitProcess(error);
    throw error;
  }
}

startServer(config.httpPort);
