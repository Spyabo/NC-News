const express = require("express");
const getTopics = require("./controllers/topics.controller");
const {
  getArticleFromID,
  getArticles,
  getArticleComments,
  patchArticleVotes,
} = require("./controllers/articles.controller");
const {
  postComment,
  deleteComment,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controller");
const {
  handlePSQL400s,
  handleCustomErrors,
  handle500Statuses,
} = require("./controllers/errorHandlers.controller");
const { fetchEndpoints } = require("./models/endpoints.model");

const app = express();
app.use(express.json());

app.get("/api", fetchEndpoints);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleFromID);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500Statuses);

module.exports = app;
