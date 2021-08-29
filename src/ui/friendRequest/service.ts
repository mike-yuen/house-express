import { IFriendRequestService } from '@/core/application/friendRequest';
import { inject, provideSingleton } from '@/infrastructure/ioc';
import {
  IFriendRequestInputDTO,
  IFriendRequestOutputDTO,
  IFriendRequestRepository,
} from '@/core/domainService/friendRequest';
import { FriendRequestRepository } from '@/infrastructure/database/repositories/friendRequest';

@provideSingleton(FriendRequestService)
export class FriendRequestService implements IFriendRequestService {
  constructor(@inject(FriendRequestRepository) private readonly friendRequestRepository: IFriendRequestRepository) {}

  public async createRequest(friendRequestInputDTO: IFriendRequestInputDTO): Promise<IFriendRequestOutputDTO> {
    try {
      const friendRequest = await this.friendRequestRepository.create(friendRequestInputDTO);
      return friendRequest;
    } catch (e) {
      throw new Error(e.message);
    }
  }
}
