const fetchArticles = require("../models/fetchArticles.model.js");

function getArticles(req, resp, next) {
  fetchArticles(req.params.article_id)
    .then((article) => {
      resp.status(200).send(article[0]);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
}

module.exports = getArticles;
