// --- Sticky Navbar ---
const navbar = document.getElementById('navbar');
// Make sure navbar exists before adding listener
if (navbar) {
  const stickyOffset = navbar.offsetTop + 100; // Add a buffer

  function handleScroll() {
    if (window.pageYOffset > stickyOffset) {
      navbar.classList.add('sticky');
    } else {
      navbar.classList.remove('sticky');
    }
  }
  window.addEventListener('scroll', handleScroll);
}

// --- Shopping Cart Functionality ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Toast Notification Function
function showToast(message, type = 'success') {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  
  let icon = 'fa-check-circle';
  if (type === 'error') icon = 'fa-exclamation-circle';
  if (type === 'info') icon = 'fa-info-circle';
  
  toast.innerHTML = `
    <i class="fas ${icon}"></i>
    <span>${message}</span>
    <span class="toast-close"><i class="fas fa-times"></i></span>
  `;
  
  toastContainer.appendChild(toast);
  
  // Close button functionality
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  });
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => toast.remove(), 300);
    }
  }, 3000);
}

function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

function removeFromCart(itemId) {
  const itemIndex = cart.findIndex(item => item.id === itemId);
  if (itemIndex > -1) {
    const removedItem = cart[itemIndex];
    cart.splice(itemIndex, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    showToast(`✗ ${removedItem.name} removed from cart!`, 'info');
  }
}

function updateCartDisplay() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  
  if (!cartItemsContainer) return;
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-center text-muted">Your cart is empty!</p>';
    if (cartTotal) cartTotal.textContent = 'Total: $0';
    return;
  }
  
  let total = 0;
  cartItemsContainer.innerHTML = '';
  
  cart.forEach(item => {
    total += item.price * item.quantity;
    const cartItemDiv = document.createElement('div');
    cartItemDiv.className = 'card mb-2 p-3';
    cartItemDiv.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="mb-1">${item.name}</h6>
          <small class="text-muted">$${item.price} x ${item.quantity} = $${item.price * item.quantity}</small>
        </div>
        <button class="btn btn-sm btn-danger remove-from-cart-btn" data-item-id="${item.id}">
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
    `;
    cartItemsContainer.appendChild(cartItemDiv);
  });
  
  if (cartTotal) cartTotal.textContent = `Total: $${total}`;
  
  // Add remove button event listeners
  document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = parseInt(btn.getAttribute('data-item-id'));
      removeFromCart(itemId);
    });
  });
}

function addToCart(productName, productPrice) {
  const cartItem = {
    id: Date.now(),
    name: productName,
    price: parseFloat(productPrice),
    quantity: 1
  };
  
  // Check if item already exists
  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) {
    existingItem.quantity += 1;
    showToast(`✓ ${productName} quantity updated!`, 'success');
  } else {
    cart.push(cartItem);
    showToast(`✓ ${productName} added to cart!`, 'success');
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Add event listeners to all "Add to Cart" buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const productName = button.getAttribute('data-product-name');
    const productPrice = button.getAttribute('data-product-price');
    addToCart(productName, productPrice);
  });
});

// Cart button click handler
const cartBtn = document.getElementById('cartBtn');
if (cartBtn) {
  cartBtn.addEventListener('click', (e) => {
    e.preventDefault();
    updateCartDisplay();
    // Show cart modal using Bootstrap
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    cartModal.show();
  });
}

// Initialize cart count on page load
updateCartCount();

// --- Testimonial Slider ---
const testimonials = [
  {
    img: 'https://images.unsplash.com/photo-1642364861013-2c33f2dcfbcf', 
    quote:
      'Amazing selection and fast shipping! Found exactly what I needed for my new setup.',
    author: 'Saurabh Pandey',
  },
  {
    img: 'https://images.unsplash.com/photo-1659353220441-9207b962a133', 
    quote:
      'The customer service was top-notch. They helped me choose the perfect laptop.',
    author: 'Akriti Shukla',
  },
  {
    img: 'https://images.unsplash.com/photo-1733796941440-9935f13a1cec', 
    quote:
      'Great prices and the quality of the smartwatch exceeded my expectations. Highly recommend!',
    author: 'Ashutosh Singh',
  },
  {
    img: 'https://images.unsplash.com/photo-1700832161143-de261675534b', 
    quote:
      'TechNest is my go-to for tech gadgets. Always reliable and great deals.',
    author: 'Kushmal Arora',
  },
];

let currentSlide = 0;
const sliderContent = document.querySelector(
  '.testimonial-slider .slider-content'
);
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let autoSlideInterval; // Variable to hold the interval ID

function renderSlider() {
  if (!sliderContent) return; // Exit if slider content area doesn't exist
  sliderContent.innerHTML = ''; // Clear existing slides
  testimonials.forEach((testimonial, index) => {
    const slideDiv = document.createElement('div');
    slideDiv.classList.add('testimonial-slide');
    // No need to add 'active' here, showSlide handles it
    slideDiv.innerHTML = `
                <img src="${testimonial.img}" alt="Customer ${testimonial.author}">
                <blockquote>"${testimonial.quote}"</blockquote>
                <p class="author">- ${testimonial.author}</p>
            `;
    sliderContent.appendChild(slideDiv);
  });
}

function showSlide(index) {
  if (!sliderContent) return; // Exit if slider content area doesn't exist
  const slides = sliderContent.querySelectorAll('.testimonial-slide');
  if (slides.length === 0) return; // Exit if no slides rendered

  if (index >= slides.length) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = slides.length - 1;
  } else {
    currentSlide = index;
  }
  // Hide all slides
  slides.forEach((slide) => slide.classList.remove('active'));
  // Show the current slide
  slides[currentSlide].classList.add('active');
}

function startAutoSlide() {
  stopAutoSlide(); // Clear existing interval first
  autoSlideInterval = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000); // Change slide every 5 seconds
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// Event Listeners for slider controls
if (nextBtn && prevBtn) {
  nextBtn.addEventListener('click', () => {
    showSlide(currentSlide + 1);
    stopAutoSlide(); // Stop auto-slide on manual control
  });

  prevBtn.addEventListener('click', () => {
    showSlide(currentSlide - 1);
    stopAutoSlide(); // Stop auto-slide on manual control
  });
}

// Initial setup for slider
renderSlider(); // Create the slides first
showSlide(currentSlide); // Then show the initial active slide
startAutoSlide(); // Start auto-sliding

// --- Update Footer Year ---
const currentYearSpan = document.getElementById('currentYear');
if (currentYearSpan) {
  currentYearSpan.textContent = new Date().getFullYear();
}

// --- Navbar Active Link highlighting on Scroll ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');

function changeNavOnScroll() {
  if (!navLinks || navLinks.length === 0) return; // Exit if no nav links found

  let currentSection = '';
  const offset = navbar ? navbar.offsetHeight + 20 : 100; // Offset based on navbar height

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    // Check if scroll position is within the section (adjust offset as needed)
    if (pageYOffset >= sectionTop - offset) {
      currentSection = section.getAttribute('id');
    }
  });

  // If scrolled past the last section, keep the last link active
  if (
    window.innerHeight + window.pageYOffset >=
    document.body.offsetHeight - 50
  ) {
    // Near bottom
    const lastSection = sections[sections.length - 1];
    if (lastSection) currentSection = lastSection.id;
  }

  navLinks.forEach((link) => {
    link.classList.remove('active');
    const linkHref = link.getAttribute('href');
    // Check if the link's href matches the current section ID
    if (linkHref === `#${currentSection}`) {
      link.classList.add('active');
    }
  });

  // Special case for top of page
  if (pageYOffset < sections[0].offsetTop - offset) {
    // Before the first section
    navLinks.forEach((link) => link.classList.remove('active'));
    const homeLink = document.querySelector(
      '.navbar-nav .nav-link[href="#hero"]'
    );
    if (homeLink) homeLink.classList.add('active');
  }
}
window.addEventListener('scroll', changeNavOnScroll);
// Initial check in case page loads scrolled down
changeNavOnScroll();