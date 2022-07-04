const connection = require("../../db/connection");

exports.fetchCategories = () => {
  return connection
    .query(`SELECT * FROM categories;`)
    .then(({ rows }) => {
      return rows;
    })
    .catch((error) => {
      console.log(error);
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
      console.log(review)
      return review
    });
};
