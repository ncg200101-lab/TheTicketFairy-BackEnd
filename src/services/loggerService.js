import { v4 as uuidv4 } from 'uuid';
import i18nService from './i18nService.js';

class LoggerService {
  constructor() {
    this.requestId = null;
  }

  setRequestId(requestId) {
    this.requestId = requestId;
  }

  generateRequestId() {
    return uuidv4().substring(0, 8);
  }

  formatLog(level, method, url, statusCode, messageCode, message, extra = '') {
    const timestamp = new Date().toISOString().replace('T', ' ').replace(/\..+/, '');
    const reqId = this.requestId || 'no-req-id';
    
    return `[${timestamp}] [${reqId}] [${method}] [${url}] [${statusCode}] - ${messageCode} - ${message}${extra ? ` - ${extra}` : ''}`;
  }

  logRequest(req, res, messageCode, extra = '') {
    const method = req.method;
    const url = req.originalUrl || req.url;
    const statusCode = res.statusCode;
    const language = req.language || 'vi';
    const message = i18nService.getMessage(messageCode, language);
    
    const logMessage = this.formatLog('INFO', method, url, statusCode, messageCode, message, extra);
    console.log(logMessage);
  }

  logError(req, res, messageCode, error, extra = '') {
    const method = req?.method || 'UNKNOWN';
    const url = req?.originalUrl || req?.url || 'UNKNOWN';
    const statusCode = res?.statusCode || 500;
    const language = req?.language || 'vi';
    const message = i18nService.getMessage(messageCode, language);
    
    const errorDetail = error ? `Error: ${error.message || error}` : '';
    const logMessage = this.formatLog('ERROR', method, url, statusCode, messageCode, message, `${extra} ${errorDetail}`.trim());
    console.error(logMessage);
    
    if (error && error.stack) {
      console.error(`[${this.requestId || 'no-req-id'}] Stack trace:`, error.stack);
    }
  }

  logSystem(messageCode, level = 'INFO', extra = '') {
    const timestamp = new Date().toISOString().replace('T', ' ').replace(/\..+/, '');
    const message = i18nService.getMessage(messageCode);
    
    const logMessage = `[${timestamp}] [SYSTEM] [${level}] - ${messageCode} - ${message}${extra ? ` - ${extra}` : ''}`;
    
    if (level === 'ERROR') {
      console.error(logMessage);
    } else {
      console.log(logMessage);
    }
  }

  info(messageCode, extra = '') {
    this.logSystem(messageCode, 'INFO', extra);
  }

  error(messageCode, error, extra = '') {
    const errorDetail = error ? `Error: ${error.message || error}` : '';
    this.logSystem(messageCode, 'ERROR', `${extra} ${errorDetail}`.trim());
    
    if (error && error.stack) {
      console.error(`[SYSTEM] Stack trace:`, error.stack);
    }
  }

  warn(messageCode, extra = '') {
    this.logSystem(messageCode, 'WARN', extra);
  }

  debug(messageCode, extra = '') {
    if (process.env.NODE_ENV === 'development') {
      this.logSystem(messageCode, 'DEBUG', extra);
    }
  }
}

export default new LoggerService();
