const fetchArticles = require("../models/fetchArticles.model.js");

function getArticles(req, resp, next) {
  fetchArticles(req.params.article_id)
    .then((article) => {
      resp.status(200).send(article);
    })
    .catch((err) => {
      //   console.log("err:", err);
      if (err.status === 404) {
        resp.status(404).send({ error: err.msg });
      } else {
        next(err);
      }
    });
}

module.exports = getArticles;
