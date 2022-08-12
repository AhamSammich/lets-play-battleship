const express = require("express");
const server  = require("./server/server");

const app = express();

app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`App is running on port 8080...`);
});