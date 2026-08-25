/* ========================================
   NEXUS HEALTHCARE - MAIN JAVASCRIPT
   ======================================== */

(function() {
    'use strict';

    // ========================================
    // 1. NAVBAR - SCROLL EFFECT
    // ========================================
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // ========================================
    // 2. HAMBURGER MENU
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // ========================================
    // 3. ACTIVE NAVIGATION LINK
    // ========================================
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-menu a:not(.btn-nav-cta)');
        
        navLinks.forEach(function(link) {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref === fileName || 
                (fileName === '' && linkHref === 'index.html') ||
                (fileName === '/' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setActiveNavLink);
    } else {
        setActiveNavLink();
    }

    // ========================================
    // 4. ANIMATED STATISTICS
    // ========================================
    function animateStatistics() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length === 0) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.getAttribute('data-target')) || 0;
                    const duration = 2000;
                    const startTime = performance.now();
                    
                    function updateStat(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const currentValue = Math.round(eased * target);
                        
                        element.textContent = currentValue + '+';
                        
                        if (progress < 1) {
                            requestAnimationFrame(updateStat);
                        } else {
                            element.textContent = target + '+';
                        }
                    }
                    
                    requestAnimationFrame(updateStat);
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(function(stat) {
            observer.observe(stat);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', animateStatistics);
    } else {
        animateStatistics();
    }

    // ========================================
    // 5. BACK TO TOP BUTTON
    // ========================================
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========================================
    // 6. SCROLL REVEAL ANIMATIONS
    // ========================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll(
            '.feature-card, .topic-card, .service-card, .doctor-card, .scheme-card, .library-card, .emergency-card, .rural-card, .value-card, .help-card'
        );

        if (revealElements.length === 0) return;

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry, index) {
                if (entry.isIntersecting) {
                    setTimeout(function() {
                        entry.target.classList.add('revealed');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(function(el) {
            el.classList.add('hidden');
            observer.observe(el);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollReveal);
    } else {
        initScrollReveal();
    }

    // ========================================
    // 7. SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // 8. PARALLAX HERO EFFECT
    // ========================================
    const heroSection = document.querySelector('.hero');
    if (heroSection && window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            if (scrolled < heroSection.offsetHeight) {
                heroSection.style.backgroundPositionY = scrolled * 0.3 + 'px';
            }
        });
    }

    // ========================================
    // 9. KEYBOARD ACCESSIBILITY
    // ========================================
    if (hamburger) {
        hamburger.setAttribute('role', 'button');
        hamburger.setAttribute('aria-label', 'Toggle navigation menu');
        hamburger.setAttribute('tabindex', '0');
        
        hamburger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // ========================================
    // 10. PERFORMANCE - DEBOUNCE RESIZE
    // ========================================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Handle any resize-specific logic here
        }, 250);
    });

    // ========================================
    // 11. DYNAMIC YEAR IN FOOTER
    // ========================================
    const footerYear = document.querySelector('.footer-bottom p:first-child');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.textContent = footerYear.textContent.replace('2026', currentYear);
    }

    // ========================================
    // 12. CONSOLE WELCOME
    // ========================================
    console.log('%c🏥 Nexus Healthcare', 'font-size: 24px; font-weight: bold; color: #0B3B6B;');
    console.log('%c"Connecting People to Better Healthcare."', 'font-size: 16px; color: #00B4D8;');
    console.log('%cBuilt with ❤️ | Educational Project', 'font-size: 14px; color: #4A4A6A;');

})();

// ========================================
// 13. PAGE-SPECIFIC INITIALIZATIONS
// ========================================

// --- Health Library Search & Filter ---
(function() {
    const searchInput = document.getElementById('searchLibrary');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const libraryCards = document.querySelectorAll('.library-card');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            libraryCards.forEach(function(card) {
                const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
                const desc = card.querySelector('.card-desc')?.textContent?.toLowerCase() || '';
                const tags = card.getAttribute('data-tags')?.toLowerCase() || '';
                const match = title.includes(query) || desc.includes(query) || tags.includes(query);
                card.style.display = match ? '' : 'none';
            });
        });
    }

    if (filterButtons.length > 0) {
        filterButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter') || 'all';
                
                filterButtons.forEach(function(b) { b.classList.remove('active'); });
                this.classList.add('active');
                
                libraryCards.forEach(function(card) {
                    const cardFilter = card.getAttribute('data-category') || 'all';
                    if (filter === 'all' || cardFilter === filter) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });

                if (searchInput && searchInput.value.trim() !== '') {
                    const query = searchInput.value.toLowerCase().trim();
                    libraryCards.forEach(function(card) {
                        if (card.style.display !== 'none') {
                            const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
                            const desc = card.querySelector('.card-desc')?.textContent?.toLowerCase() || '';
                            const tags = card.getAttribute('data-tags')?.toLowerCase() || '';
                            const match = title.includes(query) || desc.includes(query) || tags.includes(query);
                            if (!match) card.style.display = 'none';
                        }
                    });
                }
            });
        });
    }
})();

// --- FAQ Accordion ---
(function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', function() {
                const isOpen = item.classList.contains('open');
                
                faqItems.forEach(function(other) {
                    if (other !== item) {
                        other.classList.remove('open');
                        const answer = other.querySelector('.faq-answer');
                        if (answer) answer.style.maxHeight = '0';
                    }
                });
                
                if (!isOpen) {
                    item.classList.add('open');
                    const answer = item.querySelector('.faq-answer');
                    if (answer) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                } else {
                    item.classList.remove('open');
                    const answer = item.querySelector('.faq-answer');
                    if (answer) answer.style.maxHeight = '0';
                }
            });
        }
    });
})();

// --- Appointment Form Validation ---
(function() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const name = document.getElementById('appName');
            const age = document.getElementById('appAge');
            const date = document.getElementById('appDate');
            const time = document.getElementById('appTime');
            const reason = document.getElementById('appReason');
            
            const errorMessages = [];
            
            if (!name || name.value.trim().length < 2) {
                isValid = false;
                errorMessages.push('Please enter your full name.');
                if (name) name.classList.add('error');
            } else if (name) {
                name.classList.remove('error');
            }
            
            if (!age || age.value < 1 || age.value > 120) {
                isValid = false;
                errorMessages.push('Please enter a valid age (1-120).');
                if (age) age.classList.add('error');
            } else if (age) {
                age.classList.remove('error');
            }
            
            if (!date || date.value === '') {
                isValid = false;
                errorMessages.push('Please select a preferred date.');
                if (date) date.classList.add('error');
            } else if (date) {
                date.classList.remove('error');
            }
            
            if (!time || time.value === '') {
                isValid = false;
                errorMessages.push('Please select a preferred time.');
                if (time) time.classList.add('error');
            } else if (time) {
                time.classList.remove('error');
            }
            
            if (!reason || reason.value.trim().length < 5) {
                isValid = false;
                errorMessages.push('Please describe the reason for visit (minimum 5 characters).');
                if (reason) reason.classList.add('error');
            } else if (reason) {
                reason.classList.remove('error');
            }
            
            const errorContainer = document.getElementById('formErrors');
            const successContainer = document.getElementById('formSuccess');
            
            if (!isValid) {
                if (errorContainer) {
                    errorContainer.innerHTML = errorMessages.map(msg => 
                        `<p style="color: #D32F2F; margin: 4px 0;">⚠️ ${msg}</p>`
                    ).join('');
                    errorContainer.style.display = 'block';
                }
                if (successContainer) {
                    successContainer.style.display = 'none';
                }
            } else {
                if (errorContainer) {
                    errorContainer.style.display = 'none';
                }
                if (successContainer) {
                    successContainer.innerHTML = `
                        <div style="background: #E8F5E9; padding: 20px; border-radius: 12px; text-align: center;">
                            <p style="color: #2E7D32; font-size: 1.1rem;">✅ Thank you! Your appointment request has been received.</p>
                            <p style="color: #4A4A6A; margin-top: 8px; font-size: 0.95rem;">
                                <strong>${name ? name.value : 'Patient'}</strong> · 
                                ${date ? date.value : ''} at ${time ? time.value : ''}
                            </p>
                            <p style="color: #7A7A9A; font-size: 0.85rem; margin-top: 8px;">
                                ⚠️ This is a demonstration. No actual appointment has been booked.
                            </p>
                        </div>
                    `;
                    successContainer.style.display = 'block';
                }
                appointmentForm.reset();
            }
        });
        
        appointmentForm.querySelectorAll('input, textarea, select').forEach(function(field) {
            field.addEventListener('input', function() {
                this.classList.remove('error');
                const errorContainer = document.getElementById('formErrors');
                if (errorContainer) {
                    errorContainer.style.display = 'none';
                }
            });
        });
    }
})();

// --- Contact Form Validation ---
(function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const name = document.getElementById('contactName');
            const email = document.getElementById('contactEmail');
            const phone = document.getElementById('contactPhone');
            const message = document.getElementById('contactMessage');
            
            const errorMessages = [];
            
            if (!name || name.value.trim().length < 2) {
                isValid = false;
                errorMessages.push('Please enter your full name.');
                if (name) name.classList.add('error');
            } else if (name) {
                name.classList.remove('error');
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email.value.trim())) {
                isValid = false;
                errorMessages.push('Please enter a valid email address.');
                if (email) email.classList.add('error');
            } else if (email) {
                email.classList.remove('error');
            }
            
            if (phone && phone.value.trim() !== '') {
                const phoneRegex = /^[0-9\-\+\(\)\s]{8,15}$/;
                if (!phoneRegex.test(phone.value.trim())) {
                    isValid = false;
                    errorMessages.push('Please enter a valid phone number.');
                    phone.classList.add('error');
                } else {
                    phone.classList.remove('error');
                }
            }
            
            if (!message || message.value.trim().length < 10) {
                isValid = false;
                errorMessages.push('Please enter a message (minimum 10 characters).');
                if (message) message.classList.add('error');
            } else if (message) {
                message.classList.remove('error');
            }
            
            const errorContainer = document.getElementById('contactErrors');
            const successContainer = document.getElementById('contactSuccess');
            
            if (!isValid) {
                if (errorContainer) {
                    errorContainer.innerHTML = errorMessages.map(msg => 
                        `<p style="color: #D32F2F; margin: 4px 0;">⚠️ ${msg}</p>`
                    ).join('');
                    errorContainer.style.display = 'block';
                }
                if (successContainer) {
                    successContainer.style.display = 'none';
                }
            } else {
                if (errorContainer) {
                    errorContainer.style.display = 'none';
                }
                if (successContainer) {
                    successContainer.innerHTML = `
                        <div style="background: #E8F5E9; padding: 20px; border-radius: 12px; text-align: center;">
                            <p style="color: #2E7D32; font-size: 1.1rem;">✅ Thank you for contacting Nexus Healthcare!</p>
                            <p style="color: #4A4A6A; margin-top: 8px;">
                                We'll get back to you at ${email ? email.value : 'your email'}.
                            </p>
                            <p style="color: #7A7A9A; font-size: 0.85rem; margin-top: 8px;">
                                This is a demonstration. No actual message has been sent.
                            </p>
                        </div>
                    `;
                    successContainer.style.display = 'block';
                }
                contactForm.reset();
            }
        });
        
        contactForm.querySelectorAll('input, textarea').forEach(function(field) {
            field.addEventListener('input', function() {
                this.classList.remove('error');
                const errorContainer = document.getElementById('contactErrors');
                if (errorContainer) {
                    errorContainer.style.display = 'none';
                }
            });
        });
    }
})();

// ========================================
// 14. EXPOSE UTILITIES FOR CONSOLE DEBUGGING
// ========================================
window.NexusHealthcare = {
    version: '1.0.0',
    year: new Date().getFullYear(),
    name: 'Nexus Healthcare',
    tagline: 'Connecting People to Better Healthcare.'
};

console.log('Nexus Healthcare v1.0.0 loaded successfully ✅');
