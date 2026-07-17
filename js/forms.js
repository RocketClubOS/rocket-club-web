const API_BASE_URL = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  ? 'http://127.0.0.1:5000'
  : 'https://rocket-club-web-backend.onrender.com';
const FORMS_ENABLED = true;
const FORM_TYPE_MAP = {
  general_contact: 'contact',
  strategy_call: 'book_call',
  demo_request: 'request_demo'
};

(() => {
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getErrorNode = (field) => document.getElementById(`${field.id}-error`);

  const setFieldError = (field, message) => {
    const error = getErrorNode(field);
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) error.textContent = message;
  };

  const validateField = (field) => {
    const value = field.type === 'checkbox' ? field.checked : field.value.trim();
    let message = '';

    if (field.required && (field.type === 'checkbox' ? !value : value === '')) {
      message = field.type === 'checkbox' ? 'Please confirm your consent to continue.' : 'This field is required.';
    } else if (field.type === 'email' && value && !EMAIL_PATTERN.test(value)) {
      message = 'Enter a valid email address.';
    } else if (field.type === 'url' && value) {
      try {
        const url = new URL(value);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol');
      } catch {
        message = 'Enter a complete website URL, including https://.';
      }
    } else if (field.minLength > 0 && value && value.length < field.minLength) {
      message = `Enter at least ${field.minLength} characters.`;
    } else if (field.maxLength > 0 && value && value.length > field.maxLength) {
      message = `Use ${field.maxLength} characters or fewer.`;
    }

    setFieldError(field, message);
    return !message;
  };

  const validateForm = (form) => {
    const fields = [...form.querySelectorAll('input, select, textarea')].filter((field) => field.type !== 'submit');
    const valid = fields.map(validateField).every(Boolean);
    if (!valid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
    }
    return valid;
  };

  const submitForm = async (form) => {
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('[type="submit"]');
    const originalLabel = submit.textContent;

    if (!validateForm(form)) {
      status.textContent = 'Please correct the highlighted fields.';
      status.className = 'form-status is-error';
      return;
    }

    if (!FORMS_ENABLED) {
      status.textContent = 'Online submission is being connected. Please contact Rocket Club directly in the meantime.';
      status.className = 'form-status is-error';
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Sending…';
    status.textContent = '';
    status.className = 'form-status';

    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload.form_type = FORM_TYPE_MAP[form.dataset.leadForm];
      payload.consent = formData.has('consent');
      payload.company_fax = formData.get('company_fax') || '';
      payload.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      payload.page_url = window.location.href;
      const query = new URLSearchParams(window.location.search);
      ['utm_source', 'utm_medium', 'utm_campaign'].forEach((field) => {
        if (query.get(field)) payload[field] = query.get(field);
      });
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        const fields = result.error?.fields || {};
        Object.entries(fields).forEach(([name, message]) => {
          const field = form.elements[name];
          if (field) setFieldError(field, message);
        });
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        throw new Error(result.error?.message || 'The server could not accept the request.');
      }
      status.textContent = result.message || 'Your request was submitted successfully.';
      status.className = 'form-status is-success';
      window.location.assign('./thank-you.html');
    } catch (error) {
      status.textContent = 'We could not submit your request. Your information is still here so you can try again.';
      status.className = 'form-status is-error';
      submit.disabled = false;
      submit.textContent = originalLabel;
    }
  };

  document.querySelectorAll('[data-lead-form]').forEach((form) => {
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'company_fax';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.className = 'form-honeypot';
    form.appendChild(honeypot);
    form.noValidate = true;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (form.dataset.submitting === 'true') return;
      form.dataset.submitting = 'true';
      Promise.resolve(submitForm(form)).finally(() => { form.dataset.submitting = 'false'; });
    });
    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
      field.addEventListener('change', () => {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });
  });

  const query = new URLSearchParams(window.location.search);
  document.querySelectorAll('[data-query-param]').forEach((field) => {
    const requestedValue = query.get(field.dataset.queryParam);
    if (requestedValue && [...field.options].some((option) => option.value === requestedValue)) {
      field.value = requestedValue;
    }
  });

  document.querySelectorAll('input[type="date"]').forEach((field) => {
    field.min = new Date().toISOString().split('T')[0];
  });
})();
