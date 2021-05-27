export default interface RedisServiceInterface {
  push(key: string, list: Array<any>, override: boolean): Promise<any>;

  setValue(key: string, value: any, expiryTime?: number): Promise<boolean>;

  getValue(key: string, toObject: boolean): Promise<any>;

  get(key: string, toObject: boolean): Promise<Array<any>>;

  delete(key: string): Promise<boolean>;

  cache(key: string, data: any): Promise<boolean>;

  getCache(key: string): Promise<any>;

  deleteCache(key: string, members: any[]): Promise<any>;
}
