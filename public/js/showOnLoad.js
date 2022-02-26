// CSS
//
// .show-on-load {
//   visibility: hidden; 
// }

document.addEventListener("load", () => {
  Array.from(document.getElementsByClassName('show-on-load')).forEach(function (element) {
    element.classList.remove('show-on-load');
  });
});