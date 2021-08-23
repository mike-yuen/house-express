import { IUserInputDTO, IUserOutputDTO } from './user';

export interface IAuthService {
  signUp(userInputDTO: IUserInputDTO): Promise<{ user: IUserOutputDTO; token: string }>;
  signIn(emailOrUsername: string, password: string): Promise<{ user: IUserOutputDTO; token: string; refreshToken: string }>;
}
