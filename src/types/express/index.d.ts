import { Document, Model } from 'mongoose';
import { IUser } from '@/api/users/interface';
declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
    }
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
  }
}
