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

describe("PATCH", () => {
  describe("/api/reviews/:review_id", () => {
    test("status:202 - updates the votes property on specified review object to increment by 1", () => {
      const patch = {
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/reviews/3")
        .send(patch)
        .expect(202)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            review_id: 3,
            title: "Ultimate Werewolf",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "We couldn't find the werewolf!",
            category: "social deduction",
            created_at: expect.any(String),
            votes: 6,
          });
        });
    });
    test("status:202 - updates the votes property on specified review object to increment by any amount", () => {
      const patch = {
        inc_votes: 420,
      };
      return request(app)
        .patch("/api/reviews/4")
        .send(patch)
        .expect(202)
        .then(({ body: { review } }) => {
          expect(review).toEqual({
            review_id: 4,
            title: "Dolor reprehenderit",
            designer: "Gamey McGameface",
            owner: "mallionaire",
            review_img_url:
              "https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
            review_body: expect.any(String),
            category: "social deduction",
            created_at: expect.any(String),
            votes: 427,
          });
        });
    });
  });
});
