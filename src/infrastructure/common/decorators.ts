import { inject } from 'inversify';

import { DECORATOR_IDENTIFIERS } from '@/infrastructure/InfrastructureModuleSymbols';

export const eventDispatcher = inject(DECORATOR_IDENTIFIERS.EVENT_DISPATCHER);
