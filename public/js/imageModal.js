function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}

fetch("./partials/imageModal.html").then(res => res.text()).then(modalHtml => {

  modal = htmlToElement(modalHtml);
  document.body.appendChild(modal);

  let image = modal.querySelector("img");

  let justOpen = false;

  function openModal(src) {
    console.log("macheooo")
    // let modal = document.querySelector("#img-modal");
    image.src = src;
    modal.classList.add("img-modal--open");
    document.querySelector("html").classList.add("modal-is-open");
    justOpen = true;
  }

  function closeModal() {
    // let modal = document.querySelector("#img-modal");
    modal.classList.remove("img-modal--open");
    document.querySelector("html").classList.remove("modal-is-open");
    justOpen = false;
  }

  for (let toggler of document.querySelectorAll(".img-modal__toggler")) {
    toggler.onclick = () => openModal(toggler.src != null ? toggler.src : toggler.dataset.target);
  }

  window.onclick = event => {
    if (event.target !== image)
      justOpen ? justOpen = false : closeModal();

  };
});