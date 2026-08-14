/**
 * Booking / Inquiry Modal Module
 */

export function initBookingModal() {
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
