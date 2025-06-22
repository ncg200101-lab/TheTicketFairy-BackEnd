import loggerService from '../services/loggerService.js';

const errorHandler = (err, req, res, _next) => {
  loggerService.setRequestId(req.requestId);

  // Custom error with messageCode (from our services)
  if (err.messageCode) {
    const statusCode = err.status || (err.name === 'ValidationError' ? 400 : err.name === 'NotFoundError' ? 404 : 500);
    return res.error({
      status: statusCode,
      messageCode: err.messageCode,
      error: err,
    });
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(error => ({
      field: error.path,
      message: error.message,
    }));
    
    return res.error({
      status: 400,
      messageCode: 'system.validation_error',
      error: { ...err, details: errors },
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.error({
      status: 409,
      messageCode: 'user.email.exists',
      error: err,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.error({
      status: 401,
      messageCode: 'system.unauthorized',
      error: err,
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.error({
      status: 401,
      messageCode: 'system.unauthorized',
      error: err,
    });
  }

  // File upload errors
  if (err.message && err.message.includes('Invalid file type')) {
    return res.error({
      status: 400,
      messageCode: 'file.type.invalid',
      error: err,
    });
  }

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.error({
      status: 400,
      messageCode: 'file.size.too_large',
      error: err,
    });
  }

  // Default error
  const statusCode = err.statusCode || err.status || 500;
  const messageCode = statusCode >= 500 ? 'system.internal_error' : 'system.unknown_error';

  return res.error({
    status: statusCode,
    messageCode,
    error: process.env.NODE_ENV === 'development' ? err : null,
  });
};

export default errorHandler;
