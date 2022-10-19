const { fetchAPI } = require("../models");

module.exports = function getAPI(request, response, next) {
  fetchAPI().then((fileContent) => {
    response.status(200).send({ fileContent });
  });
};
