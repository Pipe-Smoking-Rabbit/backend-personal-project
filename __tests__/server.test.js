const request = require("supertest");
const app = require("../server/app");
const connection = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("Server Endpoints", () => {
  describe("/api", () => {
    describe("GET", () => {
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
  });
  describe("/api/users", () => {
    describe("GET", () => {
      test("status:200 - responds with an array of user objects containing properties for username, name, avatar_url", () => {
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
    describe("POST", () => {
      test.only('status:201 - inserts a new user to the database and responds with that user on a key of "user"', () => {
        return request(app)
          .post("/api/users")
          .send({
            username: "Pipe-Smoking-Rabbit",
            avatar_url:
              "https://static.tumblr.com/c4eb631d38d084b509d6e7db7452a008/ilzv8tb/H6Cnlqvqh/tumblr_static_8v62czb9h0soocogg8ckwg4s.jpg",
            name: "average supertest enjoyer",
          })
          .expect(201)
          .then(({ body: { user } }) => {
            expect(user).toEqual({
              username: "Pipe-Smoking-Rabbit",
              avatar_url:
                "https://static.tumblr.com/c4eb631d38d084b509d6e7db7452a008/ilzv8tb/H6Cnlqvqh/tumblr_static_8v62czb9h0soocogg8ckwg4s.jpg",
              name: "average supertest enjoyer",
            });
          });
      });
    });
  });
  describe("/api/categories", () => {
    describe("GET", () => {
      test("status:200 - responds with an array of category objects, each of which contains slug and description properties", () => {
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
  });
  describe("/api/reviews", () => {
    describe("GET", () => {
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
      test("status:200 - reviews array can be sorted by any valid column", () => {
        return request(app)
          .get("/api/reviews?sort_by=votes")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSortedBy("votes", { descending: true });
          });
      });
      test("status:200 - reviews array can be ordered in ascending order", () => {
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
            expect(reviews).toBeSortedBy("comment_count", {
              descending: false,
            });
          });
      });
      test("status:200 - reviews array can be filtered by category, if category exists but has no reviews return object will be empty array", () => {
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
  });
  describe("api/reviews/:review_id", () => {
    describe("GET", () => {
      test("status:200 - responds with a review object which should have properties: review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at, comment_count", () => {
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
      test("status:404 - that review does not exist", () => {
        return request(app)
          .get("/api/reviews/420")
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("Sorry. Review ID 420 does not exist.");
          });
      });
      test("status:400 - review_id must be a number", () => {
        return request(app)
          .get("/api/reviews/monkee")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Invalid: ID must be a number.");
          });
      });
    });
    describe("PATCH", () => {
      test("status:200 - updates the votes property on specified review object to increment by any amount", () => {
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
      test("status:200 - updates the votes property on specified review object to decremenet by any amount", () => {
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
      test("status:404 - review id is valid but does not exist in database", () => {
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
      test("status:400 - increment value is not a number", () => {
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
      test("status:400 - Review id is not a number", () => {
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
      test("status:400 - patch body does not contain an inc_votes property", () => {
        const patch = {
          title: 1,
        };
        return request(app)
          .patch("/api/reviews/2")
          .send(patch)
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Invalid request.");
          });
      });
    });
  });
  describe("/api/reviews/:review_id/comments", () => {
    describe("GET", () => {
      test("status:200 - responds with an array of comment objects for the given review_id, array returned is empty when review has no comments", () => {
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
    describe("POST", () => {
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
      test("status:400 - unrecognised username provided for author of comment post request", () => {
        return request(app)
          .post("/api/reviews/3/comments")
          .send({ username: "monkee", body: "test" })
          .expect(400)
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
  describe("/api/comments/:comment_id", () => {
    describe("DELETE", () => {
      test("status:204 - deletes comment that contains the specified unique comment_id", () => {
        return request(app).delete("/api/comments/2").expect(204);
      });
      test("status:404 - comment_id is of valid data type but does not exist in the databse", () => {
        return request(app)
          .delete("/api/comments/420")
          .expect(404)
          .then(({ body: { message } }) => {
            expect(message).toBe("Comment ID 420 could not be found.");
          });
      });
      test("status:400 - comment_id is of invalid data type", () => {
        return request(app)
          .delete("/api/comments/monkee")
          .expect(400)
          .then(({ body: { message } }) => {
            expect(message).toBe("Invalid: ID must be a number.");
          });
      });
    });
  });
});
