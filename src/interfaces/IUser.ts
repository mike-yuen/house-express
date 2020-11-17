export interface IUser {
  _id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  salt: string;
  role: string;

  last_login?: Date;
  date_joined?: Date;
  last_change_password?: Date;

  is_active?: boolean;
  is_two_factor?: boolean;
  is_two_factor_verified?: boolean;
}

export interface IUserInputDTO {
  username: string;
  email: string;
  password: string;
  role: string;
}

export enum UserRole {
  SUPER_ADMIN = 'SuperAdmin',
  ADMIN = 'Admin',
  STAFF = 'Staff',
}
