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

describe("DELETE HAPPY PATHS :)", () => {
  describe("/api/comments/:comment_id", () => {
    test("status:204 - deletes comment that contains the specified unique comment_id", () => {
      return request(app)
        .delete("/api/comments/2")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
  });
});

describe("ERROR HANDLING", () => {
  describe("/api/comments/:comment_id", () => {
    test("status:404 - comment_id is of valid data type but does not exist in the databse", () => {
      return request(app)
        .delete("/api/comments/420")
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("Comment ID 420 could not be found.");
        });
    });
    test('status:400 - comment_id is of invalid data type', () => {
      return request(app)
        .delete("/api/comments/monkee")
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Invalid: ID must be a number.");
        });
    });
  });
});
