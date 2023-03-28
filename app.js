const express = require("express");
const getTopics = require("./controllers/topics.controller");
const {
  getArticleFromID,
  getArticles,
  getArticleComments,
} = require("./controllers/articles.controller");
const {
  handlePSQL400s,
  handleCustomErrors,
  handle500Statuses,
} = require("./controllers/errorHandlers.controller");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleFromID);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);

app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500Statuses);

module.exports = app;
