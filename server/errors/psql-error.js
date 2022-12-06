const handlePsqlError = (error, request, response, next) => {
  const { code } = error;

  if (code === "22P02") {
    response.status(400).send({ message: "Invalid: ID must be a number." });
  }
  else if (code === "23502") {
    response.status(400).send({ message: "Invalid request." });
  }
  else if (code === "23503") {
    response.status(400).send({ message: "Credentials not recognised." });
  }
  else if (code === "23505") {
    response.status(409).send({ message: error.detail})
  }
  else {
    next(error);
  }
};

module.exports = handlePsqlError;
