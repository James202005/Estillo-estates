/**
 * Header Module - Scroll state, Mobile Menu Drawer & Active Nav indicator
 */

export function initHeader() {
    const header = document.getElementById('siteHeader');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a:not(.nav-cta)');

    // Scroll header background blur toggle
    function handleScroll() {
        if (!header) return;
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateActiveNav();
    }

    // Mobile navigation drawer toggle
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // Highlight navigation link based on viewport scroll position
    function updateActiveNav() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}
