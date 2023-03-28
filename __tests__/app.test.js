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

  it("404: respond with an error for requesting an ID that is not possible", () => {
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
