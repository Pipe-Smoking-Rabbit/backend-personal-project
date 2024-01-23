const categoriesRouter = require("express").Router();
const { getCategories } = require("../../controllers");

categoriesRouter.get("/", getCategories);

module.exports = categoriesRouter;
