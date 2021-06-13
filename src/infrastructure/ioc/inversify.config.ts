import { EventDispatcher } from 'event-dispatch';
import { ContainerModule } from 'inversify';

import { DECORATOR_IDENTIFIERS } from '@/infrastructure/InfrastructureModuleSymbols';

// Controllers
import '../../ui/api/controllers/auth_controller';
import '../../ui/api/controllers/tenant_controller';

export const referenceDataIoCModule = new ContainerModule(bind => {
  bind<EventDispatcher>(DECORATOR_IDENTIFIERS.EVENT_DISPATCHER).toConstantValue(new EventDispatcher());
});
