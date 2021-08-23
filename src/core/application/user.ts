export interface IUserInputDTO {
  username: string;
  displayName?: string;
  email: string;
  password: string;
  salt: string;
  role: string;
}

export interface IUserOutputDTO {
  readonly id: string;
  username: string;
  displayName?: string;
  email: string;
  password?: string;
  salt?: string;
  role: string;
}

export interface IUserService {
  // create(user: IUserInputDTO): Promise<IUserOutputDTO>;
  // get(query: { id?: string; emailOrUsername?: string }): Promise<IUserOutputDTO>;
  getAll(): Promise<IUserOutputDTO[]>;
  // update(user: Partial<User>): Promise<void>;
  // delete(id: string): Promise<boolean>;
}
