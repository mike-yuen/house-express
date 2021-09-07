export interface IRedisService {
  setArray(key: string, list: Array<any>, override?: boolean): Promise<any>;

  setValue(key: string, value: any, expiryTime?: number): Promise<boolean>;

  getValue(key: string, toObject: boolean): Promise<any>;

  getArray(key: string, toObject: boolean): Promise<Array<any>>;

  delete(key: string): Promise<boolean>;

  deleteValueInArray(key: string, value: string): Promise<boolean>;

  cache(key: string, data: any): Promise<boolean>;

  getCached(key: string): Promise<any>;

  deleteCached(key: string, members: any[]): Promise<any>;
}
