const { insertComment } = require("../models/comments.model");
const { checkArticleExists } = require("../models/fetchArticles.model.js");

exports.postComment = async (req, resp, next) => {
  const article_id = parseInt(req.params.article_id);
  const comment = {
    username: req.body.username,
    body: req.body.body,
    article_id,
  };
  insertComment(comment)
    .then(async (data) => {
      console.log("data:", data);
      resp.status(201).send(data);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
