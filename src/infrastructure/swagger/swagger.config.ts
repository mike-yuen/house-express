import { generateRoutes, RoutesConfig } from 'tsoa';
import config from '@/crossCutting/config';
// import { X_TENANT_ID, X_AUTH_TOKEN_KEY } from '../../ui/constants/header_constants';

const basePath = config.api.prefix;
const entryFile = '@/app.ts';
const controllers = '@/ui/user/controller.ts';
const protocol = 'http';

export const swaggerGen = async () => {
  const swaggerOptions = {
    basePath,
    entryFile,
    // securityDefinitions: {
    //   [X_TENANT_ID]: {
    //     type: 'apiKey',
    //     in: 'header',
    //     name: X_TENANT_ID,
    //     description: 'Tenant ID',
    //   },
    //   [X_AUTH_TOKEN_KEY]: {
    //     type: 'apiKey',
    //     in: 'header',
    //     name: X_AUTH_TOKEN_KEY,
    //     description: 'JWT access token',
    //   },
    // },
    noImplicitAdditionalProperties: 'throw-on-extras',
    host: process.env.HOST,
    description: 'Enterprise NodeJs/Typescript API boilerplate',
    version: '1.0.0',
    name: 'node-typescript-boilerplate',
    specVersion: 3,
    schemes: [protocol],
    outputDirectory: './',
    controllerPathGlobs: [controllers],
  };

  const routeOptions: RoutesConfig = {
    basePath,
    // middleware: 'express',
    // authenticationModule: './src/ui/api/middleware/auth_middleware',
    iocModule: '@/infrastructure/ioc',
    routesDir: '@/ui',
  };

  // if (config.env !== 'test') await generateSwaggerSpec(swaggerOptions, routeOptions);

  await generateRoutes(routeOptions, swaggerOptions);
};
