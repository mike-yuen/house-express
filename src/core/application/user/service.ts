import { IUserInputDTO, IUserOutputDTO } from './dto';
import { User } from '@/core/domainModel/user/User';
import { IBaseService } from '../_base/service';

export interface IUserService extends IBaseService<IUserOutputDTO[]> {
  create(user: IUserInputDTO): Promise<IUserOutputDTO>;
  get(query: { id?: string; emailOrUsername?: string }): Promise<IUserOutputDTO>;
  getAll(): Promise<IUserOutputDTO[]>;
  update(user: Partial<User>): Promise<void>;
  delete(id: string): Promise<boolean>;
}
