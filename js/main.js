/**
 * Estillo Estates Application Main Script
 * Standard & ES Module Compatible (Runs on file:// and http://)
 */

(function () {
    'use strict';

    // Mark body as JS-enabled for animations
    document.documentElement.classList.add('js-enabled');

    const propertiesData = {
        'cozy-home': {
            title: 'Semi-Industrial Cozy Home',
            category: 'live',
            years: '2025 — Present',
            image: 'assets/property_cozy.png',
            location: 'Metro Manila, Philippines',
            capacity: 'Up to 6 Guests',
            tagline: 'Warm design meets semi-industrial elegance.',
            description: 'A thoughtfully designed private home created for comfortable stays, relaxed family gatherings, and memorable intimate celebrations. Features custom wood furnishings, exposed brick detailing, high-speed WiFi, smart entertainment, and full kitchen amenities.',
            amenities: ['Exposed Brick Design', 'Fully Equipped Kitchen', 'High-Speed WiFi', 'Smart Entertainment System', 'Private Dedicated Workspace', 'Air Conditioned Suites']
        },
        'soak-screen': {
            title: 'Soak | Screen Urban Hideaway',
            category: 'live',
            years: '2026 — Present',
            image: 'assets/property_cozy.png',
            location: 'Tagaytay / Urban Hideaway',
            capacity: 'Up to 8 Guests',
            tagline: 'Private urban retreat with pool & outdoor cinema.',
            description: 'A private retreat crafted specifically around relaxation, outdoor entertainment, and shared moments. Guests can unwind in the private plunge pool, enjoy open-air movie screening under the stars, or relax in spacious indoor-outdoor lounge quarters.',
            amenities: ['Private Plunge Pool', 'Outdoor Cinema Screen', 'Teak Wood Deck & Lounge', 'Outdoor BBQ Grill Area', 'Lush Tropical Garden', 'Curated Mood Lighting']
        },
        'industrial-suites': {
            title: 'Estillo Industrial Suites (EIS)',
            category: 'upcoming',
            years: 'Target Launch — 2028',
            image: 'assets/hero_bg.png',
            location: 'Prime Destination (In Development)',
            capacity: 'Boutique Complex',
            tagline: 'Boutique accommodations meets cafe culture.',
            description: 'A flagship hospitality concept envisioned to unite designer accommodations, artisanal café culture, and curated lifestyle retail spaces. EIS marks the expansion of Estillo Estates into full-scale hospitality destinations.',
            amenities: ['Artisanal Cafe & Bakery', 'Boutique Luxury Suites', 'Co-Working Lounge', 'Wellness & Sauna Deck', 'Design Concept Store', '24/7 Hospitality Concierge']
        }
    };

    /* 1. Header & Navigation Handler */
    function initHeader() {
        const header = document.getElementById('siteHeader');
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.main-nav a:not(.nav-cta)');

        function handleScroll() {
            if (!header) return;
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            updateActiveNav();
        }

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

    /* 2. Scroll Reveal Animations */
    function initAnimations() {
        const revealElements = document.querySelectorAll('.reveal');
        if (!revealElements.length) return;

        if ('IntersectionObserver' in window) {
            const revealObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -20px 0px'
            });

            revealElements.forEach(el => revealObserver.observe(el));
        } else {
            revealElements.forEach(el => el.classList.add('visible'));
        }
    }

    /* 3. Portfolio Filter & Modal Quick-View */
    function initPortfolio() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const propertyCards = document.querySelectorAll('.property-card');
        const modalOverlay = document.getElementById('propertyModal');
        const modalCloseBtn = document.getElementById('modalCloseBtn');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.dataset.filter;

                propertyCards.forEach(card => {
                    const category = card.dataset.category;
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(10px)';
                        setTimeout(() => { card.style.display = 'none'; }, 300);
                    }
                });
            });
        });

        propertyCards.forEach(card => {
            card.addEventListener('click', () => {
                const propId = card.dataset.propertyId;
                const data = propertiesData[propId];
                if (!data || !modalOverlay) return;

                document.getElementById('modalPropTitle').textContent = data.title;
                document.getElementById('modalPropTagline').textContent = data.tagline;
                document.getElementById('modalPropDesc').textContent = data.description;
                document.getElementById('modalPropLocation').textContent = data.location;
                document.getElementById('modalPropCapacity').textContent = data.capacity;
                document.getElementById('modalPropImage').src = data.image;

                const amenitiesList = document.getElementById('modalPropAmenities');
                if (amenitiesList) {
                    amenitiesList.innerHTML = data.amenities.map(item => `<li><span style="color: var(--color-gold);">•</span> ${item}</li>`).join('');
                }

                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (modalCloseBtn && modalOverlay) {
            modalCloseBtn.addEventListener('click', () => {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });

            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    modalOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    /* 4. Stats Counter */
    function initStats() {
        const statsSection = document.querySelector('.future-stats');
        const statNumbers = document.querySelectorAll('.stat-number');

        if (!statsSection || !statNumbers.length) return;

        let animated = false;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !animated) {
                        animated = true;
                        runCounter();
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(statsSection);
        } else {
            runCounter();
        }

        function runCounter() {
            statNumbers.forEach(numEl => {
                const targetStr = numEl.dataset.target || numEl.textContent.trim();
                const hasPlus = targetStr.includes('+');
                const targetNum = parseInt(targetStr.replace(/\D/g, ''), 10);

                if (isNaN(targetNum)) return;

                let current = 0;
                const step = Math.max(1, Math.ceil(targetNum / 30));
                const timer = setInterval(() => {
                    current += step;
                    if (current >= targetNum) {
                        numEl.textContent = targetNum + (hasPlus ? '+' : '');
                        clearInterval(timer);
                    } else {
                        numEl.textContent = current + (hasPlus ? '+' : '');
                    }
                }, 40);
            });
        }
    }

    /* 5. Booking & Inquiry Modal */
    function initBookingModal() {
        const bookingOverlay = document.getElementById('bookingModal');
        const closeBookingBtn = document.getElementById('bookingCloseBtn');
        const openBookingBtns = document.querySelectorAll('.open-booking-modal');
        const bookingForm = document.getElementById('bookingForm');
        const formSuccessState = document.getElementById('bookingFormSuccess');

        if (!bookingOverlay) return;

        openBookingBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                bookingOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        if (closeBookingBtn) {
            closeBookingBtn.addEventListener('click', () => {
                bookingOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        bookingOverlay.addEventListener('click', (e) => {
            if (e.target === bookingOverlay) {
                bookingOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                bookingForm.style.display = 'none';
                if (formSuccessState) {
                    formSuccessState.style.display = 'block';
                }
            });
        }
    }

    /* 6. Smooth Scrolling */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || !targetId) return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = 75;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Initialize all features on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        initHeader();
        initAnimations();
        initPortfolio();
        initStats();
        initBookingModal();
        initSmoothScroll();
    });
})();
