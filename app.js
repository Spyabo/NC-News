const express = require("express");
const getTopics = require("./controllers/topics.controller");

const {
  handlePSQL400s,
  handleCustomErrors,
  handle500Statuses,
} = require("./controllers/errorHandlers.controllers");

const app = express();

app.get("/api/topics", getTopics);

app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500Statuses);

module.exports = app;
