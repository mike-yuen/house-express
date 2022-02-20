import Agenda from 'agenda';
import { Server } from 'http';
import { decorate, injectable } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { InversifyExpressServer } from 'inversify-express-utils';
import swaggerUi from 'swagger-ui-express';
import { Controller } from 'tsoa';

import config from '@/crossCutting/config';
import { LoggerInstance as logger } from '@/crossCutting/logger/instance';
import mongooseLoader from '@/infrastructure/database/connection';
import { iocContainer } from '@/infrastructure/ioc';
import { referenceDataIoCModule } from '@/infrastructure/ioc/inversify.config';
import { generateSwagger } from '@/infrastructure/swagger/swagger.config';
import { INFRASTRUCTURE_IDENTIFIERS } from '@/infrastructure/InfrastructureModuleSymbols';
import { RegisterRoutes } from '@/ui/routes';
// eslint-disable-next-line
const swaggerDoc = require('@/swagger.json');

import './events';
import expressLoader, { App } from './express';
import agendaFactory from './agenda';
import { jobsLoader } from './jobsLoader';

export function exitProcess(error: any): void {
  logger.error(`❌  ${error}`);
  process.exit(1);
}

export function startAppServer(app: App, serverPort?: number): Server {
  const port = serverPort || config.httpPort;

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

  const app = server.build() as App;

  await setupSwagger(app);

  return app;
}

async function setupSwagger(app: App) {
  RegisterRoutes(app);
  logger.info('✌️ Routes generated');

  // await generateSwagger();
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));
  // logger.info('✌️ SwaggerDoc generated');
}

export default bootstrap;
