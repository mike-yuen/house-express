import { IUserOutputDTO } from '@/core/domainService/user';
import path from 'path';
import { promisify } from 'util';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const USER_PROTO_PATH = './user.proto';
const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../proto', USER_PROTO_PATH), {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});
const user = grpc.loadPackageDefinition(packageDefinition).user;
const client = new user.UserProtoService('localhost:8448', grpc.credentials.createInsecure());

const createPokerUser = async (user: Partial<IUserOutputDTO>) => {
  const { id, email, displayName, avatar } = user;
  // prettier-ignore
  const request = { id, email, displayName, vipType: 0, gender: 0, coin: 1000, level: 0, experience: 0, avatar };
  const result = await promisify(client.Create.bind(client))(request);
  return result
};

export default createPokerUser;
