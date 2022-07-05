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

describe("PATCH HAPPY PATHS", () => {
  describe("/api/reviews/:review_id", () => {
    test("status:202 - updates the votes property on specified review object to increment by any amount", () => {
      const patch = {
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/reviews/3")
        .send(patch)
        .expect(200)
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
    test("status:202 - updates the votes property on specified review object to decremenet by any amount", () => {
      const patch = {
        inc_votes: -6,
      };
      return request(app)
        .patch("/api/reviews/4")
        .send(patch)
        .expect(200)
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
            votes: 1,
          });
        });
    });
  });
});

describe("PATCH ERROR HANDLING", () => {
  describe("/api/reviews/:review_id", () => {
    test("404 - review id is valid but does not exist in database", () => {
      const patch = {
        inc_votes: 420,
      };
      return request(app)
        .patch("/api/reviews/21")
        .send(patch)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe(
            "Unable to process patch request: Review ID 21 could not be found."
          );
        });
    });
    test("400 - increment value is not a number", () => {
      const patch = {
        inc_votes: "monkee",
      };
      return request(app)
        .patch("/api/reviews/21")
        .send(patch)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Invalid: ID must be a number.");
        });
    });
    test("400 - Review id is not a number", () => {
      const patch = {
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/reviews/monkee")
        .send(patch)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Invalid: ID must be a number.");
        });
    });
    test("400 - patch body does not contain an inc_votes property", () => {
      const patch = {
        title: 1,
      };
      return request(app)
        .patch("/api/reviews/2")
        .send(patch)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("Invalid patch request.");
        });
    });
  });
});
