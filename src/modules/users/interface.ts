export interface IUser {
  readonly _id: string;
  username: string;
  displayName?: string;
  email: string;
  password: string;
  salt: string;
  role: string;

  lastLogin?: Date;
  lastChangePassword?: Date;

  isActive?: boolean;
  isTwoFactor?: boolean;
  isTwoFactorVerified?: boolean;
}

export interface IUserInputDTO {
  username: string;
  displayName?: string;
  email: string;
  password: string;
  salt: string;
  role: string;
}

export interface IUserOutputDTO {
  readonly id: string;
  username: string;
  displayName?: string;
  email: string;
  password?: string;
  salt?: string;
  role: string;

  lastLogin?: Date;
  lastChangePassword?: Date;

  isActive?: boolean;
  isTwoFactor?: boolean;
  isTwoFactorVerified?: boolean;
}

export enum UserRoles {
  SUPER_ADMIN = 'superAdmin',
  ADMIN = 'admin',
  USER = 'user',
}
