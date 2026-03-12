(function () {
  const toggleButton = document.querySelector("[data-blog-menu-toggle]");
  const mobileNav = document.querySelector("[data-blog-mobile-nav]");

  if (!(toggleButton instanceof HTMLButtonElement) || !(mobileNav instanceof HTMLElement)) {
    return;
  }

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
})();
