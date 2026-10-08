(() => {
  "use strict";

  const accordionButtons = document.querySelectorAll(
    "[data-accordion] .accordion-item button",
  );

  accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".accordion-item");
      const panel = item?.querySelector(".accordion-panel");
      const isOpen = button.getAttribute("aria-expanded") === "true";

      accordionButtons.forEach((otherButton) => {
        if (otherButton === button) return;

        otherButton.setAttribute("aria-expanded", "false");
        const otherItem = otherButton.closest(".accordion-item");
        otherItem?.classList.remove("is-open");
        otherItem
          ?.querySelector(".accordion-panel")
          ?.setAttribute("aria-hidden", "true");
      });

      button.setAttribute("aria-expanded", String(!isOpen));
      item?.classList.toggle("is-open", !isOpen);
      panel?.setAttribute("aria-hidden", String(isOpen));
    });
  });

  const revealTargets = document.querySelectorAll(
    ".removal-hero-content, .removal-intro-grid, .removal-trust-grid article, .result-card, .treatment-card, .removal-process-intro, .removal-process li, .specialty-item, .review-card, .reviews-summary, .removal-about-symbol, .removal-about-content, .faq-layout, .contact-card",
  );

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.documentElement.classList.add("reveal-ready");

    revealTargets.forEach((element, index) => {
      element.setAttribute("data-reveal", "");
      element.style.setProperty("--reveal-delay", `${(index % 4) * 90}ms`);
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.08,
      },
    );

    revealTargets.forEach((element) => revealObserver.observe(element));
  }
})();
