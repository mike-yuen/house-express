import { inject } from 'inversify';

import { INFRASTRUCTURE_IDENTIFIERS } from '@/infrastructure/InfrastructureModuleSymbols';

export const eventDispatcher = inject(INFRASTRUCTURE_IDENTIFIERS.EVENT_DISPATCHER);
