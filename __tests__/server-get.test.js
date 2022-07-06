const request = require("supertest");
const app = require("../server/app");
const connection = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return connection.end();
});

describe("/api/categories", () => {
  test("status:200, responds with an array of category objects, each of which contains slug and description properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body: { categories } }) => {
        expect(categories).toBeInstanceOf(Array);
        expect(categories).toHaveLength(4);
        categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("api/reviews/:review_id", () => {
  test("status:200 responds with a review object which should have properties: review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at, comment_count", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then(({ body: { review } }) => {
        expect(review).toEqual({
          review_id: 2,
          title: "Jenga",
          category: "dexterity",
          designer: "Leslie Scott",
          owner: "philippaclaire9",
          review_body: "Fiddly fun for all the family",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          created_at: "2021-01-18T10:01:41.251Z",
          votes: 5,
          comment_count: "3",
        });
      });
  });
});

describe("Error Handling", () => {
  describe("incorrect url for get request", () => {});
  test("/api/invalid_url returns 404 error with error message", () => {
    return request(app)
      .get("/api/invalid_url")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("invalid url");
      });
  });
  describe("valid but none existing review_id passed to GET /api/reviews/:review_id", () => {
    test("status:404, that review does not exist", () => {
      return request(app)
        .get("/api/reviews/420")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Sorry. There is no review with that ID number :("
          );
        });
    });
  });
  describe("invalid review_id passed to GET /api/reviews/:review_id", () => {
    test("status:400, review_id must be a number", () => {
      return request(app)
        .get("/api/reviews/monkee")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Invalid: ID must be a number.");
        });
    });
  });
});
