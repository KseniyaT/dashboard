import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILogEntry, LogLevel } from '@core/models/log-entry.interface';
import { LOG_URL } from '@core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  constructor(private http: HttpClient) {}

  debug(message: string, context?: string): void {
    this.log(LogLevel.debug, message, null, context);
  }

  info(message: string, context?: string): void {
    this.log(LogLevel.info, message, null, context);
  }

  warn(message: string, error?: any, context?: string): void {
    this.log(LogLevel.warn, message, error, context);
  }

  error(message: string, error?: any, context?: string): void {
    this.log(LogLevel.error, message, error, context);
  }

  private log(level: LogLevel, message: string, error?: any, context?: string): void {
    const logEntry: ILogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error ? this.serializeError(error) : undefined,
      stack: error?.stack,
    };

    if (environment.production) {
      this.sendToServer(logEntry).subscribe({
        error: err => {
          console.error('Failed to send log to server:', err);
          this.logToConsole(logEntry);
        },
      });
    } else {
      this.logToConsole(logEntry);
    }
  }

  private logToConsole(entry: ILogEntry): void {
    const logMessage = `[${entry.timestamp}] ${entry.level}: ${entry.message}`;
    const contextMessage = entry.context ? `\nContext: ${entry.context}` : '';
    const errorMessage = entry.error ? `\nError: ${JSON.stringify(entry.error, null, 2)}` : '';
    const stackMessage = entry.stack ? `\nStack: ${entry.stack}` : '';

    switch (entry.level) {
      case LogLevel.debug:
        console.debug(logMessage + contextMessage + errorMessage + stackMessage);
        break;
      case LogLevel.info:
        console.info(logMessage + contextMessage + errorMessage + stackMessage);
        break;
      case LogLevel.warn:
        console.warn(logMessage + contextMessage + errorMessage + stackMessage);
        break;
      case LogLevel.error:
        console.error(logMessage + contextMessage + errorMessage + stackMessage);
        break;
    }
  }

  private sendToServer(logEntry: ILogEntry): Observable<any> {
    return this.http.post(LOG_URL, logEntry);
  }

  private serializeError(error: any): any {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    return error;
  }
}
