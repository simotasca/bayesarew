var loadCSS = function (url, callback) {
  var link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = url;

  document.getElementsByTagName('head')[0].appendChild(link);

  var img = document.createElement('img');
  img.onerror = function () {
    (callback) ? callback(link) : alert('style sheet loaded!');
  }
  img.src = url;
}

loadCSS("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Oswald:wght@700&display=swap", link => {
  console.log("fonts loaded");
  Array.from(document.getElementsByClassName('show-on-load')).forEach(function (element) {
    element.classList.remove('show-on-load');
  });
})