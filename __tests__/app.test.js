const db = require("../db/connection.js");
const app = require("../app");
const request = require("supertest");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index.js");
const users = require("../db/data/test-data/users.js");
const seed = require("../db/seeds/seed.js");

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
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
