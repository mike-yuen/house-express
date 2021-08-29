import { IUserOutputDTO } from '@/core/domainService/user';

export interface IUserService {
  // get(query: { id?: string; emailOrUsername?: string }): Promise<IUserOutputDTO>;
  getAll(): Promise<IUserOutputDTO[]>;
  // update(user: Partial<User>): Promise<void>;
  // delete(id: string): Promise<boolean>;
}
