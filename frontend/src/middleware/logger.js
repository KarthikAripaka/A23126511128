class Logger {
  constructor() {
    this.logs = [];
    this.maxLogs = 500;
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  }

  log(level, message, meta = {}) {
    const entry = this.formatMessage(level, message, meta);
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  info(message, meta) { this.log('INFO', message, meta); }
  warn(message, meta) { this.log('WARN', message, meta); }
  error(message, meta) { this.log('ERROR', message, meta); }
  debug(message, meta) { this.log('DEBUG', message, meta); }
}

export const logger = new Logger();
