const contactForm = document.querySelector('.contact-form');

if (contactForm) {
  const statusEl = contactForm.querySelector('[data-status]');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  const setStatus = (message, tone = 'info') => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.dataset.statusTone = tone;
  };

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    initEmailjsOnce();

    if (!isEmailjsConfigured || !window.emailjs) {
      setStatus('Form is not configured yet. Please email me directly.', 'error');
      return;
    }

    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    const templateParams = {
      from_name: name,
      from_email: email,
      to_name: name,
      to_email: email,
      message,
    };

    try {
      setStatus('Sending your message…', 'info');
      if (submitBtn) submitBtn.disabled = true;

      await Promise.all([
        window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_ADMIN_TEMPLATE_ID, templateParams),
        window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, templateParams),
      ]);

      setStatus('Thanks! I will reach out within 24 hours.', 'success');
      contactForm.reset();
    } catch (error) {
      console.error('Contact form submission failed', error);
      setStatus('Something went wrong. Please try again or email me directly.', 'error');
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });
}
