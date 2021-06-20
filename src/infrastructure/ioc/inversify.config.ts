import { EventDispatcher } from 'event-dispatch';
import { ContainerModule } from 'inversify';

import { INFRASTRUCTURE_IDENTIFIERS } from '@/infrastructure/InfrastructureModuleSymbols';

// Models
import UserModel from '@/infrastructure/database/models/user';

// Controllers
// import '@/ui/auth/controllers';
// import '@/ui/user/controller';

export const referenceDataIoCModule = new ContainerModule(bind => {
  bind<EventDispatcher>(INFRASTRUCTURE_IDENTIFIERS.EVENT_DISPATCHER).toConstantValue(new EventDispatcher());
  bind<typeof UserModel>(INFRASTRUCTURE_IDENTIFIERS.USER_MODEL).toConstantValue(UserModel);
});
