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
      .then(({ body: {categories} }) => {
        expect(categories).toBeInstanceOf(Array);
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
describe('Error Handling', () => {
    describe('incorrect url for get request', () => {});
        test('/api/invalid_url returns 404 error with error message', () => {
            return request(app).get("/api/invalid_url").expect(404).then(({body: {message}})=> {
                expect(message).toBe("invalid url")
            });
    });
});