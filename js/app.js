const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const THEME_STORAGE_KEY = 'jp-theme';

const applyTheme = (theme) => {
  root.setAttribute('data-theme', theme);
  themeToggle?.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
};

const resolveInitialTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
  } catch (error) {
    // storage might be unavailable
  }
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19 ? 'light' : 'dark';
};

let activeTheme = resolveInitialTheme();
applyTheme(activeTheme);

themeToggle?.addEventListener('click', () => {
  activeTheme = activeTheme === 'dark' ? 'light' : 'dark';
  applyTheme(activeTheme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, activeTheme);
  } catch (error) {
    // ignore write errors
  }
});

const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('open');
});

navMenu?.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  })
);

const revealTargets = new Set([
  ...document.querySelectorAll('[data-reveal]'),
  ...document.querySelectorAll('.reveal'),
]);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: '0px 0px -80px 0px',
  }
);

revealTargets.forEach((node) => {
  const delay = node.dataset.delay ? Number.parseFloat(node.dataset.delay) : null;
  if (!Number.isNaN(delay) && delay !== null) {
    node.style.transitionDelay = `${delay}s`;
  }
  revealObserver.observe(node);
});

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

if (!prefersReducedMotion && hasFinePointer) {
  const tiltTargets = document.querySelectorAll('[data-tilt]');

  const handleTilt = (event) => {
    const target = event.currentTarget;
    const bounds = target.getBoundingClientRect();
    const tiltStrength = Number.parseFloat(target.dataset.tiltStrength || '8');
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const rotateX = ((y / bounds.height) - 0.5) * -tiltStrength;
    const rotateY = ((x / bounds.width) - 0.5) * tiltStrength;

    target.style.setProperty('--tiltX', `${rotateX.toFixed(2)}deg`);
    target.style.setProperty('--tiltY', `${rotateY.toFixed(2)}deg`);
  };

  const resetTilt = (event) => {
    const target = event.currentTarget;
    target.style.setProperty('--tiltX', '0deg');
    target.style.setProperty('--tiltY', '0deg');
  };

  tiltTargets.forEach((target) => {
    target.addEventListener('pointermove', handleTilt);
    target.addEventListener('pointerleave', resetTilt);
  });
}

(function initConstellation() {
  const canvas = document.getElementById('constellation');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  const particleCount = Math.min(140, Math.floor(width / 10));
  const particles = [];

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = initial ? Math.random() * width : Math.random() < 0.5 ? 0 : width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.6 + 0.2;
      this.alpha = Math.random() * 0.6 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -50 || this.x > width + 50 || this.y < -50 || this.y > height + 50) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(127, 92, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i += 1) {
    particles.push(new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distSq = dx * dx + dy * dy;
        const threshold = 150;

        if (distSq < threshold * threshold) {
          const opacity = 1 - distSq / (threshold * threshold);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(39, 242, 255, ${opacity * 0.28})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  if (prefersReducedMotion) {
    particles.forEach((particle) => particle.draw());
    drawLines();
    return;
  }

  function animate() {
    if (prefersReducedMotion) return;

    ctx.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
    drawLines();
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
})();

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  const statusEl = contactForm.querySelector('[data-status]');
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const scriptUrl = contactForm.dataset.scriptUrl?.trim();

  const setStatus = (message, tone = 'info') => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.statusTone = tone;
  };

  if (!scriptUrl) {
    console.warn('Contact form Google Script URL is not configured.');
  }

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    if (!scriptUrl) {
      setStatus('Form is not configured yet. Please email me directly.', 'error');
      return;
    }

    const formData = new FormData(contactForm);

    try {
      setStatus('Sending your message…', 'info');
      if (submitBtn) {
        submitBtn.disabled = true;
      }

      const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      let parsed;
      let rawText = '';

      try {
        parsed = await response.clone().json();
      } catch (jsonError) {
        rawText = await response.text();
      }

      const reportedResult = parsed?.result ?? parsed?.status;
      const normalizedResult =
        typeof reportedResult === 'string' ? reportedResult.trim().toLowerCase() : '';
      const textSuggestsSuccess = rawText.toLowerCase().includes('success');

      if (normalizedResult && !['success', 'ok', 'done'].includes(normalizedResult)) {
        throw new Error('Script reported a failure.');
      }

      if (!normalizedResult && rawText && !textSuggestsSuccess) {
        console.warn('Unexpected response from contact form script:', rawText);
      }

      setStatus('Thanks! I will reach out within 24 hours.', 'success');
      contactForm.reset();
    } catch (error) {
      console.error('Contact form submission failed', error);
      const message = String(error?.message || '').toLowerCase();
      const isLikelyCors =
        error instanceof TypeError || message.includes('fetch') || message.includes('cors');

      if (isLikelyCors) {
        setStatus('Thanks! I received your details — I will reply within 24 hours.', 'success');
        contactForm.reset();
      } else {
        setStatus('Something went wrong. Please try again or email me directly.', 'error');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  });
}
