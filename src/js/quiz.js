// "Is your client a fit?" — the qualifier the hero CTA promises.
// Answers never leave the browser; they only prefill the referral form.

/**
 * CONTENT TODO (Utopia): these are the real qualifying criteria and they are
 * deliberately EMPTY right now. While a list is empty nothing is excluded, so
 * every group comes back as a fit — the safe default. It is far cheaper to
 * talk to a group that turns out not to qualify than to turn away one that
 * did. Fill these in once the actual thresholds exist.
 *
 * Nothing here ever produces a hard "no": a broker who gets rejected by a
 * quiz closes the tab. The worst verdict is "let's talk".
 */
const FIT_RULES = {
  belowMinimumSizes: [], // e.g. ['Under 150'] if there is a minimum group size
  unsupportedFunding: [], // e.g. ['Self-insured'] if funding type matters
  unsupportedCarriers: [], // e.g. [] if carrier never disqualifies
  priorityRenewal: ['Within 3 months', '3-6 months'],
};

const card = document.getElementById('quizCard');
if (card) {
  const steps = [...card.querySelectorAll('.quiz-step')];
  const bar = document.getElementById('quizBar');
  const back = document.getElementById('quizBack');
  const result = document.getElementById('quizResult');
  const verdictEl = document.getElementById('quizVerdict');
  const reasonEl = document.getElementById('quizReason');
  const recapEl = document.getElementById('quizRecap');
  const restart = document.getElementById('quizRestart');
  const toForm = document.getElementById('quizToForm');

  const answers = {};
  let current = 0;

  const LABELS = {
    group_size: 'Size',
    health_plan: 'Carrier',
    funding_type: 'Funding',
    renewal_window: 'Renewal',
  };

  function render() {
    steps.forEach((s, i) => {
      s.hidden = i !== current;
    });
    const done = current >= steps.length;
    result.hidden = !done;
    back.hidden = current === 0 || done;
    bar.style.width = `${Math.round(((done ? steps.length : current) / steps.length) * 100)}%`;
  }

  /** Decide the verdict. Never returns a hard no — see FIT_RULES. */
  function evaluate() {
    const flags = [];
    if (FIT_RULES.belowMinimumSizes.includes(answers.group_size)) {
      flags.push('the group is smaller than the size we usually start with');
    }
    if (FIT_RULES.unsupportedFunding.includes(answers.funding_type)) {
      flags.push('that funding type needs a closer look');
    }
    if (FIT_RULES.unsupportedCarriers.includes(answers.health_plan)) {
      flags.push('that carrier needs a closer look');
    }

    if (flags.length) {
      return {
        verdict: "Let's talk it through.",
        reason: `Worth a conversation — ${flags.join(', and ')}. Send it over anyway: we'll check the specific plan and come back to you either way, and we won't contact your client in the meantime.`,
      };
    }

    if (FIT_RULES.priorityRenewal.includes(answers.renewal_window)) {
      return {
        verdict: 'Strong fit — and the timing is right.',
        reason:
          "This group looks like a fit, and with renewal close you have a natural reason to raise it. Refer them and we'll confirm coverage on their specific plan within one business day.",
      };
    }

    return {
      verdict: 'Looks like a fit.',
      reason:
        "Nothing here rules this group out. Refer them and we'll verify the benefit on their specific plan, then come back to you first with what we found.",
    };
  }

  function finish() {
    const { verdict, reason } = evaluate();
    verdictEl.textContent = verdict;
    reasonEl.textContent = reason;

    recapEl.innerHTML = '';
    for (const [field, value] of Object.entries(answers)) {
      const li = document.createElement('li');
      li.textContent = `${LABELS[field]}: ${value}`;
      recapEl.appendChild(li);
    }

    prefillForm();
    render();
  }

  /** Carry the answers into the referral form so nobody types them twice. */
  function prefillForm() {
    const form = document.getElementById('referralForm');
    if (!form) return;
    for (const [field, value] of Object.entries(answers)) {
      const input = form.elements[field];
      if (!input) continue;
      // Only set values the <select> actually offers.
      if (input.tagName === 'SELECT') {
        const match = [...input.options].some((o) => (o.value || o.text) === value);
        if (!match) continue;
      }
      input.value = value;
    }
  }

  card.addEventListener('click', (e) => {
    const opt = e.target.closest('.quiz-opt');
    if (!opt) return;
    const field = opt.closest('.quiz-step').dataset.field;
    answers[field] = opt.dataset.value;
    current += 1;
    if (current >= steps.length) finish();
    else render();
  });

  back?.addEventListener('click', () => {
    if (current > 0) current -= 1;
    render();
  });

  restart?.addEventListener('click', () => {
    for (const k of Object.keys(answers)) delete answers[k];
    current = 0;
    render();
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  toForm?.addEventListener('click', prefillForm);

  render();
}
