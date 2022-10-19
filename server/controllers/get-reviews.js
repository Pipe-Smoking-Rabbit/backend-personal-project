const { fetchCategories, fetchReviews } = require("../models");

module.exports = function getReviews(request, response, next) {
  const { sort_by, order, category } = request.query;
  fetchCategories(category)
    .then(() => {
      return fetchReviews(sort_by, order, category);
    })
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch(next);
};
