import jwt from 'express-jwt';
import { Service } from 'typedi';

import { Request } from 'express';
import { COOKIE_KEY } from '@/ui/auth/constants';
import config from '@/crossCutting/config';
import { UnauthorizedResponse } from '@/crossCutting/responseHandler/httpResponse';

@Service()
export default class AuthMiddleware {
  private getTokenFromCookie = (req: Request, tokenType: string) => {
    if (req.cookies && req.cookies[tokenType]) {
      return req.cookies[tokenType];
    }
    throw new UnauthorizedResponse();
  };

  public getToken = jwt({
    secret: config.jwtSecret, // The _secret_ to sign the JWTs
    algorithms: [config.jwtAlgorithm], // JWT Algorithm
    userProperty: 'token', // Use req.token to store the JWT
    getToken: (req: Request) => this.getTokenFromCookie(req, COOKIE_KEY.token), // How to extract the JWT from the request
  });

  public getRefreshToken = jwt({
    secret: config.jwtSecret,
    algorithms: [config.jwtAlgorithm],
    userProperty: 'refreshToken',
    getToken: (req: Request) => this.getTokenFromCookie(req, COOKIE_KEY.refreshToken),
  });
}
