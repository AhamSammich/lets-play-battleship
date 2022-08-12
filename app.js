const express = require("express");
const server  = require("./server/server");
const port = process.env.PORT || 8088;
const app = express();

app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

app.listen(port, () => {
  console.log(`App is running at http://localhost:${port}...`);
});

server.listen(5055, () => {
  console.log(`Server is running on port 5055...`);
});