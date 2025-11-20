// middleware/errorHandler.js - Global Error Handler
const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Server error';

  res.status(status).json({
    error: message,
    status: status,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
