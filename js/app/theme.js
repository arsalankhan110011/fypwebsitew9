const KEY = "windcast_theme"; // "light" | "dark"

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(KEY, theme);

  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    btn.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    btn.innerHTML = theme === "dark"
      ? 'Light'
      : 'Dark';
  }
}

function initTheme() {
  const saved = localStorage.getItem(KEY);
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  applyTheme(theme);

  const btn = document.getElementById("themeToggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }
}

document.addEventListener("DOMContentLoaded", initTheme);

