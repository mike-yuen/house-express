import jwt from 'express-jwt';

import { Request } from 'express';
import config from '@/config';
import { UnauthorizedResponse } from '@/utils/responseHandler/httpResponse';

const getToken = (req: Request) => {
  if (req.cookies && req.cookies.jt) {
    return req.cookies.jt;
  }
  throw new UnauthorizedResponse();
};

const isAuth = jwt({
  secret: config.jwtSecret, // The _secret_ to sign the JWTs
  algorithms: [config.jwtAlgorithm], // JWT Algorithm
  userProperty: 'token', // Use req.token to store the JWT
  getToken: getToken, // How to extract the JWT from the request
});

export default isAuth;
