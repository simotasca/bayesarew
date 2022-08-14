const express = require("express");
const path = require('path');
const fs = require('fs');
const { languageMiddleware, languageSSR, initLanguages } = require("./international");
// const { redirect } = require("express/lib/response");

const app = express();
app.use(express.static('public'));

function sendPage(res, page) {
  res.sendFile(path.join(__dirname, "pages", page + '.html'));
}

const languages = ['it', 'fr']
const DEFAULT_LANG_IDX = 0;
const defaultLanguage = languages[DEFAULT_LANG_IDX]

// routes
const router = express.Router();

// middleware gestione linguaggi
initLanguages(languages, DEFAULT_LANG_IDX)
router.use(languageMiddleware)

// pagine multilingua
router.get('/', (req, res) => {
  console.log("double callllll")
  languageSSR('index', req, res)
});
router.get('/progetti', (req, res) => {
  languageSSR('progetti', req, res)
});
router.get('/comingsoon', (req, res) => {
  languageSSR('comingsoon', req, res)
});
router.get('/chisiamo', (req, res) => {
  sendPage(res, 'chisiamo')
});

app.use('/', router);
languages.forEach(lang => {
  if (lang != defaultLanguage)
    app.use(`/${lang}`, router);
})

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
})

app.use((req, res) => {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    sendPage(res, '404')
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});

// start server
let port = process.env.PORT || 3000;
app.listen(port, () => console.log("server listen at http://localhost:%d", port));