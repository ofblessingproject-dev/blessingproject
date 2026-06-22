document.addEventListener('DOMContentLoaded', () => {

  // ── Year ──
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Navbar scroll — always show frosted on carousel pages ──
  const navbar = document.getElementById('navbar');
  if (document.querySelector('.fp-carousel')) {
    navbar.classList.add('scrolled');
  } else {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── Logo 가로선 좌→우 애니메이션 ──
  const logoOverlay = document.getElementById('logoOverlay');
  if (logoOverlay) {
    let animated = false;

    function animateLogo() {
      if (animated) return;
      animated = true;
      const duration = 900;
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const pct = (eased * 100).toFixed(2);
        logoOverlay.style.clipPath =
          `polygon(0% 0%, ${pct}% 0%, ${pct}% 100%, 0% 100%)`;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    window.addEventListener('load', () => setTimeout(animateLogo, 600));
  }

  // ── Mobile menu ──
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'ph ph-x' : 'ph ph-list';
      }
    });

    document.querySelectorAll('.mobile-link, .mobile-sublink').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) icon.className = 'ph ph-list';
      });
    });
  }

  // ── Fullpage Carousel ──
  const track = document.getElementById('fp-track');
  const dotsContainer = document.getElementById('fp-dots');
  const prevBtn = document.getElementById('fp-prev');
  const nextBtn = document.getElementById('fp-next');

  if (track && dotsContainer) {
    const slides = track.querySelectorAll('.fp-slide');
    const total = slides.length;
    let current = 0;
    let isAnimating = false;

    // Generate dots
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'fp-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `슬라이드 ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
    const dots = dotsContainer.querySelectorAll('.fp-dot');

    function goTo(index) {
      if (isAnimating || index === current) return;
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;

      isAnimating = true;
      current = index;

      track.style.transform = `translateX(-${current * 100}vw)`;

      dots.forEach((d, i) => d.classList.toggle('active', i === current));


      setTimeout(() => { isAnimating = false; }, 550);
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goTo(current - 1);
      if (e.key === 'ArrowRight') goTo(current + 1);
    });

    // Touch swipe
    let touchStartX = 0;
    let touchStartY = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) goTo(current + 1);
        else goTo(current - 1);
      }
    }, { passive: true });

  }

  // ── Intersection Observer: fade-up-section + text lines ──
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        entry.target.querySelectorAll('.fade-up-text, .script-reveal').forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 80);
        });
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up-section').forEach(el => sectionObserver.observe(el));

});
