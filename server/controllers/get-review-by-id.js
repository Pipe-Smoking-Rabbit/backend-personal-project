const { fetchReviewByID } = require("../models");

module.exports = function getReviewByID(request, response, next) {
  const { review_id } = request.params;
  fetchReviewByID(review_id)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch(next);
};
