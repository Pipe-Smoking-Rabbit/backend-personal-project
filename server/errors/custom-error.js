const handleCustomError = (error, request, response, next) => {
  const { status, message } = error;
  if (status && message) {
    response.status(status).send({ message });
  } else {
    next(error);
  }
};

module.exports = handleCustomError;
