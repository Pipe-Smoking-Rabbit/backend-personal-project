const {
  fetchCategories,
  fetchReviewByID,
  updateReviewByID,
  fetchUsers,
  fetchReviews,
  fetchCommentsByReviewID,
  insertCommentByReviewID,
  fetchAPI,
  removeComment,
} = require("../models/games-models");

exports.getCategories = (request, response, next) => {
  fetchCategories()
    .then((categories) => {
      response.status(200).send({ categories });
    })
    .catch(next);
};

exports.getReviewByID = (request, response, next) => {
  const { review_id } = request.params;
  fetchReviewByID(review_id)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch(next);
};

exports.getReviews = (request, response, next) => {
  const { sort_by, order, category } = request.query;
  fetchCategories(category)
    .then(() => {
      return fetchReviews(sort_by, order, category);
    })
    .then((reviews) => {
      response.status(200).send({ reviews });
    })
    .catch(next);
};

exports.patchReviewByID = (request, response, next) => {
  const { review_id } = request.params;
  const { inc_votes } = request.body;
  updateReviewByID(review_id, inc_votes)
    .then((review) => {
      response.status(200).send({ review });
    })
    .catch(next);
};

exports.getCommentsByReviewID = (request, response, next) => {
  const { review_id } = request.params;
  fetchReviewByID(review_id)
    .then(() => {
      return fetchCommentsByReviewID(review_id);
    })
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};

exports.getUsers = (request, response, next) => {
  fetchUsers().then((users) => {
    response.status(200).send({ users });
  });
};

exports.postCommentByReviewID = (request, response, next) => {
  const { review_id } = request.params;
  const { body, username } = request.body;
  fetchReviewByID(review_id)
    .then(() => {
      return insertCommentByReviewID(review_id, body, username);
    })
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};

exports.getAPI = (request, response, next) => {
  fetchAPI().then((fileContent) => {
    response.status(200).send({ fileContent });
  });
};

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params;
  removeComment(comment_id)
    .then(() => {
      response.sendStatus(204);
    })
    .catch(next);
};
