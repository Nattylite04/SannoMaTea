// Mobile menu toggle
const toggle = document.querySelector(".menu-toggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", open);
  });
  document.querySelectorAll(".nav a").forEach((a) =>
    a.addEventListener("click", () => document.body.classList.remove("menu-open"))
  );
}

// Fade sections in as they scroll into view
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Demo form handling — replace with a real service (Formspree, Netlify Forms, Mailchimp...)
document.querySelectorAll("form[data-demo]").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.closest("[data-form-wrap]").classList.add("submitted");
  });
});

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
