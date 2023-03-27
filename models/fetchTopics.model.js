const db = require("../db/connection.js");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`);
}

module.exports = fetchTopics;
