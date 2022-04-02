
const sendError = (res, status, message, stack) =>
  res.status(status).json({
    status,
    message,
    stack: process.env.NODE_ENV !== 'production' ? stack : undefined,
  });

exports.sendError = sendError;

exports.catchErrors = fn =>
  (req, res, next) =>
    fn(req, res, next).catch(err => sendError(res, 500, err.message, err.stack));
