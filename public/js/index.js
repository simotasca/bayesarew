gsap.registerPlugin(ScrollTrigger);

function pxStringToInt(str) {
  return parseInt(str.substring(0, str.length - 2));
}

function resizeCarousel() {
  let subtitle = document.getElementsByClassName("subtitle")[0];
  let subtitleStyle = window.getComputedStyle(subtitle);
  let width = pxStringToInt(subtitleStyle.width) + pxStringToInt(subtitleStyle.marginLeft);
  let carousel = document.getElementsByClassName("carousel")[0];
  carousel.style.width = width + "px";
}

function mainAnimation() {
  let svgDoc = document.getElementById("main-impronta").contentDocument;
  gsap.to('.carousel__img', { autoAlpha: 1, stagger: .2, duration: 1.5, delay: 1.5 });
  gsap.to(svgDoc.getElementsByClassName('st0'), { autoAlpha: 1, duration: .4, stagger: -.05, delay: -.5 });

  let dona = document.querySelector('.main-dona');
  let tl = gsap.timeline()
    .to(dona, { x: "-2rem", duration: .2, ease: "power2.in", delay: 4 })
    .to(dona, { x: "0", duration: .2, ease: "power2.out" }, "+=.25");

  let hover = gsap.to(dona, { x: "-2rem", duration: .15, ease: "sine.out", paused: true });

  dona.addEventListener("mouseenter", () => hover.play());
  dona.addEventListener("mouseleave", () => hover.reverse());
}

function waitBeforeMainAnimation() {
  let promises = [];


  promises.push(new Promise(resolve => {
    document.getElementById("main-impronta").addEventListener("load", () => {
      logoPosition(true);
      resolve();
    });
  }));

  promises.push(new Promise(resolve => {
    document.getElementById("main-background").onload = resolve
  }));

  console.log(document.getElementById("main-background"))
  document.getElementById("main-background").src = "/resources/img/foto/schiena.jpg"; // le altre sono lazy quindi spero vadano sempre?
  console.log(document.getElementById("main-background").src)

  Array.from(document.querySelectorAll(".carousel__img img")).forEach((image, idx) => {
    promises.push(new Promise(resolve => {
      image.onload = resolve
    }));
  });


  Promise.all(promises).then(() => {
    mainAnimation();
  });
}

function logoPosition(first = false) {
  let impronta = document.getElementById('main-impronta');
  let logoCheck = document.getElementById('logo-check');
  let logo = document.getElementById('main-logo');

  let impPos = impronta.getBoundingClientRect();
  let logoPos = logoCheck.getBoundingClientRect();

  let spread = window.innerHeight * 0.03;

  if (logoPos.right > impPos.left + spread) {
    logo.classList.add("logo--on-overlap");
  } else {
    logo.classList.remove("logo--on-overlap");
  }

  if (first) {
    logo.classList.add("logo--visible")
  }
}

(function () {
  waitBeforeMainAnimation();
  resizeCarousel();
  document.getElementsByClassName("carousel")[0].classList.add("carousel--visible");

  window.addEventListener("resize", () => {
    logoPosition();
    resizeCarousel();
  });


  // SCROLL TRIGGER
  gsap.fromTo('.left-in',
    { x: '-100%', opacity: .2 },
    {
      x: 0, opacity: 1,
      ease: "power2.out",
      scrollTrigger: {
        // markers: true,
        trigger: '.left-in',
        // start/end: 'trigger viewport'
        start: 'top bottom'
      }
    });

  gsap.fromTo('.right-in',
    { x: '100%', opacity: .2 },
    {
      x: 0, opacity: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: '.right-in',
        // start/end: 'trigger viewport'
        start: 'top bottom', end: '+=50%',
      }
    });
})();