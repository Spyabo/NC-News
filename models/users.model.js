const db = require("../db/connection.js");

async function checkUserExists(username) {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((data) => {
      if (data.rowCount === 0) {
        return 1;
      }
      return 0;
    });
}
module.exports.checkUserExists = checkUserExists;
