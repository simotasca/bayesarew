const { join: pathJoin } = require('path')
const fs = require('fs')

let languages = []
let defaultLanguage = null
let init = false

function initLanguages(_languages, _defaultIdx = 0) {
  languages = _languages
  defaultLanguage = languages[_defaultIdx]
  init = true
}

function currentLanguage(req) {
  let lang = req.baseUrl.split('/')[1]
  return lang && languages.includes(lang) ? lang : null
}

function languageMiddleware(req, res, next) {
  if (!init) throw Error("Configuare i linguaggi con initLanguages per utilizzare il middleware")

  res.locals.langMiddleware = true

  // // Evita doppie chiamate date dalla duplicazione dei route
  // if (languages.includes(req.url.split('/')[1])) {
  //   return next();
  // }

  // // se non è specificato il linguaggio nel nuovo route
  // // allora viene inserito quello già utilizzato
  // const referer = req.get('referer');
  // if (referer) {
  //   let oldLang = referer.split('/')[3];
  //   oldLang = oldLang && languages.includes(oldLang) ? oldLang : null
  //   let lang = currentLanguage(req)
  //   if (lang == null && oldLang != null) {
  //     return res.redirect(`/${oldLang}${req.url}`)
  //   }
  // }

  next();
}

function getLangPrefix(lang) {
  return lang != defaultLanguage ? "/" + lang : ""
}

function getHrefLangTag(url, lang) {
  return `<link rel="alternate" href="http://www.bayesarew.com${getLangPrefix(lang)}${url}" hreflang="${lang}" />`
}

function appendHrefLangs(htmlString, url, currLang) {
  let modifiedHtmlString = htmlString
  let hrefLangString = "<!-- HREFLANG -->\n"

  languages.forEach(lang => {
    if (lang != currLang) {
      hrefLangString += getHrefLangTag(url, lang) + '\n'
    }
  })

  modifiedHtmlString = modifiedHtmlString.replace(new RegExp(`<!-- HREFLANG -->`, 'g'), hrefLangString)
  modifiedHtmlString = modifiedHtmlString.replace(new RegExp(`{{lang}}`, 'g'), currLang)
  modifiedHtmlString = modifiedHtmlString.replace(new RegExp(`{{lang-prefix}}`, 'g'), getLangPrefix(currLang))

  return modifiedHtmlString
}

// requires languageMiddleware
function languageSSR(page, req, res) {
  if (!res.locals.langMiddleware) throw Error("aggiungere app.use(languageMiddleware) per utilizzare languageSSR")

  let file = pathJoin(__dirname, "pages", page + '.html');
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

    // se non esiste il file con le traduzioni utilizzo il file del linguaggio default
    // mantengo però la lingua corrente per tutto il resto
    let langFName = pathJoin(__dirname, "lang", page, `${lang}.json`);
    if (!fs.existsSync(langFName)) {
      langFName = pathJoin(__dirname, "lang", page, `${defaultLanguage}.json`);
      if (!fs.existsSync(langFName)) {
        // se non esiste nemmeno quello base allora mando la pagina così com'è
        return res.send(appendHrefLangs(html, req.url, lang));
      }
    }

    fs.readFile(langFName, (err, jbuff) => {
      if (err) throw err;

      let json = JSON.parse(jbuff);

      // inserisce le traduzioni nell'html
      for (const trad in json) {
        html = html.replace(new RegExp(`{{${trad}}}`, 'g'), json[trad]);
      }

      html = appendHrefLangs(html, req.url, lang)

      // invia al client l'html modificato
      res.send(html);
    })
  })
}

module.exports = {
  initLanguages,
  languageMiddleware,
  languageSSR
}