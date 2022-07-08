const app = require("./app");

const { PORT = 0202 } = process.env;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`)
})