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

describe("HAPPY POST PATHS :)", () => {
  describe("/api/reviews/:review_id/comments", () => {
    test("status:201 - creates new user comment linked to a review and responds with posted comment", () => {
      return request(app)
        .post("/api/reviews/2/comments")
        .send({
          username: "mallionaire",
          body: "What is grief, if not love persevering",
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual({
            author: "mallionaire",
            body: "What is grief, if not love persevering",
            comment_id: 7,
            created_at: expect.any(String),
            review_id: 2,
            votes: 0,
          });
        });
    });
  });
});

describe("POST ERROR HANDLING", () => {
  describe("/api/reviews/:review_id/comments", () => {
    test("status:401 - unrecognised username provided for author of comment post request", () => {
      return request(app)
        .post("/api/reviews/3/comments")
        .send({ username: "monkee", body: "test" })
        .expect(401)
        .then(({ body: { message } }) => {
          expect(message).toBe("Credentials not recognised.");
        });
    });
    test("status:400 - post request is made without a username or body property", () => {
      return request(app)
        .post("/api/reviews/4/comments")
        .send({ no_username: "mallionaire", no_body: "test" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Invalid request.");
        });
    });
    test("status:400 - post request contains invalid forms of data for body", () => {
      return request(app)
        .post("/api/reviews/1/comments")
        .send({ username: "mallionaire", body: 420 })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Invalid request.");
        });
    });
    test("status:404 - review ID is valid but could not be found in the database", () => {
      return request(app)
        .post("/api/reviews/420/comments")
        .send({ username: "mallionaire", body: "test" })
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Sorry. Review ID 420 does not exist.");
        });
    });
    test("status:400 - review ID is of invalid data type", () => {
      return request(app)
        .post("/api/reviews/monkee/comments")
        .send({ username: "mallionaire", body: "test" })
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Invalid: ID must be a number.");
        });
    });
  });
});
