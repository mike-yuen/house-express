import { IUserInputDTO, IUserOutputDTO } from '@/core/domainService/user';

export interface IAuthService {
  signUp(userInputDTO: IUserInputDTO): Promise<{ user: IUserOutputDTO; token: string }>;
  signIn(
    emailOrUsername: string,
    password: string,
  ): Promise<{ user: IUserOutputDTO; token: string; refreshToken: string }>;
}
