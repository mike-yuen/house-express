import mongoose from 'mongoose';
import { BaseEntity } from './_base';

export enum USER_ROLES {
  SUPER_ADMIN = 'superAdmin',
  ADMIN = 'admin',
  USER = 'user',
}

export class User extends BaseEntity {
  constructor(
    public readonly displayName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly salt: string,
    public readonly role: USER_ROLES,
    public readonly avatar: string,
    public readonly friendIds: Array<mongoose.Types.ObjectId>,
    public readonly active: boolean,
    public readonly verificationCode: number,
  ) {
    super();
  }
}
