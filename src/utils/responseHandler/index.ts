import { NextFunction, Response } from 'express';

import Logger from '@/utils/logger';
import { HttpResponse, NotFoundResponse } from './httpResponse';
import { isCelebrateError } from 'celebrate';

class ResponseHandler {
  public async handleError(err: HttpResponse, res: Response): Promise<void> {
    Logger.error('Error message from error-handler:\n %o', err);
    err.send(res);
    // await sendMailToAdminIfCritical();
    // await sendEventsToSentry();
  }

  public async handleCelebrateError(err: any, res: Response, next: NextFunction): Promise<void | Response<any>> {
    if (!isCelebrateError(err)) {
      return next(err);
    }

    const errors = {};
    for (const [segment, joiError] of err.details.entries()) {
      errors[segment] = {
        source: segment,
        keys: joiError.details.map(detail => detail.path.join('.')),
        message: joiError.message,
      };
    }

    Logger.error('Error message from error-handler:\n %o', errors);
    return new NotFoundResponse(err.message, errors).send(res);
  }

  public isTrustedError(error: Error) {
    return !!(error instanceof HttpResponse);
  }
}

export const responseHandler = new ResponseHandler();
