import { isNumber } from 'lodash';
import { BulkWriteOpResultObject } from 'mongodb';
import { Document, Model, Types, QueryFindOneAndUpdateOptions } from 'mongoose';

import { IBaseRepository } from '@/core/domainService/_base';
import { provideSingleton, unmanaged } from '@/infrastructure/ioc';

function transform(doc: Document, ret: any) {
  ret.id = ret._id.toString();
  delete ret._id;
}
@provideSingleton(BaseRepository)
export class BaseRepository<I extends Document, O extends Document> implements IBaseRepository<I, O> {
  public readonly _model: Model<Document>;

  constructor(@unmanaged() schemaModel: Model<Document>) {
    this._model = schemaModel;
  }

  static toObjectId(_id: any): Types.ObjectId {
    if (Types.ObjectId.isValid(_id)) {
      return <Types.ObjectId>_id;
    }
    return Types.ObjectId.createFromHexString(_id);
  }

  async create(item: I): Promise<O> {
    return new Promise<O>((resolve, reject) => {
      this._model.create(item, (err: any, res: O) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O>res.toObject());
        }
      });
    });
  }

  async bulkInsert(cond: any): Promise<BulkWriteOpResultObject> {
    return new Promise<BulkWriteOpResultObject>((resolve, reject) => {
      this._model.bulkWrite(cond, (err: any, res: BulkWriteOpResultObject) => {
        if (err) {
          reject(err);
        } else {
          resolve(<BulkWriteOpResultObject>res);
        }
      });
    });
  }

  async insertOne(cond: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._model.create(cond, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<any>res);
        }
      });
    });
  }

  async find(
    cond: any,
    fields: any,
    options: any,
    sortOptions?: any,
    populate = true,
    maxTimeMS?: number,
  ): Promise<O[]> {
    return new Promise<O[]>((resolve, reject) => {
      let query = this._model.find(cond, fields, options);
      if (sortOptions) {
        query = query.sort(sortOptions);
      }

      if (populate) {
        query.populate('revisions').lean();
      }

      if (isNumber(maxTimeMS)) {
        query.maxTimeMS(maxTimeMS);
      }

      query.exec((err: any, res: O[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O[]>res);
        }
      });
    });
  }

  async leanFind(cond: any, fields: any, options: any): Promise<O[]> {
    return new Promise<O[]>((resolve, reject) => {
      const query = this._model.find(cond, fields, options);
      query.lean({ virtuals: true }).exec((err: any, res: O[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O[]>res);
        }
      });
    });
  }

  async findOne(cond: any, fields: any, options: any): Promise<O> {
    return new Promise<O>((resolve, reject) => {
      this._model.findOne(cond, fields, options).exec((err: any, res: O) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O>res.toObject());
        }
      });
    });
  }

  /**
   * Insert all the documents it can and report errors later
   * Ref: https://mongoosejs.com/docs/api.html#model_Model.insertMany
   */
  async unorderedInsertMany(items: I[]): Promise<O[]> {
    return new Promise<O[]>((resolve, reject) => {
      this._model.insertMany(items, { ordered: false }, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O[]>res);
        }
      });
    });
  }

  async insertMany(items: any, option: any): Promise<O[]> {
    return new Promise<O[]>((resolve, reject) => {
      this._model.insertMany(items, option, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O[]>res);
        }
      });
    });
  }

  async findOneAndUpdate(cond: any, update: any, options?: QueryFindOneAndUpdateOptions): Promise<O> {
    return new Promise<O>((resolve, reject) => {
      this._model.findOneAndUpdate(cond, update, { new: true, ...options }, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O>res);
        }
      });
    });
  }

  async updateMany(cond: any, update: any): Promise<O> {
    return new Promise<O>((resolve, reject) => {
      this._model.updateMany(cond, update, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O>res);
        }
      });
    });
  }

  async updateOne(cond: any, doc: any, option: any): Promise<O> {
    return new Promise<O>((resolve, reject) => {
      this._model.updateOne(cond, doc, option, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O>res);
        }
      });
    });
  }

  async filterName(name: string): Promise<O> {
    return new Promise<O>((resolve, reject) => {
      this._model.find({ $text: { $search: name } }, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O>res);
        }
      });
    });
  }

  async filter(name: string): Promise<O> {
    return new Promise<O>((resolve, reject) => {
      this._model.find({ $text: { $search: name } }, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O>res);
        }
      });
    });
  }

  async paginationWithCondition(cond: any, projection: any, option: any): Promise<O> {
    return new Promise<O>((resolve, reject) => {
      this._model.find({ $and: [{ deleted: false }, cond] }, {}, option, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O>res);
        }
      });
    });
  }

  async countAll(cond: any): Promise<O> {
    return new Promise<O>((resolve, reject) => {
      this._model.find({ $and: [{ deleted: false }, cond] }).countDocuments((err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O>res);
        }
      });
    });
  }

  async softDelete(id: string, client_id?: string): Promise<O> {
    return new Promise<O>((resolve, reject) => {
      const condition: any = {
        $and: [{ _id: id }],
      };
      if (client_id) {
        condition.$and.push({ client_id: client_id });
      }
      this._model.findOneAndUpdate(condition, { deleted: true }, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O>res);
        }
      });
    });
  }

  async softDeleteById(id: string): Promise<O> {
    return new Promise<O>((resolve, reject) => {
      this._model.findOneAndUpdate({ _id: id }, { deleted: true }, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O>res);
        }
      });
    });
  }

  async findAndCount(cond: any, fields: any, options: any, sortOptions?: any): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      let query = this._model.find(cond, fields, options);
      if (sortOptions) {
        query = query.sort(sortOptions);
      }
      query.countDocuments().exec((err: any, res: number) => {
        if (err) {
          reject(err);
        } else {
          resolve(<number>res);
        }
      });
    });
  }

  async count(cond: any): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this._model.countDocuments(cond, (err: any, number: number) => {
        if (err) {
          reject(err);
        } else {
          resolve(number);
        }
      });
    });
  }

  async countAllInDocument(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this._model.estimatedDocumentCount((err: any, number: number) => {
        if (err) {
          reject(err);
        } else {
          resolve(number);
        }
      });
    });
  }

  async hardDelete(cond: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._model.deleteMany(cond, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async aggregate(operationList: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._model.aggregate(operationList, (err: any, res: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(<O>res);
        }
      });
    });
  }

  async aggregateAllowDisk(operationList: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this._model
        .aggregate(operationList)
        .allowDiskUse(true)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  async distinctDocument(field: string, cond: any): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this._model.distinct(field, cond, (err: any, res: any) => {
        return err ? reject(err) : resolve(res);
      });
    });
  }
}
