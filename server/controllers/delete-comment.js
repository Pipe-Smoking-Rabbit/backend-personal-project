const { removeComment } = require("../models");

module.exports = function deleteComment(request, response, next) {
  const { comment_id } = request.params;
  removeComment(comment_id)
    .then(() => {
      response.sendStatus(204);
    })
    .catch(next);
};
