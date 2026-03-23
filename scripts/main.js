document.addEventListener('DOMContentLoaded', () => {
    
    // --- Set current year in footer ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- Navbar Scroll Effect ---
    const header = document.getElementById('navbar');
    
    // --- Hero Logo Scroll Animation ---
    const logoOverlay = document.getElementById('logoOverlay');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Navbar Scrolled Effect
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Logo Animation Effect (animate 0 -> 100% over internal 400px of scroll)
        if (logoOverlay) {
            const maxScroll = window.innerHeight * 0.35; // Finishes much earlier before full scroll
            let percentage = (scrollY / maxScroll) * 100;
            if (percentage > 100) percentage = 100;
            if (percentage < 0) percentage = 0;
            // 0% scroll -> 0% width polygon, 100% scroll -> 100% width polygon
            logoOverlay.style.webkitClipPath = `polygon(0% 0%, ${percentage}% 0%, ${percentage}% 100%, 0% 100%)`;
            logoOverlay.style.clipPath = `polygon(0% 0%, ${percentage}% 0%, ${percentage}% 100%, 0% 100%)`;
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.getElementById('mobileNav');

    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileNav.classList.contains('active')) {
            icon.classList.remove('ph-list');
            icon.classList.add('ph-x');
        } else {
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        }
    });

    // Close mobile nav when linking
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-sublink');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        });
    });

    // --- Intersection Observer for Fade Up Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If the section has text elements to fade up
                const textElements = entry.target.querySelectorAll('.fade-up-text, .script-reveal');
                textElements.forEach((el, index) => {
                    // Minimal staggering
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, index * 100); // 100ms stagger between text lines within a section
                });

                // Option: Stop observing once faded in if you only want it to happen once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections and cards with fade-up-section
    const animatedElements = document.querySelectorAll('.fade-up-section');
    animatedElements.forEach(el => sectionObserver.observe(el));

});
