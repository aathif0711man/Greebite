// Reusable function for scroll-based animations
function revealOnScroll() {
  const elements = document.querySelectorAll('.health-tips, .recipes');
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

// Auto-rotating slogans (for Home Page)
const slogans = [
  "Eat Well, Live Well",
  "Nourish Your Body, Feed Your Soul",
  "Healthy Today, Thriving Tomorrow",
  "Balance is the Key to Wellness"
];
let sloganIndex = 0;
const sloganElement = document.getElementById('slogan');
if (sloganElement) {
  function rotateSlogan() {
    sloganElement.style.opacity = 0;
    setTimeout(() => {
      sloganIndex = (sloganIndex + 1) % slogans.length;
      sloganElement.textContent = slogans[sloganIndex];
      sloganElement.style.opacity = 1;
    }, 500);
  }
  setInterval(rotateSlogan, 4000);
}

// Daily health tips from JSON (for Home Page)
function displayDailyTip() {
  const dailyTipElement = document.getElementById('daily-tip');
  if (dailyTipElement) {
    fetch('./Greenbite/JSON/tips.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load tips');
        return response.json();
      })
      .then(tips => {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const tipIndex = dayOfYear % tips.length;
        dailyTipElement.innerHTML = `<p>${tips[tipIndex]}</p>`;
      })
      .catch(error => {
        console.error('Error loading tips:', error);
        dailyTipElement.innerHTML = `<p>Sorry, unable to load today's tip. Please try again later.</p>`;
      });
  }
}
displayDailyTip();

// Newsletter subscription with email validation (shared across pages)
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && emailRegex.test(email)) {
      localStorage.setItem('newsletterEmail', email);
      alert('Thank you for subscribing!');
      newsletterForm.reset();
    } else {
      alert('Please enter a valid email address.');
    }
  });
}

// Recipes Page: Load and display recipes
const recipeGrid = document.getElementById('recipe-grid');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const modal = document.getElementById('recipe-modal');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalIngredients = document.getElementById('modal-ingredients');
const modalInstructions = document.getElementById('modal-instructions');
const modalNutrition = document.querySelector('#modal-nutrition tbody');
const modalClose = document.getElementById('modal-close');

let recipes = [];

function loadRecipes() {
  if (!recipeGrid) return;
  fetch('./Greenbite/JSON/recipes.json')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load recipes');
      return res.json();
    })
    .then(data => {
      recipes = data;
      displayRecipes(recipes);
    })
    .catch(err => {
      console.error(err);
      recipeGrid.innerHTML = '<p>Unable to load recipes at this time.</p>';
    });
}

function displayRecipes(recipeList) {
  if (!recipeGrid) return;
  recipeGrid.innerHTML = '';
  recipeList.forEach(recipe => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');
    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.name}">
      <h3>${recipe.name}</h3>
      <p>${recipe.description}</p>
    `;
    card.addEventListener('click', () => openModal(recipe));
    recipeGrid.appendChild(card);
  });
}

function openModal(recipe) {
  if (!modal || !modalTitle || !modalImage || !modalIngredients || !modalInstructions || !modalNutrition) return;
  modalTitle.textContent = recipe.name;
  modalImage.src = recipe.image;
  modalImage.alt = recipe.name;
  modalIngredients.innerHTML = recipe.ingredients.map(i => `<li>${i}</li>`).join('');
  modalInstructions.innerHTML = recipe.instructions.map(i => `<li>${i}</li>`).join('');
  modalNutrition.innerHTML = `
    <tr><td>Calories</td><td>${recipe.nutrition.Calories}</td></tr>
    <tr><td>Protein</td><td>${recipe.nutrition.Protein}</td></tr>
    <tr><td>Carbs</td><td>${recipe.nutrition.Carbs}</td></tr>
    <tr><td>Fat</td><td>${recipe.nutrition.Fat}</td></tr>
  `;
  modal.style.display = 'flex';
}

if (modalClose) {
  modalClose.addEventListener('click', () => {
    if (modal) modal.style.display = 'none';
  });
}

if (modal) {
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });
}

function filterRecipes() {
  if (!searchInput || !categoryFilter) return;
  const searchTerm = searchInput.value.toLowerCase();
  const category = categoryFilter.value;
  const filtered = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm) &&
    (category === 'all' || recipe.category === category)
  );
  displayRecipes(filtered);
}

if (searchInput) {
  searchInput.addEventListener('input', filterRecipes);
}
if (categoryFilter) {
  categoryFilter.addEventListener('change', filterRecipes);
}

window.addEventListener('DOMContentLoaded', loadRecipes);

// Scroll event for reveal animations
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// PWA Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./Greenbite/JS/service-worker.js')
    .then(() => console.log('Service Worker Registered'))
    .catch(err => console.error('Service Worker Error:', err));
}