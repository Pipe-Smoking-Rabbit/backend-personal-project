const { insertUser } = require("../models")

module.exports = function postUser (req, res, next) {
    const post_body = req.body
    insertUser(post_body).then(user => {
        res.status(201).send({user})
    }).catch(next)
}