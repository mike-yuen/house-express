import { IUser, UserRole } from './interface';
import mongoose from 'mongoose';

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
    firstName: {
      type: String,
      index: true,
    },
    lastName: {
      type: String,
      index: true,
    },
    password: String,
    salt: String,
    role: {
      type: String,
      default: UserRole.USER,
      enum: UserRole,
    },

    lastLogin: { type: Date },
    lastChangePassword: { type: Date },
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
