// Form Validation & Storage
const contactForm = document.getElementById('contactForm');
const confirmation = document.getElementById('confirmation');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get fields
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Error spans
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  // Reset errors
  nameError.textContent = "";
  emailError.textContent = "";
  messageError.textContent = "";
  confirmation.textContent = "";

  let isValid = true;

  // Validate Name
  if (!name) {
    nameError.textContent = "⚠ Please enter your name.";
    isValid = false;
  }

  // Validate Email
  if (!email) {
    emailError.textContent = "⚠ Please enter your email.";
    isValid = false;
  } else if (!validateEmail(email)) {
    emailError.textContent = "⚠ Please enter a valid email address.";
    isValid = false;
  }

  // Validate Message
  if (!message) {
    messageError.textContent = "⚠ Please enter a message.";
    isValid = false;
  }

  if (!isValid) return;

  // Store Feedback
  const feedback = { name, email, message, date: new Date().toISOString() };
  let storedFeedback = JSON.parse(localStorage.getItem('feedback')) || [];
  storedFeedback.push(feedback);
  localStorage.setItem('feedback', JSON.stringify(storedFeedback));

  confirmation.textContent = "✅ Thank you! Your feedback has been submitted.";
  contactForm.reset();
});

// Email Validation
function validateEmail(email) {
  const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return re.test(email);
}

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
  });
});