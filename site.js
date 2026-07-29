"use strict";

(() => {
  const button = document.getElementById("siteMenuButton");
  const nav = document.getElementById("siteNav");
  if (button && nav) {
    button.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) {
        nav.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
      }
    });
  }

  const page = document.body.dataset.page;
  document.querySelectorAll("[data-site-page]").forEach(link => {
    const active = link.dataset.sitePage === page;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
  });

  document.querySelectorAll("[data-filter-group]").forEach(toolbar => {
    const targetSelector = toolbar.dataset.filterTarget;
    const items = document.querySelectorAll(targetSelector);
    toolbar.addEventListener("click", event => {
      const buttonEl = event.target.closest("[data-filter]");
      if (!buttonEl) return;
      toolbar.querySelectorAll("[data-filter]").forEach(item => item.classList.remove("active"));
      buttonEl.classList.add("active");
      const filter = buttonEl.dataset.filter;
      items.forEach(item => {
        item.hidden = filter !== "all" && item.dataset.category !== filter;
      });
    });
  });

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(() => {}), { once: true });
  }
})();
