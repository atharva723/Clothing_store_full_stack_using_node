// ==============================
// Cookie Banner
// ==============================


// ==============================
// Region Modal
// ==============================



// ==============================
// Header scroll effect
// ==============================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 80) {
    header.style.background = 'rgba(0, 0, 0, 0.95)';
    header.style.backdropFilter = 'blur(10px)';
  } else {
    header.style.background = 'transparent';
    header.style.backdropFilter = 'none';
  }

  lastScroll = currentScroll;
});


// ==============================
// Newsletter form
// ==============================
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = newsletterForm.querySelector('input').value;
  alert(`Thank you for subscribing with: ${email}`);

  newsletterForm.reset();
});


// ==============================
// Parallax effect for hero sections
// ==============================
const heroSections = document.querySelectorAll('.hero-section');

window.addEventListener('scroll', () => {
  heroSections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const scrollPercent =
      (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

    if (scrollPercent >= 0 && scrollPercent <= 1) {
      const img = section.querySelector('.hero-image img');
      if (img) {
        const translateY = (scrollPercent - 0.5) * 30;
        img.style.transform = `translateY(${translateY}%)`;
      }
    }
  });
});
