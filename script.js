/**
 * ProtègeMoi - Enhanced JavaScript functionality
 * Improved accessibility, performance, and user experience
 */

class ProtegemoiApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupYear();
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.setupBillingToggle();
    this.setupLanguageSelector();
    this.setupAccessibility();
    this.setupAnimations();
  }

  /**
   * Set current year in footer
   */
  setupYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /**
   * Enhanced mobile menu with better accessibility
   */
  setupMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const links = document.getElementById('nav-links');
    
    if (!toggle || !links) return;

    // Handle menu toggle
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const newState = !isExpanded;
      
      toggle.setAttribute('aria-expanded', newState.toString());
      links.classList.toggle('open', newState);
      
      // Animate hamburger lines
      this.animateHamburger(toggle, newState);
      
      // Focus management
      if (newState) {
        const firstLink = links.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    // Close menu when clicking links
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        this.animateHamburger(toggle, false);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        this.animateHamburger(toggle, false);
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        this.animateHamburger(toggle, false);
        toggle.focus();
      }
    });
  }

  /**
   * Animate hamburger menu icon
   */
  animateHamburger(toggle, isOpen) {
    const lines = toggle.querySelectorAll('.hamburger-line');
    if (lines.length !== 3) return;

    if (isOpen) {
      lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      lines[1].style.opacity = '0';
      lines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      lines[0].style.transform = 'none';
      lines[1].style.opacity = '1';
      lines[2].style.transform = 'none';
    }
  }

  /**
   * Enhanced smooth scrolling with offset for fixed header
   */
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href').slice(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.pushState(null, null, `#${targetId}`);
          
          // Focus management for accessibility
          setTimeout(() => {
            targetElement.focus({ preventScroll: true });
          }, 500);
        }
      });
    });
  }

  /**
   * Enhanced billing toggle with animations and accessibility
   */
  setupBillingToggle() {
    const billingSwitch = document.getElementById('billingSwitch');
    if (!billingSwitch) return;

    const updatePricing = () => {
      const isYearly = billingSwitch.checked;
      billingSwitch.setAttribute('aria-checked', isYearly.toString());
      
      // Update price displays with animation
      document.querySelectorAll('.pricing-amount').forEach(priceElement => {
        const monthlyPrice = priceElement.getAttribute('data-monthly');
        const yearlyPrice = priceElement.getAttribute('data-yearly');
        
        if (monthlyPrice && yearlyPrice) {
          // Add fade effect
          priceElement.style.opacity = '0.5';
          
          setTimeout(() => {
            priceElement.textContent = isYearly ? yearlyPrice : monthlyPrice;
            priceElement.style.opacity = '1';
          }, 150);
        }
      });

      // Update toggle visual state (handled by CSS)
      this.announceToScreenReader(
        isYearly ? 'Facturation annuelle sélectionnée' : 'Facturation mensuelle sélectionnée'
      );
    };

    billingSwitch.addEventListener('change', updatePricing);
    
    // Initialize
    updatePricing();
  }

  /**
   * Enhanced language selector with better UX
   */
  setupLanguageSelector() {
    const langSelect = document.getElementById('lang');
    if (!langSelect) return;

    langSelect.addEventListener('change', (e) => {
      const selectedLang = e.target.value;
      
      // Show loading state
      langSelect.disabled = true;
      langSelect.style.opacity = '0.7';
      
      // Simulate language change (replace with actual i18n logic)
      setTimeout(() => {
        // In a real implementation, this would call setLang function
        if (typeof setLang === 'function') {
          setLang(selectedLang, true);
        } else {
          // Fallback: reload page with language parameter
          const url = new URL(window.location);
          url.searchParams.set('lang', selectedLang);
          window.location.href = url.toString();
        }
      }, 300);
    });
  }

  /**
   * Enhanced accessibility features
   */
  setupAccessibility() {
    // Add focus indicators for keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });

    // Improve form accessibility
    document.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('invalid', (e) => {
        e.target.setAttribute('aria-invalid', 'true');
      });

      input.addEventListener('input', (e) => {
        if (e.target.validity.valid) {
          e.target.removeAttribute('aria-invalid');
        }
      });
    });

    // Add live region for dynamic content announcements
    if (!document.getElementById('live-region')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      document.body.appendChild(liveRegion);
    }
  }

  /**
   * Setup scroll-based animations
   */
  setupAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.feature-card, .pricing-card, .hero-content').forEach(el => {
      el.classList.add('animate-on-scroll');
      observer.observe(el);
    });

    // Parallax effect for hero image (subtle)
    const heroImg = document.querySelector('.hero-img');
    if (heroImg) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroImg.style.transform = `translateY(${rate}px)`;
      });
    }
  }

  /**
   * Announce messages to screen readers
   */
  announceToScreenReader(message) {
    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }

  /**
   * Utility method for debouncing
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ProtegemoiApp();
  });
} else {
  new ProtegemoiApp();
}

// Add CSS for animations
const animationStyles = `
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }
  
  .animate-in {
    opacity: 1;
    transform: translateY(0);
  }
  
  .keyboard-navigation *:focus {
    outline: 2px solid var(--pm-blue) !important;
    outline-offset: 2px !important;
  }
  
  @media (prefers-reduced-motion: reduce) {
    .animate-on-scroll,
    .animate-in {
      transition: none !important;
      transform: none !important;
    }
  }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);
