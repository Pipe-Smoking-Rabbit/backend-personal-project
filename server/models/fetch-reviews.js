const connection = require("../../db/connection");

module.exports = function fetchReviews(
  sortBy = "created_at",
  order = "DESC",
  category
) {
  let queryString = `
      SELECT reviews.*, COUNT(comments.review_id)::INT
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
