const connection = require("../../db/connection");

module.exports = function insertUser ({username, avatar_url, name}) {
    return connection.query(`
        INSERT INTO users
        (username, avatar_url, name)
        VALUES
        ($1, $2, $3)
        RETURNING *
    `, [username, avatar_url, name]).then(({rows: [user]})=> {
        return user
    })
}