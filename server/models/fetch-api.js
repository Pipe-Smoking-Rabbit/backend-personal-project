const fs = require("fs/promises");

module.exports = function fetchAPI() {
  return fs
    .readFile(`${__dirname}/../../endpoints.json`, "utf-8")
    .then((data) => {
      return data;
    });
};
