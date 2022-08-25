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
  describe("/api", () => {
    test("status:200 - responds with json object containing details for every available endpoint", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { fileContent } }) => {
          fileContent = JSON.parse(fileContent);
          expect(fileContent).toEqual(
            expect.objectContaining({
              "DELETE /api/comments/:comment_id": expect.any(Object),
              "GET /api/reviews": expect.any(Object),
              "GET /api/reviews/:review_id": expect.any(Object),
              "GET /api/reviews/:review_id/comments": expect.any(Object),
              "GET /api/users": expect.any(Object),
              "PATCH /api/reviews/:review_id": expect.any(Object),
              "POST /api/reviews/:review_id/comments": expect.any(Object),
              "DELETE /api/comments/:comment_id": expect.any(Object),
            })
          );
        });
    });
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
    test("status:200 - reviews array are sorted by date in descending order (by default)", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("status:200 - reviews array can be sorted by any valid column (descending by default)", () => {
      return request(app)
        .get("/api/reviews?sort_by=votes")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("votes", { descending: true });
        });
    });
    test("status:200 - reviews array can be ordered in ascending order (sorted by date by default)", () => {
      return request(app)
        .get("/api/reviews?order=asc")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at", { descending: false });
        });
    });
    test("status:200 - reviews array can be ordered in ascending order and sorted by any valid column simultaneously", () => {
      return request(app)
        .get("/api/reviews?order=asc&sort_by=comment_count")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("comment_count", { descending: false });
        });
    });
    test("status:200 - reviews array can be filtered by category (no filter by default), if category exists but has no reviews return object will be empty array", () => {
      return request(app)
        .get("/api/reviews?category=social%20deduction")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toHaveLength(11);
          reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                category: "social deduction",
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
  describe("/api/reviews/:review_id/comments", () => {
    test("status:200 responds with an array of comment objects for the given review_id, array returned is empty when review has no comments", () => {
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
  describe("GET /api/reviews", () => {
    test("status:400 - returns error when sort_by query is a valid column but is not sortable", () => {
      return request(app)
        .get("/api/reviews?sort_by=review_body")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Unable to sort by review_body.");
        });
    });
    test("status:400 - returns error when sort_by query is an invalid column", () => {
      return request(app)
        .get("/api/reviews?sort_by=monkee")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("monkee column does not exist.");
        });
    });
    test("status:400 - returns error when order query is invalid sort order", () => {
      return request(app)
        .get("/api/reviews?sort_by=title&order=monkee")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            'Invalid order "monkee". Try "asc" or "desc" instead.'
          );
        });
    });
    test("status:400 - category does not exist", () => {
      return request(app)
        .get("/api/reviews?sort_by=title&order=desc&category=monkee")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("monkee category does not exist.");
        });
    });
  });
  describe("GET /api/reviews/:review_id", () => {
    test("status:404, that review does not exist", () => {
      return request(app)
        .get("/api/reviews/420")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Sorry. Review ID 420 does not exist.");
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
  describe("/api/reviews/:review_id/comments", () => {
    test("status:404 - review ID is valid but does not exist in the database", () => {
      return request(app)
        .get("/api/reviews/420/comments")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Sorry. Review ID 420 does not exist.");
        });
    });
    test("status:400 - review ID is not a number", () => {
      return request(app)
        .get("/api/reviews/monkee/comments")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Invalid: ID must be a number.");
        });
    });
  });
});
