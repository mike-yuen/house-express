import { Response } from 'express';
import { HttpStatusCode } from './httpStatusCode';

export abstract class HttpResponse {
  constructor(protected statusCode: HttpStatusCode, protected message?: string) {}

  public prepare<T extends HttpResponse>(res: Response, response: T): Response {
    return res.status(this.statusCode).json(HttpResponse.sanitize(response));
  }

  public send(res: Response): Response {
    return this.prepare<HttpResponse>(res, this);
  }

  private static sanitize<T extends HttpResponse>(response: T): T {
    const clone: T = {} as T;
    Object.assign(clone, response);
    for (const i in clone) if (typeof clone[i] === 'undefined') delete clone[i];
    return clone;
  }
}

export class SuccessResponse<T> extends HttpResponse {
  constructor(private data: T) {
    super(HttpStatusCode.SUCCESS);
  }

  send(res: Response): Response {
    return super.prepare<SuccessResponse<T>>(res, this);
  }
}

export class CreateSuccessResponse<T> extends HttpResponse {
  constructor(private data: T) {
    super(HttpStatusCode.CREATED_SUCCESS);
  }

  send(res: Response): Response {
    return super.prepare<CreateSuccessResponse<T>>(res, this);
  }
}

export class NotFoundResponse<T> extends HttpResponse {
  constructor(message = 'Bad Request', private errors?: T) {
    super(HttpStatusCode.NOT_FOUND, message);
  }

  send(res: Response): Response {
    return super.prepare<NotFoundResponse<T>>(res, this);
  }
}

export class UnprocessableEntityResponse extends HttpResponse {
  constructor(message = 'Unprocessable Entity') {
    super(HttpStatusCode.UNPROCESSABLE_ENTITY, message);
  }
}

export class InternalErrorResponse extends HttpResponse {
  constructor(message = 'Internal Server Error') {
    super(HttpStatusCode.INTERNAL_SERVER, message);
  }
}
