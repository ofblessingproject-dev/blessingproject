document.addEventListener('DOMContentLoaded', () => {

  // ── Year ──
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Navbar scroll ──
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

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
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const pct = (eased * 100).toFixed(2);
        logoOverlay.style.clipPath =
          `polygon(0% 0%, ${pct}% 0%, ${pct}% 100%, 0% 100%)`;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    // 페이지 로드 후 0.6초 뒤 시작
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
