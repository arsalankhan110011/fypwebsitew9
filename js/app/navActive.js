export function setActiveNav(current) {
  document.querySelectorAll(".nav a").forEach(a => {
    const href = a.getAttribute("href");
    a.classList.toggle("active", href && href.includes(current));
  });
}