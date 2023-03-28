const db = require("../db/connection.js");

exports.fetchArticleFromID = (article_id) => {
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
};

exports.fetchArticles = () => {
  const comment_count = `(SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id)`;
  return db
    .query(
      `SELECT 
      article_id,
      author,
      title,
      body,
      topic,
      created_at,
      votes,
      article_img_url,
      CAST(${comment_count}AS INT) AS comment_count
  FROM 
      articles ORDER BY created_at DESC`
    )
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Articles not found",
        });
      }
      return data.rows;
    });
};
