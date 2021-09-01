import { BaseEntity } from './_base';

export enum FRIEND_REQUEST_STATUS {
  REQUESTED = 1,
  ACCEPTED = 2,
  REJECTED = 3,
}

export class FriendRequest extends BaseEntity {
  constructor(
    public readonly requestUserId: string,
    public readonly recipientUserId: string,
    public readonly status: FRIEND_REQUEST_STATUS,
  ) {
    super();
  }
}
