const connection = require("../../db/connection");
const fs = require("fs/promises")

exports.fetchCategories = (category) => {
  let queryString = `SELECT * FROM categories`;
  let bindArray = undefined;

  if (category) {
    queryString += ` WHERE slug = $1`;
    bindArray = [category];
  }

  return connection.query(queryString, bindArray).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 400,
        message: `${category} category does not exist.`,
      });
    }
    return rows;
  });
};

exports.fetchReviews = (sortBy = "created_at", order = "DESC", category) => {
  let queryString = `
      SELECT reviews.*, COUNT(comments.review_id)
      AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON reviews.review_id = comments.review_id`;

  const validSortBy = [
    "owner",
    "title",
    "review_id",
    "category",
    "created_at",
    "votes",
    "designer",
    "comment_count",
  ];

  const invalidExistingColumn = ["review_body", "review_img_url"];

  const validOrderKey = ["ASC", "DESC"];

  if (!validSortBy.includes(sortBy)) {
    if (!invalidExistingColumn.includes(sortBy)) {
      return Promise.reject({
        status: 400,
        message: `${sortBy} column does not exist.`,
      });
    }
    return Promise.reject({
      status: 400,
      message: `Unable to sort by ${sortBy}.`,
    });
  }

  if (!validOrderKey.includes(order.toUpperCase())) {
    return Promise.reject({
      status: 400,
      message: `Invalid order "${order}". Try "asc" or "desc" instead.`,
    });
  }

  const bindArray = [];
  let querySortString = "reviews.";
  if (sortBy === "comment_count") {
    querySortString = `COUNT(comments.review_id)`;
  } else {
    querySortString += sortBy;
  }

  if (category) {
    queryString += ` WHERE category = $1`;
    bindArray.push(category);
  }
  queryString += ` GROUP BY reviews.review_id
      ORDER BY ${querySortString} ${order}`;

  return connection.query(queryString, bindArray).then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviewByID = (review_id) => {
  return connection
    .query(
      `SELECT reviews.*, COUNT(comments.review_id) AS comment_count FROM reviews
      LEFT JOIN comments 
      ON reviews.review_id = comments.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id`,
      [review_id]
    )
    .then(({ rows: [review] }) => {
      if (review) {
        return review;
      }
      return Promise.reject({
        status: 404,
        message: `Sorry. Review ID ${review_id} does not exist.`,
      });
    });
};

exports.fetchCommentsByReviewID = (review_id) => {
  return connection
    .query(
      `
  SELECT * FROM comments
  WHERE review_id = $1`,
      [review_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.updateReviewByID = (review_id, inc_votes) => {
  const queryValues = [inc_votes, review_id];
  return connection
    .query(
      `UPDATE reviews
      SET votes = votes + $1
      WHERE review_id = $2
      RETURNING *`,
      queryValues
    )
    .then(({ rows: [review] }) => {
      if (review) {
        return review;
      }
      return Promise.reject({
        status: 404,
        message: `Unable to process patch request: Review ID ${review_id} could not be found.`,
      });
    });
};

exports.fetchUsers = () => {
  return connection.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.insertCommentByReviewID = (review_id, body, username) => {
  if (typeof body !== "string") {
    return Promise.reject({ status: 400, message: "Invalid request." });
  }
  return connection
    .query(
      `
  INSERT INTO comments
  (review_id, body, author)
  VALUES
  ($1, $2, $3)
  RETURNING *`,
      [review_id, body, username]
    )
    .then(({ rows: [comment] }) => {
      return comment;
    });
};

exports.fetchAPI = () => {
  return fs.readFile(`${__dirname}/../../endpoints.json`, "utf-8").then(data=>{
    return data
  })
}

exports.removeComment = (comment_id) => {
  return connection.query(
    `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *`,
    [comment_id]
  ).then(({rows: [comment]})=>{
    if (comment === undefined) {
      return Promise.reject({status: 404, message: `Comment ID ${comment_id} could not be found.`})
    }
  });
};

