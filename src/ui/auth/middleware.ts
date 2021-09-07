import { Request } from 'express';
import jwt from 'jsonwebtoken';

import { COOKIE_KEY } from '@/core/application/auth';
import { USER_ROLES } from '@/core/domainModel/user';
import config from '@/crossCutting/config';
import { Authorization, X_AUTH_JWT_COOKIE } from '@/infrastructure/common/constants';
import { UnauthorizedResponse } from '@/crossCutting/responseHandler/httpResponse';

function getTokenFromHeader(req: Request) {
  if (req.headers && req.headers['authorization']) {
    const rawToken = req.headers['authorization'].split(':')[0];
    const rawRefreshToken = req.headers['authorization'].split(':')[1];
    return { rawToken, rawRefreshToken };
  }
  throw new UnauthorizedResponse();
}

function getTokenFromCookie(req: Request, tokenType: string) {
  if (req.cookies && req.cookies[tokenType]) {
    return req.cookies[tokenType];
  }
  throw new Error();
}

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes: string[] = [USER_ROLES.USER],
): Promise<any> {
  switch (securityName) {
    case Authorization: {
      const { rawToken, rawRefreshToken } = getTokenFromHeader(request);

      const token = jwt.verify(rawToken, config.jwtSecret);
      const refreshToken = jwt.verify(rawRefreshToken, config.jwtSecret);

      return Promise.resolve({ token, refreshToken });
    }
    case X_AUTH_JWT_COOKIE: {
      const rawToken = getTokenFromCookie(request, COOKIE_KEY.token);
      const rawRefreshToken = getTokenFromCookie(request, COOKIE_KEY.refreshToken);

      const token = jwt.verify(rawToken, config.jwtSecret);
      const refreshToken = jwt.verify(rawRefreshToken, config.jwtSecret);

      return Promise.resolve({ token, refreshToken });
    }
  }
}

// export default class AuthMiddleware {
//   private getTokenFromCookie = (req: Request, tokenType: string) => {
//     if (req.cookies && req.cookies[tokenType]) {
//       return req.cookies[tokenType];
//     }
//     throw new UnauthorizedResponse();
//   };

//   public getToken = jwt({
//     secret: config.jwtSecret, // The _secret_ to sign the JWTs
//     algorithms: [config.jwtAlgorithm], // JWT Algorithm
//     userProperty: 'token', // Use req.token to store the JWT
//     getToken: (req: Request) => this.getTokenFromCookie(req, COOKIE_KEY.token), // How to extract the JWT from the request
//   });

//   public getRefreshToken = jwt({
//     secret: config.jwtSecret,
//     algorithms: [config.jwtAlgorithm],
//     userProperty: 'refreshToken',
//     getToken: (req: Request) => this.getTokenFromCookie(req, COOKIE_KEY.refreshToken),
//   });
// }
