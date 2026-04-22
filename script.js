(function () {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sections = document.querySelectorAll("[data-section]");
  const ctas = document.querySelectorAll("[data-track]");
  const revealNodes = document.querySelectorAll(".reveal");

  const analyticsState = {
    queue: [],
    firstClick: null,
    seenSections: new Set(),
    seenCtas: new Set(),
    firedEvents: new Set(),
    lastActiveSection: null,
    scrollMarkers: new Set(),
    returnedToTop: false
  };

  function track(eventName, payload) {
    const event = {
      event: eventName,
      timestamp: new Date().toISOString(),
      payload
    };

    analyticsState.queue.push(event);
    window.__cmAnalyticsQueue = analyticsState.queue;

    if (window.__cmAnalytics && typeof window.__cmAnalytics.track === "function") {
      window.__cmAnalytics.track(eventName, payload);
      return;
    }

    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.info("[cm-track]", eventName, payload);
    }
  }

  window.__cmTrack = track;

  function fireOnce(key, eventName, payload) {
    if (analyticsState.firedEvents.has(key)) {
      return;
    }

    analyticsState.firedEvents.add(key);
    track(eventName, payload);
  }

  function getCtaPayload(node) {
    return {
      track: node.dataset.track,
      tier: node.dataset.tier || "unknown",
      position: node.dataset.ctaPosition || "unknown",
      href: node.getAttribute("href") || ""
    };
  }

  function activateNode(node) {
    ctas.forEach((cta) => cta.classList.remove("is-active"));
    node.classList.add("is-active");
  }

  function bindCtaInteractions() {
    ctas.forEach((cta) => {
      cta.addEventListener("mouseenter", () => {
        activateNode(cta);
      });

      cta.addEventListener("focus", () => {
        activateNode(cta);
      });

      cta.addEventListener("blur", () => {
        cta.classList.remove("is-active");
      });

      cta.addEventListener("mouseleave", () => {
        cta.classList.remove("is-active");
      });

      cta.addEventListener("click", () => {
        const payload = getCtaPayload(cta);

        if (!analyticsState.firstClick) {
          analyticsState.firstClick = payload.track;
          track("first_cta_click", payload);
        }

        ctas.forEach((node) => node.classList.remove("is-featured"));
        cta.classList.add("is-featured");
        track("cta_click", {
          ...payload,
          firstClickTrack: analyticsState.firstClick
        });
      });
    });
  }

  function observeReveals() {
    if (prefersReducedMotion) {
      revealNodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14 });

    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  function observeSections() {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const section = entry.target.dataset.section;
        if (!section) {
          return;
        }

        if (entry.isIntersecting) {
          analyticsState.lastActiveSection = section;
          root.dataset.activeSection = section;

          if (!analyticsState.seenSections.has(section)) {
            analyticsState.seenSections.add(section);
            track(section === "hero" ? "hero_view" : "section_view", { section });
          }
        }
      });
    }, { threshold: 0.4 });

    sections.forEach((section) => sectionObserver.observe(section));
  }

  function observeCtas() {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const node = entry.target;
        const trackKey = node.dataset.track;

        if (!entry.isIntersecting || analyticsState.seenCtas.has(trackKey)) {
          return;
        }

        analyticsState.seenCtas.add(trackKey);
        node.classList.add("is-seen");
        track("cta_visible", getCtaPayload(node));
      });
    }, {
      threshold: 0.65
    });

    ctas.forEach((cta) => ctaObserver.observe(cta));
  }

  function watchScrollDepth() {
    function onScroll() {
      const viewport = window.innerHeight;
      const fullHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      const scrollBottom = window.scrollY + viewport;
      const progress = fullHeight > 0 ? scrollBottom / fullHeight : 0;

      if (progress >= 0.5 && !analyticsState.scrollMarkers.has(50)) {
        analyticsState.scrollMarkers.add(50);
        track("scroll_50", { activeSection: analyticsState.lastActiveSection });
      }

      if (progress >= 0.9 && !analyticsState.scrollMarkers.has(90)) {
        analyticsState.scrollMarkers.add(90);
        track("scroll_90", { activeSection: analyticsState.lastActiveSection });
      }

      if (analyticsState.scrollMarkers.has(50) && window.scrollY < 80 && !analyticsState.returnedToTop) {
        analyticsState.returnedToTop = true;
        track("return_top", { activeSection: analyticsState.lastActiveSection });
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function watchTimeMilestones() {
    window.setTimeout(() => {
      fireOnce("time_15s", "time_15s", { activeSection: analyticsState.lastActiveSection });
    }, 15000);

    window.setTimeout(() => {
      fireOnce("time_30s", "time_30s", { activeSection: analyticsState.lastActiveSection });
    }, 30000);
  }

  function watchVisibility() {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        track("page_reengaged", { activeSection: analyticsState.lastActiveSection });
      }
    });
  }

  function init() {
    track("page_view", {
      ctaCount: ctas.length,
      sectionCount: sections.length
    });

    bindCtaInteractions();
    observeReveals();
    observeSections();
    observeCtas();
    watchScrollDepth();
    watchTimeMilestones();
    watchVisibility();
  }

  init();
})();
