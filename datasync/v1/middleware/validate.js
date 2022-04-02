module.exports = ({ schema }) => {
  const joiError = (obj) =>
    schema.validate(obj, { allowUnknown: true, abortEarly: false }).error;

  return async (req, res, next) => {
    const startAt = new Date();
    req.inputs = { ...req.query, ...req.params, ...req.body };

    const error = (joiError(req.inputs) || { details: [] })
      .details.map((err) => err.message).join(', ').replace(/"/g, "'");
    if (error) {
      req.status = 422;
      req.message = error;

      res.status(422).json({
        response: {
          status: 422,
          message: error,
        },
      });

      const { msisdn } = req.inputs;
      console.log(`[${new Date().toISOString()}] ${msisdn || ''} [${req.path.replace(/\//g, '').replace(/[_-]/g, ' ').toUpperCase()}] 422 - ${error} in ${new Date() - startAt} ms`.replace(/\s{2,}/g, ' '));

      return;
    }

    next();
  };
};
