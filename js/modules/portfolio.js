/**
 * Portfolio Module - Category Filtering & Property Quick-View Modal
 */

export const propertiesData = {
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
        image: 'assets/property_soak.png',
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

export function initPortfolio() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const propertyCards = document.querySelectorAll('.property-card');
    const modalOverlay = document.getElementById('propertyModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');

    // Filter properties
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

    // Quick-View Modal populating
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
                amenitiesList.innerHTML = data.amenities.map(item => `<li><span class="dot">•</span> ${item}</li>`).join('');
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
