module.exports = () => {
  const logAsync = async ({
    measurement, response, startAt,
  }) => {
    console.log(`[${new Date().toISOString()}] [${measurement.replace(/_/g, ' ').toUpperCase()}] ${response.status} - ${response.message} in ${new Date() - startAt} ms`);
  };

  return (fn, measurement) =>
    async (req, res, next) => {
      const startAt = new Date();

      // the controller passes us back the standard response part of the payload
      const response = await fn(req, res, next);

      logAsync({
        measurement,
        response: (response || { response: {} }).response,
        startAt,
      });
    };
};
