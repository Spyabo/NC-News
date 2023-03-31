const db = require("../db/connection.js");

async function fetchTopics() {
  const data = await db.query(`SELECT * FROM topics`);
  return data.rows;
}

module.exports.fetchTopics = fetchTopics;
