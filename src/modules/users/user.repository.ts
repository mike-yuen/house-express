import { Service, Inject } from 'typedi';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import { IUserOutputDTO, IUserInputDTO } from './user.interface';
import { Logger } from 'winston';

@Service()
export default class UserRepository {
  constructor(
    // @Inject
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('logger') private logger: Logger,
  ) {}

  public SignUp = async (userInputDTO: IUserInputDTO): Promise<IUserOutputDTO> => {
    try {
      const salt = randomBytes(32);
      /**
       * But what if, an NPM module that you trust, like body-parser, was injected with malicious code that
       * watches every API call and if it spots a 'password' and 'email' property then
       * it decides to steal them!? Would you even notice that? I wouldn't :/
       */
      const hashedPassword = await argon2.hash(userInputDTO.password, { salt });
      const userRecord = await this.userModel.create({
        ...userInputDTO,
        salt: salt.toString('hex'),
        password: hashedPassword,
      });
      this.logger.info('Creating user db record', userInputDTO.username);

      if (!userRecord) {
        throw new Error('User cannot be created');
      }

      /**
       * @TODO This is not the best way to deal with this
       * There should exist a 'Mapper' layer
       * that transforms data from layer to layer
       * but that's too over-engineering for now
       */
      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');

      return user;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  };

  public SignIn = async (email: string, password: string): Promise<IUserOutputDTO> => {
    const userRecord = await this.userModel.findOne({ email });
    if (!userRecord) {
      throw new Error('User not registered');
    }
    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */
    this.logger.silly('Checking password');
    const validPassword = await argon2.verify(userRecord.password, password);
    if (validPassword) {
      this.logger.silly('Password is valid!');
      this.logger.silly('Generating JWT');

      const user = userRecord.toObject();
      Reflect.deleteProperty(user, 'password');
      Reflect.deleteProperty(user, 'salt');

      return user;
    } else {
      throw new Error('Invalid Password');
    }
  };
}
