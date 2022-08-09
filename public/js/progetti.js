(function () {
  // console.log(ScrollTrigger)
  gsap.registerPlugin(ScrollTrigger)

  document.querySelectorAll('.strip-container').forEach(stripCont => {

    const stripL = stripCont.querySelector('.strip--left')
    const stripR = stripCont.querySelector('.strip--right')

    let timeline = gsap.timeline({
      // start: trigger viewport
      scrollTrigger: { trigger: stripCont, start: 'top bottom' }
    })

    timeline.fromTo(stripCont, { opacity: 0 }, { opacity: 1, ease: "power2.out", duration: 2 }, 0)

    if (stripL) {
      timeline.fromTo(stripL, { x: '-100vw' }, { x: '0vw', ease: "power2.out", duration: 0.5, delay: 0.5 }, 0)
    }
    if (stripR) {
      timeline.fromTo(stripR, { x: '100vw' }, { x: '0vw', ease: "power2.out", duration: 0.5, delay: 0.5 }, 0)
    }

  })

})();

let ventaglioTimeline = null

window.addEventListener('load', () => {
  ventaglioTimeline = gsap.timeline()
    .from('#ventaglio__2', { rotation: 0, x: '+=50%', y: '-=10%', autoAlpha: 0, duration: 0.5 }, 0)
    .from('#ventaglio__1', { rotation: 0, x: '+=50%', y: '-=10%', autoAlpha: 0, duration: 0.5 }, 0.2)
})

window.addEventListener('resize', () => {
  document.querySelector('#ventaglio__1').setAttribute('style', "")
  document.querySelector('#ventaglio__2').setAttribute('style', "")
  document.querySelector('#ventaglio__3').setAttribute('style', "")
})