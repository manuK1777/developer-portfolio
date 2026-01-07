// Simple JS for navigation, year, and translations

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

  // Load translations based on the <html lang="..."> attribute only
  const htmlLang = (
    document.documentElement.getAttribute("lang") || "en"
  ).toLowerCase();

  loadTranslations(htmlLang);
})();
