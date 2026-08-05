const loadingScreen = document.getElementById('loading-screen');
const themeToggle = document.getElementById('theme-toggle');
const scrollTopBtn = document.querySelector('.scroll-top');
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const progressBar = document.querySelector('.scroll-progress');
const carouselTrack = document.querySelector('.carousel-track');
const carouselButtons = document.querySelectorAll('.carousel-btn');

if (loadingScreen) {
  window.addEventListener('load', () => {
    gsap.to(loadingScreen, {
      opacity: 0,
      duration: 0.8,
      onComplete: () => loadingScreen.remove()
    });
  });
}

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

function updateProgress() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
  progressBar.style.transform = `scaleX(${progress})`;
  scrollTopBtn.style.display = scrollTop > 600 ? 'grid' : 'none';
}

window.addEventListener('scroll', updateProgress);
window.addEventListener('resize', updateProgress);
updateProgress();

scrollTopBtn?.addEventListener('click', () => lenis.scrollTo(0));

gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.reveal').forEach((el) => {
gsap.fromTo(
    el,
    { opacity: 0, y: 40, scale: 0.97 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none reverse'
      }
    }
  );
});

gsap.from('.text-reveal', {
  y: 80,
  opacity: 0,
  duration: 1.2,
  filter: 'blur(16px)',
  ease: 'power3.out',
  delay: 0.2
});

gsap.utils.toArray('.project-card, .skill-card').forEach((card) => {
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { y: -8, scale: 1.01, duration: 0.3, ease: 'power2.out' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
  });
});

const magneticItems = document.querySelectorAll('.magnetic');
magneticItems.forEach((item) => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gsap.to(item, {
      x: (x - rect.width / 2) * 0.08,
      y: (y - rect.height / 2) * 0.08,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  item.addEventListener('mouseleave', () => {
    gsap.to(item, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' });
  });
});

window.addEventListener('mousemove', (e) => {
  cursorDot.style.left = `${e.clientX}px`;
  cursorDot.style.top = `${e.clientY}px`;
  cursorOutline.style.left = `${e.clientX}px`;
  cursorOutline.style.top = `${e.clientY}px`;
});

document.querySelectorAll('a, button, input, textarea, .project-card, .skill-card').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursorOutline.style.width = '46px';
    cursorOutline.style.height = '46px';
    cursorOutline.style.borderColor = 'rgba(201, 168, 106, 0.7)';
  });
  el.addEventListener('mouseleave', () => {
    cursorOutline.style.width = '34px';
    cursorOutline.style.height = '34px';
    cursorOutline.style.borderColor = 'rgba(255, 255, 255, 0.4)';
  });
});

themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  document.body.setAttribute('data-theme', next);
});

let carouselIndex = 0;
function updateCarousel() {
  const slides = carouselTrack.querySelectorAll('article');
  const offset = carouselIndex * -(100 / 3);
  carouselTrack.style.transform = `translateX(${offset}%)`;
}

carouselButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const direction = button.dataset.direction === 'next' ? 1 : -1;
    const slides = carouselTrack.querySelectorAll('article');
    carouselIndex = (carouselIndex + direction + slides.length) % slides.length;
    updateCarousel();
  });
});

updateCarousel();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('mesh-canvas'), alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const geometry = new THREE.PlaneGeometry(14, 8, 80, 80);
const material = new THREE.MeshPhysicalMaterial({
  color: 0x111111,
  emissive: 0x111111,
  transparent: true,
  opacity: 0.65,
  roughness: 0.22,
  metalness: 0.16,
  clearcoat: 0.78,
  transmission: 0.12
});
const mesh = new THREE.Mesh(geometry, material);
mesh.position.z = -4;
scene.add(mesh);

camera.position.z = 6;

function animateScene() {
  requestAnimationFrame(animateScene);
  mesh.rotation.x = 0.18 + Math.sin(Date.now() * 0.0002) * 0.03;
  mesh.rotation.y = 0.22 + Math.cos(Date.now() * 0.0002) * 0.04;
  renderer.render(scene, camera);
}

animateScene();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
