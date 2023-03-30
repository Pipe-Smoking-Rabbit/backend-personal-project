const { insertCommentByReviewID, fetchReviewByID } = require("../models");

module.exports = function postCommentByReviewID(request, response, next) {
  const { review_id } = request.params;
  const { body, username } = request.body;
  insertCommentByReviewID(review_id, body, username)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};
