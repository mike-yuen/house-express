export interface IUser {
  _id: string;
  username: string;
  firstName?: string;
  lastName?: string;
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
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  role: string;
}

export interface IUserOutputDTO {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;

  lastLogin?: Date;
  lastChangePassword?: Date;

  isActive?: boolean;
  isTwoFactor?: boolean;
  isTwoFactorVerified?: boolean;
}

export enum UserRole {
  SUPER_ADMIN = 'superAdmin',
  ADMIN = 'admin',
  USER = 'user',
}
