const handleInternalServerError = (error, request, response, next) => {
  console.log(error);

  response.status(500).send({
    message:
      "Oops! We've run into an unexpected error :( Please contact the development team and ask them to look into this.",
  });
};

module.exports = handleInternalServerError;
