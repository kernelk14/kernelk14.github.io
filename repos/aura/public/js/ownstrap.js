/**
 * OwnStrap - Lightweight UI Framework JavaScript Library
 * Feature-rich utility library for interactive components
 */

class OwnStrap {
  constructor() {
    this.modals = new Map();
    this.tabs = new Map();
    this.accordions = new Map();
    this.toasts = [];
    this.dropdowns = new Map();
    this.collapses = new Map();
    this.carousels = new Map();
    this.tooltips = [];
    this.init();
  }

  /**
   * Initialize all components
   */
  init() {
    const ready = () => {
      this.initModals();
      this.initTabs();
      this.initAccordions();
      this.initDropdowns();
      this.initCollapses();
      this.initCarousels();
      this.initTooltips();
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', ready);
    } else {
      ready();
    }
  }

  /**
   * ==================== MODAL FUNCTIONS ====================
   */

  /**
   * Open a modal by ID
   */
  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = this.getScrollbarWidth() + 'px';
      this.trapFocus(modal);
    }
  }

  /**
   * Close a modal by ID
   */
  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '';
      this.releaseFocus(modal);
    }
  }

  /**
   * Toggle modal
   */
  toggleModal(id) {
    const modal = document.getElementById(id);
    if (modal && modal.classList.contains('show')) {
      this.closeModal(id);
    } else {
      this.openModal(id);
    }
  }

  /**
   * Get scrollbar width for body scroll compensation
   */
  getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  /**
   * Trap focus within a modal
   */
  trapFocus(modal) {
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handler = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    modal._focusHandler = handler;
    modal.addEventListener('keydown', handler);
    first.focus();
  }

  /**
   * Release focus trap
   */
  releaseFocus(modal) {
    if (modal._focusHandler) {
      modal.removeEventListener('keydown', modal._focusHandler);
      delete modal._focusHandler;
    }
  }

  /**
   * Initialize modal listeners
   */
  initModals() {
    document.querySelectorAll('.modal').forEach((modal) => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    document.querySelectorAll('.modal-close').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        if (modal) {
          this.closeModal(modal.id);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach((modal) => {
          this.closeModal(modal.id);
        });
      }
    });
  }

  /**
   * ==================== TAB FUNCTIONS ====================
   */

  /**
   * Switch to a tab
   */
  switchTab(tabId, container) {
    if (!container) return;

    container.querySelectorAll('.tab-content').forEach((tab) => {
      tab.classList.remove('active');
    });

    container.querySelectorAll('.tab-button').forEach((btn) => {
      btn.classList.remove('active');
    });

    const selectedTab = document.getElementById(tabId);
    if (selectedTab) {
      selectedTab.classList.add('active');
    }

    const buttons = container.querySelectorAll(`[data-tab="${tabId}"]`);
    buttons.forEach((btn) => {
      btn.classList.add('active');
    });
  }

  /**
   * Initialize tab listeners
   */
  initTabs() {
    document.querySelectorAll('.tab-button').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const tabId = btn.getAttribute('data-tab');
        const container = btn.closest('[data-tabs]');
        if (container) {
          this.switchTab(tabId, container);
        }
      });
    });

    // Keyboard navigation for tabs
    document.querySelectorAll('[data-tabs]').forEach((container) => {
      container.addEventListener('keydown', (e) => {
        const buttons = Array.from(container.querySelectorAll('.tab-button'));
        const current = document.activeElement;
        const idx = buttons.indexOf(current);
        if (idx === -1) return;

        let nextIdx;
        if (e.key === 'ArrowRight') {
          nextIdx = (idx + 1) % buttons.length;
        } else if (e.key === 'ArrowLeft') {
          nextIdx = (idx - 1 + buttons.length) % buttons.length;
        } else {
          return;
        }

        e.preventDefault();
        buttons[nextIdx].click();
        buttons[nextIdx].focus();
      });
    });
  }

  /**
   * ==================== ACCORDION FUNCTIONS ====================
   */

  /**
   * Toggle accordion item
   */
  toggleAccordionItem(itemId) {
    const item = document.getElementById(itemId);
    if (!item) return;

    const accordion = item.closest('.accordion');
    const body = item.querySelector('.accordion-body');
    const icon = item.querySelector('.accordion-icon');

    const isSingle = accordion && accordion.hasAttribute('data-single');
    if (isSingle) {
      accordion.querySelectorAll('.accordion-item').forEach((other) => {
        if (other !== item) {
          const otherBody = other.querySelector('.accordion-body');
          const otherIcon = other.querySelector('.accordion-icon');
          if (otherBody && otherIcon) {
            otherBody.classList.remove('show');
            otherIcon.classList.remove('active');
            other.querySelector('.accordion-header')?.setAttribute('aria-expanded', 'false');
          }
        }
      });
    }

    if (body && icon) {
      const isOpen = body.classList.contains('show');
      body.classList.toggle('show');
      icon.classList.toggle('active');
      item.querySelector('.accordion-header')?.setAttribute('aria-expanded', String(!isOpen));
    }
  }

  /**
   * Initialize accordion listeners
   */
  initAccordions() {
    document.querySelectorAll('.accordion-header').forEach((header) => {
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');

      header.addEventListener('click', (e) => {
        const item = header.closest('.accordion-item');
        if (item && item.id) {
          this.toggleAccordionItem(item.id);
        }
      });

      // Keyboard support
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const item = header.closest('.accordion-item');
          if (item && item.id) {
            this.toggleAccordionItem(item.id);
          }
        }
      });
    });
  }

  /**
   * ==================== COLLAPSE FUNCTIONS ====================
   */

  /**
   * Toggle collapse
   */
  toggleCollapse(id) {
    const el = document.getElementById(id);
    if (!el) return;

    el.classList.toggle('show');

    // Toggle aria-expanded on trigger buttons
    document.querySelectorAll(`[data-toggle="collapse"][data-target="${id}"]`).forEach((btn) => {
      btn.setAttribute('aria-expanded', String(el.classList.contains('show')));
    });
  }

  /**
   * Show collapse
   */
  showCollapse(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('show');
      document.querySelectorAll(`[data-toggle="collapse"][data-target="${id}"]`).forEach((btn) => {
        btn.setAttribute('aria-expanded', 'true');
      });
    }
  }

  /**
   * Hide collapse
   */
  hideCollapse(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('show');
      document.querySelectorAll(`[data-toggle="collapse"][data-target="${id}"]`).forEach((btn) => {
        btn.setAttribute('aria-expanded', 'false');
      });
    }
  }

  /**
   * Initialize collapse listeners
   */
  initCollapses() {
    document.querySelectorAll('[data-toggle="collapse"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-target');
        if (target) {
          this.toggleCollapse(target.replace('#', ''));
        }
      });
    });
  }

  /**
   * ==================== TOAST/ALERT FUNCTIONS ====================
   */

  /**
   * Show a toast notification
   */
  showToast(message, type = 'info', duration = 4000) {
    const toastContainer = document.querySelector('.toast-container') || this.createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span>${message}</span>
      <button class="toast-close" aria-label="Close">&times;</button>
    `;

    toastContainer.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.hideToast(toast);
    });

    setTimeout(() => {
      this.hideToast(toast);
    }, duration);

    this.toasts.push(toast);
    return toast;
  }

  /**
   * Hide a specific toast
   */
  hideToast(toast) {
    toast.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      toast.remove();
      this.toasts = this.toasts.filter((t) => t !== toast);
    }, 300);
  }

  /**
   * Create toast container
   */
  createToastContainer(placement = 'bottom-right') {
    const container = document.createElement('div');
    container.className = 'toast-container';
    const positions = {
      'bottom-right': { bottom: '2rem', right: '2rem' },
      'bottom-left': { bottom: '2rem', left: '2rem' },
      'top-right': { top: '2rem', right: '2rem' },
      'top-left': { top: '2rem', left: '2rem' },
      'top-center': { top: '2rem', left: '50%', transform: 'translateX(-50%)' },
    };
    const pos = positions[placement] || positions['bottom-right'];
    Object.assign(container.style, pos, {
      position: 'fixed',
      zIndex: '2000',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    });
    document.body.appendChild(container);
    return container;
  }

  /**
   * Show green toast
   */
  green(message, duration = 4000) {
    return this.showToast(message, 'green', duration);
  }

  /**
   * Show orange toast
   */
  orange(message, duration = 4000) {
    return this.showToast(message, 'orange', duration);
  }

  /**
   * Show red toast
   */
  red(message, duration = 4000) {
    return this.showToast(message, 'red', duration);
  }

  /**
   * Show blue toast
   */
  blue(message, duration = 4000) {
    return this.showToast(message, 'blue', duration);
  }

  /**
   * Show purple toast
   */
  purple(message, duration = 4000) {
    return this.showToast(message, 'purple', duration);
  }

  /**
   * Show pink toast
   */
  pink(message, duration = 4000) {
    return this.showToast(message, 'pink', duration);
  }

  /**
   * Show cyan toast
   */
  cyan(message, duration = 4000) {
    return this.showToast(message, 'cyan', duration);
  }

  /**
   * Show indigo toast
   */
  indigo(message, duration = 4000) {
    return this.showToast(message, 'indigo', duration);
  }

  /**
   * Show teal toast
   */
  teal(message, duration = 4000) {
    return this.showToast(message, 'teal', duration);
  }

  /**
   * Show success toast (alias for green)
   */
  success(message, duration = 4000) {
    return this.showToast(message, 'success', duration);
  }

  /**
   * Show warning toast (alias for orange)
   */
  warning(message, duration = 4000) {
    return this.showToast(message, 'warning', duration);
  }

  /**
   * Show error toast (alias for red)
   */
  error(message, duration = 4000) {
    return this.showToast(message, 'danger', duration);
  }

  /**
   * Show info toast (alias for blue)
   */
  info(message, duration = 4000) {
    return this.showToast(message, 'info', duration);
  }

  /**
   * ==================== DROPDOWN FUNCTIONS ====================
   */

  /**
   * Toggle dropdown
   */
  toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
      dropdown.classList.toggle('show');
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', String(dropdown.classList.contains('show')));
      }
    }
  }

  /**
   * Close all dropdowns
   */
  closeAllDropdowns() {
    document.querySelectorAll('.dropdown.show').forEach((dropdown) => {
      dropdown.classList.remove('show');
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * Initialize dropdown listeners
   */
  initDropdowns() {
    document.querySelectorAll('.dropdown-toggle').forEach((toggle) => {
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.setAttribute('aria-expanded', 'false');

      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = toggle.closest('.dropdown');
        if (dropdown) {
          this.toggleDropdown(dropdown.id);
        }
      });
    });

    document.querySelectorAll('.dropdown-item').forEach((item) => {
      item.addEventListener('click', () => {
        this.closeAllDropdowns();
      });
    });

    document.addEventListener('click', () => {
      this.closeAllDropdowns();
    });
  }

  /**
   * ==================== FORM FUNCTIONS ====================
   */

  /**
   * Validate form with enhanced rules
   */
  validateForm(formId, options = {}) {
    const form = document.getElementById(formId);
    if (!form) return false;

    let isValid = true;
    form.querySelectorAll('.input-control, .select-control, textarea').forEach((input) => {
      const group = input.closest('.field-group');
      if (!group) return;

      const value = input.value.trim();
      let fieldValid = true;

      // Required check
      if (input.hasAttribute('required') && !value) {
        fieldValid = false;
      }

      // Email pattern
      if (fieldValid && input.type === 'email' && value) {
        fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      // Pattern attribute
      if (fieldValid && input.getAttribute('pattern') && value) {
        fieldValid = new RegExp(input.getAttribute('pattern')).test(value);
      }

      // Minlength
      if (fieldValid && input.getAttribute('minlength') && value) {
        fieldValid = value.length >= parseInt(input.getAttribute('minlength'));
      }

      // Maxlength
      if (fieldValid && input.getAttribute('maxlength') && value) {
        fieldValid = value.length <= parseInt(input.getAttribute('maxlength'));
      }

      if (!fieldValid) {
        input.classList.remove('state-valid');
        input.classList.add('state-invalid');
        const feedback = group.querySelector('.field-text');
        if (feedback) {
          feedback.classList.remove('state-valid');
          feedback.classList.add('state-invalid');
        }
        isValid = false;
      } else {
        input.classList.remove('state-invalid');
        input.classList.add('state-valid');
        const feedback = group.querySelector('.field-text');
        if (feedback) {
          feedback.classList.remove('state-invalid');
          feedback.classList.add('state-valid');
        }
      }
    });

    return isValid;
  }

  /**
   * Clear form
   */
  clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
      form.reset();
      form.querySelectorAll('.input-control, .select-control, textarea').forEach((input) => {
        input.classList.remove('state-valid', 'state-invalid');
      });
      form.querySelectorAll('.field-text').forEach((text) => {
        text.classList.remove('state-valid', 'state-invalid');
      });
    }
  }

  /**
   * Get form data as object
   */
  getFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return {};

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }

  /**
   * ==================== PROGRESS BAR FUNCTIONS ====================
   */

  /**
   * Set progress bar value
   */
  setProgress(elementId, percentage) {
    const progressBar = document.getElementById(elementId);
    if (progressBar) {
      progressBar.style.width = Math.min(Math.max(percentage, 0), 100) + '%';
    }
  }

  /**
   * Animate progress bar
   */
  animateProgress(elementId, from = 0, to = 100, duration = 2000) {
    const progressBar = document.getElementById(elementId);
    if (!progressBar) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = from + ((to - from) * elapsed) / duration;

      if (progress < to) {
        this.setProgress(elementId, progress);
        requestAnimationFrame(animate);
      } else {
        this.setProgress(elementId, to);
      }
    };

    animate();
  }

  /**
   * ==================== CAROUSEL FUNCTIONS ====================
   */

  /**
   * Initialize carousels
   */
  initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach((carousel) => {
      const id = carousel.getAttribute('data-carousel') || carousel.id;
      if (!id) return;

      const items = carousel.querySelectorAll('.carousel-item');
      if (items.length === 0) return;

      const config = {
        interval: parseInt(carousel.getAttribute('data-interval')) || 5000,
        pause: carousel.getAttribute('data-pause') !== 'false',
        wrap: carousel.getAttribute('data-wrap') !== 'false',
      };

      this.carousels.set(id, {
        el: carousel,
        items: Array.from(items),
        current: 0,
        config,
        timer: null,
      });

      this.showCarouselItem(id, 0);

      // Auto-play
      if (config.interval > 0) {
        this.startCarousel(id);
      }

      // Pause on hover
      if (config.pause) {
        carousel.addEventListener('mouseenter', () => this.pauseCarousel(id));
        carousel.addEventListener('mouseleave', () => this.startCarousel(id));
      }
    });
  }

  /**
   * Show specific carousel item
   */
  showCarouselItem(id, index) {
    const carousel = this.carousels.get(id);
    if (!carousel) return;

    const { items, config } = carousel;
    if (index < 0) index = config.wrap ? items.length - 1 : 0;
    if (index >= items.length) index = config.wrap ? 0 : items.length - 1;

    items.forEach((item, i) => {
      item.classList.toggle('active', i === index);
    });

    carousel.current = index;

    // Update indicators
    const indicators = carousel.el.querySelectorAll('.carousel-indicator');
    indicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
    });
  }

  /**
   * Next carousel item
   */
  nextCarousel(id) {
    const carousel = this.carousels.get(id);
    if (carousel) {
      this.showCarouselItem(id, carousel.current + 1);
    }
  }

  /**
   * Previous carousel item
   */
  prevCarousel(id) {
    const carousel = this.carousels.get(id);
    if (carousel) {
      this.showCarouselItem(id, carousel.current - 1);
    }
  }

  /**
   * Start carousel auto-play
   */
  startCarousel(id) {
    const carousel = this.carousels.get(id);
    if (!carousel || carousel.timer) return;
    carousel.timer = setInterval(() => this.nextCarousel(id), carousel.config.interval);
  }

  /**
   * Pause carousel auto-play
   */
  pauseCarousel(id) {
    const carousel = this.carousels.get(id);
    if (carousel && carousel.timer) {
      clearInterval(carousel.timer);
      carousel.timer = null;
    }
  }

  /**
   * ==================== TOOLTIP FUNCTIONS ====================
   */

  /**
   * Initialize tooltips
   */
  initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach((el) => {
      el.addEventListener('mouseenter', (e) => this.showTooltip(e));
      el.addEventListener('mouseleave', () => this.hideAllTooltips());
      el.addEventListener('focus', (e) => this.showTooltip(e));
      el.addEventListener('blur', () => this.hideAllTooltips());
    });
  }

  /**
   * Show tooltip
   */
  showTooltip(event) {
    this.hideAllTooltips();
    const el = event.currentTarget || event.target;
    const text = el.getAttribute('data-tooltip');
    if (!text) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);

    const rect = el.getBoundingClientRect();
    const tipRect = tooltip.getBoundingClientRect();
    tooltip.style.top = (rect.top - tipRect.height - 8) + 'px';
    tooltip.style.left = (rect.left + rect.width / 2 - tipRect.width / 2) + 'px';

    requestAnimationFrame(() => tooltip.classList.add('show'));
    this.tooltips.push(tooltip);
  }

  /**
   * Hide all tooltips
   */
  hideAllTooltips() {
    this.tooltips.forEach((t) => t.remove());
    this.tooltips = [];
  }

  /**
   * ==================== UTILITY FUNCTIONS ====================
   */

  /**
   * Handle close buttons
   */
  handleCloseButtons() {
    document.querySelectorAll('[data-close]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = document.getElementById(btn.getAttribute('data-close'));
        if (target) {
          target.style.display = 'none';
        }
      });
    });
  }

  /**
   * Show spinner
   */
  showSpinner(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      spinner.id = `spinner-${containerId}`;
      container.appendChild(spinner);
    }
  }

  /**
   * Hide spinner
   */
  hideSpinner(containerId) {
    const spinner = document.getElementById(`spinner-${containerId}`);
    if (spinner) {
      spinner.remove();
    }
  }

  /**
   * Debounce function
   */
  debounce(func, delay = 300) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  /**
   * Throttle function
   */
  throttle(func, limit = 300) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  /**
   * Copy text to clipboard
   */
  copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.success('Copied to clipboard!');
      });
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.success('Copied to clipboard!');
    }
  }

  /**
   * Smooth scroll to element
   */
  smoothScroll(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Toggle class on element
   */
  toggleClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.toggle(className);
    }
  }

  /**
   * Add class to element
   */
  addClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add(className);
    }
  }

  /**
   * Remove class from element
   */
  removeClass(elementId, className) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove(className);
    }
  }

  /**
   * Get element by ID with error handling
   */
  getElement(id) {
    return document.getElementById(id);
  }

  /**
   * Query selector with error handling
   */
  query(selector) {
    return document.querySelector(selector);
  }

  /**
   * Query selector all
   */
  queryAll(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Add event listener to all matching elements
   */
  onAll(selector, event, callback) {
    this.queryAll(selector).forEach((element) => {
      element.addEventListener(event, callback);
    });
  }

  /**
   * Utility to check if element is visible
   */
  isVisible(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return false;
    return element.style.display !== 'none' && element.offsetParent !== null;
  }

  /**
   * Toggle visibility
   */
  toggleVisibility(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      if (this.isVisible(elementId)) {
        element.style.display = 'none';
      } else {
        element.style.display = 'block';
      }
    }
  }

  /**
   * ==================== HTTP / FETCH FUNCTIONS ====================
   */

  /**
   * HTTP GET request
   */
  async get(url, options = {}) {
    try {
      const res = await fetch(url, { method: 'GET', ...options });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      this.error(err.message);
      throw err;
    }
  }

  /**
   * HTTP POST request
   */
  async post(url, data = {}, options = {}) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...options.headers },
        body: JSON.stringify(data),
        ...options,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      this.error(err.message);
      throw err;
    }
  }

  /**
   * HTTP PUT request
   */
  async put(url, data = {}, options = {}) {
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...options.headers },
        body: JSON.stringify(data),
        ...options,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      this.error(err.message);
      throw err;
    }
  }

  /**
   * HTTP DELETE request
   */
  async del(url, options = {}) {
    try {
      const res = await fetch(url, { method: 'DELETE', ...options });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      this.error(err.message);
      throw err;
    }
  }

  /**
   * ==================== STORAGE FUNCTIONS ====================
   */

  /**
   * Local Storage wrapper
   */
  storage = {
    get: (key) => {
      try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
    },
    set: (key, value) => {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
    },
    remove: (key) => {
      try { localStorage.removeItem(key); return true; } catch { return false; }
    },
    clear: () => {
      try { localStorage.clear(); return true; } catch { return false; }
    },
  };

  /**
   * Cookie wrapper
   */
  cookie = {
    get: (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? decodeURIComponent(match[2]) : null;
    },
    set: (name, value, days = 7) => {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    },
    remove: (name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    },
  };
}

// Initialize OwnStrap
const OS = new OwnStrap();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = OwnStrap;
}
