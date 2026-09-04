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
    navToggle?.setAttribute('aria-expanded', 'false');
  })
);

document.addEventListener('click', (event) => {
  if (!navMenu || !navMenu.classList.contains('open')) return;
  if (navMenu.contains(event.target) || navToggle?.contains(event.target)) return;
  navMenu.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
});

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

// Split hero headline into per-word spans so GSAP can stagger them in.
// Skipped entirely under reduced motion, in which case the plain text stays untouched.
document.querySelectorAll('[data-split]').forEach((el) => {
  if (reduceMotionQuery.matches) return;
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words.map((word) => `<span class="split-word">${word}</span>`).join(' ');
});

const hasGsap = typeof window.gsap !== 'undefined';

if (hasGsap) {
  if (window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  const mm = gsap.matchMedia();

  mm.add(
    {
      reduceMotion: '(prefers-reduced-motion: reduce)',
      fullMotion: '(prefers-reduced-motion: no-preference)',
    },
    (context) => {
      const { reduceMotion } = context.conditions;

      gsap.utils.toArray('[data-reveal]').forEach((el) => {
        const delay = Number.parseFloat(el.dataset.delay || '0') || 0;

        if (reduceMotion) {
          gsap.set(el, { opacity: 1, y: 0 });
          return;
        }

        gsap.from(el, {
          opacity: 0,
          y: 22,
          duration: 0.6,
          delay,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        });
      });

      const splitWords = document.querySelectorAll('.split-word');
      if (splitWords.length) {
        if (reduceMotion) {
          gsap.set(splitWords, { opacity: 1, y: 0 });
        } else {
          gsap.from(splitWords, {
            opacity: 0,
            y: 16,
            rotateX: -25,
            duration: 0.55,
            stagger: 0.035,
            ease: 'power3.out',
            delay: 0.1,
          });
        }
      }

      if (!reduceMotion) {
        const hoverCards = gsap.utils.toArray(
          '.service-card, .project-card, .info-card, .skill-card, .process-card, .contact-info-card, .hero-card'
        );

        const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

        hoverCards.forEach((card) => {
          gsap.set(card, { transformPerspective: 700 });
          const liftTo = gsap.quickTo(card, 'y', { duration: 0.35, ease: 'power2.out' });

          if (hasFinePointer) {
            card.addEventListener('pointermove', (event) => {
              const bounds = card.getBoundingClientRect();
              const px = (event.clientX - bounds.left) / bounds.width - 0.5;
              const py = (event.clientY - bounds.top) / bounds.height - 0.5;
              gsap.to(card, {
                rotationY: px * 9,
                rotationX: py * -9,
                duration: 0.45,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            });
          }

          card.addEventListener('pointerenter', () => liftTo(-6));
          card.addEventListener('pointerleave', () => {
            liftTo(0);
            gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
          });
        });
      }
    }
  );
} else {
  // GSAP failed to load (e.g. CDN blocked) — reveal everything immediately, no motion.
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    el.style.opacity = '1';
  });
}
