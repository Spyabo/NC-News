const { insertComment } = require("../models/comments.model");

exports.postComment = (req, resp) => {
  const newComment = req.body;
  insertComment(newComment).then((data) => {
    resp.status(201).send(data);
  });
};
