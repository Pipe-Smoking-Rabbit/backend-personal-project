const { fetchUsers } = require("../models");

module.exports = function getUsers(request, response, next) {
  fetchUsers().then((users) => {
    response.status(200).send({ users });
  });
};
