/**
 * Stats Module - Animated Numbers Counter on Scroll
 */

export function initStats() {
    const statsSection = document.querySelector('.future-stats');
    const statNumbers = document.querySelectorAll('.stat-number');

    if (!statsSection || !statNumbers.length) return;

    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(numEl => {
                    const targetStr = numEl.dataset.target || numEl.textContent.trim();
                    const hasPlus = targetStr.includes('+');
                    const targetNum = parseInt(targetStr.replace(/\D/g, ''), 10);

                    if (isNaN(targetNum)) return;

                    let current = 0;
                    const step = Math.ceil(targetNum / 35);
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
        });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
}
