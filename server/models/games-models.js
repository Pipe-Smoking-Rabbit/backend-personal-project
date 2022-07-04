const connection = require("../../db/connection");

exports.fetchCategories = () => {
  return connection
    .query(`SELECT * FROM categories;`)
    .then(({ rows }) => {
      return rows;
    })
    .catch((error) => {
      console.log(error);
      return Promise.reject({ message: "something is wrong" });
    });
};

exports.fetchReviewByID = () => {};
