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
        const otherPanel = otherButton
          .closest(".accordion-item")
          ?.querySelector(".accordion-panel");
        if (otherPanel) otherPanel.hidden = true;
      });

      button.setAttribute("aria-expanded", String(!isOpen));
      if (panel) panel.hidden = isOpen;
    });
  });

  const revealTargets = document.querySelectorAll(
    ".removal-hero-content, .removal-hero-visual, .removal-intro-grid, .removal-trust-grid article, .result-card, .treatment-card, .removal-process-intro, .removal-process li, .removal-about-symbol, .removal-about-content, .faq-layout, .contact-card",
  );

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.documentElement.classList.add("reveal-ready");

    revealTargets.forEach((element) => element.setAttribute("data-reveal", ""));

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
