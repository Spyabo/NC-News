const endpoints = require("../endpoints.json");

exports.fetchEndpoints = (req, resp, next) => {
  resp
    .status(200)
    .send({ endpoints })
    .catch((err) => {
      next(err);
    });
};
