import moduleAlias from 'module-alias';
moduleAlias.addAliases({
  '@': `${__dirname}`,
});

import 'reflect-metadata'; // We need this in order to use @Decorators
import express from 'express';

import bootstrap from '@/bootstrap';
import config from '@/config';
import Logger from '@/utils/logger';

async function startServer() {
  const app = express();
  /**
   * A little hack here
   * Import/Export can only be used in 'top-level code'
   * Well, at least in node 10 without babel and at the time of writing
   * So we are using good old require.
   **/
  await bootstrap({ expressApp: app });
  app
    .listen(config.port, () => {
      Logger.info(`
      ##############################################
      ✌️  Server listening on port: ${config.port} ✌️
      ##############################################
    `);
    })
    .on('error', err => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();
