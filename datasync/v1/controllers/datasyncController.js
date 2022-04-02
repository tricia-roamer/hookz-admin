const { success } = require('../../../lib/grpc/responses');

module.exports = () => ({
  subscription: async (req, res) => {
    console.log('PAYLOAD', req.inputs);

    const response = success('ok');

    res.status(200).json(response);

    // return response for tracking
    return response;
  },
});
