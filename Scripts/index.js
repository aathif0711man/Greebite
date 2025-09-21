// Reusable function for scroll-based animations
function revealOnScroll() {
  const elements = document.querySelectorAll('.health-tips');
  elements.forEach(element => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      element.classList.add('visible');
    }
  });
}

// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// Auto-rotating slogans
const slogan = [
  "Eat Well, Live Well",
  "Nourish Your Body, Feed Your Soul",
  "Healthy Today, Thriving Tomorrow",
  "Balance is the Key to Wellness"
];
let sloganIndex = 0;
const sloganElement = document.getElementById('slogan');
if (sloganElement) {
  function rotateSlogan() {
    sloganElement.style.opacity = 0; // Start fade-out
    setTimeout(() => {
      sloganIndex = (sloganIndex + 1) % slogan.length;
      sloganElement.textContent = slogan[sloganIndex];
      sloganElement.style.opacity = 1; // Fade-in
    }, 500); // Match CSS transition duration
  }
  setInterval(rotateSlogan, 4000); // Rotate every 4 seconds
}

// Display Health Tip of the Day
function displayDailyTip() {
  const dailyTipElement = document.getElementById('daily-tip');

  fetch('./Greenbite/JSON/index.json')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load tips');
      return response.json();
    })
    .then(tips => {
      // Get today's date and calculate day of year
      const today = new Date();
      const startOfYear = new Date(today.getFullYear(), 0, 0);
      const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));

      // Use modulo so tips loop through days
      const tipIndex = dayOfYear % tips.length;

      dailyTipElement.innerHTML = `<p>${tips[tipIndex]}</p>`;
    })
    .catch(error => {
      console.error('Error loading tips:', error);
      dailyTipElement.innerHTML = `<p>Sorry, unable to load today's tip. Please try again later.</p>`;
    });
}

// Trigger when page loads
window.addEventListener('DOMContentLoaded', displayDailyTip);


// Newsletter subscription with email validation
const newsletterForm = document.getElementById('newsletter-form');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;

    if (email && emailRegex.test(email)) {
      localStorage.setItem('newsletterEmail', email);
      alert('Thank you for subscribing!');
      newsletterForm.reset();
    } else {
      alert('Please enter a valid email address.');
    }
  });
}

// Scroll event for reveal animations
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// PWA Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./Greenbite/JS/service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch(err => console.error('Service Worker Error:', err));
}