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

// Day / night switch (remembered across pages)
const themeBtn = document.querySelector(".theme-toggle");
const syncThemeLabel = () => {
  const dark = document.documentElement.dataset.theme === "dark";
  themeBtn.setAttribute("aria-label", dark ? "Switch to day mode" : "Switch to night mode");
  themeBtn.setAttribute("aria-pressed", dark);
};
if (themeBtn) {
  syncThemeLabel();
  themeBtn.addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme !== "dark";
    if (dark) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
    syncThemeLabel();
  });
}

// Photo album: reveal one batch per click; always starts collapsed on page load
const albumBtn = document.querySelector(".album-toggle");
const album = document.getElementById("album");
if (albumBtn && album) {
  const batches = [...new Set([...album.querySelectorAll(".g-more")].map((f) => f.dataset.batch))];
  let shown = 0;
  albumBtn.addEventListener("click", () => {
    if (shown < batches.length) {
      album.querySelectorAll(`.g-more[data-batch="${batches[shown]}"]`).forEach((f) => f.classList.add("shown"));
      shown++;
    } else {
      album.querySelectorAll(".g-more.shown").forEach((f) => f.classList.remove("shown"));
      shown = 0;
      album.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    albumBtn.textContent = shown < batches.length ? "view more photos" : "show fewer photos";
  });
}

// Photo viewer: click a photo to enlarge; arrows / keys / swipe to move through visible photos
const lightbox = document.querySelector(".lightbox");
if (album && lightbox && lightbox.showModal) {
  const lbImg = lightbox.querySelector(".lb-img");
  const lbCount = lightbox.querySelector(".lb-count");
  let list = [];
  let idx = 0;
  const visible = () => [...album.querySelectorAll("figure")].filter((f) => f.offsetParent !== null);
  const show = (i) => {
    idx = (i + list.length) % list.length;
    const img = list[idx].querySelector("img");
    lbImg.src = img.dataset.full || img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbCount.textContent = `${idx + 1} / ${list.length}`;
  };
  album.querySelectorAll("figure").forEach((fig) => {
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", "View photo larger");
    const open = () => {
      list = visible();
      show(list.indexOf(fig));
      lightbox.showModal();
    };
    fig.addEventListener("click", open);
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });
  lightbox.querySelector(".lb-prev").addEventListener("click", () => show(idx - 1));
  lightbox.querySelector(".lb-next").addEventListener("click", () => show(idx + 1));
  lightbox.querySelector(".lb-close").addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
  let touchX = null;
  lightbox.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    touchX = null;
  });
  lightbox.addEventListener("close", () => { lbImg.removeAttribute("src"); });
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
