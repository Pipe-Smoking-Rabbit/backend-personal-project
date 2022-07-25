const cors = require("cors")
const express = require("express");
const {
  getCategories,
  getReviewByID,
  patchReviewByID,
  getUsers,
  getReviews,
  getCommentsByReviewID,
  postCommentByReviewID,
  getAPI,
  deleteComment,
} = require("./controllers/games-controllers");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", getAPI)
app.get("/api/categories", getCategories);
app.get("/api/reviews", getReviews)
app.get("/api/reviews/:review_id", getReviewByID);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewID)
app.get("/api/users", getUsers)

app.patch("/api/reviews/:review_id", patchReviewByID);

app.post("/api/reviews/:review_id/comments", postCommentByReviewID)

app.delete("/api/comments/:comment_id", deleteComment)

// invalid url error handling
app.use("*", (request, response) => {
  response.status(404).send({ message: "invalid url" });
});

// psql error handling
app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({ message: "Invalid: ID must be a number." });
  } else if (error.code === "23502") {
    response.status(400).send({ message: "Invalid request." });
  } else if (error.code === "23503") {
    response.status(400).send({message: "Credentials not recognised."})
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
  console.log(error)

  response.status(500).send({
    message:
      "The creator of this server is, as yet, physically incapable of writing adequate enough code to handle your request.",
  });
});

module.exports = app;
