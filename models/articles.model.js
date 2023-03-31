const db = require("../db/connection.js");
const { fetchTopics } = require("../models/fetchTopics.model.js");

exports.fetchArticleFromID = (article_id) => {
  return db
    .query(
      `SELECT articles.*, CAST(COUNT(comments.comment_id) AS INT) as comment_count FROM articles
       LEFT JOIN comments ON articles.article_id = comments.article_id
       WHERE articles.article_id = $1
       GROUP BY articles.article_id`,
      [article_id]
    )
    .then((data) => {
      if (data.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return data.rows[0];
    });
};

exports.fetchArticles = async (
  topic,
  sort_by = "created_at",
  order = "desc"
) => {
  let query = `SELECT articles.*, CAST(COUNT(comments.article_id) AS INT) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;
  const topicArr = [];

  const validColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "votes",
    "article_image_url",
  ];
  // reject if invalid queries
  if (!validColumns.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid sort_by",
    });
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid order",
    });
  }
  if (topic) {
    const topics = await fetchTopics().then((topics) =>
      topics.map((topic) => topic.slug)
    );
    if (!topics.includes(topic)) {
      return Promise.reject({
        status: 404,
        msg: "Invalid topic",
      });
    }
    topicArr.push(topic);
    query += ` WHERE topic = $1`;
  }

  query += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  return db.query(query, topicArr).then((data) => {
    if (topicArr.length === 1 && data.rowCount === 0) {
      return Promise.resolve({
        status: 200,
        msg: "No articles found for specified topic",
        article: new Array(),
      });
    }

    if (data.rowCount === 0) {
      return Promise.reject({
        status: 404,
        msg: "Articles not found",
      });
    }
    return data.rows;
  });
};

exports.fetchArticleComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY created_at DESC`,
      [article_id]
    )
    .then((data) => {
      return data.rows;
    });
};

exports.updateArticleVotes = (update) => {
  const { article_id, inc_votes } = update;
  return db
    .query(
      `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
      `,
      [inc_votes, article_id]
    )
    .then((data) => {
      if (data.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return data.rows[0];
    });
};

async function checkArticleExists(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((data) => {
      if (data.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return 0; //Thought returning a falsy value would be better
    });
}
module.exports.checkArticleExists = checkArticleExists;
