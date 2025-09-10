import { logger, LogLevel } from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    logger.clearLogs();
  });

  it('logs debug messages', () => {
    logger.debug('Debug message', { extra: 'data' });
    const logs = logger.getLogs();
    
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe(LogLevel.DEBUG);
    expect(logs[0].message).toBe('Debug message');
    expect(logs[0].context).toEqual({ extra: 'data' });
  });

  it('logs info messages', () => {
    logger.info('Info message');
    const logs = logger.getLogs();
    
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe(LogLevel.INFO);
    expect(logs[0].message).toBe('Info message');
  });

  it('logs warning messages', () => {
    logger.warn('Warning message');
    const logs = logger.getLogs();
    
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe(LogLevel.WARN);
    expect(logs[0].message).toBe('Warning message');
  });

  it('logs error messages with Error object', () => {
    const error = new Error('Test error');
    logger.error('Error message', error, { context: 'test' });
    const logs = logger.getLogs();
    
    expect(logs).toHaveLength(1);
    expect(logs[0].level).toBe(LogLevel.ERROR);
    expect(logs[0].message).toBe('Error message');
    expect(logs[0].error).toBe(error);
    expect(logs[0].context).toEqual({ context: 'test' });
  });

  it('filters logs by level', () => {
    logger.debug('Debug');
    logger.info('Info');
    logger.warn('Warn');
    logger.error('Error');

    const warnAndAbove = logger.getLogs(LogLevel.WARN);
    expect(warnAndAbove).toHaveLength(2);
    expect(warnAndAbove[0].message).toBe('Warn');
    expect(warnAndAbove[1].message).toBe('Error');
  });

  it('clears logs', () => {
    logger.info('Message 1');
    logger.info('Message 2');
    expect(logger.getLogs()).toHaveLength(2);

    logger.clearLogs();
    expect(logger.getLogs()).toHaveLength(0);
  });

  it('maintains timestamp for each log entry', () => {
    const beforeTime = new Date();
    logger.info('Test message');
    const afterTime = new Date();

    const logs = logger.getLogs();
    expect(logs[0].timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
    expect(logs[0].timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime());
  });
});