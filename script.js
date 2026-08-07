/* =========================================================
   FAYA PLACE — Guest Guide
   Vanilla JS interactions: loader, sticky nav, mobile menu,
   scroll reveal, checkout checklist, back-to-top.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading transition ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('loaded'), 250);
  });
  // Fallback in case 'load' already fired or is slow
  setTimeout(() => loader && loader.classList.add('loaded'), 1800);

  /* ---------- Sticky nav shadow on scroll ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 8) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile hamburger menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  const closeMenu = () => {
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  navToggle.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: reveal everything immediately
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- Checkout checklist progress ---------- */
  const checklist = document.getElementById('checklist');
  const checklistBar = document.getElementById('checklistBar');

  if (checklist && checklistBar) {
    const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');

    const updateProgress = () => {
      const total = checkboxes.length;
      const checked = Array.from(checkboxes).filter((cb) => cb.checked).length;
      const percent = total === 0 ? 0 : (checked / total) * 100;
      checklistBar.style.width = percent + '%';
    };

    checkboxes.forEach((cb) => cb.addEventListener('change', updateProgress));
    updateProgress();
  }

  /* ---------- Back to top ---------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Smooth scroll offset for sticky nav (anchor links) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const navHeight = nav ? nav.offsetHeight : 0;
          const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

});
