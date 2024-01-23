const connection = require("../../db/connection");

module.exports = function insertCommentByReviewID(review_id, body, username) {
  return connection
    .query(
      `
  INSERT INTO comments
  (review_id, body, author)
  VALUES
  ($1, $2, $3)
  RETURNING *`,
      [review_id, body, username]
    )
    .then(({ rows: [comment] }) => {
      return comment;
    });
};
