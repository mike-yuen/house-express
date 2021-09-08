import { USER_ROLES } from '@/core/domainModel/user';

import { IBaseRepository } from './_base';

export interface IUserInputDTO {
  displayName?: string;
  email: string;
  password: string;
  salt: string;
  role: USER_ROLES;
  avatar: string;
  active: boolean;
  verificationCode?: number;
}

export interface IUserOutputDTO {
  readonly id: string;
  displayName?: string;
  email: string;
  password?: string;
  salt?: string;
  role: USER_ROLES;
  avatar: string;
  active?: boolean;
  verificationCode?: number;
}

export type IUserRepository = IBaseRepository<IUserInputDTO, IUserOutputDTO>;
