(function () {
  "use strict";

  /* ============ MOBILE NAV ============ */
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");
  const scrim = document.getElementById("mobileNavScrim");

  function openNav() {
    mobileNav.hidden = false;
    scrim.hidden = false;
    requestAnimationFrame(() => {
      mobileNav.classList.add("is-open");
      scrim.classList.add("is-open");
    });
    menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeNav() {
    mobileNav.classList.remove("is-open");
    scrim.classList.remove("is-open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    setTimeout(() => {
      mobileNav.hidden = true;
      scrim.hidden = true;
    }, 300);
  }
  menuBtn.addEventListener("click", () => {
    menuBtn.getAttribute("aria-expanded") === "true" ? closeNav() : openNav();
  });
  scrim.addEventListener("click", closeNav);
  mobileNav.querySelectorAll("[data-nav]").forEach((a) =>
    a.addEventListener("click", closeNav)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuBtn.getAttribute("aria-expanded") === "true") closeNav();
  });

  /* ============ GALLERY: dots + lightbox ============ */
  const scroller = document.getElementById("galleryScroller");
  const slides = Array.from(scroller.querySelectorAll(".gallery__slide"));
  const dotsWrap = document.getElementById("galleryDots");

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Go to photo " + (i + 1));
    if (i === 0) dot.classList.add("is-active");
    dot.addEventListener("click", () => {
      slides[i].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = slides.indexOf(entry.target);
          dots.forEach((d) => d.classList.remove("is-active"));
          if (dots[idx]) dots[idx].classList.add("is-active");
        }
      });
    },
    { root: scroller, threshold: 0.6 }
  );
  slides.forEach((s) => io.observe(s));

  /* Lightbox */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  let currentIndex = 0;
  let lastFocused = null;

  function showLightbox(index) {
    const slide = slides[index];
    if (!slide || slide.classList.contains("gallery__slide--empty")) return;
    currentIndex = index;
    const img = slide.querySelector("img");
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lastFocused = document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }
  function hideLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }
  function stepLightbox(delta) {
    let next = currentIndex;
    for (let i = 0; i < slides.length; i++) {
      next = (next + delta + slides.length) % slides.length;
      if (!slides[next].classList.contains("gallery__slide--empty")) break;
    }
    showLightbox(next);
  }

  slides.forEach((slide, i) => {
    slide.addEventListener("click", () => showLightbox(i));
  });
  lightboxClose.addEventListener("click", hideLightbox);
  lightboxPrev.addEventListener("click", () => stepLightbox(-1));
  lightboxNext.addEventListener("click", () => stepLightbox(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) hideLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") hideLightbox();
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  /* ============ GUEST CHECKLIST ============ */
  const STORAGE_KEY = "faya-place-checklist";
  const checkboxes = Array.from(document.querySelectorAll('#checklistRoot input[type="checkbox"]'));

  function loadState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }
  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* ignore */
    }
  }
  function updateCounts() {
    document.querySelectorAll(".checklist__group").forEach((group) => {
      const items = group.querySelectorAll('input[type="checkbox"]');
      const checked = group.querySelectorAll('input[type="checkbox"]:checked');
      const countEl = group.querySelector("[data-count]");
      if (countEl) countEl.textContent = checked.length + " / " + items.length;
    });
  }

  const state = loadState();
  checkboxes.forEach((cb) => {
    const key = cb.dataset.item;
    if (state[key]) cb.checked = true;
    cb.addEventListener("change", () => {
      const s = loadState();
      s[key] = cb.checked;
      saveState(s);
      updateCounts();
    });
  });
  updateCounts();

  const resetBtn = document.getElementById("resetChecklist");
  resetBtn.addEventListener("click", () => {
    if (!confirm("Reset the guest checklist? This will uncheck all items.")) return;
    checkboxes.forEach((cb) => (cb.checked = false));
    saveState({});
    updateCounts();
  });

  /* ============ TOPBAR SHADOW ON SCROLL ============ */
  const topbar = document.getElementById("topbar");
  function onScroll() {
    if (window.scrollY > 8) {
      topbar.style.boxShadow = "0 1px 0 rgba(12,12,13,0.08)";
    } else {
      topbar.style.boxShadow = "none";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
