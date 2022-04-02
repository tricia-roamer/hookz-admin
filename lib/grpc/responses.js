module.exports = {
  success: (message) => ({
    response: {
      status: 200,
      message,
    },
  }),

  invalid: (message) => ({
    response: {
      status: 422,
      message,
    },
  }),

  badRequest: (message) => ({
    response: {
      status: 400,
      message,
    },
  }),

  error: (message) => ({
    response: {
      status: 500,
      message,
    },
  }),
};
