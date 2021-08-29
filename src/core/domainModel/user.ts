import mongoose from 'mongoose';
import { BaseEntity } from './_base';

export enum USER_ROLES {
  SUPER_ADMIN = 'superAdmin',
  ADMIN = 'admin',
  USER = 'user',
}

export class User extends BaseEntity {
  constructor(
    public readonly username: string,
    public readonly displayName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly salt: string,
    public readonly role: USER_ROLES,
    public readonly friendIds: Array<mongoose.Types.ObjectId>,
  ) {
    super();
  }
}
