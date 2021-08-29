import { Request as ERequest } from 'express';
import { Body, Controller, Post, Request, Res, Route, Security, Tags, TsoaResponse } from 'tsoa';

import { IFriendRequestService } from '@/core/application/friendRequest';
import { IFriendRequestOutputDTO } from '@/core/domainService/friendRequest';
import { inject, provideSingleton } from '@/infrastructure/ioc';

import { FriendRequestService } from './service';

@Route('friend-requests')
@Tags('friend-requests')
@provideSingleton(FriendRequestController)
export class FriendRequestController extends Controller {
  constructor(@inject(FriendRequestService) private readonly friendRequestService: IFriendRequestService) {
    super();
  }

  /**
   * @summary Create new friend request
   */
  @Security('X-Auth-Jwt-Cookie')
  @Post('/create-request')
  public async createRequest(
    @Request() request: ERequest,
    @Body() requestBody: any,
    @Res() errorResponse: TsoaResponse<404, { message: string }>,
  ): Promise<IFriendRequestOutputDTO> {
    try {
      const friendRequest = await this.friendRequestService.createRequest(requestBody);
      return friendRequest;
    } catch (e) {
      return errorResponse(e.statusCode, { message: e.message });
    }
  }
}
