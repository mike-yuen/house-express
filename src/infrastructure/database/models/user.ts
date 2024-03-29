import mongoose from 'mongoose';

import { User, USER_ROLES } from '@/core/domainModel/user';

const transform = (doc: mongoose.Document, ret: any) => {
  ret.id = ret._id.toString();
  delete ret._id;
};

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true,
      required: [true, 'Please enter email'],
      unique: [true, 'Email must be unique'],
      index: true,
    },
    displayName: {
      type: String,
      index: true,
    },
    password: String,
    salt: String,
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    avatar: String,
    friendIds: [
      {
        type: String,
      },
    ],
    active: Boolean,
    verificationCode: Number,

    lastLogin: {
      type: Date,
    },
    lastChangePassword: {
      type: Date,
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

const UserModel = mongoose.model<User & mongoose.Document>('User', UserSchema, 'users');

export default UserModel;
