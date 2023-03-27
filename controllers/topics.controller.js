const fetchTopics = require("../models/fetchTopics.model.js");

function getTopics(req, resp, next) {
  fetchTopics(req.query)
    .then((data) => {
      resp.status(200).send(data.rows);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = getTopics;
