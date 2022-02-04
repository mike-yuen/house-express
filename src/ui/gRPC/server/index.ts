import jwt from 'jsonwebtoken';
import path from 'path';
import config from '@/crossCutting/config';
import { ServerUnaryCall } from 'grpc';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const AUTH_PROTO_PATH = './auth.proto';
const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../proto', AUTH_PROTO_PATH), {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});
const authProto = grpc.loadPackageDefinition(packageDefinition);

const grpcServer = new grpc.Server();
// @ts-ignore
grpcServer.addService(authProto.auth.AuthProtoService.service, {
  verify: (call: ServerUnaryCall<{ token: string }>, callback: Function) => {
    const { token } = call.request;
    try {
      const jwtToken = jwt.verify(token, config.jwtSecret);
      callback(null, { uuid: jwtToken.id });
    } catch (e) {
      callback({
        code: grpc.status.NOT_FOUND,
        details: e.message,
      });
    }
  },
});

grpcServer.bind(`127.0.0.1:${config.grpcPort}`, grpc.ServerCredentials.createInsecure());
export default grpcServer;
