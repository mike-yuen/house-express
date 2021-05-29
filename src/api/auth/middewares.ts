import jwt from 'express-jwt';
import { Service } from 'typedi';

import { Request } from 'express';
import { COOKIE_KEY } from '@/api/auth/constants';
import config from '@/config';
import { UnauthorizedResponse } from '@/utils/responseHandler/httpResponse';

@Service()
export default class AuthMiddleware {
  private getTokenFromCookie = (req: Request) => {
    if (req.cookies && req.cookies[COOKIE_KEY.token]) {
      return req.cookies[COOKIE_KEY.token];
    }
    throw new UnauthorizedResponse();
  };

  public getToken = jwt({
    secret: config.jwtSecret, // The _secret_ to sign the JWTs
    algorithms: [config.jwtAlgorithm], // JWT Algorithm
    userProperty: 'token', // Use req.token to store the JWT
    getToken: (req: Request) => this.getTokenFromCookie(req), // How to extract the JWT from the request
  });
}
