import mongoose from 'mongoose';

export abstract class BaseEntity {
  public id: mongoose.Types.ObjectId;
  public readonly createdAt: Date = new Date();
  public updatedAt: Date = new Date();
}
