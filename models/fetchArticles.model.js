const db = require("../db/connection.js");

function fetchArticles(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((data) => {
      return data.rows;
    });
}

module.exports = fetchArticles;
