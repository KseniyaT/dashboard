export enum LogLevel {
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
}

export interface ILogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  error?: any;
  context?: string;
  stack?: string;
}
