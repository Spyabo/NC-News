const db = require("../db/connection.js");
const { checkArticleExists } = require("../models/fetchArticles.model.js");

exports.insertComment = async (comment) => {
  const { username, body, article_id } = comment;
  if (await checkArticleExists(article_id)) {
    return Promise.reject({
      status: 404,
      msg: "Articles not found",
    });
  }
  return db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [body, username, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};
