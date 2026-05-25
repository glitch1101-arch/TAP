/* ═══════════════════════════════════════════
   TAP PADEL CANGGU — JavaScript
═══════════════════════════════════════════ */

/* ─── LOADER ─── */
(function initLoader() {
  const loader   = document.getElementById('loader');
  const fill     = document.querySelector('.loader-fill');
  let progress   = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        kickOffAnimations();
      }, 500);
    }
    fill.style.width = progress + '%';
  }, 80);
  document.body.style.overflow = 'hidden';
})();

/* ─── CUSTOM CURSOR ─── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
let mouseX = -100, mouseY = -100;
let curX = -100, curY = -100;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});
document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; cursorDot.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; cursorDot.style.opacity = '1'; });

function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ─── NAV ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── MOBILE MENU ─── */
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen     = false;

burger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  const spans = burger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(4px, 4px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(4px, -4px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ─── COURTS PHOTO GALLERY ─── */
const courtPhotos = [
  { file: 'assets/court1.png',   fallback: 'assets/facility.svg', label: 'Court 1' },
  { file: 'assets/court2.png',   fallback: 'assets/facility.svg', label: 'The TAP Sign' },
  { file: 'assets/facility.png', fallback: 'assets/facility.svg', label: 'The Lounge' },
  { file: 'assets/court3.png',   fallback: 'assets/facility.svg', label: 'Court 3' },
  { file: 'assets/court4.png',   fallback: 'assets/facility.svg', label: 'Court 4' },
  { file: 'assets/court5.png',   fallback: 'assets/facility.svg', label: 'Night Sessions' },
  { file: 'assets/court6.png',   fallback: 'assets/facility.svg', label: 'Tournament Court' },
];

function buildGallery() {
  const track = document.getElementById('galleryTrack');
  if (!track) return;
  track.innerHTML = '';
  courtPhotos.forEach(photo => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${photo.file}" onerror="this.src='${photo.fallback}'" alt="${photo.label}" loading="lazy" />
      <div class="gallery-item-label">${photo.label}</div>`;
    track.appendChild(item);
  });
  setupGalleryDrag(track.parentElement, track);
}

function setupGalleryDrag(strip, track) {
  let isDown = false, startX = 0, scrollLeft = 0;
  strip.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - strip.offsetLeft; scrollLeft = strip.scrollLeft; });
  strip.addEventListener('mouseleave', () => { isDown = false; });
  strip.addEventListener('mouseup', () => { isDown = false; });
  strip.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    strip.scrollLeft = scrollLeft - (e.pageX - strip.offsetLeft - startX) * 1.4;
  });
  strip.addEventListener('touchstart', e => { startX = e.touches[0].pageX; scrollLeft = strip.scrollLeft; }, { passive: true });
  strip.addEventListener('touchmove', e => { strip.scrollLeft = scrollLeft - (e.touches[0].pageX - startX); }, { passive: true });
  strip.style.overflowX = 'scroll';
  strip.style.scrollbarWidth = 'none';
  strip.style.msOverflowStyle = 'none';
}

/* ─── PARALLAX ─── */
function handleParallax() {
  document.querySelectorAll('.parallax-bg, .parallax-layer').forEach(el => {
    const rect  = el.parentElement.getBoundingClientRect();
    const speed = parseFloat(el.dataset.speed || 0.3);
    el.style.transform = `translateY(${rect.top * speed}px)`;
  });
}
window.addEventListener('scroll', handleParallax, { passive: true });

/* ─── REVEAL ON SCROLL ─── */
function setupReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      setTimeout(() => el.classList.add('revealed'), parseInt(el.dataset.delay || 0));
      observer.unobserve(el);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => observer.observe(el));
}

/* ─── COUNTER ANIMATION ─── */
function setupCounters() {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const step = target / (1600 / 16);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString();
        if (current >= target) clearInterval(timer);
      }, 16);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));
}

/* ─── 3D CAROUSEL ─── */
const IMG_RACKETS  = 'assets/rackets.png';
const IMG_FACILITY = 'assets/facility.png';

const racketData = [
  { img: IMG_RACKETS,  title: 'METALBONE HRD',   sub: 'Adidas · High Performance' },
  { img: IMG_RACKETS,  title: 'METALBONE CARBON', sub: 'Adidas · Pro Series' },
  { img: IMG_RACKETS,  title: 'CROSS IT LIGHT',   sub: 'Adidas · Control Series' },
  { img: IMG_RACKETS,  title: 'ARROW CTRL',       sub: 'Adidas · Speed Series' },
  { img: IMG_FACILITY, title: 'ACCESSORY KIT',    sub: 'Adidas · Full Bundle' },
];

let currentCard  = 0;
const carouselEl = document.getElementById('carousel3d');
const dotsEl     = document.getElementById('carouselDots');

function buildCarousel() {
  const total = racketData.length;
  const angleStep = 360 / total;
  const radius = Math.round(280 / Math.tan(Math.PI / total));
  carouselEl.innerHTML = '';
  dotsEl.innerHTML     = '';
  racketData.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'c-card';
    card.style.transform = `rotateY(${i * angleStep}deg) translateZ(${radius}px)`;
    const svgFallback = item.img.includes('racket') ? 'assets/rackets.svg' : 'assets/facility.svg';
    card.innerHTML = `
      <img src="${item.img}" onerror="this.src='${svgFallback}'" alt="${item.title}" loading="lazy" />
      <div class="c-card-overlay">
        <div class="c-card-title">${item.title}</div>
        <div class="c-card-sub">${item.sub}</div>
      </div>`;
    card.addEventListener('click', () => goToCard(i));
    carouselEl.appendChild(card);
    const dot = document.createElement('div');
    dot.className = 'c-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToCard(i));
    dotsEl.appendChild(dot);
  });
  rotateCarousel();
}

function goToCard(index) {
  currentCard = ((index % racketData.length) + racketData.length) % racketData.length;
  rotateCarousel();
  dotsEl.querySelectorAll('.c-dot').forEach((d, i) => d.classList.toggle('active', i === currentCard));
}

function rotateCarousel() {
  carouselEl.style.transform = `rotateY(${-currentCard * (360 / racketData.length)}deg)`;
}

document.getElementById('prevBtn').addEventListener('click', () => goToCard(currentCard - 1));
document.getElementById('nextBtn').addEventListener('click', () => goToCard(currentCard + 1));

let dragStartX = null;
carouselEl.addEventListener('mousedown', e => { dragStartX = e.clientX; });
carouselEl.addEventListener('mouseup', e => {
  if (dragStartX === null) return;
  const diff = e.clientX - dragStartX;
  if (Math.abs(diff) > 40) goToCard(currentCard + (diff < 0 ? 1 : -1));
  dragStartX = null;
});
carouselEl.addEventListener('touchstart', e => { dragStartX = e.touches[0].clientX; }, { passive: true });
carouselEl.addEventListener('touchend', e => {
  if (dragStartX === null) return;
  const diff = e.changedTouches[0].clientX - dragStartX;
  if (Math.abs(diff) > 40) goToCard(currentCard + (diff < 0 ? 1 : -1));
  dragStartX = null;
});

/* ─── BOOKING FORM ─── */
document.getElementById('bookingForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('[type=submit]');
  btn.textContent = 'Booking Confirmed! ✓';
  btn.style.background = '#2ecc71';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Confirm Booking →';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 3500);
});

/* ─── HERO ZOOM ON SCROLL ─── */
function heroZoom() {
  const heroImg = document.getElementById('hero-img');
  if (!heroImg) return;
  const progress = Math.min(window.scrollY / window.innerHeight, 1);
  heroImg.style.transform = `scale(${1 + progress * 0.12})`;
  heroImg.style.filter    = `brightness(${1 - progress * 0.3})`;
}
window.addEventListener('scroll', heroZoom, { passive: true });

/* ─── KICK OFF ─── */
function kickOffAnimations() {
  setupReveal();
  setupCounters();
  buildGallery();
  buildCarousel();
  handleParallax();
  heroZoom();
}

window.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.querySelector('input[type="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
});