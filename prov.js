const express = require("express");
const path = require('path');

const app = express();
app.use(express.static('public'));

function sendPage(res, page) {
  res.sendFile(path.join(__dirname, "pages", page));
}

// var router = express.Router();

// router.get('/home', (req, res) => {
//   res.send(req.baseUrl.split('/')[1] + " HOMEEE")
// })
// router.get('/altro', (req, res) => {
//   res.send("ALTOR")
// })

// // routes
// app.use('/base', router)
// app.use('/due', router)

app.get('/home', (req, res) => {
  res.send("HOMEEE")
})

app.get('/:param', (req, res) => {
  res.send(req.params.param)
})

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
})

// start server
let port = process.env.PORT || 3000;
app.listen(port, () => console.log("server listen at http://localhost:%d", port));