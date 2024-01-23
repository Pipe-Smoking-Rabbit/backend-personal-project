const connection = require("../../db/connection");

module.exports = fetchUserByUsername = (username) => {
  return connection
    .query(
      `
    SELECT username, name, avatar_url 
    FROM users 
    WHERE username = $1`,
      [username]
    )
    .then(({ rows: [user] }) => {
      if (user) return user;
      else
        return Promise.reject({
          status: 404,
          message: `No user found with username "${username}"`,
        });
    });
};
