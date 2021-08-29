import { IFriendRequestInputDTO, IFriendRequestOutputDTO } from '@/core/domainService/friendRequest';

export interface IFriendRequestService {
  createRequest(friendRequestInputDTO: IFriendRequestInputDTO): Promise<IFriendRequestOutputDTO>;
}
