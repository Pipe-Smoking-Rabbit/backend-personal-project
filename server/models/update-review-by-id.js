const connection = require("../../db/connection");

module.exports = function updateReviewByID(review_id, inc_votes) {
  const queryValues = [inc_votes, review_id];
  return connection
    .query(
      `UPDATE reviews
      SET votes = votes + $1
      WHERE review_id = $2
      RETURNING *`,
      queryValues
    )
    .then(({ rows: [review] }) => {
      if (review) {
        return review;
      }
      return Promise.reject({
        status: 404,
        message: `Unable to process patch request: Review ID ${review_id} could not be found.`,
      });
    });
};
