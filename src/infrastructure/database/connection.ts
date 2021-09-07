import { Db } from 'mongodb';
import mongoose from 'mongoose';

import config from '@/crossCutting/config';

export default async function (): Promise<Db> {
  const connection = await mongoose.connect(config.databaseURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    autoIndex: true,
  });
  return connection.connection.db;
}

export async function seedSuperAdmin() {
  //   const password = await bcrypt.hash('123qwe', 1);
  //   const user = User.createInstance({
  //     firstName: 'Admin',
  //     lastName: 'Admin',
  //     username: 'Admin',
  //     email: 'defaultAdmin@email.com',
  //     tenantId,
  //     password,
  //   });
  //   const userModel = User.getModel();
  //   const defaultAdminUser = await userModel.findOne({
  //     $or: [
  //       { email: user.email, tenant: tenantId },
  //       { username: user.username, tenant: tenantId },
  //     ],
  //   });
  //   if (!defaultAdminUser) {
  //     user.setRole(UserRole.ADMIN);
  //     await userModel.create(user);
  //   }
}
