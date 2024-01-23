const endPoints = require("../../endpoints.json");

module.exports = function getAPI(request, response, next) {
  response.status(200).send({ endPoints });
};
