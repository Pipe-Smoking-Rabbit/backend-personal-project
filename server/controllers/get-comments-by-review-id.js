const { fetchReviewByID, fetchCommentsByReviewID } = require("../models");

module.exports = function getCommentsByReviewID(request, response, next) {
  const { review_id } = request.params;
  fetchReviewByID(review_id)
    .then(() => {
      return fetchCommentsByReviewID(review_id);
    })
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};
