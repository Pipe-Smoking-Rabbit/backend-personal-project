const express = require("express");
const {
  getCategories,
  getReviewByID,
  patchReviewByID,
  getUsers,
  getReviews,
} = require("./controllers/games-controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewByID);
app.get("/api/users", getUsers)
app.get("*", (request, response) => {
  response.status(404).send({ message: "invalid url" });
});

app.patch("/api/reviews/:review_id", patchReviewByID);

// psql error handling
app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ message: "Invalid: ID must be a number." });
  } else if (error.code === "23502") {
    response.status(400).send({ message: "Invalid patch request." });
  } else {
    next(error);
  }
});

// custom error handling
app.use((error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  } else {
    next(error);
  }
});

// internal server error handling (500)
app.use((error, request, response, next) => {
  response.status(500).send({
    message:
      "The creator of this server is, as yet, physically incapable of writing adequate enough code to handle your request.",
  });
});

module.exports = app;
