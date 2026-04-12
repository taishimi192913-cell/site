(function () {
  const STORAGE_KEY = "meetjapan-view-mode";

  function applyMode(mode) {
    document.body.classList.toggle("force-mobile", mode === "mobile");
    const button = document.querySelector("[data-view-toggle]");
    if (button) {
      button.textContent = mode === "mobile" ? "Desktop View" : "Phone View";
      button.setAttribute("aria-pressed", mode === "mobile" ? "true" : "false");
    }
  }

  function initViewMode() {
    const saved = localStorage.getItem(STORAGE_KEY) || "desktop";
    applyMode(saved);

    const button = document.querySelector("[data-view-toggle]");
    if (!button) return;

    button.addEventListener("click", function () {
      const current = document.body.classList.contains("force-mobile") ? "mobile" : "desktop";
      const next = current === "mobile" ? "desktop" : "mobile";
      localStorage.setItem(STORAGE_KEY, next);
      applyMode(next);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initViewMode);
  } else {
    initViewMode();
  }
})();
