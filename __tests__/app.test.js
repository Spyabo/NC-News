const db = require("../db/connection.js");
const app = require("../app");
const request = require("supertest");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const { expect } = require("@jest/globals");
const { resourceUsage } = require("process");

beforeEach(() => seed({ articleData, commentData, topicData, userData }));

afterAll(() => db.end());

describe("GET: /api/topics", () => {
  it("200: respond with a json object containing an array of all the topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });

  it("404: respond with an error for an incorrect url", () => {
    return request(app)
      .get("/api/katherine")
      .expect(404)
      .then(({ res }) => {
        expect(res.statusMessage).toBe("Not Found");
      });
  });
});

describe("GET: /api/articles/:article_id", () => {
  it("200: respond with an article object corresponding to the id requested", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body;
        expect(article).toBeInstanceOf(Object);
        expect(Object.keys(article).length).toBe(8);
        expect(article).toMatchObject({
          article_id: 1,
          author: expect.any(String),
          title: expect.any(String),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  it("400: respond with an error for requesting an ID that is not possible", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });

  it("404: respond with an error for requesting an ID that does not exist", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("Article not found");
      });
  });
});

describe("GET: /api/articles", () => {
  it("200: respond with an array of all the article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  it("200: respond with the articles sorted by Date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(12);

        const isSorted = articles.every((item, index, array) => {
          if (index === 0) return true;
          return (
            new Date(item.created_at) <= new Date(array[index - 1].created_at)
          );
        });
        expect(isSorted).toBe(true);
      });
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  it("200: respond with an array of comment objects for a given article", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: 9,
            created_at: expect.any(String),
          });
        });
      });
  });

  it("200: respond with the articles sorted by Date in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(11);

        const isSorted = comments.every((item, index, array) => {
          if (index === 0) return true;
          return (
            new Date(item.created_at) <= new Date(array[index - 1].created_at)
          );
        });
        expect(isSorted).toBe(true);
      });
  });

  it("404: respond with an error for requesting an ID that does not exist", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("Article not found");
      });
  });

  it("400: respond with an error for requesting an ID that is not possible", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });

  it("200: respond with an empty array for an article that has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(0);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  let comment;
  beforeEach(() => {
    comment = {
      username: "lurker",
      body: "This is a comment",
    };
  });

  it("201: respond with the posted comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send(comment)
      .expect(201)
      .then(({ body }) => {
        expect(body.postedComment).toMatchObject({
          comment_id: expect.any(Number),
          body: "This is a comment",
          votes: expect.any(Number),
          author: "lurker",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });

  it("201: ignores unnecessary properties in a sent comment", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "lurker",
        body: "This is a comment",
        votes: 1,
        password: "password",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.postedComment).toMatchObject({
          comment_id: expect.any(Number),
          body: "This is a comment",
          votes: expect.any(Number),
          author: "lurker",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });

  it("400: respond with an error for posting on an ID that is not possible", () => {
    return request(app)
      .post("/api/articles/banana/comments")
      .send(comment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });

  it("400: missing username responds with an error", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        body: "This is a comment",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields: username and body");
      });
  });

  it("400: missing body responds with an error", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "lurker",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields: username and body");
      });
  });

  it("404: respond with an error for posting on an ID that does not exist", () => {
    return request(app)
      .post("/api/articles/1000/comments")
      .send(comment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  it("404: username does not exist", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "Zu",
        body: "This is a comment",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("200: respond with the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 10,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 110,
          article_img_url: expect.any(String),
        });
      });
  });

  it("200: increment the votes by 10", () => {
    let votes;
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        votes = body.votes;
      })
      .then(() => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            inc_votes: 10,
          })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).toBe(votes + 10);
          });
      });
  });

  it("200: decrement the votes by 10", () => {
    let votes;
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        votes = body.votes;
      })
      .then(() => {
        return request(app)
          .patch("/api/articles/1")
          .send({
            inc_votes: -10,
          })
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).toBe(votes - 10);
          });
      });
  });

  it("200: respond with an updated article when the article has no votes key yet", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({
        inc_votes: 10,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 2,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 10,
          article_img_url: expect.any(String),
        });
      });
  });

  it("200: respond with an updated article when the article has no votes key yet and the votes value will be negative", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({
        inc_votes: -10,
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 2,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: -10,
          article_img_url: expect.any(String),
        });
      });
  });

  it("404: respond with an error for requesting an ID that does not exist", () => {
    return request(app)
      .patch("/api/articles/1000")
      .send({
        inc_votes: 10,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("Article not found");
      });
  });

  it("400: respond with an error for requesting an ID that is not possible", () => {
    return request(app)
      .patch("/api/articles/banana")
      .send({
        inc_votes: 10,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it('204: respond with "No Content"', () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ res }) => {
        expect(res.statusMessage).toBe("No Content");
      });
  });

  it("204: delete the comment", () => {
    return db
      .query(`SELECT FROM comments WHERE comment_id = 2`)
      .then(({ rows }) => {
        expect(rows.length).toBe(1);
        return request(app)
          .delete("/api/comments/2")
          .expect(204)
          .then(() => {
            return db
              .query(`SELECT FROM comments WHERE comment_id = 2`)
              .then(({ rows }) => {
                expect(rows.length).toBe(0);
              });
          });
      });
  });

  it("404: respond with an error for requesting an ID that does not exist", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });

  it("404: respond with an error for requesting an ID that is not possible", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid ID");
      });
  });
});

describe("GET /api/users", () => {
  it("200: respond with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toBeInstanceOf(Array);
      });
  });

  it("200: each user has 3 properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        expect(body.users[0]).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });
});
