import { IUserInputDTO, IUserOutputDTO } from '@/core/application/user/dto';
// import { User } from '@/core/domainModel/user/User';

import { IBaseRepository } from '../_base/repository';

export type IUserRepository = IBaseRepository<IUserInputDTO, IUserOutputDTO>;
