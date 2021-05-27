import Redis from 'ioredis';
import chunk from 'lodash/chunk';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';
import map from 'lodash/map';

import Logger from '@/utils/logger';

import { RedisInstance } from './instance';
import RedisServiceInterface from './interface';

export default class RedisService implements RedisServiceInterface {
  redis: Redis.Redis;
  expiryTime = -1; // seconds
  constructor(expiryTime?: number) {
    if (!isUndefined(expiryTime) && expiryTime > 0) {
      this.expiryTime = expiryTime;
    }
    this.redis = RedisInstance;
  }

  async push(key: string, list: Array<any>, override = false): Promise<boolean> {
    try {
      if (override) {
        await this.redis.del(key);
      }
      const rPipeline: Redis.Pipeline = this.redis.pipeline();
      const listStr = map(list, item => {
        if (isObject(item)) {
          item = JSON.stringify(item);
        }
        return item;
      });
      const chunks: string[][] = chunk(listStr, 1000);
      for (const chunk of chunks) {
        rPipeline.lpush(key, ...chunk);
      }
      await rPipeline.exec();
      if (this.expiryTime > 0) {
        // If expiry time does not set for key
        const pttl: number = await this.redis.ttl(key);
        if (isEqual(pttl, -1)) {
          await this.redis.expire(key, this.expiryTime);
        }
      }
      return Promise.resolve(true);
    } catch (err) {
      Logger.error('Error while push data into redis', err);
      return Promise.reject(err);
    }
  }

  async setValue(key: string, value: any, expiryTime?: number): Promise<boolean> {
    try {
      await this.redis.del(key);
      if (!isUndefined(expiryTime)) {
        this.expiryTime = expiryTime;
      }
      const rPipeline: Redis.Pipeline = this.redis.pipeline();
      if (isObject(value)) {
        value = JSON.stringify(value);
      }
      rPipeline.lpush(key, value);
      await rPipeline.exec();
      if (this.expiryTime > 0) {
        // If expiry time does not set for key
        const pttl: number = await this.redis.ttl(key);
        if (isEqual(pttl, -1)) {
          await this.redis.expire(key, this.expiryTime);
        }
      }
      return Promise.resolve(true);
    } catch (err) {
      Logger.error(`Error while set data into redis for key ${key}: `, err);
      return Promise.reject(err);
    }
  }

  async getValue(key: string, toObject = false): Promise<any> {
    try {
      let value: any = await this.redis.lrange(key, 0, -1);
      if (isEmpty(value)) {
        return null;
      }
      if (toObject) {
        value = JSON.parse(value);
      }
      return value;
    } catch (err) {
      Logger.error(`Error while get value of key ${key} from redis`, err);
      return Promise.reject(err);
    }
  }

  async get(key: string, toObject = false): Promise<Array<any>> {
    try {
      let list: Array<any> = [];
      const data: Array<string> = await this.redis.lrange(key, 0, -1);
      if (isEmpty(data)) {
        return [];
      }
      if (toObject) {
        for (const item of data) {
          list.push(JSON.parse(item));
        }
      } else {
        list = data;
      }
      return list;
    } catch (err) {
      Logger.error('Error while get data from redis', err);
      return Promise.reject(err);
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      await this.redis.del(key);
      return true;
    } catch (err) {
      Logger.error(`Error while delete key: ${key} in redis`, err);
      return Promise.reject(err);
    }
  }

  async cache(key: string, data: any): Promise<boolean> {
    if (isObject(data)) {
      data = JSON.stringify(data);
    }
    try {
      await this.redis.sadd(key, data);
      return true;
    } catch (e) {
      Logger.error(`[cacheRow]Has error while cache row into redis`, e);
      throw e;
    }
  }

  async getCache(key: string): Promise<any> {
    try {
      return await this.redis.smembers(key);
    } catch (e) {
      Logger.error(`[getCachedRow]Has error while cache row into redis`, e);
      throw e;
    }
  }

  async deleteCache(key: string, members: any[]): Promise<any> {
    try {
      return await this.redis.srem(key, members);
    } catch (e) {
      Logger.error(`[deleteCachedRows]Has error while deleting cached rows in redis`, e);
      throw e;
    }
  }
}
