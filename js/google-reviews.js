(() => {
  "use strict";

  /**
   * Avaliações do Google via Featurable (https://featurable.com).
   *
   * Para ativar:
   * 1. Crie uma conta gratuita em https://featurable.com e conecte o perfil
   *    do Google da La Morocha Tattoo.
   * 2. Crie um widget e copie o "Widget ID" (Embed > API).
   * 3. Cole o ID no atributo `data-featurable-id` da seção
   *    <section data-google-reviews> em index.html.
   *
   * Enquanto o ID não for preenchido (ou se a API falhar), a seção exibe
   * automaticamente um bloco alternativo com link direto para o Google,
   * sem quebrar o layout da página. Use "example" como ID para testar.
   */
  const FEATURABLE_API = "https://api.featurable.com/v1/widgets/";
  const GOOGLE_PROFILE_URL = "https://share.google/xSorwOc66yfTf3s5g";
  const MAX_REVIEWS = 6;

  const section = document.querySelector("[data-google-reviews]");
  if (!section) return;

  const widgetId = section.dataset.featurableId || "";
  const isConfigured = widgetId && !widgetId.includes("COLOQUE_");

  const grid = section.querySelector("[data-reviews-grid]");
  const summary = section.querySelector("[data-reviews-summary]");
  const ratingEl = section.querySelector("[data-reviews-rating]");
  const starsEl = section.querySelector("[data-reviews-stars]");
  const countEl = section.querySelector("[data-reviews-count]");
  const writeLink = section.querySelector("[data-reviews-write-link]");

  const STAR_WORDS = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };

  const toRating = (value) =>
    typeof value === "number" ? value : STAR_WORDS[value] || Number(value) || 0;

  const starsMarkup = (rating) => {
    const rounded = Math.max(0, Math.min(5, Math.round(rating)));
    return "★★★★★☆☆☆☆☆".slice(5 - rounded, 10 - rounded);
  };

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]);

  const relativeTimeFormat = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

  const relativeTime = (iso) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";

    const days = Math.round((date - Date.now()) / 86400000);
    if (Math.abs(days) < 30) return relativeTimeFormat.format(days, "day");
    const months = Math.round(days / 30);
    if (Math.abs(months) < 12) return relativeTimeFormat.format(months, "month");
    return relativeTimeFormat.format(Math.round(days / 365), "year");
  };

  const updateStructuredData = (rating, count) => {
    const script = document.getElementById("business-jsonld");
    if (!script || !rating || !count) return;

    try {
      const data = JSON.parse(script.textContent);
      const business =
        (data["@graph"] || [data]).find((node) => node["@type"] === "TattooParlor") || data;
      business.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: rating,
        reviewCount: count,
      };
      script.textContent = JSON.stringify(data);
    } catch (error) {
      console.error("Não foi possível atualizar os dados estruturados.", error);
    }
  };

  const renderFallback = () => {
    if (!grid) return;
    grid.innerHTML = `
      <div class="reviews-fallback">
        <p>
          Em breve as avaliações aparecerão aqui automaticamente.
          Enquanto isso, veja o perfil completo no Google.
        </p>
        <a
          class="button button-dark"
          href="${GOOGLE_PROFILE_URL}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver perfil no Google
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    `;
  };

  const selectReviews = (data) => {
    const hidden = new Set(data.hiddenReviews || []);
    const pinned = data.pinnedReviews || [];

    return (data.reviews || [])
      .filter((review) => !hidden.has(review.reviewId) && (review.comment || "").trim())
      .sort((a, b) => {
        const pinA = pinned.indexOf(a.reviewId);
        const pinB = pinned.indexOf(b.reviewId);
        if (pinA !== pinB) return (pinA === -1 ? Infinity : pinA) - (pinB === -1 ? Infinity : pinB);
        return new Date(b.createTime) - new Date(a.createTime);
      })
      .slice(0, MAX_REVIEWS);
  };

  const renderReviews = (data) => {
    if (!grid) return;

    const average = Number(data.averageRating);
    const count = Number(data.totalReviewCount) || 0;

    if (average && summary) {
      summary.hidden = false;
      if (ratingEl) ratingEl.textContent = average.toFixed(1);
      if (starsEl) starsEl.textContent = starsMarkup(average);
      if (countEl) {
        countEl.textContent = `${count} avaliaç${count === 1 ? "ão" : "ões"} no Google`;
      }
      updateStructuredData(average, count);
    }

    if (writeLink && data.profileUrl && data.profileUrl !== "https://google.com") {
      writeLink.href = data.profileUrl;
    }

    const reviews = selectReviews(data);

    if (!reviews.length) {
      renderFallback();
      return;
    }

    grid.innerHTML = reviews
      .map((review) => {
        const reviewer = review.reviewer || {};
        const authorName = escapeHtml(
          reviewer.isAnonymous ? "Cliente Google" : reviewer.displayName || "Cliente Google",
        );
        const photo = escapeHtml(reviewer.profilePhotoUrl || "");
        const time = escapeHtml(relativeTime(review.createTime));
        const text = escapeHtml(review.comment.trim());
        const rating = toRating(review.starRating);

        return `
          <article class="review-card">
            <div class="review-card-head">
              ${
                photo
                  ? `<img class="review-avatar" src="${photo}" alt="" loading="lazy" referrerpolicy="no-referrer" />`
                  : `<span class="review-avatar" aria-hidden="true"></span>`
              }
              <div class="review-author">
                <strong>${authorName}</strong>
                <time datetime="${escapeHtml(review.createTime || "")}">${time}</time>
              </div>
            </div>
            <div class="review-stars" aria-label="${rating} de 5 estrelas">${starsMarkup(rating)}</div>
            <p class="review-text">${text}</p>
          </article>
        `;
      })
      .join("");

    if (!section.querySelector("[data-reviews-attribution]")) {
      const attributionEl = document.createElement("p");
      attributionEl.dataset.reviewsAttribution = "";
      attributionEl.style.cssText =
        "margin-top:22px;color:var(--color-muted);font-size:0.68rem;text-align:right;";
      attributionEl.innerHTML =
        'Avaliações via Google · <a href="https://featurable.com" target="_blank" rel="noopener noreferrer" style="color:inherit;">Powered by Featurable</a>';
      grid.after(attributionEl);
    }
  };

  const init = async () => {
    try {
      const response = await fetch(FEATURABLE_API + encodeURIComponent(widgetId));
      if (!response.ok) throw new Error(`Featurable respondeu ${response.status}`);

      const data = await response.json();
      if (!data.success) throw new Error("Widget do Featurable indisponível.");

      renderReviews(data);
    } catch (error) {
      console.error("Não foi possível carregar as avaliações do Google.", error);
      renderFallback();
    }
  };

  if (!isConfigured) {
    renderFallback();
    return;
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          obs.disconnect();
          init();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(section);
  } else {
    init();
  }
})();
