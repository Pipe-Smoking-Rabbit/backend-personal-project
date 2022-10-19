const connection = require("../../db/connection");

module.exports = function removeComment(comment_id) {
  return connection
    .query(
      `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *`,
      [comment_id]
    )
    .then(({ rows: [comment] }) => {
      if (comment === undefined) {
        return Promise.reject({
          status: 404,
          message: `Comment ID ${comment_id} could not be found.`,
        });
      }
    });
};
