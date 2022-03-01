const express = require("express");
const path = require('path');

const app = express();
app.use(express.static('public'));

function sendPage(res, page) {
  res.sendFile(path.join(__dirname, page));
}

// routes
app.get('/', function (req, res) {
  sendPage(res, "index.html");
});
app.get('/comingsoon', function (req, res) {
  res.send("<h1>COMINGSOON</h1>");
  // sendPage(res, "comingSoon.html");
});


// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
})

// start server
let port = process.env.PORT || 3000;
app.listen(port, () => console.log("server listen at http://localhost:%d", port));