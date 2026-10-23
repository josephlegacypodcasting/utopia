// Utopia WellCare — Broker Referral Hub
// Entry point. Loaded as a module from index.html.

import './quiz.js';

/**
 * Endpoint that receives the referral form.
 * Set VITE_GHL_WEBHOOK_URL in .env (see .env.example). When it is empty the
 * form stays in "dry run" mode: it validates and logs the payload, but sends
 * nothing.
 */
const WEBHOOK_URL = import.meta.env.VITE_GHL_WEBHOOK_URL || '';

/**
 * Every key the webhook should always receive, in the order GoHighLevel will
 * see them. Keep this in step with the form fields in index.html — anything
 * listed here is guaranteed to be present, even when left blank.
 */
const PAYLOAD_FIELDS = [
  'broker_name',
  'broker_company',
  'broker_email',
  'group_name',
  'group_size',
  'health_plan',
  'funding_type',
  'renewal_date',
  'renewal_window',
  'notes',
];

/** Briefly show a "Copied" flag next to a copy button. */
function flash(el, ms = 2000) {
  if (!el) return;
  el.style.display = 'inline';
  setTimeout(() => {
    el.style.display = 'none';
  }, ms);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // clipboard API needs a secure context (https or localhost)
    return false;
  }
}

// ============ Email templates (cold / warm / renewal) ============
const emailTabs = [...document.querySelectorAll('.email-tab')];
const emailVariants = [...document.querySelectorAll('.email-variant')];
const emailSubject = document.getElementById('emailSubject');
const emailMailto = document.getElementById('emailMailto');

const activeVariant = () => emailVariants.find((v) => !v.hidden);

/** Keep the subject line and the mailto: link in step with the open tab. */
function syncEmail() {
  const variant = activeVariant();
  if (!variant || !emailSubject || !emailMailto) return;
  const subject = variant.dataset.subject;
  emailSubject.textContent = `Subject: ${subject}`;
  emailMailto.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    variant.innerText.trim()
  )}`;
}

function selectVariant(name) {
  emailVariants.forEach((v) => {
    v.hidden = v.dataset.variant !== name;
  });
  emailTabs.forEach((t) => {
    const on = t.dataset.variant === name;
    t.classList.toggle('is-active', on);
    t.setAttribute('aria-selected', String(on));
  });
  syncEmail();
}

emailTabs.forEach((tab) =>
  tab.addEventListener('click', () => selectVariant(tab.dataset.variant))
);
syncEmail();

document.getElementById('copyEmailBtn')?.addEventListener('click', async () => {
  const variant = activeVariant();
  if (!variant) return;
  const text = `Subject: ${variant.dataset.subject}\n\n${variant.innerText.trim()}`;
  if (await copyToClipboard(text)) {
    flash(document.getElementById('emailCopied'));
  }
});

// ============ Copy the broker talking points ============
document.getElementById('copyPointsBtn')?.addEventListener('click', async () => {
  const points = [...document.querySelectorAll('#talkingPoints li')]
    .map((li) => `• ${li.textContent.trim()}`)
    .join('\n');
  if (await copyToClipboard(points)) {
    flash(document.getElementById('pointsCopied'));
  }
});

// ============ Copy the shareable video link ============
document.getElementById('copyVideoBtn')?.addEventListener('click', async function () {
  const link = this.getAttribute('data-link');
  if (await copyToClipboard(link)) {
    flash(document.getElementById('videoCopied'));
  }
});

// ============ Referral form -> GoHighLevel ============
const form = document.getElementById('referralForm');
const status = document.getElementById('formStatus');

function setStatus(message, state) {
  if (!status) return;
  status.textContent = message;
  status.dataset.state = state; // 'ok' | 'error' | 'pending'
  status.hidden = false;
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  const payload = Object.fromEntries(new FormData(form).entries());

  // Honeypot: only a bot fills a field nobody can see. Drop the submission
  // without sending it, but show the normal success state — telling a bot it
  // failed just teaches it to try again with the field left blank.
  const trap = payload.company_website;
  delete payload.company_website;
  if (trap) {
    console.warn('[referral] honeypot tripped — submission dropped, nothing sent.');
    form.reset();
    setStatus("Thanks — we've got it. We'll follow up with you shortly.", 'ok');
    return;
  }

  // A <select> the broker never touched drops out of FormData entirely: its
  // placeholder <option> is disabled, so nothing gets submitted for it. That
  // would hand GoHighLevel a payload whose shape changes per submission, and
  // GHL builds its field mapping from a single captured sample — a key that
  // is missing from that sample cannot be mapped at all. Pin the shape.
  for (const key of PAYLOAD_FIELDS) {
    if (!(key in payload)) payload[key] = '';
  }

  payload.submitted_at = new Date().toISOString();
  payload.source = 'broker-referral-hub';

  if (!WEBHOOK_URL) {
    console.warn(
      '[referral] VITE_GHL_WEBHOOK_URL is not set — nothing was sent. Payload:',
      payload
    );
    setStatus(
      'Dry run: no endpoint configured yet. The payload was logged to the console.',
      'pending'
    );
    return;
  }

  submitBtn.disabled = true;
  setStatus('Sending your referral…', 'pending');

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    form.reset();
    setStatus("Thanks — we've got it. We'll follow up with you shortly.", 'ok');
  } catch (err) {
    console.error('[referral] submission failed:', err);
    setStatus(
      "Something went wrong sending that. Please email us and we'll pick it up from there.",
      'error'
    );
  } finally {
    submitBtn.disabled = false;
  }
});
