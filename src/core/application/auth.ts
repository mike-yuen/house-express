import { IUserInputDTO, IUserOutputDTO } from '@/core/domainService/user';

export enum COOKIE_KEY {
  token = 'jt',
  refreshToken = 'rjt',
}

export interface IAuthService {
  signUp(userInputDTO: IUserInputDTO): Promise<{ user: IUserOutputDTO }>;
  signIn(email: string, password: string): Promise<{ user: IUserOutputDTO; token: string; refreshToken: string }>;
}

export interface ISignInInput {
  email: string;
  password: string;
}

export interface ISignInOutput {
  user: IUserOutputDTO;
  [COOKIE_KEY.token]: { value: string; maxAge: number };
  [COOKIE_KEY.refreshToken]: { value: string; maxAge: number };
}
