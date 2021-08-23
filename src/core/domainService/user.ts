import { IUserInputDTO, IUserOutputDTO } from '@/core/application/user';

import { IBaseRepository } from './_base';

export type IUserRepository = IBaseRepository<IUserInputDTO, IUserOutputDTO>;
