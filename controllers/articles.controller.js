const {
  fetchArticleFromID,
  fetchArticles,
  fetchArticleComments,
  checkArticleExists,
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

exports.getArticleComments = (req, resp, next) => {
  fetchArticleComments(req.params.article_id)
    .then(async (comments) => {
      if (comments.length === 0) {
        const reject = await checkArticleExists(req.params.article_id);
        if (reject) {
          resp.status(404).send({ error: reject.msg });
        }
        resp.status(200).send({ comments });
      }
      resp.status(200).send({ comments });
    })
    .catch((err) => {
      if (err.status) {
        resp.status(404).send({ error: err.msg });
      } else {
        next(err);
      }
    });
};
