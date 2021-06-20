import { provideSingleton } from '@/infrastructure/ioc';

import { IWinstonLogger, LoggerInstance } from './instance';
import { ILoggerService } from './interface';

@provideSingleton(LoggerService)
export class LoggerService implements ILoggerService {
  private readonly loggerInstance: IWinstonLogger = LoggerInstance;

  silly(message: string, meta?: any): void {
    this.loggerInstance.silly(message, meta);
  }
  error(message: string, meta?: any): void {
    this.loggerInstance.error(message, meta);
  }
  info(message: string, meta?: any): void {
    this.loggerInstance.info(message, meta);
  }
  debug(message: string, meta?: any): void {
    this.loggerInstance.debug(message, meta);
  }
  warn(message: string, meta?: any): void {
    this.loggerInstance.warn(message, meta);
  }
}
