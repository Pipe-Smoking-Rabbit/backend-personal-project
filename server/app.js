const cors = require("cors");
const express = require("express");
const apiRouter = require("./router/api-router");
const {
  handleInternalServerError,
  handleCustomError,
  handlePsqlError,
  handleInvalidPathError,
} = require("./errors");


const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

// invalid url error handling
app.use("*", handleInvalidPathError);

// psql error handling
app.use(handlePsqlError);

// custom error handling
app.use(handleCustomError);

// internal server error handling (500)
app.use(handleInternalServerError);

module.exports = app;
