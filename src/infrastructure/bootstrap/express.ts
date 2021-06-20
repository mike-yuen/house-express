import express, { Express, NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
// import swaggerUi from 'swagger-ui-express';

// import config from '@/crossCutting/config';
import { responseHandler } from '@/crossCutting/responseHandler';
// const swaggerDoc = require('@/swagger.json');

// import routes from './routes';

export type App = Express;

export default (app: express.Application) => {
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Middleware that transforms the raw string of req.body into json
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Adds some security defaults
  app.use(helmet());

  app.use(cookieParser());

  // Load API routes
  // app.use(config.api.prefix, routes());

  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));

  // Custom error handlers
  app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (!responseHandler.isTrustedError(err)) {
      await responseHandler.handleCelebrateError(err, res, next);
      return next(err);
    }
    await responseHandler.handleError(err, res);
  });
};
