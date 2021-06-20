import { BaseEntity } from '../_base/entity';

export class User extends BaseEntity {
  constructor(
    public readonly username: string,
    public readonly displayName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly salt: string,
    public readonly role: string,
  ) {
    super();
  }
}
