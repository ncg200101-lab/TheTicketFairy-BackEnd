import i18nService from '../services/i18nService.js';
import loggerService from '../services/loggerService.js';

const responseHandler = (req, res, next) => {
  // Set default language from headers
  req.language = req.headers['accept-language']?.startsWith('en') ? 'en' : 'vi';
  
  // Generate and set request ID
  const requestId = loggerService.generateRequestId();
  req.requestId = requestId;
  loggerService.setRequestId(requestId);
  
  // Add request ID to response headers
  res.set('X-Request-ID', requestId);

  // Success response method
  res.success = ({ messageCode, data = null, status = 200 }) => {
    const message = i18nService.getMessage(messageCode, req.language);
    
    const response = {
      success: true,
      message,
      messageCode,
      data,
      error: null,
    };

    res.status(status);
    loggerService.logRequest(req, res, messageCode);
    res.json(response);
  };

  // Error response method
  res.error = ({ status = 400, messageCode, error = null, data = null }) => {
    const message = i18nService.getMessage(messageCode, req.language);
    
    const response = {
      success: false,
      message,
      messageCode,
      data,
      error: error ? {
        type: error.name || 'Error',
        details: error.message || error.toString(),
      } : null,
    };

    res.status(status);
    loggerService.logError(req, res, messageCode, error);
    res.json(response);
  };

  next();
};

export default responseHandler;
