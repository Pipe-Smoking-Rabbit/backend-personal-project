const connection = require("../../db/connection");

exports.fetchCategories = (category) => {
  let queryString = `SELECT * FROM categories`;
  let bindArray = undefined

  if (category) {
    queryString += ` WHERE slug = $1`;
    bindArray = [category]
  }

  return connection.query(queryString, bindArray).then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviews = (sort_by = "created_at", order = "DESC", category) => {
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

  if (!validSortBy.includes(sort_by)) {
    if (!invalidExistingColumn.includes(sort_by)) {
      return Promise.reject({
        status: 400,
        message: `${sort_by} column does not exist.`,
      });
    }
    return Promise.reject({
      status: 400,
      message: `Unable to sort by ${sort_by}.`,
    });
  }

  if (!validOrderKey.includes(order.toUpperCase())) {
    return Promise.reject({
      status: 400,
      message: `Invalid order "${order}". Try "asc" or "desc" instead.`,
    });
  }

  let bindArray = undefined
  let querySortString = "reviews.";
  if (sort_by === "comment_count") {
    querySortString = `COUNT(comments.review_id)`;
  } else {
    querySortString += sort_by;
  }

  if (category) {
    queryString += ` WHERE category = $1`;
    bindArray = [category]
  }
  queryString += ` GROUP BY reviews.review_id
      ORDER BY ${querySortString} ${order}`;

  return connection
    .query(queryString, bindArray)
    .then(({ rows }) => {
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
      if (rows.length > 0) {
        return rows;
      }
      return Promise.reject({
        status: 404,
        message: `Sorry. Review ID ${review_id} has no comments.`,
      });
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
