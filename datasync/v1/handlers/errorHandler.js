const { error } = require('../../../lib/grpc/responses');

const sendError = (
  req, res, err,
) => {
  console.log(err);

  if (res.headersSent) { return; }

  res.status(500).json(error(err.message));
};

exports.catchError = (fn) =>
  (req, res, next) => {
    fn(req, res, next).catch((err) => {
      sendError(req, res, err);
    });
  };
