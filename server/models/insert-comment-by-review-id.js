const connection = require("../../db/connection");

module.exports = function insertCommentByReviewID(review_id, body, username) {
  if (typeof body !== "string") {
    return Promise.reject({ status: 400, message: "Invalid request." });
  }
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
