/**
 * Estillo Estates Application Main Script
 * Standard & ES Module Compatible (Runs on file:// and http://)
 */

(function () {
    'use strict';

    // Mark body as JS-enabled for animations
    document.documentElement.classList.add('js-enabled');

    // Matches the breakpoint where responsive.css reveals the sticky bar
    const MOBILE_QUERY = '(max-width: 768px)';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    /* Property records mirror the printed listing sheets — specs, rates and
       guest quotes are taken from those, so keep them in sync when a listing
       changes. Gallery entries name the slug; -lg is appended for the sheet. */
    const propertiesData = {
        'lumina': {
            title: 'Lumina',
            subtitle: 'Semi-Industrial Cozy Home',
            category: 'live',
            years: '2025 — Present',
            location: 'Oton, Iloilo',
            capacity: '6 Guests',
            rate: '₱2,500',
            rating: '5.0 · Guest favorite · Top 5% of homes',
            tagline: 'Warm design meets semi-industrial calm.',
            specs: ['6 guests', '2 bedrooms', '3 beds', 'Entire home'],
            gallery: [
                ['lumina-garden', 'Garden lounge with hanging swing chairs at night'],
                ['lumina-living', 'Common area with sofa, staircase and layered rug'],
                ['lumina-dining', 'Dining area beside the open kitchen'],
                ['lumina-lounge', 'Entertainment lounge with wall-mounted screen'],
                ['lumina-bedroom', 'Bedroom with natural light and workspace'],
                ['lumina-patio', 'Outdoor patio and BBQ area after dark'],
                ['lumina-exterior', 'Front exterior and garden walkway']
            ],
            description: 'Book the entire home in Oton, Iloilo. A hotel-clean, thoughtfully designed house built for comfortable stays, relaxed family gatherings and intimate celebrations — with a garden swing, outdoor dining and a full kitchen you can actually cook in.',
            amenities: ['Hotel-clean, cozy home vibe', 'Fast WiFi + Netflix', 'Full kitchen', 'Garden swing + outdoor dining', 'Free parking', 'Hot & cold shower'],
            quote: { text: 'The best house we’ve ever stayed in! Better than a hotel.', author: 'Ben' }
        },
        'savannah': {
            title: 'Savannah',
            subtitle: 'Soak | Screen Urban Hideaway',
            category: 'live',
            years: '2025 — Present',
            location: 'Oton, Iloilo',
            capacity: '9 Guests',
            rate: '₱4,699',
            rating: '5.0 · Guest favorite · Top 5% of homes',
            tagline: 'Private cinema pool staycation.',
            specs: ['9 guests', '4 bedrooms', '5 beds', 'Entire home'],
            gallery: [
                ['savannah-cinema', 'Outdoor cinema screen reflected in the pool at night'],
                ['savannah-pool', 'Private swimming pool framed by bamboo screening'],
                ['savannah-dining', 'Long communal dining table under the vaulted roof'],
                ['savannah-kitchen', 'Kitchen island set for a shared dinner'],
                ['savannah-bedroom', 'Bedroom with gallery wall and tall windows'],
                ['savannah-poolnight', 'Pool deck lit for evening swims'],
                ['savannah-exterior', 'Poolside exterior in daylight']
            ],
            description: 'A private retreat built around relaxation, outdoor entertainment and shared moments. Swim in the private pool, watch films projected open-air over the water, then gather everyone around the long kitchen island for dinner.',
            amenities: ['Private swimming pool', 'Outdoor BBQ + dining area', 'Screen / movie area', 'Fully equipped kitchen', 'Fast WiFi', 'AC in all bedrooms + living room'],
            quote: { text: 'Clean, relaxing, exactly as listed — the pool was a highlight.', author: 'Denev' }
        },
        'industrial-suites': {
            title: 'Estillo Industrial Suites',
            subtitle: 'EIS — Hospitality Destination',
            category: 'upcoming',
            years: 'Target Launch — 2028',
            location: 'Prime Destination (In Development)',
            capacity: 'Boutique Complex',
            rate: '',
            rating: '',
            tagline: 'Boutique accommodations meets café culture.',
            specs: ['Boutique suites', 'Café', 'Lifestyle spaces'],
            gallery: [
                ['eis-concept', 'Estillo Industrial Suites architectural concept rendering']
            ],
            description: 'A flagship hospitality concept envisioned to unite designer accommodations, artisanal café culture, and curated lifestyle retail spaces. EIS marks the expansion of Estillo Estates into full-scale hospitality destinations.',
            amenities: ['Artisanal Cafe & Bakery', 'Boutique Luxury Suites', 'Co-Working Lounge', 'Wellness & Sauna Deck', 'Design Concept Store', '24/7 Hospitality Concierge'],
            quote: null
        }
    };

    /* ------------------------------------------------------------------
     * Scroll lock
     * Mobile Safari ignores `overflow: hidden` on the body, so we pin the
     * body in place and restore the exact scroll offset on release.
     * ------------------------------------------------------------------ */
    const scrollLock = (function () {
        let locked = false;
        let savedY = 0;

        return {
            lock() {
                if (locked) return;
                savedY = window.pageYOffset || document.documentElement.scrollTop || 0;
                document.body.style.setProperty('--scroll-lock-top', `-${savedY}px`);
                document.body.classList.add('is-locked');
                locked = true;
            },
            release() {
                if (!locked) return;
                document.body.classList.remove('is-locked');
                document.body.style.removeProperty('--scroll-lock-top');
                locked = false;
                // Instant restore — a smooth jump back would look broken
                const behaviour = document.documentElement.style.scrollBehavior;
                document.documentElement.style.scrollBehavior = 'auto';
                window.scrollTo(0, savedY);
                document.documentElement.style.scrollBehavior = behaviour;
            }
        };
    })();

    /* ------------------------------------------------------------------
     * Overlay layer manager
     * Tracks every open drawer/modal so the scroll lock is only released
     * once the last one closes (e.g. booking modal opened from a property
     * modal) and Escape always dismisses the topmost layer.
     * ------------------------------------------------------------------ */
    const layers = (function () {
        const stack = [];

        function sync() {
            if (stack.length) {
                scrollLock.lock();
            } else {
                scrollLock.release();
            }
            document.dispatchEvent(new CustomEvent('layerschange', {
                detail: { count: stack.length }
            }));
        }

        return {
            open(layer) {
                if (stack.indexOf(layer) !== -1) return;
                layer.lastFocused = document.activeElement;
                stack.push(layer);
                layer.el.classList.add(layer.openClass);
                layer.el.setAttribute('aria-hidden', 'false');
                if (typeof layer.onOpen === 'function') layer.onOpen();
                sync();

                if (layer.focusTarget) {
                    // Wait for the transition to start so focus doesn't fight the animation
                    window.setTimeout(() => {
                        try { layer.focusTarget.focus({ preventScroll: true }); } catch (e) { /* older browsers */ }
                    }, 60);
                }
            },
            close(layer) {
                const index = stack.indexOf(layer);
                if (index === -1) return;
                stack.splice(index, 1);
                layer.el.classList.remove(layer.openClass);
                layer.el.setAttribute('aria-hidden', 'true');
                if (typeof layer.onClose === 'function') layer.onClose();
                sync();

                if (layer.lastFocused && typeof layer.lastFocused.focus === 'function') {
                    try { layer.lastFocused.focus({ preventScroll: true }); } catch (e) { /* older browsers */ }
                }
                layer.lastFocused = null;
            },
            closeTop() {
                if (!stack.length) return false;
                this.close(stack[stack.length - 1]);
                return true;
            },
            closeAll() {
                while (stack.length) {
                    this.close(stack[stack.length - 1]);
                }
            },
            isOpen(layer) {
                return stack.indexOf(layer) !== -1;
            },
            count() {
                return stack.length;
            }
        };
    })();

    /* Header height drives every scroll offset, so read it live —
       it differs between desktop, mobile and the scrolled state. */
    function headerOffset() {
        const header = document.getElementById('siteHeader');
        return (header ? header.offsetHeight : 72) + 10;
    }

    /* 1. Header & Navigation Handler */
    function initHeader() {
        const header = document.getElementById('siteHeader');
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.main-nav a:not(.nav-cta), .mobile-menu-nav a');

        let ticking = false;

        function handleScroll() {
            if (header) {
                if (window.pageYOffset > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
            updateActiveNav();
        }

        // rAF throttle keeps scrolling smooth on lower-powered phones
        function onScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
        }

        if (hamburger && mobileMenu) {
            const menuLayer = {
                el: mobileMenu,
                openClass: 'open',
                onOpen() {
                    hamburger.classList.add('active');
                    hamburger.setAttribute('aria-expanded', 'true');
                    hamburger.setAttribute('aria-label', 'Close navigation menu');
                },
                onClose() {
                    hamburger.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    hamburger.setAttribute('aria-label', 'Open navigation menu');
                }
            };

            hamburger.addEventListener('click', () => {
                if (layers.isOpen(menuLayer)) {
                    layers.close(menuLayer);
                } else {
                    layers.open(menuLayer);
                }
            });

            mobileLinks.forEach(link => {
                link.addEventListener('click', () => layers.close(menuLayer));
            });

            // A rotation or a jump to desktop width must not strand the drawer open
            const desktopQuery = window.matchMedia(`(min-width: ${901}px)`);
            const onBreakpointChange = (event) => {
                if (event.matches) layers.close(menuLayer);
            };
            if (typeof desktopQuery.addEventListener === 'function') {
                desktopQuery.addEventListener('change', onBreakpointChange);
            } else if (typeof desktopQuery.addListener === 'function') {
                desktopQuery.addListener(onBreakpointChange);
            }
        }

        function updateActiveNav() {
            let currentSectionId = '';
            const probeLine = window.pageYOffset + headerOffset() + 40;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (probeLine >= sectionTop && probeLine < sectionTop + section.offsetHeight) {
                    currentSectionId = section.id;
                }
            });

            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${currentSectionId}`;
                link.classList.toggle('active', isActive);
                if (isActive) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        handleScroll();
    }

    /* 2. Scroll Reveal Animations */
    function initAnimations() {
        const revealElements = document.querySelectorAll('.reveal');
        if (!revealElements.length) return;

        if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
            revealElements.forEach(el => el.classList.add('visible'));
            return;
        }

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Once revealed there's nothing left to watch
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            // Fires slightly before the element enters the viewport so
            // short mobile screens don't show a blank gap mid-scroll
            rootMargin: '0px 0px -8% 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    /* 3. Portfolio Filter & Modal Quick-View */
    function initPortfolio() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const propertyCards = document.querySelectorAll('.property-card');
        const modalOverlay = document.getElementById('propertyModal');
        const modalCloseBtn = document.getElementById('modalCloseBtn');
        const hideTimers = new WeakMap();

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');

                const filterValue = btn.dataset.filter;

                propertyCards.forEach(card => {
                    // Cancel any pending hide so fast repeated taps can't
                    // leave a matching card stuck at display:none
                    window.clearTimeout(hideTimers.get(card));

                    const matches = filterValue === 'all' || card.dataset.category === filterValue;

                    if (matches) {
                        card.style.display = 'flex';
                        card.removeAttribute('aria-hidden');
                        hideTimers.set(card, window.setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 20));
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(10px)';
                        card.setAttribute('aria-hidden', 'true');
                        hideTimers.set(card, window.setTimeout(() => {
                            card.style.display = 'none';
                        }, 300));
                    }
                });
            });
        });

        if (!modalOverlay) return;

        const propertyLayer = {
            el: modalOverlay,
            openClass: 'active',
            focusTarget: modalCloseBtn
        };

        // Exposed so the booking modal can replace this sheet rather than stack on it
        initPortfolio.propertyLayer = propertyLayer;

        function openProperty(card) {
            const data = propertiesData[card.dataset.propertyId];
            if (!data) return;

            document.getElementById('modalPropTitle').textContent = data.title;
            document.getElementById('modalPropTagline').textContent =
                data.subtitle ? `${data.subtitle} — ${data.tagline}` : data.tagline;
            document.getElementById('modalPropDesc').textContent = data.description;
            document.getElementById('modalPropLocation').textContent = data.location;
            document.getElementById('modalPropCapacity').textContent = data.rating || data.capacity;

            const specs = document.getElementById('modalPropSpecs');
            if (specs) {
                specs.innerHTML = data.specs.map(s => `<li>${s}</li>`).join('');
            }

            const amenitiesList = document.getElementById('modalPropAmenities');
            if (amenitiesList) {
                amenitiesList.innerHTML = data.amenities
                    .map(item => `<li><span class="amenity-bullet" aria-hidden="true">•</span><span>${item}</span></li>`)
                    .join('');
            }

            const quote = document.getElementById('modalPropQuote');
            if (quote) {
                if (data.quote) {
                    document.getElementById('modalPropQuoteText').textContent = `“${data.quote.text}”`;
                    document.getElementById('modalPropQuoteAuthor').textContent = `— ${data.quote.author}, verified guest`;
                    quote.hidden = false;
                } else {
                    quote.hidden = true;
                }
            }

            const rate = document.getElementById('modalPropRate');
            if (rate) {
                rate.innerHTML = data.rate
                    ? `<strong>${data.rate}</strong> <span>/ night · ${data.location}</span>`
                    : `<span>${data.years}</span>`;
            }

            buildGallery(data);

            layers.open(propertyLayer);
            // Sheets are reused, so always start a fresh open at the top
            const sheet = modalOverlay.querySelector('.modal-card');
            if (sheet) sheet.scrollTop = 0;
        }

        /* Swipeable gallery — a scroll-snap track is the native-feeling
           pattern on touch and still works with a trackpad or arrow keys. */
        function buildGallery(data) {
            const track = document.getElementById('modalGallery');
            const dots = document.getElementById('modalGalleryDots');
            if (!track) return;

            // srcset keeps phones on the ~100KB 800w file; only wide/retina
            // screens pull the 1400w. The next slide is eager so a swipe
            // doesn't land on an empty frame.
            track.innerHTML = data.gallery.map(([slug, alt], i) => (
                `<img src="assets/properties/${slug}.webp"
                      srcset="assets/properties/${slug}.webp 800w, assets/properties/${slug}-lg.webp 1400w"
                      sizes="(max-width: 768px) 92vw, 600px"
                      alt="${alt}"
                      loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async"
                      draggable="false">`
            )).join('');
            track.scrollLeft = 0;

            if (!dots) return;
            const multiple = data.gallery.length > 1;
            dots.hidden = !multiple;
            dots.innerHTML = multiple
                ? data.gallery.map((_, i) =>
                    `<button type="button" class="gallery-dot${i === 0 ? ' active' : ''}" data-index="${i}"
                             aria-label="Go to photo ${i + 1} of ${data.gallery.length}"></button>`).join('')
                : '';
        }

        // Delegated once — the dots are rebuilt on every open
        const galleryTrack = document.getElementById('modalGallery');
        const galleryDots = document.getElementById('modalGalleryDots');

        if (galleryTrack && galleryDots) {
            /* Slide pitch is measured from the rendered children — mobile shows
               a narrower "peeking" slide than desktop, so clientWidth would drift. */
            function slideStep() {
                const slides = galleryTrack.querySelectorAll('img');
                if (slides.length > 1) {
                    return slides[1].offsetLeft - slides[0].offsetLeft;
                }
                return galleryTrack.clientWidth || 1;
            }

            galleryDots.addEventListener('click', (e) => {
                const dot = e.target.closest('.gallery-dot');
                if (!dot) return;
                galleryTrack.scrollTo({
                    left: Number(dot.dataset.index) * slideStep(),
                    behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
                });
            });

            let scrollTick = false;
            galleryTrack.addEventListener('scroll', () => {
                if (scrollTick) return;
                scrollTick = true;
                window.requestAnimationFrame(() => {
                    const index = Math.round(galleryTrack.scrollLeft / slideStep());
                    galleryDots.querySelectorAll('.gallery-dot').forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                    scrollTick = false;
                });
            }, { passive: true });
        }

        propertyCards.forEach(card => {
            card.addEventListener('click', () => openProperty(card));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                    e.preventDefault();
                    openProperty(card);
                }
            });
        });

        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', () => layers.close(propertyLayer));
        }

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) layers.close(propertyLayer);
        });
    }

    /* 4. Stats Counter */
    function initStats() {
        const statsSection = document.querySelector('.future-stats');
        const statNumbers = document.querySelectorAll('.stat-number');

        if (!statsSection || !statNumbers.length) return;

        // Final values are already in the markup, so reduced motion just keeps them
        if (prefersReducedMotion.matches) return;

        let animated = false;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !animated) {
                        animated = true;
                        runCounter();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(statsSection);
        } else {
            runCounter();
        }

        function runCounter() {
            statNumbers.forEach(numEl => {
                // Non-integer figures (a 5.0 rating) are shown as-is
                if (numEl.hasAttribute('data-static')) return;

                const targetStr = numEl.dataset.target || numEl.textContent.trim();
                const suffix = numEl.textContent.replace(/[\d\s]/g, '');
                const targetNum = parseInt(targetStr.replace(/\D/g, ''), 10);

                if (isNaN(targetNum)) return;

                let current = 0;
                const step = Math.max(1, Math.ceil(targetNum / 30));
                const timer = window.setInterval(() => {
                    current += step;
                    if (current >= targetNum) {
                        numEl.textContent = targetNum + suffix;
                        window.clearInterval(timer);
                    } else {
                        numEl.textContent = current + suffix;
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
        const propertySelect = document.getElementById('bookingProperty');

        if (!bookingOverlay) return;

        const bookingLayer = {
            el: bookingOverlay,
            openClass: 'active',
            focusTarget: closeBookingBtn
        };

        openBookingBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                // Reopening after a submit should offer a fresh form, not the
                // previous confirmation. Runs before the pre-select below so
                // reset() can't wipe the chosen property.
                if (bookingForm && bookingForm.hidden) {
                    bookingForm.reset();
                    bookingForm.hidden = false;
                    if (formSuccessState) formSuccessState.hidden = true;
                }

                // Swap a property sheet for the booking sheet instead of
                // stacking two full-screen sheets on a phone
                const propertyLayer = initPortfolio.propertyLayer;
                if (propertyLayer && layers.isOpen(propertyLayer)) {
                    const openTitle = document.getElementById('modalPropTitle');
                    const match = openTitle && Object.keys(propertiesData)
                        .find(key => propertiesData[key].title === openTitle.textContent);
                    if (match && propertySelect) propertySelect.value = match;
                    layers.close(propertyLayer);
                }

                layers.open(bookingLayer);
                const card = bookingOverlay.querySelector('.modal-card');
                if (card) card.scrollTop = 0;
            });
        });

        if (closeBookingBtn) {
            closeBookingBtn.addEventListener('click', () => layers.close(bookingLayer));
        }

        bookingOverlay.addEventListener('click', (e) => {
            if (e.target === bookingOverlay) layers.close(bookingLayer);
        });

        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // novalidate is set so we can show the browser's own messages
                // only after an explicit submit attempt
                if (!bookingForm.checkValidity()) {
                    bookingForm.reportValidity();
                    return;
                }

                bookingForm.hidden = true;
                if (formSuccessState) {
                    formSuccessState.hidden = false;
                    formSuccessState.setAttribute('role', 'status');
                }
            });
        }
    }

    /* 6. Smooth Scrolling */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (!targetId || targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                e.preventDefault();
                const offsetPosition = targetElement.getBoundingClientRect().top
                    + window.pageYOffset
                    - headerOffset();

                window.scrollTo({
                    top: Math.max(offsetPosition, 0),
                    behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
                });
            });
        });
    }

    /* 7. Sticky Mobile Action Bar */
    function initMobileCtaBar() {
        const bar = document.getElementById('mobileCtaBar');
        const hero = document.getElementById('hero');
        if (!bar) return;

        const mobileQuery = window.matchMedia(MOBILE_QUERY);
        let ticking = false;
        let layerOpen = false;

        function update() {
            const triggerPoint = hero ? hero.offsetHeight * 0.7 : 400;
            const shouldShow = mobileQuery.matches
                && !layerOpen
                && window.pageYOffset > triggerPoint;
            bar.classList.toggle('visible', shouldShow);
        }

        function onScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                update();
                ticking = false;
            });
        }

        // A drawer or sheet always takes precedence over the bar
        document.addEventListener('layerschange', (e) => {
            layerOpen = e.detail.count > 0;
            update();
        });

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        window.addEventListener('orientationchange', onScroll, { passive: true });
        update();
    }

    /* 8. Brand mark
     * The badge lives at assets/logo.png. Until that file exists every
     * <img data-logo> is dropped so the page falls back to the wordmark
     * instead of showing broken-image icons. Once it's added:
     *   data-logo="pair"    — badge sits beside the wordmark (header, footer)
     *   data-logo="replace" — badge takes the place of the "EE" lettering
     */
    function initBrandMark() {
        document.querySelectorAll('img[data-logo]').forEach(img => {
            const fallback = img.parentElement
                ? img.parentElement.querySelector('[data-logo-fallback]')
                : null;

            function onLoaded() {
                if (img.dataset.logo === 'replace' && fallback) {
                    fallback.hidden = true;
                }
            }

            function onFailed() {
                img.remove();
            }

            if (img.complete) {
                // Already settled before this script ran
                if (img.naturalWidth > 0) {
                    onLoaded();
                } else {
                    onFailed();
                }
                return;
            }

            img.addEventListener('load', onLoaded);
            img.addEventListener('error', onFailed);
        });
    }

    /* 9. Global dismiss shortcut */
    function initGlobalKeys() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                layers.closeTop();
            }
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
        initMobileCtaBar();
        initBrandMark();
        initGlobalKeys();
    });
})();
