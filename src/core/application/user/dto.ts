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
