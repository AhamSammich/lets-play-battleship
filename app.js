const express = require("express");

const app = express();

app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/dist/index.html`);
});

app.listen(8080, () => {
  console.log(`App is running on port 8080...`);
});
