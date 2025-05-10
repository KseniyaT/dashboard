import { TestBed } from '@angular/core/testing';
import { LoggerService } from './logger.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { LogLevel } from '@core/models/log-entry.interface';

describe('LoggerService', () => {
  let service: LoggerService;
  let httpMock: HttpTestingController;
  let consoleSpy: { [key: string]: jest.SpyInstance };

  beforeEach(() => {
    consoleSpy = {
      debug: jest.spyOn(console, 'debug').mockImplementation(() => {}),
      info: jest.spyOn(console, 'info').mockImplementation(() => {}),
      warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
      error: jest.spyOn(console, 'error').mockImplementation(() => {}),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoggerService],
    });

    service = TestBed.inject(LoggerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log debug message', () => {
    const message = 'Debug message';
    const context = 'TestContext';
    service.debug(message, context);
    expect(consoleSpy['debug']).toHaveBeenCalledWith(expect.stringContaining(message));
  });

  it('should log info message', () => {
    const message = 'Info message';
    const context = 'TestContext';
    service.info(message, context);
    expect(consoleSpy['info']).toHaveBeenCalledWith(expect.stringContaining(message));
  });

  it('should log warning message with error', () => {
    const message = 'Warning message';
    const error = new Error('Test error');
    const context = 'TestContext';
    service.warn(message, error, context);
    expect(consoleSpy['warn']).toHaveBeenCalledWith(expect.stringContaining(message));
  });

  it('should log error message with error', () => {
    const message = 'Error message';
    const error = new Error('Test error');
    const context = 'TestContext';
    service.error(message, error, context);
    expect(consoleSpy['error']).toHaveBeenCalledWith(expect.stringContaining(message));
  });

  it('should send logs to server in production', () => {
    const originalEnv = environment.production;
    environment.production = true;

    const message = 'Test message';
    const error = new Error('Test error');
    const context = 'TestContext';

    service.error(message, error, context);

    const req = httpMock.expectOne('/api/logs');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(
      expect.objectContaining({
        level: LogLevel.error,
        message,
        context,
        error: expect.any(Object),
      }),
    );

    req.flush({});

    environment.production = originalEnv;
  });

  it('should handle server error in production', () => {
    const originalEnv = environment.production;
    environment.production = true;

    const message = 'Test message';
    const error = new Error('Test error');
    const context = 'TestContext';

    service.error(message, error, context);

    const req = httpMock.expectOne('/api/logs');
    req.error(new ErrorEvent('Network error'));

    expect(consoleSpy['error']).toHaveBeenCalled();

    environment.production = originalEnv;
  });

  it('should serialize Error objects', () => {
    const error = new Error('Test error');
    error.stack = 'Test stack';
    const serialized = (service as any).serializeError(error);
    expect(serialized).toEqual({
      name: 'Error',
      message: 'Test error',
      stack: 'Test stack',
    });
  });

  it('should handle non-Error objects in serializeError', () => {
    const error = { custom: 'error' };
    const serialized = (service as any).serializeError(error);
    expect(serialized).toEqual(error);
  });
});
