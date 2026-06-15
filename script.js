// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        organization: document.getElementById('organization').value,
        message: document.getElementById('message').value
    };

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
        showErrorMessage('Please fill in all required fields.');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showErrorMessage('Please enter a valid email address.');
        return;
    }

    // Disable submit button to prevent double submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        // Send data to backend
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
            // Show success message
            showSuccessMessage(result.message);
            // Reset form
            this.reset();
        } else {
            showErrorMessage(result.message || 'An error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showErrorMessage('An error occurred while submitting your message. Please try again.');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});

function showSuccessMessage(message) {
    // Create success message element if it doesn't exist
    let successMsg = document.querySelector('.success-message');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        const form = document.getElementById('contactForm');
        form.insertBefore(successMsg, form.firstChild);
    }

    successMsg.textContent = message || 'Thank you for your message! We will get back to you within 24 hours.';
    successMsg.classList.add('show');

    // Hide message after 5 seconds
    setTimeout(() => {
        successMsg.classList.remove('show');
    }, 5000);
}

function showErrorMessage(message) {
    let errorMsg = document.querySelector('.error-message');
    if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        const form = document.getElementById('contactForm');
        form.insertBefore(errorMsg, form.firstChild);
    }

    errorMsg.textContent = message;
    errorMsg.classList.add('show');

    setTimeout(() => {
        errorMsg.classList.remove('show');
    }, 6000);
}

// Google Reviews
function renderStars(rating) {
    const full = Math.round(rating);
    return '&#9733;'.repeat(full) + '&#9734;'.repeat(5 - full);
}

function safeText(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function googleIconSvg() {
    return `<svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>`;
}

async function loadGoogleReviews() {
    try {
        const res = await fetch('/api/reviews');
        if (!res.ok) return;
        const data = await res.json();
        if (!data.reviews || data.reviews.length === 0) return;

        if (data.rating && data.userRatingCount) {
            document.getElementById('google-rating-score').textContent = data.rating.toFixed(1);
            document.getElementById('google-rating-stars').innerHTML = renderStars(data.rating);
            document.getElementById('google-rating-count').textContent = `(${data.userRatingCount.toLocaleString()} reviews)`;
            document.getElementById('google-rating-summary').style.display = 'flex';
        }

        const grid = document.getElementById('testimonials-grid');
        grid.innerHTML = data.reviews.map((r) => `
            <div class="testimonial-card">
                <div class="review-stars" aria-label="${r.rating} out of 5 stars">${renderStars(r.rating)}</div>
                <p class="testimonial-quote">${safeText(r.text)}</p>
                <div class="testimonial-author">
                    <strong>${safeText(r.authorName)}</strong>
                    <span>${safeText(r.relativeTime)}</span>
                </div>
                <div class="google-badge">
                    ${googleIconSvg()}
                    <span>Google Review</span>
                </div>
            </div>
        `).join('');
    } catch (_) {
        // silently keep static fallback testimonials
    }
}

loadGoogleReviews();

// Add active state to navigation on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
