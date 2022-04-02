module.exports = () => {
  const logAsync = async ({
    msisdn, measurement, response, startAt,
  }) => {
    console.log(`[${new Date().toISOString()}] ${msisdn} [${measurement.replace(/_/g, ' ').toUpperCase()}] ${response.status} - ${response.message} in ${new Date() - startAt} ms`);
  };

  return (fn, measurement) =>
    async (req, res, next) => {
      const startAt = new Date();

      const { msisdn } = req.inputs;
      // the controller passes us back the standard response part of the payload
      const response = await fn(req, res, next);

      logAsync({
        msisdn,
        measurement,
        response: (response || { response: {} }).response,
        startAt,
      });
    };
};
