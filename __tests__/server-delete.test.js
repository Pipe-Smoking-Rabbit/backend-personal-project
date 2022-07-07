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

describe('DELETE HAPPY PATHS :)', () => {
    describe('/api/comments/:comment_id', () => {
        test('status:204 - deletes comment that contains unique specified comment_id', () => {
            return request(app).delete("/api/comments/:comment_id").expect(204).then(({body})=> {
                expect(body).toEqual({})
            })
        });
    });
});