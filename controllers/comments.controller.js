const { insertComment, removeComment } = require("../models/comments.model");

exports.postComment = async (req, resp, next) => {
  const article_id = parseInt(req.params.article_id);
  const comment = {
    username: req.body.username,
    body: req.body.body,
    article_id,
  };
  insertComment(comment)
    .then(async (data) => {
      resp.status(201).send({ postedComment: data });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, resp, next) => {
  const comment_id = parseInt(req.params.comment_id);
  removeComment(comment_id)
    .then((data) => {
      resp.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
