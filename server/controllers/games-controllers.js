const {
  fetchCategories,
  fetchReviewByID,
  updateReviewByID,
  fetchUsers,
  fetchReviews,
  fetchCommentsByReviewID,
  insertCommentByReviewID,
  fetchAPI,
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

exports.getReviews = async (request, response, next) => {
  const { sort_by, order, category } = request.query;
  await fetchCategories(category).catch((error) => {
    next(error);
  });
  fetchReviews(sort_by, order, category)
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchReviewByID = (request, response, next) => {
  const { review_id } = request.params;
  const { inc_votes } = request.body;
  updateReviewByID(review_id, inc_votes)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCommentsByReviewID = async (request, response, next) => {
  const { review_id } = request.params;
  await fetchReviewByID(review_id).catch((error) => {
    next(error);
  });
  fetchCommentsByReviewID(review_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getUsers = (request, response, next) => {
  fetchUsers().then((users) => {
    response.status(200).send({ users });
  });
};

exports.postCommentByReviewID = (request, response, next) => {
  const { review_id } = request.params;
  const { body, username } = request.body;
  fetchReviewByID(review_id).catch((error) => {
    next(error);
  });
  insertCommentByReviewID(review_id, body, username)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getAPI = (request, response, next) => {
  fetchAPI().then(fileContent => {
    fileContent = JSON.parse(fileContent)
    response.status(200).send({fileContent})
  })
}