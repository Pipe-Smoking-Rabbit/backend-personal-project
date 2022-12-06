const cors = require("cors");
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
  postUser,
} = require("./controllers/");
const {
  handleInternalServerError,
  handleCustomError,
  handlePsqlError,
  handleInvalidPathError,
} = require("./errors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", getAPI);

app.get("/api/users", getUsers);
app.post("/api/users", postUser)

app.get("/api/reviews", getReviews);

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewByID);
app.patch("/api/reviews/:review_id", patchReviewByID);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewID);
app.post("/api/reviews/:review_id/comments", postCommentByReviewID);

app.delete("/api/comments/:comment_id", deleteComment);

// invalid url error handling
app.use("*", handleInvalidPathError);

// psql error handling
app.use(handlePsqlError);

// custom error handling
app.use(handleCustomError);

// internal server error handling (500)
app.use(handleInternalServerError);

module.exports = app;
