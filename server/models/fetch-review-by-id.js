const connection = require("../../db/connection");

module.exports = function fetchReviewByID(review_id) {
  return connection
    .query(
      `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews
      LEFT JOIN comments 
      ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id`,
      [review_id]
    )
    .then(({ rows: [review] }) => {
      if (review) {
        return review;
      }
      return Promise.reject({
        status: 404,
        message: `Sorry. Review ID ${review_id} does not exist.`,
      });
    });
};
