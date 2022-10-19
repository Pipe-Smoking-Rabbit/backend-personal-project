const connection = require("../../db/connection");

module.exports = function fetchUsers () {
  return connection.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
