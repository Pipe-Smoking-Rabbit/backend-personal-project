const connection = require("../../db/connection");

module.exports = function fetchCategories(category) {
  let queryString = `SELECT * FROM categories`;
  let bindArray = undefined;

  if (category) {
    queryString += ` WHERE slug = $1`;
    bindArray = [category];
  }

  return connection.query(queryString, bindArray).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 400,
        message: `${category} category does not exist.`,
      });
    }
    return rows;
  });
};
