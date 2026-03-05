
(function () {
  // Bail out entirely if the user prefers reduced motion
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) return;

  // ── Scroll reveal ───────────────────────────────────
  //
  // Selectors to observe. Each matched element gets the
  // .reveal class added, then .is-visible when it enters
  // the viewport. Sibling elements in the same parent
  // get a small stagger delay so groups feel natural.

  const REVEAL_SELECTORS = [
    ".section-header",
    ".site-main p",
    ".site-main li",
    ".card-projects",
    ".card",
    ".case-study section",
    ".project-detail h2",
".pill-list",
    // Hero is handled by CSS keyframes, skip it
  ].join(", ");

  // Threshold: element is 10% visible before triggering
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // Once revealed, no need to keep observing
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  // Collect all targets, add .reveal, compute stagger
  const targets = Array.from(document.querySelectorAll(REVEAL_SELECTORS));

  // Skip elements already inside the hero (CSS handles those)
  const filtered = targets.filter(
    (el) => !el.closest(".hero")
  );

  // Group siblings so cards in the same grid stagger nicely
  const parentMap = new Map();

  filtered.forEach((el) => {
    // Section headers also get the accent-line trigger
    if (el.classList.contains("section-header")) {
      el.classList.add("is-visible"); // accent line fires via CSS
    }

    el.classList.add("reveal");

    const parent = el.parentElement;
    if (!parentMap.has(parent)) {
      parentMap.set(parent, []);
    }
    parentMap.get(parent).push(el);
  });

  // Apply stagger delays to siblings (capped at 4 items
  // so long lists don't wait forever)
  parentMap.forEach((siblings) => {
    if (siblings.length > 1) {
      siblings.forEach((el, i) => {
        const delay = Math.min(i, 3) * 0.08;
        el.style.setProperty("--reveal-delay", `${delay}s`);
      });
    }
  });

  // Observe everything
  filtered.forEach((el) => observer.observe(el));

  // ── Section header accent lines ─────────────────────
  //
  // The CSS ::after pseudo-element grows when
  // .section-header gets .is-visible. We use a separate
  // observer with a lower threshold so it fires as soon
  // as the heading scrolls into view.

  const headerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          headerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".section-header").forEach((el) => {
    // Remove the early is-visible we added above so the
    // headerObserver controls the timing properly
    el.classList.remove("is-visible");
    headerObserver.observe(el);
  });
})();
