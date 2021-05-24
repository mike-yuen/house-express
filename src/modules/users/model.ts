import mongoose from 'mongoose';

import { IUser, UserRoles } from './interface';

const transform = (doc: mongoose.Document, ret: any) => {
  ret.id = ret._id.toString();
  delete ret._id;
};

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter username'],
      unique: [true, 'Username must be unique'],
      index: true,
    },
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
      enum: Object.values(UserRoles),
      default: UserRoles.USER,
    },

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

const UserModel = mongoose.model<IUser & mongoose.Document>('User', UserSchema, 'users');

export default UserModel;
