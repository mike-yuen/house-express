import { IUser, UserRole } from '@/modules/users/user.interface';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const transform = (doc: mongoose.Document, ret: any) => {
  ret.id = ret._id.toString();
  delete ret._id;
};

const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, default: uuidv4() },
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
    first_name: { type: String, index: true },
    last_name: { type: String, index: true },
    password: String,
    salt: String,
    role: { type: String, default: UserRole.STAFF },

    last_login: { type: Date },
    date_joined: { type: Date, default: Date.now },
    last_change_password: { type: Date, default: Date.now },
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
    // timestamps: true,
  },
);

const UserModel = mongoose.model<IUser & mongoose.Document>('User', UserSchema, 'crypto_user');

export default UserModel;
