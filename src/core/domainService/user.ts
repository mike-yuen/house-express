import { USER_ROLES } from '@/core/domainModel/user';

import { IBaseRepository } from './_base';

export interface IUserInputDTO {
  username: string;
  displayName?: string;
  email: string;
  password: string;
  salt: string;
  role: USER_ROLES;
}

export interface IUserOutputDTO {
  readonly id: string;
  username: string;
  displayName?: string;
  email: string;
  password?: string;
  salt?: string;
  role: USER_ROLES;
}

export type IUserRepository = IBaseRepository<IUserInputDTO, IUserOutputDTO>;
