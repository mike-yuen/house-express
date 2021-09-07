import { RoutesConfig, generateSpecAndRoutes, SwaggerArgs, SpecConfig } from 'tsoa';
import config from '@/crossCutting/config';

const basePath = config.api.prefix;
const entryFile = 'src/app.ts';
const controllers = 'src/ui/**/controller.ts';
const outputDirectory = 'src';

export const generateSwagger = async () => {
  const specOptions: SpecConfig = {
    outputDirectory: outputDirectory,
    host: process.env.HOST,
    version: '1.0.0',
    specVersion: 2,
    name: 'Swagger HouseExpress',
    description:
      'The awesome swagger for NodeJs/Typescript API project.<br/>You can find out more about Swagger at <a href="https://swagger.io" target="_blank">swagger</a> or on <a href="https://swagger.io/irc/" target="_blank">swagger/irc</a>. For this sample, you can use the api key special-key to test the authorization filters.',
    contact: {
      name: 'Developer',
      email: 'nhatminh.150596@gmail.com',
    },
    basePath,
    tags: [
      {
        name: 'auth',
        description: 'Access to our site',
      },
      {
        name: 'users',
        description: 'Operations about users',
      },
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      'Authorization': {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      },
    },
  };

  const routeOptions: RoutesConfig = {
    routesDir: 'src/ui',
    basePath,
    middleware: 'express',
    iocModule: 'src/infrastructure/ioc',
    authenticationModule: 'src/ui/auth/middleware.ts',
  };

  const swaggerArgs: SwaggerArgs = {
    configuration: {
      entryFile,
      noImplicitAdditionalProperties: 'throw-on-extras',
      controllerPathGlobs: [controllers],
      spec: specOptions,
      routes: routeOptions,
      compilerOptions: {
        baseUrl: 'src',
        paths: {
          '@/*': ['*'],
        },
      },
    },
  };

  await generateSpecAndRoutes(swaggerArgs);
};
