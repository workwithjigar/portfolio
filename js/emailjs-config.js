/**
 * Shared EmailJS setup (https://dashboard.emailjs.com), used by the contact form
 * and the "Detail Case Study" popup.
 * 1. Account > General            -> copy the Public Key into EMAILJS_PUBLIC_KEY below.
 * 2. Email Services > Add service -> copy the Service ID into EMAILJS_SERVICE_ID below.
 * 3. Create TWO email templates:
 *      a) Admin notification template -> its "To Email" field should be
 *         workwithjigar@gmail.com (hardcoded in the template settings, not a variable).
 *         Body can use: {{from_name}}, {{from_email}}, {{message}}.
 *         Copy its Template ID into EMAILJS_ADMIN_TEMPLATE_ID.
 *      b) Auto-reply template -> its "To Email" field should be the dynamic
 *         variable {{to_email}} so it goes back to whoever submitted the form.
 *         Body can use: {{to_name}}, {{to_email}}, {{message}}.
 *         Copy its Template ID into EMAILJS_AUTOREPLY_TEMPLATE_ID.
 * 4. Replace the four placeholder strings below with the real values.
 *    Both the contact form and the case-study popup use the same values.
 */
const EMAILJS_PUBLIC_KEY = 'IH4oUZ5ii80Mm17Wx';
const EMAILJS_SERVICE_ID = 'service_2dlmlnq';
const EMAILJS_ADMIN_TEMPLATE_ID = 'template_sf367av';
const EMAILJS_AUTOREPLY_TEMPLATE_ID = 'template_j6zwgku';

const isEmailjsConfigured = [
  EMAILJS_PUBLIC_KEY,
  EMAILJS_SERVICE_ID,
  EMAILJS_ADMIN_TEMPLATE_ID,
  EMAILJS_AUTOREPLY_TEMPLATE_ID,
].every((value) => value && !value.startsWith('YOUR_'));

function initEmailjsOnce() {
  if (isEmailjsConfigured && window.emailjs && !window.__emailjsInitialized) {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    window.__emailjsInitialized = true;
  }
}

initEmailjsOnce();
