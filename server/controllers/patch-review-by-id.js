const { updateReviewByID } = require("../models");

module.exports = function patchReviewByID(request, response, next) {
  const { review_id } = request.params;
  const { inc_votes } = request.body;
  updateReviewByID(review_id, inc_votes)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch(next);
};
