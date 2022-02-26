// CSS
//
// .show-on-load {
//   visibility: hidden; 
// }

window.addEventListener("load", () => {
  Array.from(document.getElementsByClassName('show-on-load')).forEach(function (element) {
    element.classList.remove('show-on-load');
  });
});