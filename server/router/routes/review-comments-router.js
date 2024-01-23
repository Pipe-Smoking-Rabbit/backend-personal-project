const reviewCommentsRouter = require("express").Router({mergeParams: true});
const {
  getCommentsByReviewID,
  postCommentByReviewID,
} = require("../../controllers");

reviewCommentsRouter
  .route("/")
  .get(getCommentsByReviewID)
  .post(postCommentByReviewID);

module.exports = reviewCommentsRouter;
