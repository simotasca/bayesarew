const express = require("express");
const path = require('path');
const fs = require('fs');
const { redirect } = require("express/lib/response");

const app = express();
app.use(express.static('public'));

function sendPage(res, page) {
  res.sendFile(path.join(__dirname, "pages", page + '.html'));
}

function currentLanguage(req) {
  let lang = req.baseUrl.split('/')[1]
  return lang && languages.includes(lang) ? lang : null
}

function readLangFile(page, lang) {
  let fName = path.join(__dirname, "lang", page, `${lang}.json`);
  try {
    const data = fs.readFileSync(fName);
  } catch {
    // file not found
    fName = path.join(__dirname, "lang", page, `it.json`);
    const data = fs.readFileSync(fName);
  }
}

const languages = ['it', 'fr']
const DEFAULT_LANG_IDX = 0;
let defaultLanguage = languages[DEFAULT_LANG_IDX]

// routes
const router = express.Router();

// middleware gestione linguaggi
router.use((req, res, next) => {

  // Evita doppie chiamate date dalla duplicazione dei route
  if (languages.includes(req.url.split('/')[1])) {
    return next();
  }

  // se non è specificato il linguaggio nel nuovo route
  // allora viene inserito quello già utilizzato
  const referer = req.get('referer');
  if (referer) {
    let oldLang = referer.split('/')[3];
    oldLang = oldLang && languages.includes(oldLang) ? oldLang : null
    let lang = currentLanguage(req)
    if (lang == null && oldLang != null) {
      return res.redirect(`/${oldLang}${req.url}`)
    }
  }

  next();
})

function languageSSR(page, req, res) {
  let file = path.join(__dirname, "pages", page + '.html');
  let exists = fs.existsSync(file)
  if (!exists) return null

  fs.readFile(file, (err, data) => {
    if (err) throw err;

    // Setup mime type of the file
    res.setHeader("content-type", "text/html");

    let html = data.toString();

    // se il linguaggio non è nel route è quello default
    let lang = currentLanguage(req);
    if (lang == null) lang = defaultLanguage;

    // se non esiste il file del linguaggio allora rerouting al defalut
    // se è già il default invio il file così com'è
    let langFName = path.join(__dirname, "lang", page, `${lang}.json`);
    if (!fs.existsSync(langFName)) {
      if (lang == defaultLanguage) {
        return res.send(html);
      }
      langFName = path.join(__dirname, "lang", page, `${defaultLanguage}.json`);
      if (!fs.existsSync(langFName)) {
        return res.redirect(`/${defaultLanguage}${req.url}`)
      }
    }

    fs.readFile(langFName, (err, jbuff) => {
      if (err) throw err;

      let json = JSON.parse(jbuff);

      // inserisce le traduzioni nell'html
      for (const trad in json) {
        html = html.replace(new RegExp(`{{${trad}}}`, 'g'), json[trad]);
      }

      // send the client the modified html
      res.send(html);
    })
  })
}

router.get('/', (req, res) => {
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
app.use(`/:lang`, router);

// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  next(err);
})

// start server
let port = process.env.PORT || 3000;
app.listen(port, () => console.log("server listen at http://localhost:%d", port));