(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealNodes = document.querySelectorAll(".reveal");
  const trackedLinks = document.querySelectorAll("[data-track]");
  const analyticsQueue = [];

  window.__cmAnalyticsQueue = analyticsQueue;

  function track(eventName, payload) {
    const event = {
      event: eventName,
      timestamp: new Date().toISOString(),
      payload
    };

    analyticsQueue.push(event);

    if (window.__cmAnalytics && typeof window.__cmAnalytics.track === "function") {
      window.__cmAnalytics.track(eventName, payload);
      return;
    }

    console.info("[cm-track]", eventName, payload);
  }

  function getLinkPayload(link) {
    return {
      track: link.dataset.track || "unknown",
      tier: link.dataset.tier || "unknown",
      position: link.dataset.ctaPosition || "unknown",
      href: link.href
    };
  }

  function revealContent() {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealNodes.forEach((node) => observer.observe(node));
  }

  function bindTracking() {
    trackedLinks.forEach((link) => {
      link.addEventListener("click", () => {
        trackedLinks.forEach((item) => item.classList.remove("is-clicked"));
        link.classList.add("is-clicked");
        track("cta_click", getLinkPayload(link));
      });
    });
  }

  track("page_view", {
    ctaCount: trackedLinks.length,
    path: window.location.pathname
  });

  revealContent();
  bindTracking();
})();
