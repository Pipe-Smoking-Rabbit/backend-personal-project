const app = require("./app");

const {port = 0202} = process.env;

app.listen(port, () => {
    console.log(`Listening on port ${port}.`)
})