(function () {
  const modal = document.getElementById('case-study-modal');
  if (!modal) return;

  const closeBtn = document.getElementById('case-study-modal-close');
  const nameEl = document.getElementById('case-study-modal-name');
  const form = document.getElementById('case-study-modal-form');
  const emailInput = document.getElementById('case-study-email');
  const statusEl = form.querySelector('[data-status]');
  const submitBtn = form.querySelector('button[type="submit"]');

  let currentCaseStudy = '';
  let lastFocused = null;

  const setStatus = (message, tone = 'info') => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.statusTone = tone;
  };

  const onKeydown = (event) => {
    if (event.key === 'Escape') closeModal();
  };

  function openModal(caseStudyName) {
    currentCaseStudy = caseStudyName;
    nameEl.textContent = caseStudyName;
    form.reset();
    setStatus('', 'info');
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeydown);
    emailInput.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  document.querySelectorAll('.case-study-detail-btn').forEach((btn) => {
    btn.addEventListener('click', () => openModal(btn.dataset.caseStudy || 'this project'));
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    initEmailjsOnce();

    if (!isEmailjsConfigured || !window.emailjs) {
      setStatus('This isn\'t configured yet. Please email me directly.', 'error');
      return;
    }

    const email = emailInput.value.trim();
    const templateParams = {
      from_name: email,
      from_email: email,
      to_name: 'Jigar',
      to_email: 'workwithjigar@gmail.com',
      message: `Requested the full case study for "${currentCaseStudy}". Reply to: ${email}`,
    };

    try {
      setStatus('Sending…', 'info');
      submitBtn.disabled = true;

      await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_ADMIN_TEMPLATE_ID, templateParams);

      setStatus('Thanks! I\'ll send the full case study to your inbox shortly.', 'success');
      form.reset();
    } catch (error) {
      console.error('Case study request failed', error);
      setStatus('Something went wrong. Please try again or email me directly.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
