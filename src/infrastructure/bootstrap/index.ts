import Agenda from 'agenda';
import { Server } from 'http';
import { decorate, injectable } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Controller } from 'tsoa';

import { LoggerInstance as logger } from '@/crossCutting/logger/instance';
import mongooseLoader from '@/infrastructure/database/connection';
import { iocContainer } from '@/infrastructure/ioc';
import { referenceDataIoCModule } from '@/infrastructure/ioc/inversify.config';
import { INFRASTRUCTURE_IDENTIFIERS } from '@/infrastructure/InfrastructureModuleSymbols';

import './events';
import expressLoader, { App } from './express';
import agendaFactory from './jobScheduler/agenda';
import { jobsLoader } from './jobScheduler/jobs';
import config from '@/crossCutting/config';
import { RegisterRoutes } from '@/ui/routes';

export function exitProcess(error: any): void {
  logger.error(`❌  ${error}`);
  process.exit(1);
}

export function startAppServer(app: App, serverPort?: number): Server {
  const port = serverPort || config.port;

  return app
    .listen(port, () => {
      iocContainer.bind<App>(INFRASTRUCTURE_IDENTIFIERS.APP).toConstantValue(app);
    })
    .on('error', (err: any) => {
      exitProcess(err);
    });
}

async function bootstrap(): Promise<App> {
  if (iocContainer.isBound(INFRASTRUCTURE_IDENTIFIERS.APP) === true)
    return iocContainer.get<App>(INFRASTRUCTURE_IDENTIFIERS.APP);

  const mongoConnection = await mongooseLoader();
  logger.info('✌️ DB loaded and connected!');

  iocContainer.bind<Agenda>(INFRASTRUCTURE_IDENTIFIERS.AGENDA).toConstantValue(agendaFactory({ mongoConnection }));
  iocContainer.load(...[referenceDataIoCModule]);
  decorate(injectable(), Controller);
  iocContainer.load(buildProviderModule());
  logger.info('✌️ Dependency Injector loaded');

  jobsLoader.forEach(async job => job(iocContainer.get<Agenda>(INFRASTRUCTURE_IDENTIFIERS.AGENDA)));
  logger.info('✌️ Jobs loaded');

  // Configure express server using inversify IoC
  const server = new InversifyExpressServer(iocContainer, null, null, null, null, false);
  server.setConfig((app: App) => expressLoader(app));
  logger.info('✌️ Express loaded');

  // server.setErrorConfig(app => {
  //   // Catch and log all exceptions
  //   app.use(exceptionLoggerMiddleware);
  // });

  const app = server.build() as App;

  RegisterRoutes(app);

  return app;
}

export default bootstrap;
