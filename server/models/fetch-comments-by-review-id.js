const connection = require("../../db/connection");

module.exports = function fetchCommentsByReviewID(review_id) {
  return connection
    .query(
      `
  SELECT * FROM comments
  WHERE review_id = $1`,
      [review_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};
