/**
 * Piyush Vaid - Main Application Script
 * Smooth Scrolling, Ambient Theme Switching, Mobile Nav, Interactive Animations
 */

(function () {
  'use strict';

  // ── 1. Theme Persistence & Toggle ──
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('pv-theme') || 'dark';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('pv-theme', theme);

    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      themeToggle.innerHTML = theme === 'dark'
        ? `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`
        : `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
    }
  }

  // Apply immediately
  applyTheme(storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // ── 2. Loading Screen Dismissal (Instant & Responsive) ──
  const loadingScreen = document.getElementById('loading-screen');
  const gsapAvailable = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (gsapAvailable) {
    document.documentElement.classList.add('animations-ready');
  }

  function dismissLoader() {
    if (!loadingScreen) return;
    loadingScreen.style.opacity = '0';
    loadingScreen.style.pointerEvents = 'none';
    setTimeout(() => {
      if (loadingScreen && loadingScreen.parentNode) {
        loadingScreen.remove();
      }
    }, 280);
  }

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    requestAnimationFrame(dismissLoader);
  } else {
    document.addEventListener('DOMContentLoaded', dismissLoader);
    window.addEventListener('load', dismissLoader);
  }
  // Fast fallback so user is never kept waiting
  setTimeout(dismissLoader, 400);

  // ── 3. Mobile Navigation Drawer ──
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen);
      menuToggle.innerHTML = isOpen
        ? `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`
        : `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>`;
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when clicking any nav link inside drawer
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
        if (menuToggle) {
          menuToggle.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>`;
        }
      });
    });
  }

  // ── 4. Scroll Progress & Back-to-Top (Throttled via rAF to avoid layout thrashing) ──
  const progressBar = document.querySelector('.scroll-progress');
  const scrollTopBtn = document.querySelector('.scroll-top');
  let scrollTicking = false;
  let cachedMaxScroll = 1;
  let isScrollTopVisible = false;

  function calculateMaxScroll() {
    cachedMaxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }

  function handleScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY || window.pageYOffset;
        const progress = Math.min(1, Math.max(0, scrollTop / cachedMaxScroll));

        if (progressBar) {
          progressBar.style.transform = `scaleX(${progress})`;
        }

        const shouldShow = scrollTop > 400;
        if (scrollTopBtn && shouldShow !== isScrollTopVisible) {
          isScrollTopVisible = shouldShow;
          scrollTopBtn.classList.toggle('visible', shouldShow);
        }

        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }

  calculateMaxScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', () => {
    calculateMaxScroll();
    handleScroll();
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { duration: 0.8 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // ── 5. Smooth Scroll (Lenis - Optimized & Synced with GSAP) ──
  if (typeof Lenis !== 'undefined') {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    // On touch screens, native momentum scroll is faster and more natural
    if (!isTouch) {
      const lenis = new Lenis({
        duration: 0.65,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.15,
        touchMultiplier: 1.0,
        syncTouch: false,
        autoResize: true
      });
      window.lenisInstance = lenis;

      // Synchronize Lenis with GSAP ScrollTrigger to prevent frame jitter
      if (gsapAvailable) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }
    }
  }

  // Smooth scroll for internal anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (window.lenisInstance) {
          window.lenisInstance.scrollTo(targetEl, { offset: -70 });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ── 6. GSAP Entrance Animations (Optimized with once: true) ──
  if (gsapAvailable) {
    gsap.registerPlugin(ScrollTrigger);

    // Reveal elements on scroll - triggers detach after running to conserve CPU/GPU
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true
          },
          onComplete: () => {
            el.style.willChange = 'auto';
          }
        }
      );
    });

    // Hero title entrance
    gsap.from('.text-reveal', {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.05
    });
  }

  // ── 7. Interactive Form Handling ──
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Sending Message...
        `;
      }

      setTimeout(() => {
        form.innerHTML = `
          <div class="text-center py-10 space-y-4">
            <div class="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 class="editorial-heading text-2xl text-white">Message Delivered</h3>
            <p class="body-text text-sm text-white/60 max-w-md mx-auto">
              Thank you for reaching out! Piyush Vaid will review your brief and respond within 24 hours.
            </p>
          </div>
        `;
      }, 900);
    });
  });

  // ── 8. Global Video Player Lightbox / Modal ──
  const SAMPLE_BRAND_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  let videoModalEl = null;
  let videoViewportEl = null;
  let videoTitleEl = null;
  let videoCategoryEl = null;
  let activeMediaEl = null;

  function initVideoModal() {
    if (document.getElementById('pv-video-modal')) {
      videoModalEl = document.getElementById('pv-video-modal');
      videoViewportEl = videoModalEl.querySelector('.video-modal-viewport');
      videoTitleEl = videoModalEl.querySelector('.video-modal-title');
      videoCategoryEl = videoModalEl.querySelector('.video-modal-category');
      return;
    }

    videoModalEl = document.createElement('div');
    videoModalEl.id = 'pv-video-modal';
    videoModalEl.className = 'video-modal-backdrop';
    videoModalEl.setAttribute('role', 'dialog');
    videoModalEl.setAttribute('aria-modal', 'true');
    videoModalEl.innerHTML = `
      <div class="video-modal-dialog">
        <div class="video-modal-header">
          <div class="flex items-center gap-3">
            <span class="brand-dot"></span>
            <div>
              <span class="video-modal-category text-[0.7rem] uppercase tracking-wider text-indigo-400 font-bold block">Brand Showcasing & Videography</span>
              <h3 class="video-modal-title text-lg font-serif">Cinematic Video</h3>
            </div>
          </div>
          <button type="button" class="video-modal-close-btn" aria-label="Close Video Player">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="video-modal-viewport"></div>
        <div class="video-modal-footer">
          <span class="flex items-center gap-2">
            <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Directed & Produced by Piyush Vaid
          </span>
          <span class="text-white/40">Press ESC or click outside to close</span>
        </div>
      </div>
    `;

    document.body.appendChild(videoModalEl);
    videoViewportEl = videoModalEl.querySelector('.video-modal-viewport');
    videoTitleEl = videoModalEl.querySelector('.video-modal-title');
    videoCategoryEl = videoModalEl.querySelector('.video-modal-category');

    // Close on backdrop click
    videoModalEl.addEventListener('click', (e) => {
      if (e.target === videoModalEl || e.target.closest('.video-modal-close-btn')) {
        closeVideoModal();
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModalEl.classList.contains('is-active')) {
        closeVideoModal();
      }
    });
  }

  function parseVideoUrl(url) {
    if (!url) return { type: 'none', src: '' };
    // YouTube
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch) {
      return { type: 'youtube', id: ytMatch[1] };
    }
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
    if (vimeoMatch) {
      return { type: 'vimeo', id: vimeoMatch[1] };
    }
    // Direct / Local video file
    return { type: 'direct', src: url };
  }

  function openVideoModal(videoSrc, title, category) {
    initVideoModal();
    if (title && videoTitleEl) videoTitleEl.textContent = title;
    if (category && videoCategoryEl) videoCategoryEl.textContent = category;

    videoViewportEl.innerHTML = '';
    const parsed = parseVideoUrl(videoSrc);

    if (parsed.type === 'youtube') {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${parsed.id}?autoplay=1&rel=0&modestbranding=1`;
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen');
      iframe.setAttribute('allowfullscreen', 'true');
      videoViewportEl.appendChild(iframe);
      activeMediaEl = iframe;
    } else if (parsed.type === 'vimeo') {
      const iframe = document.createElement('iframe');
      iframe.src = `https://player.vimeo.com/video/${parsed.id}?autoplay=1`;
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      iframe.setAttribute('allowfullscreen', 'true');
      videoViewportEl.appendChild(iframe);
      activeMediaEl = iframe;
    } else {
      // Direct video file
      const video = document.createElement('video');
      video.src = parsed.src || SAMPLE_BRAND_VIDEO;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.className = 'w-full h-full object-contain';

      // Fallback if local file isn't uploaded yet
      video.addEventListener('error', () => {
        videoViewportEl.innerHTML = `
          <div class="p-8 text-center max-w-md space-y-4">
            <div class="w-12 h-12 mx-auto rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </div>
            <h4 class="text-white font-medium text-base">Video File Ready to Link</h4>
            <p class="text-xs text-white/60 leading-relaxed">
              Place your video file at <code class="text-indigo-300 font-mono">${parsed.src}</code> in the <code class="text-indigo-300 font-mono">videos/</code> folder, or link to a YouTube/Vimeo URL.
            </p>
            <button type="button" class="btn-primary text-xs py-2 px-4 demo-preview-btn">
              Play Demo Luxury Reel Instead
            </button>
          </div>
        `;
        const demoBtn = videoViewportEl.querySelector('.demo-preview-btn');
        if (demoBtn) {
          demoBtn.addEventListener('click', () => {
            openVideoModal(SAMPLE_BRAND_VIDEO, `${title} (Demo Reel)`, category);
          });
        }
      });

      videoViewportEl.appendChild(video);
      activeMediaEl = video;
      video.play().catch(() => {});
    }

    videoModalEl.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    if (!videoModalEl) return;
    videoModalEl.classList.remove('is-active');
    document.body.style.overflow = '';

    if (activeMediaEl) {
      if (typeof activeMediaEl.pause === 'function') {
        activeMediaEl.pause();
      }
      activeMediaEl = null;
    }
    if (videoViewportEl) {
      videoViewportEl.innerHTML = '';
    }
  }

  // Delegated event listener for all video triggers and buttons
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-video-src], [data-open-video]');
    if (trigger) {
      e.preventDefault();
      const src = trigger.getAttribute('data-video-src') || SAMPLE_BRAND_VIDEO;
      const title = trigger.getAttribute('data-video-title') || 'Brand Showcase & Videography';
      const category = trigger.getAttribute('data-video-category') || 'Videography Portfolio';
      openVideoModal(src, title, category);
    }
  });

})();

