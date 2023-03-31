const { fetchTopics } = require("../models/fetchTopics.model.js");

function getTopics(req, resp, next) {
  fetchTopics()
    .then((topics) => {
      resp.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = getTopics;
