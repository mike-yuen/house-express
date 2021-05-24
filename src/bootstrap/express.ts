import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

import config from '@/config';
import { responseHandler } from '@/utils/responseHandler';
import routes from './routes';

export default ({ app }: { app: express.Application }) => {
  /**
   * Health Check endpoints
   * @TODO Explain why they are here
   */
  app.get('/status', (req, res) => {
    res.status(200).end();
  });
  app.head('/status', (req, res) => {
    res.status(200).end();
  });

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Some sauce that always add since 2014
  // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
  // Maybe not needed anymore ?

  // app.use(require('method-override')());

  // Middleware that transforms the raw string of req.body into json
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Load API routes
  app.use(config.api.prefix, routes());

  // Custom error handlers
  app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (!responseHandler.isTrustedError(err)) {
      await responseHandler.handleCelebrateError(err, res, next);
      return next(err);
    }
    await responseHandler.handleError(err, res);
  });
};
