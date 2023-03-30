const db = require("../db/connection.js");
const { checkArticleExists } = require("./articles.model.js");
const { checkUserExists } = require("./users.model.js");

exports.insertComment = async (comment) => {
  const { username, body, article_id } = comment;

  if (username === undefined || body === undefined) {
    return Promise.reject({
      status: 400,
      msg: "Missing required fields: username and body",
    });
  }

  if (await checkUserExists(username)) {
    return Promise.reject({
      status: 404,
      msg: "User not found",
    });
  }

  if (await checkArticleExists(article_id)) {
    return Promise.reject({
      status: 404,
      msg: "Articles not found",
    });
  } else {
    return db
      .query(
        `INSERT INTO comments (body, author, article_id) VALUES ($1, $2, $3) RETURNING *`,
        [body, username, article_id]
      )
      .then((result) => {
        return result.rows[0];
      });
  }
};

exports.removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found",
        });
      }
      return result.rows[0];
    });
};
