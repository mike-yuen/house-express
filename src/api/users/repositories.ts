import { FilterQuery, QueryFindBaseOptions } from 'mongoose';
import { Service, Inject } from 'typedi';
import { Logger } from 'winston';

import { UnprocessableEntityResponse } from '@/utils/responseHandler/httpResponse';
import { IUserOutputDTO, IUserInputDTO, IUser } from './interfaces';

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

      if (!userRecord) {
        throw new UnprocessableEntityResponse('User cannot be created');
      }

      const user = userRecord.toObject();
      return user;
    } catch (e) {
      throw new UnprocessableEntityResponse(e.message);
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
        throw new UnprocessableEntityResponse('We couldn’t find an account matching the account you entered.');
      }
      const user = userRecord.toObject();
      return user;
    } catch (e) {
      throw new UnprocessableEntityResponse(e.message);
    }
  };
}
