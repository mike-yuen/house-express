import mongoose from 'mongoose';

import { FriendRequest, FRIEND_REQUEST_STATUS } from '@/core/domainModel/friendRequest';

const transform = (doc: mongoose.Document, ret: any) => {
  ret.id = ret._id.toString();
  delete ret._id;
};

const FriendRequestSchema = new mongoose.Schema(
  {
    requestUserId: {
      type: mongoose.Types.ObjectId,
      required: [true, 'requestUserId is required'],
      index: true,
    },
    recipientUserId: {
      type: mongoose.Types.ObjectId,
      required: [true, 'recipientUserId is required'],
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(FRIEND_REQUEST_STATUS),
      default: FRIEND_REQUEST_STATUS.REQUESTED,
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
      transform: transform,
    },
    toObject: {
      virtuals: true,
      getters: true,
      transform: transform,
    },
    timestamps: true,
  },
);

const FriendRequestModel = mongoose.model<FriendRequest & mongoose.Document>(
  'FriendRequest',
  FriendRequestSchema,
  'friendRequests',
);

export default FriendRequestModel;
