/**
 * PNR Clean Room Technologies
 * Theme Initialization and UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==== Theme Toggle Logic ====
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Check for saved theme or fall back to user's system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    htmlElement.setAttribute('data-theme', 'dark');
  }

  // Toggle theme on click
  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'dark') {
      htmlElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  });

  // ==== Header Scroll Effect ====
  const header = document.querySelector('.header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==== Scroll Reveal Animation ====
  const revealElements = document.querySelectorAll('.reveal-elem, .hero-reveal');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });

  // ==== Stats Count Up Animation ====
  const statsElements = document.querySelectorAll('.stat-value');
  let animationTriggered = false;

  const animateStats = () => {
    if (animationTriggered) return;
    animationTriggered = true;

    statsElements.forEach(stat => {
      const targetText = stat.innerText;
      // Extract number part and any prefix/suffix
      const match = targetText.match(/([^\d]*)([\d,]+)([^\d]*)/);
      if (!match) return;

      const prefix = match[1] || '';
      let targetNumberStr = match[2].replace(/,/g, '');
      const suffix = match[3] || '';
      const isFloat = targetNumberStr.includes('.');
      const targetNumber = isFloat ? parseFloat(targetNumberStr) : parseInt(targetNumberStr, 10);

      if (isNaN(targetNumber)) return;

      const duration = 2000; // 2 seconds
      const frameRate = 30; // 30 frames per second roughly
      const totalFrames = Math.round(duration / (1000 / frameRate));
      const increment = targetNumber / totalFrames;
      let currentNumber = 0;
      let frame = 0;

      const timer = setInterval(() => {
        frame++;
        currentNumber += increment;

        let displayValue = '';
        if (frame >= totalFrames || currentNumber >= targetNumber) {
          clearInterval(timer);
          currentNumber = targetNumber;
        }

        if (isFloat) {
          // preserve decimal places from original if possible, default to 1
          const decimals = targetNumberStr.split('.')[1]?.length || 1;
          displayValue = currentNumber.toFixed(decimals);
        } else {
          displayValue = Math.round(currentNumber).toString();
        }

        stat.innerText = `${prefix}${displayValue}${suffix}`;
      }, 1000 / frameRate);
    });
  };

  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateStats();
        statsObserver.unobserve(statsSection);
      }
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
  }

  // ==== Global Particles Animation ====
  const particlesContainer = document.getElementById('particles-container');
  if (particlesContainer) {
    const particleCount = 65; // Increased for global coverage
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const left = Math.random() * 100;
      const width = Math.random() * 5 + 2; // Making particles larger (2px to 7px)
      const duration = Math.random() * 15 + 15; // Original slow float up (15–30s)
      const delay = -(Math.random() * duration); // Negative delay = start mid-animation immediately
      const maxOpacity = Math.random() * 0.3 + 0.1; // Gentle opacity

      particle.style.left = `${left}%`;
      particle.style.width = `${width}px`;
      particle.style.height = `${width}px`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.setProperty('--duration', `${duration}s`);
      particle.style.setProperty('--max-opacity', maxOpacity);
      particle.style.setProperty('--width', `${width}px`);

      // We'll set the color dynamically inside CSS based on a data attribute or theme
      const colorTypeIndex = Math.floor(Math.random() * 3);
      particle.setAttribute('data-color-type', colorTypeIndex);
      // Removed inline static colors so CSS can handle theme toggling

      particlesContainer.appendChild(particle);
    }
  }

  // ==== Smooth Scrolling for anchor links ====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // ==== Mobile Hamburger Menu ====
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });

    // Close menu when a link is tapped
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        mobileNav.classList.remove('open');
      });
    });
  }


  // ==== Network-Aware Image Loading ====
  // Runs before lazy images load â€” overrides srcset on slow connections
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const effectiveType = conn ? conn.effectiveType : null;
  const saveData = conn ? conn.saveData : false;

  if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
    // Very slow / data-saver: strip srcset, serve 800w only
    document.querySelectorAll('.gallery-item img[srcset]').forEach(img => {
      img.srcset = img.srcset.split(',').find(s => s.includes('_800w')) || img.srcset;
    });
  } else if (effectiveType === '3g') {
    // Moderate: cap at 1200w, remove 2000w from options
    document.querySelectorAll('.gallery-item img[srcset]').forEach(img => {
      img.srcset = img.srcset.split(',').filter(s => !s.includes('2000w')).join(',');
    });
  }
  // 4g / WiFi / unknown: leave srcset unchanged, browser picks full quality

  // ==== Reviews Drag-to-Scroll ====
  const reviewsMarquee = document.querySelector('.reviews-marquee');
  const reviewsTrack = document.querySelector('.reviews-track');
  if (reviewsMarquee && reviewsTrack) {
    const DURATION = 40;
    let isDown = false, startX = 0, currentX = 0, animationOffset = 0;
    const getTranslateX = () => new DOMMatrix(window.getComputedStyle(reviewsTrack).transform).m41;
    const startDrag = (x) => {
      isDown = true; startX = x;
      animationOffset = getTranslateX();
      reviewsTrack.style.animationPlayState = 'paused';
      reviewsTrack.style.transform = 'translateX(' + animationOffset + 'px)';
      reviewsMarquee.style.cursor = 'grabbing';
    };
    const moveDrag = (x) => {
      if (!isDown) return;
      currentX = animationOffset + (x - startX);
      reviewsTrack.style.transform = 'translateX(' + currentX + 'px)';
    };
    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      reviewsMarquee.style.cursor = 'grab';
      const halfWidth = reviewsTrack.scrollWidth / 2;
      let norm = currentX % halfWidth;
      if (norm > 0) norm -= halfWidth;
      const delay = -(Math.abs(norm) / halfWidth) * DURATION;
      reviewsTrack.style.transform = '';
      reviewsTrack.style.animationDelay = delay + 's';
      reviewsTrack.style.animationPlayState = 'running';
    };
    reviewsMarquee.addEventListener('mousedown', (e) => { e.preventDefault(); startDrag(e.pageX); });
    window.addEventListener('mousemove', (e) => moveDrag(e.pageX));
    window.addEventListener('mouseup', endDrag);
    reviewsMarquee.addEventListener('touchstart', (e) => startDrag(e.touches[0].pageX), { passive: true });
    reviewsMarquee.addEventListener('touchmove', (e) => { moveDrag(e.touches[0].pageX); e.preventDefault(); }, { passive: false });
    reviewsMarquee.addEventListener('touchend', endDrag);
    reviewsMarquee.style.cursor = 'grab';
  }

  // ==== Active Nav Highlighting on Scroll ====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observerOptions = {
    threshold: 0.2, // Lower threshold so larger sections trigger earlier
    rootMargin: '-10% 0px -40% 0px' // Tighter margin for more precise highlighting
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
});