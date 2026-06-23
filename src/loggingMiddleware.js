const LOG_LEVELS = {
  INFO: 0,
  WARN: 1,
  ERROR: 2,
  DEBUG: 3
};

const LEVEL_NAMES = {
  0: 'INFO',
  1: 'WARN',
  2: 'ERROR',
  3: 'DEBUG'
};

class LoggingMiddleware {
  constructor(options = {}) {
    this.level = options.level ?? LOG_LEVELS.INFO;
    this.format = options.format ?? 'text';
    this.includeTimestamp = options.includeTimestamp ?? true;
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = this.includeTimestamp ? new Date().toISOString() : '';
    const metaStr = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
    return this.format === 'json'
      ? JSON.stringify({ timestamp, level: LEVEL_NAMES[level], message, ...meta })
      : `${timestamp} [${LEVEL_NAMES[level]}] ${message}${metaStr}`;
  }

  log(level, message, meta = {}) {
    if (level > this.level) return;
    const formatted = this.formatMessage(level, message, meta);
    process.stdout.write(formatted + '\n');
  }

  info(message, meta) { this.log(LOG_LEVELS.INFO, message, meta); }
  warn(message, meta) { this.log(LOG_LEVELS.WARN, message, meta); }
  error(message, meta) { this.log(LOG_LEVELS.ERROR, message, meta); }
  debug(message, meta) { this.log(LOG_LEVELS.DEBUG, message, meta); }
}

export const logger = new LoggingMiddleware({ level: LOG_LEVELS.DEBUG, format: 'json' });
export { LoggingMiddleware, LOG_LEVELS };
