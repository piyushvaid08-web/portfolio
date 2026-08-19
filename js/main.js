const loadingScreen = document.getElementById('loading-screen');
const themeToggle = document.getElementById('theme-toggle');
const scrollTopBtn = document.querySelector('.scroll-top');
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const progressBar = document.querySelector('.scroll-progress');

// SEO/safety: content is only hidden (reveal-on-scroll) and the loader is only
// shown once we know the animation libraries are available.
const gsapAvailable = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

if (!gsapAvailable) {
  if (loadingScreen) loadingScreen.remove();
} else {
  document.documentElement.classList.add('animations-ready');
}

// ── Loading screen ──
if (loadingScreen && gsapAvailable) {
  window.addEventListener('load', () => {
    gsap.to(loadingScreen, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut',
      onComplete: () => loadingScreen.remove()
    });
  });
  setTimeout(() => {
    if (document.body.contains(loadingScreen)) {
      loadingScreen.style.opacity = '0';
      loadingScreen.style.pointerEvents = 'none';
      setTimeout(() => loadingScreen.remove(), 600);
    }
  }, 4000);
}

// ── Lenis smooth scroll ──
let lenis = null;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);
}

// ── Scroll progress + back-to-top ──
function updateProgress() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
  if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
  if (scrollTopBtn) scrollTopBtn.style.display = scrollTop > 600 ? 'grid' : 'none';
}

window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

scrollTopBtn?.addEventListener('click', () => {
  if (lenis) {
    lenis.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// ── GSAP animations ──
if (gsapAvailable) {
  gsap.registerPlugin(ScrollTrigger);

  // Reveal on scroll — subtle, editorial feel
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Hero text reveal
  gsap.from('.text-reveal', {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.15
  });

  // Subtle card hover — just a gentle lift, no scale
  gsap.utils.toArray('.card-elevated, .card-warm').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -3, duration: 0.4, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' });
    });
  });
}

// ── Custom cursor (desktop only) ──
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
  window.addEventListener('mousemove', (e) => {
    if (cursorDot) {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    }
    if (cursorOutline) {
      cursorOutline.style.left = `${e.clientX}px`;
      cursorOutline.style.top = `${e.clientY}px`;
    }
  });

  // Subtle cursor expansion on interactive elements
  document.querySelectorAll('a, button, input, textarea, .card-elevated, .card-warm').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (cursorOutline) {
        cursorOutline.style.width = '36px';
        cursorOutline.style.height = '36px';
        cursorOutline.style.borderColor = 'rgba(200, 149, 106, 0.5)';
      }
    });
    el.addEventListener('mouseleave', () => {
      if (cursorOutline) {
        cursorOutline.style.width = '28px';
        cursorOutline.style.height = '28px';
        cursorOutline.style.borderColor = 'rgba(240, 236, 228, 0.2)';
      }
    });
  });
}

// ── Theme toggle ──
themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.body.setAttribute('data-theme', next);
});
