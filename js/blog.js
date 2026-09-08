// Reading progress bar
const progressBar = document.getElementById('reading-progress');

if (progressBar) {
  const updateProgress = () => {
    const article = document.getElementById('post-content');
    if (!article) return;
    const start = article.offsetTop;
    const total = article.offsetHeight - window.innerHeight * 0.6;
    const scrolled = window.scrollY - start + window.innerHeight * 0.2;
    const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
    progressBar.style.width = `${pct}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

// Table of contents: build from headings + scroll-spy active state
const tocList = document.getElementById('post-toc-list');
const content = document.getElementById('post-content');

if (tocList && content) {
  const headings = content.querySelectorAll('h2, h3');
  const tocLinks = [];

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `section-${index}`;
    }
    const li = document.createElement('li');
    if (heading.tagName === 'H3') {
      li.style.paddingLeft = '0.9rem';
    }
    const a = document.createElement('a');
    a.href = `#${heading.id}`;
    a.textContent = heading.textContent;
    li.appendChild(a);
    tocList.appendChild(li);
    tocLinks.push(a);
  });

  if (headings.length) {
    const setActive = () => {
      const threshold = 130;
      let current = headings[0];

      headings.forEach((heading) => {
        if (heading.getBoundingClientRect().top - threshold <= 0) {
          current = heading;
        }
      });

      tocLinks.forEach((a) => a.classList.remove('is-active'));
      const link = tocLinks.find((a) => a.getAttribute('href') === `#${current.id}`);
      link?.classList.add('is-active');
    };

    window.addEventListener('scroll', setActive, { passive: true });
    window.addEventListener('resize', setActive);
    setActive();
  }
}

// Share actions
const shareUrl = window.location.href;
const shareTitle = document.title;

document.querySelectorAll('[data-share]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.share;

    if (type === 'copy') {
      navigator.clipboard?.writeText(shareUrl).then(() => {
        const tooltip = btn.querySelector('[data-copy-tooltip]');
        if (!tooltip) return;
        tooltip.classList.add('is-visible');
        clearTimeout(tooltip._hideTimer);
        tooltip._hideTimer = setTimeout(() => tooltip.classList.remove('is-visible'), 1600);
      });
      return;
    }

    const shareLinks = {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    if (shareLinks[type]) {
      window.open(shareLinks[type], '_blank', 'noopener,width=600,height=600');
    }
  });
});
