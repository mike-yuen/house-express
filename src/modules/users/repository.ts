import { Service, Inject } from 'typedi';
import { IUserOutputDTO, IUserInputDTO, IUser } from './interface';
import { Logger } from 'winston';
import { FilterQuery, QueryFindBaseOptions } from 'mongoose';

@Service()
export default class UserRepository {
  constructor(
    /* @Inject */
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('logger') private logger: Logger,
  ) {}

  public create = async (userInputDTO: IUserInputDTO): Promise<IUserOutputDTO> => {
    try {
      const userRecord = await this.userModel.create(userInputDTO);

      this.logger.info('Creating user db record', userInputDTO.username);
      if (!userRecord) {
        throw new Error('User cannot be created');
      }

      const user = userRecord.toObject();
      return user;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  };

  public findOne = async (
    condition?: FilterQuery<IUser>,
    projection?: any,
    options?: QueryFindBaseOptions,
    callback?: () => void,
  ): Promise<IUserOutputDTO> => {
    try {
      const userRecord = await this.userModel.findOne(condition, projection, options, callback);
      if (!userRecord) {
        throw new Error('User not registered');
      }
      const user = userRecord.toObject();
      return user;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  };
}
