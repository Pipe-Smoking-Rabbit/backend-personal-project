const apiRouter = require("express").Router();
const { getAPI } = require("../controllers");
const {
  userRouter,
  reviewsRouter,
  categoriesRouter,
  commentsRouter,
} = require("./routes/");

apiRouter.get("/", getAPI);
apiRouter.use("/users", userRouter);
apiRouter.use("/reviews", reviewsRouter);
apiRouter.use("/categories", categoriesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
