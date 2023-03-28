const {
  fetchArticleFromID,
  fetchArticles,
} = require("../models/fetchArticles.model.js");

exports.getArticleFromID = (req, resp, next) => {
  fetchArticleFromID(req.params.article_id)
    .then((article) => {
      resp.status(200).send(article);
    })
    .catch((err) => {
      if (err.status) {
        resp.status(404).send({ error: err.msg });
      } else {
        next(err);
      }
    });
};

exports.getArticles = (req, resp, next) => {
  fetchArticles()
    .then((articles) => {
      resp.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
