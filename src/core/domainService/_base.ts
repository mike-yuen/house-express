import { BulkWriteOpResultObject } from 'mongodb';
import { QueryFindOneAndUpdateOptions } from 'mongoose';

export interface IBaseRepository<I, O> {
  create(item: I): Promise<O>;

  bulkInsert(cond: any): Promise<BulkWriteOpResultObject>;

  insertOne(cond: any): Promise<any>;

  find(cond: any, fields: any, options: any, sortOptions?: any, populate?: boolean, maxTimeMS?: number): Promise<O[]>;

  leanFind(cond: any, fields: any, options: any): Promise<O[]>;

  findOne(cond: any, fields: any, options: any): Promise<O>;

  unorderedInsertMany(items: I[]): Promise<O[]>;

  insertMany(items: any, option: any): Promise<O[]>;

  findOneAndUpdate(cond: any, update: any, options?: QueryFindOneAndUpdateOptions): Promise<O>;

  updateMany(cond: any, update: any): Promise<O>;

  updateOne(cond: any, doc: any, option: any): Promise<O>;

  filterName(name: string): Promise<O>;

  filter(name: string): Promise<O>;

  paginationWithCondition(cond: any, projection: any, option: any): Promise<O>;

  countAll(cond: any): Promise<O>;

  softDelete(id: string, client_id?: string): Promise<O>;

  softDeleteById(id: string): Promise<O>;

  findAndCount(cond: any, fields: any, options: any, sortOptions?: any): Promise<number>;

  count(cond: any): Promise<number>;

  countAllInDocument(): Promise<number>;

  hardDelete(cond: any): Promise<void>;

  aggregate(operationList: any): Promise<any>;

  aggregateAllowDisk(operationList: any): Promise<any>;

  distinctDocument(field: string, cond: any): Promise<number>;
}
