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

describe("GET HAPPY PATHS", () => {
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
  describe("api/reviews", () => {
    test("status:200 - responds with an array of review objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toHaveLength(13);
          reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                review_body: expect.any(String),
                designer: expect.any(String),
                comment_count: expect.any(String),
              })
            );
          });
        });
    });
    test("status:200 - reviews array are sorted by date in descending order", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at", { descending: true });
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
  describe.only("/api/reviews/:review_id/comments", () => {
    test("status:200 responds with an array of comment objects for the given review_id", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(3);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                review_id: expect.any(Number),
              })
            );
          });
        });
    });
  });
  describe("/api/users", () => {
    test("responds with an array of user objects containing properties for username, name, avatar_url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toEqual({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});

describe("Error Handling", () => {
  test("/api/invalid_url returns 404 error with error message", () => {
    return request(app)
      .get("/api/invalid_url")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("invalid url");
      });
  });
  describe("GET /api/reviews/:review_id", () => {
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
