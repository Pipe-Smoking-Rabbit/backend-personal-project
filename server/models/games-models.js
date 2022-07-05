const connection = require("../../db/connection");

exports.fetchCategories = () => {
  return connection
    .query(`SELECT * FROM categories;`)
    .then(({ rows }) => {
      return rows;
    })
    .catch((error) => {
      return Promise.reject({ message: "Something went wrong!" });
    });
};

exports.fetchReviewByID = (review_id) => {
  return connection
    .query(
      `SELECT * FROM reviews
     WHERE review_id = $1`,
      [review_id]
    )
    .then(({ rows: [review] }) => {
      if (review) {
        return review;
      }
      return Promise.reject({
        status: 404,
        message: "Sorry. There is no review with that ID number :(",
      });
    });
};

exports.fetchUsers = () => {
  return connection.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
