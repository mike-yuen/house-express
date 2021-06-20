export abstract class BaseEntity {
  public _id?: any;
  public readonly createdAt: Date = new Date();
  public updatedAt: Date = new Date();
}
