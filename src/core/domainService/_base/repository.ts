import { BulkWriteOpResultObject } from 'mongodb';
import { QueryFindOneAndUpdateOptions } from 'mongoose';

export interface IBaseRepository<T> {
  create(item: T): Promise<T>;

  bulkInsert(cond: any): Promise<BulkWriteOpResultObject>;

  insertOne(cond: any): Promise<any>;

  find(cond: any, fields: any, options: any, sortOptions?: any, populate?: boolean, maxTimeMS?: number): Promise<T[]>;

  leanFind(cond: any, fields: any, options: any): Promise<T[]>;

  findOne(cond: any, fields: any, options: any): Promise<T>;

  unorderedInsertMany(items: T[]): Promise<T[]>;

  insertMany(items: any, option: any): Promise<T[]>;

  findOneAndUpdate(cond: any, update: any, options?: QueryFindOneAndUpdateOptions): Promise<T>;

  updateMany(cond: any, update: any): Promise<T>;

  updateOne(cond: any, doc: any, option: any): Promise<T>;

  filterName(name: string): Promise<T>;

  filter(name: string): Promise<T>;

  paginationWithCondition(cond: any, projection: any, option: any): Promise<T>;

  countAll(cond: any): Promise<T>;

  softDelete(id: string, client_id?: string): Promise<T>;

  softDeleteById(id: string): Promise<T>;

  findAndCount(cond: any, fields: any, options: any, sortOptions?: any): Promise<number>;

  count(cond: any): Promise<number>;

  countAllInDocument(): Promise<number>;

  hardDelete(cond: any): Promise<void>;

  aggregate(operationList: any): Promise<any>;

  aggregateAllowDisk(operationList: any): Promise<any>;

  distinctDocument(field: string, cond: any): Promise<number>;
}
