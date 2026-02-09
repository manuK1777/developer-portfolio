(function () {
  const slideshows = document.querySelectorAll('[data-slideshow]');

  slideshows.forEach((root) => {
    const slidesContainer = root.querySelector('[data-slides]');
    if (!slidesContainer) return;

    const slides = Array.from(slidesContainer.querySelectorAll('.slide'));
    if (!slides.length) return;

    let current = 0;

    const dotsContainer = root.querySelector('[data-dots]');
    const dots = [];

    if (dotsContainer) {
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slide-dot';
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => {
          goTo(index);
        });
        dotsContainer.appendChild(dot);
        dots.push(dot);
      });
    }

    const prevBtn = root.querySelector('.slide-nav.prev');
    const nextBtn = root.querySelector('.slide-nav.next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goTo((current - 1 + slides.length) % slides.length);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goTo((current + 1) % slides.length);
      });
    }

    function update() {
      slides.forEach((slide, index) => {
        if (index === current) {
          slide.classList.add('is-active');
        } else {
          slide.classList.remove('is-active');
        }
      });

      if (dots.length) {
        dots.forEach((dot, index) => {
          if (index === current) {
            dot.classList.add('is-active');
          } else {
            dot.classList.remove('is-active');
          }
        });
      }
    }

    function goTo(index) {
      current = index;
      update();
    }

    update();
  });
})();
