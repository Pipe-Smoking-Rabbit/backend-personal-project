const userRouter = require("express").Router();
const { getUsers, getUserByUsername } = require("../../controllers");

userRouter.get("/", getUsers);
userRouter.get("/:username", getUserByUsername);

module.exports = userRouter;
