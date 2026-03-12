(function () {
  const parsePositiveInt = (value) => {
    const parsed = Number.parseInt(String(value || ""), 10);
    return Number.isInteger(parsed) && parsed >= 1 ? parsed : undefined;
  };

  const updateAnchorHref = (anchor, mutator) => {
    const rawHref = anchor.getAttribute("href");
    if (!rawHref || rawHref.startsWith("#")) {
      return;
    }

    const url = new URL(rawHref, window.location.origin);
    if (url.origin !== window.location.origin) {
      return;
    }

    mutator(url);
    anchor.setAttribute("href", `${url.pathname}${url.search}${url.hash}`);
  };

  const toggleButton = document.querySelector("[data-blog-menu-toggle]");
  const mobileNav = document.querySelector("[data-blog-mobile-nav]");

  if (toggleButton instanceof HTMLButtonElement && mobileNav instanceof HTMLElement) {
    const updateState = (open) => {
      toggleButton.setAttribute("aria-expanded", open ? "true" : "false");
      mobileNav.hidden = !open;
      mobileNav.dataset.open = open ? "true" : "false";
      document.body.style.overflow = open ? "hidden" : "";
    };

    updateState(false);

    toggleButton.addEventListener("click", () => {
      const isOpen = toggleButton.getAttribute("aria-expanded") === "true";
      updateState(!isOpen);
    });

    mobileNav.addEventListener("click", (event) => {
      const target = event.target;
      if (target instanceof HTMLAnchorElement) {
        updateState(false);
      }
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        updateState(false);
      }
    });
  }

  const fromPage = parsePositiveInt(new URLSearchParams(window.location.search).get("fromPage"));
  if (fromPage && fromPage > 1) {
    document.querySelectorAll("[data-blog-preserve-from-page]").forEach((node) => {
      if (!(node instanceof HTMLAnchorElement)) {
        return;
      }

      updateAnchorHref(node, (url) => {
        if (!url.pathname.startsWith("/blog/")) {
          return;
        }

        if (!url.searchParams.get("fromPage")) {
          url.searchParams.set("fromPage", String(fromPage));
        }
      });
    });

    document.querySelectorAll("[data-blog-breadcrumb-link]").forEach((node) => {
      if (!(node instanceof HTMLAnchorElement)) {
        return;
      }

      updateAnchorHref(node, (url) => {
        if (url.pathname !== "/blog" && url.pathname !== "/blog/") {
          return;
        }

        url.searchParams.set("page", String(fromPage));
      });
    });
  }

  const scrollToHashTarget = (hash) => {
    const normalizedHash = String(hash || "").replace(/^#/, "").trim();
    if (!normalizedHash) {
      return false;
    }

    const target = document.getElementById(decodeURIComponent(normalizedHash));
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    return true;
  };

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const anchor = target.closest('a[href^="#"]');
    if (!(anchor instanceof HTMLAnchorElement)) {
      return;
    }

    const href = anchor.getAttribute("href");
    if (!href || href === "#") {
      return;
    }

    event.preventDefault();
    if (window.location.hash !== href) {
      window.history.replaceState(null, "", href);
    }

    scrollToHashTarget(href);
  });

  const runHashScroll = () => {
    if (!window.location.hash) {
      return;
    }

    scrollToHashTarget(window.location.hash);
  };

  window.setTimeout(runHashScroll, 0);
  window.addEventListener("hashchange", runHashScroll);
})();
