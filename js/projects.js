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
