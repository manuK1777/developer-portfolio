// Simple JS for navigation, year, and basic contact form UX

(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // Set current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Basic project filtering by data-tags (Projects page)
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll("#projects-list .card");

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        filterButtons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        projectCards.forEach((card) => {
          const tags = card.getAttribute("data-tags") || "";
          const show = filter === "all" || tags.includes(filter);
          card.style.display = show ? "" : "none";
        });
      });
    });
  }

  // Contact form: simple client-side validation and fake submit
  const contactForm = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");

  function setFieldError(id, message) {
    const err = document.querySelector(`.field-error[data-for="${id}"]`);
    if (err) err.textContent = message || "";
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = event.currentTarget;
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();

      let valid = true;
      setFieldError("name", "");
      setFieldError("email", "");
      setFieldError("message", "");

      if (!name) {
        setFieldError("name", "Please enter your name.");
        valid = false;
      }

      if (!email) {
        setFieldError("email", "Please enter your email.");
        valid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setFieldError("email", "Please enter a valid email address.");
        valid = false;
      }

      if (!message) {
        setFieldError("message", "Please enter a message.");
        valid = false;
      }

      if (!valid) {
        if (statusEl) {
          statusEl.textContent =
            "Please fix the highlighted fields and try again.";
          statusEl.style.color = "#fecaca";
        }
        return;
      }

      if (statusEl) {
        statusEl.textContent =
          "Thanks for your message! (Wire this up to your backend or email service.)";
        statusEl.style.color = "#a7f3d0";
      }

      form.reset();
    });
  }

  // Language toggle: EN | ES
  const langButtons = document.querySelectorAll(".lang-link[data-lang]");

  langButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetLang = btn.getAttribute("data-lang");
      if (!targetLang) return;

      const url = new URL(window.location.href);
      const segments = url.pathname.split("/").filter(Boolean);

      const langIndex = segments.findIndex(
        (seg) => seg === "en" || seg === "es"
      );

      if (langIndex !== -1) {
        segments[langIndex] = targetLang;
        url.pathname = "/" + segments.join("/");
      }

      window.location.href = url.toString();
    });
  });

  // i18n: load translations for elements with [data-i18n]
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`/content/${lang}.json`);
      if (!response.ok) return;

      const data = await response.json();
      applyTranslations(data);
    } catch (err) {
      // Fail silently if translations cannot be loaded
      console.error("Error loading translations", err);
    }
  }

  function getNestedValue(obj, path) {
    return path.split(".").reduce((acc, key) => {
      if (acc == null) return undefined;
      // Support numeric array indices like about.skills.0
      const index = Number(key);
      if (!Number.isNaN(index) && Array.isArray(acc)) {
        return acc[index];
      }
      return acc[key];
    }, obj);
  }

  function applyTranslations(translations) {
    const nodes = document.querySelectorAll("[data-i18n]");
    const currentYear = new Date().getFullYear();

    nodes.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;

      let value = getNestedValue(translations, key);
      if (typeof value !== "string") return;

      // Simple template replacement for {year}
      value = value.replace("{year}", String(currentYear));

      el.textContent = value;
    });
  }

  // Load translations based on preferred language or <html lang="..."> attribute
  let htmlLang = (
    document.documentElement.getAttribute("lang") || "en"
  ).toLowerCase();

  try {
    const storedLang = window.localStorage.getItem("preferredLang");
    if (storedLang === "en" || storedLang === "es") {
      htmlLang = storedLang;
    }
  } catch (e) {
    // Ignore storage errors
  }

  loadTranslations(htmlLang);
})();
