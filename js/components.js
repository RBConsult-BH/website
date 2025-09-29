/**
 * Modern Components Library
 * Stripe-level UI components for enhanced user experience
 */

class ComponentsLibrary {
    constructor() {
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupModernButtons();
        this.setupTooltips();
        this.setupModals();
        this.setupLoadingStates();
        this.setupScrollEffects();
        this.setupParallax();
    }

    // Intersection Observer for animations
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all elements with animation classes
        document.querySelectorAll('.animate-on-scroll').forEach((el) => {
            observer.observe(el);
        });
    }

    // Enhanced button interactions
    setupModernButtons() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.btn-modern, .btn-ripple');
            if (button) {
                this.createRippleEffect(button, e);
            }
        });
    }

    // Ripple effect for buttons
    createRippleEffect(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        // Add ripple animation CSS if not exists
        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                .btn-modern, .btn-ripple {
                    position: relative;
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);
        }

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    // Modern tooltips
    setupTooltips() {
        document.addEventListener('mouseenter', (e) => {
            const element = e.target.closest('[data-tooltip]');
            if (element) {
                this.showTooltip(element);
            }
        });

        document.addEventListener('mouseleave', (e) => {
            const element = e.target.closest('[data-tooltip]');
            if (element) {
                this.hideTooltip(element);
            }
        });
    }

    showTooltip(element) {
        const text = element.getAttribute('data-tooltip');
        const position = element.getAttribute('data-tooltip-position') || 'top';
        
        const tooltip = document.createElement('div');
        tooltip.className = 'modern-tooltip';
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            opacity: 0;
            transform: translateY(${position === 'top' ? '10px' : '-10px'});
            transition: all 0.2s ease;
            pointer-events: none;
        `;

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        let top, left;
        if (position === 'top') {
            top = rect.top - tooltipRect.height - 8;
            left = rect.left + (rect.width - tooltipRect.width) / 2;
        } else {
            top = rect.bottom + 8;
            left = rect.left + (rect.width - tooltipRect.width) / 2;
        }

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;

        requestAnimationFrame(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        });

        element._tooltip = tooltip;
    }

    hideTooltip(element) {
        if (element._tooltip) {
            element._tooltip.style.opacity = '0';
            setTimeout(() => {
                if (element._tooltip && element._tooltip.parentNode) {
                    element._tooltip.parentNode.removeChild(element._tooltip);
                }
                delete element._tooltip;
            }, 200);
        }
    }

    // Modern modal system
    setupModals() {
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-modal-open')) {
                const modalId = e.target.getAttribute('data-modal-open');
                this.openModal(modalId);
            }
            
            if (e.target.hasAttribute('data-modal-close') || e.target.closest('.modal-overlay')) {
                this.closeModal(e.target.closest('.modal'));
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.modal-open');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('modal-open');
            document.body.style.overflow = 'hidden';
            
            // Focus trap
            const focusableElements = modal.querySelectorAll(
                'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }
    }

    closeModal(modal) {
        if (modal && modal.classList.contains('modal-open')) {
            modal.classList.remove('modal-open');
            document.body.style.overflow = '';
        }
    }

    // Loading states
    setupLoadingStates() {
        this.loadingStates = new Map();
    }

    showLoading(element, text = 'Loading...') {
        if (this.loadingStates.has(element)) return;

        const originalContent = element.innerHTML;
        this.loadingStates.set(element, originalContent);

        element.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <span>${text}</span>
            </div>
        `;
        element.classList.add('loading');

        // Add loading spinner styles if not exists
        if (!document.querySelector('#loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                .loading-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                .loading-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #e4e4e7;
                    border-top: 2px solid #18181b;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    hideLoading(element) {
        if (this.loadingStates.has(element)) {
            element.innerHTML = this.loadingStates.get(element);
            element.classList.remove('loading');
            this.loadingStates.delete(element);
        }
    }

    // Smooth scroll effects
    setupScrollEffects() {
        let ticking = false;

        const updateScrollEffects = () => {
            const scrollY = window.scrollY;
            
            // Navbar blur effect
            const navbar = document.querySelector('.nav');
            if (navbar) {
                const opacity = Math.min(scrollY / 100, 0.95);
                navbar.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
                navbar.style.backdropFilter = `blur(${Math.min(scrollY / 10, 8)}px)`;
            }

            // Parallax elements
            document.querySelectorAll('[data-parallax]').forEach(element => {
                const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
                const yPos = -(scrollY * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    // Parallax scrolling
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length === 0) return;

        const updateParallax = () => {
            const scrollTop = window.pageYOffset;

            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.5;
                const yPos = -(scrollTop * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        };

        window.addEventListener('scroll', updateParallax);
    }

    // Modern form validation
    setupFormValidation() {
        document.addEventListener('submit', (e) => {
            const form = e.target.closest('form[data-validate]');
            if (form) {
                e.preventDefault();
                this.validateForm(form);
            }
        });

        // Real-time validation
        document.addEventListener('blur', (e) => {
            const input = e.target.closest('input[required], textarea[required]');
            if (input) {
                this.validateField(input);
            }
        }, true);
    }

    validateForm(form) {
        const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            this.showLoading(form.querySelector('[type="submit"]'), 'Submitting...');
            // Process form submission
            setTimeout(() => {
                this.hideLoading(form.querySelector('[type="submit"]'));
                this.showNotification('Form submitted successfully!', 'success');
            }, 2000);
        }

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        let isValid = true;
        let message = '';

        // Remove existing error
        this.clearFieldError(field);

        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = 'This field is required';
        } else if (type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        } else if (type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            message = 'Please enter a valid phone number';
        }

        if (!isValid) {
            this.showFieldError(field, message);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('field-error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #dc2626;
            font-size: 12px;
            margin-top: 4px;
            animation: fadeIn 0.2s ease;
        `;

        field.parentNode.appendChild(errorElement);
        field._errorElement = errorElement;
    }

    clearFieldError(field) {
        field.classList.remove('field-error');
        if (field._errorElement) {
            field._errorElement.remove();
            delete field._errorElement;
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    // Notification system
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add notification styles
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 16px 20px;
                    border-radius: 8px;
                    color: white;
                    z-index: 1000;
                    animation: slideInRight 0.3s ease;
                    max-width: 400px;
                }
                .notification-success { background: #10b981; }
                .notification-error { background: #dc2626; }
                .notification-info { background: #3b82f6; }
                .notification-warning { background: #f59e0b; }
                .notification-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 12px;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove
        const timeout = setTimeout(() => {
            this.removeNotification(notification);
        }, duration);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timeout);
            this.removeNotification(notification);
        });
    }

    removeNotification(notification) {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const target = document.getElementById(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
}

// Initialize components library
window.addEventListener('DOMContentLoaded', () => {
    window.componentsLibrary = new ComponentsLibrary();
});

// Export for use in other scripts
window.ComponentsLibrary = ComponentsLibrary;