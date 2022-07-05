const express = require("express");
const {
  getCategories,
  getReviewByID,
} = require("./controllers/games-controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewByID);
app.get("*", (request, response) => {
  response.status(404).send({ message: "invalid url" });
});

app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ message: "A review ID must be a number" });
  } else {
    next(error);
  }
});

app.use((error, request, response, next) => {
  if (error.status && error.message) {
    response.status(error.status).send({ message: error.message });
  } else {
    next(error)
  }
});

app.use((error, request, response, next) => {
  response
    .status(500)
    .send({
      message:
        "The creator of this server is, as yet, physically incapable of writing adequate enough code to handle your request.",
    });
});

module.exports = app;
