export const COOKIE_KEY = {
  token: 'jt',
  refreshToken: 'rjt',
};

export const COOKIE_EXPIRATION = {
  token: 15 * 60 * 1000,
  refreshToken: 7 * 24 * 60 * 60 * 1000,
};

export const REDIS_SUFFIX = {
  refreshToken: 'rjt',
};