/**
 * Hiring Dreams - Main Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year in Footers
  const yearEls = document.querySelectorAll('.current-year');
  const thisYear = new Date().getFullYear();
  yearEls.forEach(el => { el.textContent = thisYear; });

  // 2. Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('open');
      document.body.classList.toggle('nav-open', !expanded);
    });

    // Close menu when clicking outside or pressing Escape
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
  }

  // 3. Theme Toggle (Light / Dark)
  const themeToggles = document.querySelectorAll('.theme-toggle');
  const storedTheme = localStorage.getItem('hd_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hd_theme', theme);
    themeToggles.forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      const icon = btn.querySelector('.theme-icon');
      if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      }
    });
  }

  applyTheme(initialTheme);

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  // 4. Interactive Contact & Application Form
  const contactForm = document.getElementById('contactForm');
  const audienceTabs = document.querySelectorAll('.audience-tab');
  const employerFields = document.querySelectorAll('.employer-only');
  const candidateFields = document.querySelectorAll('.candidate-only');
  const userTypeInput = document.getElementById('userType');
  const formSuccess = document.getElementById('formSuccess');

  if (audienceTabs.length > 0) {
    audienceTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        audienceTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const role = tab.getAttribute('data-role');
        if (userTypeInput) userTypeInput.value = role;

        if (role === 'candidate') {
          employerFields.forEach(f => f.style.display = 'none');
          candidateFields.forEach(f => f.style.display = 'block');
        } else {
          employerFields.forEach(f => f.style.display = 'block');
          candidateFields.forEach(f => f.style.display = 'none');
        }
      });
    });

    // Check URL parameters (e.g. ?type=job or ?type=hire)
    const urlParams = new URLSearchParams(window.location.search);
    const reqType = urlParams.get('type');
    if (reqType) {
      const targetRole = (reqType === 'job' || reqType === 'candidate') ? 'candidate' : 'employer';
      const targetTab = document.querySelector(`.audience-tab[data-role="${targetRole}"]`);
      if (targetTab) targetTab.click();
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Send';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting...';
      }

      // Smooth simulated feedback
      setTimeout(() => {
        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.style.display = 'block';
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 650);
    });
  }

  // 5. Interactive Role Chips (Filter highlight or smooth scroll)
  const chips = document.querySelectorAll('.chips span');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    });
  });
});
