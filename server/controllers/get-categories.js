const { fetchCategories } = require("../models");

module.exports = function getCategories(request, response, next) {
  fetchCategories()
    .then((categories) => {
      response.status(200).send({ categories });
    })
    .catch(next);
};
