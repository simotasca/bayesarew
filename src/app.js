const express = require("express");
const path = require('path');

const app = express();
app.use(express.static('public'));

// routes
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
})

// start server
let port = process.env.PORT || 3000;
app.listen(port, () => console.log("server listen at http://localhost:%d", port));