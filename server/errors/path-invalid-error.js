const handleInvalidPathError = (request, response) => {
  response.status(404).send({ message: "invalid url" });
};

module.exports = handleInvalidPathError;
