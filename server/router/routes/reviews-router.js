const reviewsRouter = require("express").Router();
const reviewCommentsRouter = require("./review-comments-router");
const {
  getReviews,
  getReviewByID,
  patchReviewByID,
  getCommentsByReviewID,
  postCommentByReviewID,
} = require("../../controllers");

reviewsRouter.get("/", getReviews);
reviewsRouter.route("/:review_id").get(getReviewByID).patch(patchReviewByID);
reviewsRouter.use("/:review_id/comments", reviewCommentsRouter);

module.exports = reviewsRouter;
