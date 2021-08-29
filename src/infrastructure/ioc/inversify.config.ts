import { EventDispatcher } from 'event-dispatch';
import { ContainerModule } from 'inversify';

import { INFRASTRUCTURE_IDENTIFIERS } from '@/infrastructure/InfrastructureModuleSymbols';

// Models
import FriendRequestModel from '@/infrastructure/database/models/friendRequest';
import UserModel from '@/infrastructure/database/models/user';

export const referenceDataIoCModule = new ContainerModule(bind => {
  bind<EventDispatcher>(INFRASTRUCTURE_IDENTIFIERS.EVENT_DISPATCHER).toConstantValue(new EventDispatcher());

  bind<typeof FriendRequestModel>(INFRASTRUCTURE_IDENTIFIERS.FRIEND_REQUEST_MODEL).toConstantValue(FriendRequestModel);
  bind<typeof UserModel>(INFRASTRUCTURE_IDENTIFIERS.USER_MODEL).toConstantValue(UserModel);
});
