const { fetchCategories, fetchReviewByID } = require("../models/games-models");

exports.getCategories = (request, response, next) => {
  fetchCategories()
    .then((categories) => {
      response.status(200).send({ categories });
    })
    .catch((error) => {
      console.log(error);
      response.status(404).send(error);
      next(error);
    });
};

exports.getReviewByID = () => {
  fetchReviewByID();
};
