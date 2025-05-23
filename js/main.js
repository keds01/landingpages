/**
 * Clinique Esperance - Main JavaScript
 * Controls animations, interactions and behaviors
 */

// Initialize AOS animation library
AOS.init({
    duration: 800,
    easing: 'ease',
    once: true,
    offset: 100,
});

// DOM Elements
const header = document.querySelector('.header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const nav = document.querySelector('.nav');
const faqItems = document.querySelectorAll('.faq-item');
const backToTopBtn = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        backToTopBtn.classList.add('show');
    } else {
        header.classList.remove('scrolled');
        backToTopBtn.classList.remove('show');
    }
});

// Mobile menu toggle
mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
});

// FAQ accordion
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
            const answer = faqItem.querySelector('.faq-answer');
            answer.style.maxHeight = null;
        });
        
        // If the clicked item wasn't active, open it
        if (!isActive) {
            item.classList.add('active');
            const answer = item.querySelector('.faq-answer');
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = targetPosition - headerHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Back to top button
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// GSAP Animations
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero section parallax effect
    gsap.to('.hero-image', {
        y: 50,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        let target = parseInt(stat.textContent);
        let count = 0;
        
        // Reset the text to start from 0
        stat.textContent = '0+';
        
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 80%',
            onEnter: () => {
                const interval = setInterval(() => {
                    count += Math.ceil(target / 100);
                    if (count >= target) {
                        clearInterval(interval);
                        count = target;
                    }
                    stat.textContent = count + '+';
                }, 20);
            },
            once: true
        });
    });
}

// Form validation and submission
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        let isValid = true;
        const formInputs = this.querySelectorAll('input, textarea');
        
        formInputs.forEach(input => {
            if (input.required && !input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                
                // Add error message if it doesn't exist
                if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                    const errorMessage = document.createElement('p');
                    errorMessage.classList.add('error-message');
                    errorMessage.textContent = 'Ce champ est requis';
                    input.parentNode.insertBefore(errorMessage, input.nextSibling);
                }
            } else {
                input.classList.remove('error');
                
                // Remove error message if it exists
                if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
                    input.nextElementSibling.remove();
                }
            }
        });
        
        if (isValid) {
            // Here you would typically send the form data to a server
            // For now, just show a success message
            const successMessage = document.createElement('div');
            successMessage.classList.add('form-success-message');
            successMessage.textContent = 'Votre message a été envoyé avec succès ! Nous vous contacterons bientôt.';
            
            contactForm.innerHTML = '';
            contactForm.appendChild(successMessage);
            
            // Animation for success message
            gsap.from('.form-success-message', {
                opacity: 0,
                y: 20,
                duration: 0.5
            });
        }
    });
    
    // Real-time validation feedback
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', function() {
            if (this.required && this.value.trim()) {
                this.classList.remove('error');
                
                // Remove error message if it exists
                if (this.nextElementSibling && this.nextElementSibling.classList.contains('error-message')) {
                    this.nextElementSibling.remove();
                }
            }
        });
    });
}
