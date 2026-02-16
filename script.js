document.addEventListener('DOMContentLoaded', () => {

    // Sticky Navbar transparency effect
    const navbar = document.querySelector('.navbar');
    const navContainer = document.querySelector('.nav-container');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navContainer.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
            navContainer.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const ctaBtn = document.querySelector('.btn-primary'); // Mobile menu might need this too

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Change icon based on state
        const icon = menuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.replace('ph-list', 'ph-x');
        } else {
            icon.classList.replace('ph-x', 'ph-list');
        }
    });

    // Smooth Scroll for Anchor Links (if not natively supported by browser setting)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = menuBtn.querySelector('i');
                    icon.classList.replace('ph-x', 'ph-list');
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Hero Slider
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideIntervalTime = 5000; // 5 seconds

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide++;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    }

    // Auto-play
    let slideInterval = setInterval(nextSlide, slideIntervalTime);

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            // Reset timer on manual interaction
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, slideIntervalTime);
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Fleet View All Toggle
    const viewAllBtn = document.getElementById('view-all-fleet');
    const fleetGrid = document.getElementById('fleet-grid');

    if (viewAllBtn && fleetGrid) {
        viewAllBtn.addEventListener('click', function (e) {
            e.preventDefault();

            if (fleetGrid.classList.contains('collapsed')) {
                this.innerHTML = 'View Less <i class="ph ph-arrow-up"></i>';
                fleetGrid.classList.remove('collapsed');
            } else {
                this.innerHTML = 'View All <i class="ph ph-arrow-right"></i>';
                fleetGrid.classList.add('collapsed');
                document.getElementById('fleet').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // AJAX Form Submission for Formspree
    const emailForms = document.querySelectorAll('form[action^="https://formspree.io"]');
    console.log("Found " + emailForms.length + " Formspree forms.");

    emailForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Form submission started...");

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;

            // Loading state
            btn.innerText = 'Sending...';
            btn.disabled = true;

            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    console.log("Form submitted successfully.");
                    showToast('Message sent successfully!', 'success');
                    form.reset();
                } else {
                    console.error("Form submission failed.");
                    const data = await response.json();
                    if (data && data.errors) {
                        showToast(data.errors.map(error => error.message).join(", "), 'error');
                    } else {
                        showToast('Oops! There was a problem submitting your form', 'error');
                    }
                }
            } catch (error) {
                console.error("Network error:", error);
                showToast('Network error. Please try again.', 'error');
            } finally {
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    });
});

// Toast Notification System
function showToast(message, type = 'success') {
    const container = document.querySelector('.toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? 'ph-check-circle' : 'ph-warning-circle';

    toast.innerHTML = `
        <i class="ph ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}
