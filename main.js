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

  // 5. Interactive Role Chips & Profile Hover/Tap Cards
  const ROLE_PROFILES = {
    'full-stack': {
      title: 'Full-Stack Engineers',
      experience: '5–6 Years',
      description: 'Experienced engineers skilled in building scalable, end-to-end web applications with modern frontend and backend technologies.',
      expertise: ['React', 'Next.js', 'Node.js', 'TypeScript', 'REST APIs', 'PostgreSQL']
    },
    'cloud-architects': {
      title: 'Cloud Architects',
      experience: '5–6 Years',
      description: 'Cloud professionals who design secure, scalable, and cost-efficient cloud infrastructure for growing businesses.',
      expertise: ['AWS', 'Azure', 'GCP', 'Cloud Architecture', 'Infrastructure as Code']
    },
    'devops': {
      title: 'DevOps Engineers',
      experience: '5–6 Years',
      description: 'Engineers focused on automating deployment pipelines, improving infrastructure reliability, and streamlining development workflows.',
      expertise: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'AWS', 'Monitoring']
    },
    'data-scientists': {
      title: 'Data Scientists',
      experience: '5–6 Years',
      description: 'Data professionals who transform complex datasets into meaningful insights and predictive solutions.',
      expertise: ['Python', 'SQL', 'Machine Learning', 'Data Analysis', 'Statistical Modeling']
    },
    'cybersecurity': {
      title: 'Cybersecurity Leads',
      experience: '5–6 Years',
      description: 'Security professionals responsible for protecting systems, managing security risks, and strengthening organizational security posture.',
      expertise: ['Security Audits', 'Threat Detection', 'SIEM', 'Vulnerability Management', 'Risk Assessment']
    },
    'ai-ml': {
      title: 'AI / ML Specialists',
      experience: '5–6 Years',
      description: 'AI professionals who develop intelligent applications, machine learning models, and practical automation solutions.',
      expertise: ['Python', 'Machine Learning', 'LLMs', 'AI APIs', 'Model Deployment', 'RAG']
    },
    'scrum-masters': {
      title: 'Agile Scrum Masters',
      experience: '5–6 Years',
      description: 'Experienced facilitators who help teams deliver projects efficiently through Agile practices and continuous improvement.',
      expertise: ['Scrum', 'Sprint Planning', 'Jira', 'Agile Coaching', 'Team Facilitation']
    },
    'ui-ux': {
      title: 'UI / UX Engineers',
      experience: '5–6 Years',
      description: 'Design-focused engineers who create intuitive, accessible, and visually engaging digital experiences.',
      expertise: ['Figma', 'React', 'UI Design', 'UX Research', 'Accessibility', 'Design Systems']
    },
    'business-analysts': {
      title: 'Business Systems Analysts',
      experience: '5–6 Years',
      description: 'Analysts who bridge business requirements and technical teams to deliver effective software and process solutions.',
      expertise: ['Requirement Analysis', 'Process Mapping', 'Documentation', 'SQL', 'Stakeholder Management']
    }
  };

  const chipsContainer = document.querySelector('.chips');
  const chips = Array.from(document.querySelectorAll('.chips .role-chip'));
  const roleCard = document.getElementById('roleProfileCard');

  if (chipsContainer && chips.length > 0 && roleCard) {
    const cardTitle = document.getElementById('roleCardTitle');
    const cardExp = document.getElementById('roleCardExp');
    const cardDesc = document.getElementById('roleCardDesc');
    const cardTags = document.getElementById('roleCardTags');
    const cardClose = roleCard.querySelector('.role-card-close');
    const headerEl = document.querySelector('header');

    let activeChip = null;
    let pinnedChip = null;
    let hideTimer = null;
    let rafId = null;
    let lastInputWasKeyboard = false;
    let lastPointerType = 'mouse';

    document.addEventListener('keydown', () => {
      lastInputWasKeyboard = true;
    }, true);

    document.addEventListener('pointerdown', (e) => {
      lastInputWasKeyboard = false;
      lastPointerType = e.pointerType || 'mouse';
    }, true);

    function setSelectedChip(targetChip) {
      chips.forEach(c => c.classList.remove('selected'));
      targetChip.classList.add('selected');
    }

    function populateRoleCard(profile) {
      if (cardTitle) cardTitle.textContent = profile.title;
      if (cardExp) cardExp.textContent = profile.experience;
      if (cardDesc) cardDesc.textContent = profile.description;
      if (cardTags) {
        cardTags.textContent = '';
        profile.expertise.forEach(skill => {
          const tag = document.createElement('span');
          tag.className = 'role-card-tag';
          tag.textContent = skill;
          cardTags.appendChild(tag);
        });
      }
    }

    function positionRoleCard(chip) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 12;
      const gap = 12;
      const headerBottom = headerEl ? Math.max(0, headerEl.getBoundingClientRect().bottom) : 0;
      const safeTop = Math.max(margin, headerBottom + 8);

      const cardW = roleCard.offsetWidth || Math.min(344, vw - margin * 2);
      const cardH = roleCard.offsetHeight || 220;

      const chipRect = chip.getBoundingClientRect();
      const chipCenterX = chipRect.left + chipRect.width / 2;

      let left = chipCenterX - cardW / 2;
      left = Math.max(margin, Math.min(left, vw - cardW - margin));

      const spaceAbove = chipRect.top - safeTop - gap;
      const spaceBelow = vh - margin - (chipRect.bottom + gap);

      let placement = 'top';
      let top;

      if (spaceAbove >= cardH) {
        placement = 'top';
        top = chipRect.top - gap - cardH;
      } else if (spaceBelow >= cardH) {
        placement = 'bottom';
        top = chipRect.bottom + gap;
      } else if (spaceBelow >= spaceAbove) {
        placement = 'bottom';
        top = Math.min(chipRect.bottom + gap, vh - cardH - margin);
      } else {
        placement = 'top';
        top = Math.max(safeTop, chipRect.top - gap - cardH);
      }

      top = Math.max(margin, Math.min(top, vh - cardH - margin));
      const arrowX = Math.max(22, Math.min(chipCenterX - left, cardW - 22));

      roleCard.style.left = `${Math.round(left)}px`;
      roleCard.style.top = `${Math.round(top)}px`;
      roleCard.style.setProperty('--arrow-x', `${Math.round(arrowX)}px`);
      roleCard.setAttribute('data-placement', placement);
    }

    function showRoleCard(chip, { pinned = false } = {}) {
      const roleKey = chip.getAttribute('data-role');
      const profile = ROLE_PROFILES[roleKey];
      if (!profile) return;

      clearTimeout(hideTimer);

      if (activeChip && activeChip !== chip) {
        activeChip.setAttribute('aria-expanded', 'false');
        activeChip.removeAttribute('aria-describedby');
      }

      activeChip = chip;
      pinnedChip = pinned ? chip : null;

      populateRoleCard(profile);
      roleCard.classList.toggle('is-pinned', Boolean(pinnedChip));
      positionRoleCard(chip);

      chip.setAttribute('aria-expanded', 'true');
      chip.setAttribute('aria-describedby', 'roleProfileCard');
      roleCard.setAttribute('aria-hidden', 'false');
      roleCard.classList.add('is-visible');
    }

    function hideRoleCard({ restoreFocus = false } = {}) {
      clearTimeout(hideTimer);
      const prevChip = activeChip;
      activeChip = null;
      pinnedChip = null;

      roleCard.classList.remove('is-visible', 'is-pinned');
      roleCard.setAttribute('aria-hidden', 'true');

      chips.forEach(c => {
        c.setAttribute('aria-expanded', 'false');
        c.removeAttribute('aria-describedby');
      });

      if (restoreFocus && prevChip) {
        prevChip.focus();
      }
    }

    function scheduleReposition() {
      if (!activeChip || !roleCard.classList.contains('is-visible')) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!activeChip) return;
        const rect = activeChip.getBoundingClientRect();
        const headerBottom = headerEl ? Math.max(0, headerEl.getBoundingClientRect().bottom) : 0;
        if (rect.bottom <= headerBottom || rect.top >= window.innerHeight) {
          hideRoleCard();
          return;
        }
        positionRoleCard(activeChip);
      });
    }

    chips.forEach((chip, index) => {
      chip.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'touch') return;
        clearTimeout(hideTimer);
        showRoleCard(chip, { pinned: false });
      });

      chip.addEventListener('pointerleave', (e) => {
        if (e.pointerType === 'touch') return;
        if (pinnedChip === chip) return;
        hideTimer = setTimeout(() => {
          if (!pinnedChip) hideRoleCard();
        }, 75);
      });

      chip.addEventListener('focusin', () => {
        if (!lastInputWasKeyboard) return;
        clearTimeout(hideTimer);
        showRoleCard(chip, { pinned: pinnedChip === chip });
      });

      chip.addEventListener('click', (e) => {
        const isKeyboardClick = e.detail === 0;
        const isTouchLike = lastPointerType === 'touch' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

        setSelectedChip(chip);

        if (isTouchLike || isKeyboardClick) {
          if (pinnedChip === chip && roleCard.classList.contains('is-visible')) {
            hideRoleCard();
          } else {
            showRoleCard(chip, { pinned: true });
          }
        } else {
          showRoleCard(chip, { pinned: false });
        }
      });

      chip.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (roleCard.classList.contains('is-visible')) {
            e.preventDefault();
            hideRoleCard();
          }
          return;
        }

        let nextIndex = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          nextIndex = (index + 1) % chips.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          nextIndex = (index - 1 + chips.length) % chips.length;
        } else if (e.key === 'Home') {
          nextIndex = 0;
        } else if (e.key === 'End') {
          nextIndex = chips.length - 1;
        }

        if (nextIndex !== null) {
          e.preventDefault();
          lastInputWasKeyboard = true;
          chips[nextIndex].focus();
        }
      });
    });

    chipsContainer.addEventListener('focusout', (e) => {
      const nextFocused = e.relatedTarget;
      if (nextFocused && (chipsContainer.contains(nextFocused) || roleCard.contains(nextFocused))) {
        return;
      }
      if (nextFocused || !pinnedChip) {
        hideRoleCard();
      }
    });

    if (cardClose) {
      cardClose.addEventListener('click', (e) => {
        e.stopPropagation();
        hideRoleCard({ restoreFocus: lastInputWasKeyboard });
      });
    }

    document.addEventListener('click', (e) => {
      if (!roleCard.classList.contains('is-visible')) return;
      if (!e.target.closest('.role-chip') && !roleCard.contains(e.target)) {
        hideRoleCard();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && roleCard.classList.contains('is-visible')) {
        hideRoleCard({ restoreFocus: lastInputWasKeyboard });
      }
    });

    window.addEventListener('scroll', scheduleReposition, { passive: true });
    window.addEventListener('resize', scheduleReposition, { passive: true });
  }
});
