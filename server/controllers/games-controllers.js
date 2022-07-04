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

exports.getReviewByID = (request, response, next) => {
  const { review_id } = request.params;
  fetchReviewByID(review_id)
    .then((review) => {
      if (!review) {
        response
          .status(404)
          .send({
            message: "Sorry. There is no review with that ID number :(",
          });
      }
      response.status(200).send({ review });
    })
    .catch((error) => {
      next(error);
    });
};
