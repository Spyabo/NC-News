const db = require("../db/connection.js");

function fetchArticles(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return data.rows[0];
    });
}

module.exports = fetchArticles;
