const {
  fetchCategories,
  fetchReviewByID,
  updateReviewByID,
  fetchUsers,
} = require("../models/games-models");

exports.getCategories = (request, response, next) => {
  fetchCategories()
    .then((categories) => {
      response.status(200).send({ categories });
    })
    .catch((error) => {
      response.status(404).send(error);
      next(error);
    });
};

exports.getReviewByID = (request, response, next) => {
  const { review_id } = request.params;
  fetchReviewByID(review_id)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchReviewByID = (request, response, next) => {
  const { review_id } = request.params;
  const { inc_votes } = request.body;
  updateReviewByID(review_id, inc_votes).then((review) => {
    response.status(200).send({ review });
  }).catch(error => {
    next(error)
  })
}

exports.getUsers = (request, response, next) => {
  fetchUsers().then((users) => {
    response.status(200).send({ users });
  });
};
