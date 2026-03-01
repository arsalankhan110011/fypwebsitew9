function initReveal() {
  const targets = Array.from(document.querySelectorAll(".panel, .card, .figure, .table, .hero > *"));
  if (!targets.length) return;

  targets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i * 45, 220)}ms`;
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  targets.forEach(el => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", initReveal);
