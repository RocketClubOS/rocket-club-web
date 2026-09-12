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
    const checkout = form.querySelector('[data-ai-checkout]');
    const checkoutProducts = checkout ? [...checkout.querySelectorAll('[name="selected_products"]:checked')] : [];
    const checkoutError = checkout?.querySelector('[data-checkout-error]');
    if (checkoutError) checkoutError.textContent = checkoutProducts.length ? '' : 'Select at least one AI product.';
    const valid = fields.map(validateField).every(Boolean) && (!checkout || checkoutProducts.length > 0);
    if (!valid) {
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        if (form.matches('[data-plan-builder]') && showPlanStep) {
          const index = [...form.querySelectorAll('[data-plan-step]')].findIndex((step) => step.contains(firstInvalid));
          if (index >= 0) showPlanStep(index, false);
        }
        firstInvalid.focus();
      }
      else if (!checkoutProducts.length) checkout?.querySelector('[name="selected_products"]')?.focus();
    }
    return valid;
  };


  const planForm = document.querySelector('[data-plan-builder]');
  let planStep = 0;
  let showPlanStep;
  if (planForm && window.RocketPlan) {
    const steps = [...planForm.querySelectorAll('[data-plan-step]')];
    const progress = [...document.querySelectorAll('[data-progress]')];
    const back = planForm.querySelector('[data-plan-back]');
    const next = planForm.querySelector('[data-plan-next]');
    const submit = planForm.querySelector('[data-plan-submit]');
    const params = new URLSearchParams(window.location.search);
    const interests = { 'AI Marketing': 'AI for Marketing', 'Content Production': 'AI for Marketing', 'AI Finance': 'AI for Finance', 'Predictive Analytics': 'AI for Finance', 'Executive Dashboard': 'AI for Finance', 'AI for HR': 'AI for HR (Workforce)' };
    const interest = params.get('solution');
    if (interests[interest]) planForm.elements.priority.value = interests[interest];
    ['agent', 'solution'].forEach((key) => {
      if (!params.get(key)) return;
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key === 'agent' ? 'selected_agent' : 'solution_interest';
      input.value = params.get(key).slice(0, 100);
      planForm.appendChild(input);
    });
    const renderPlan = () => {
      const values = Object.fromEntries(new FormData(planForm));
      const plan = window.RocketPlan.build(values);
      const preview = planForm.querySelector('[data-plan-preview]');
      preview.replaceChildren();
      const add = (tag, text) => {
        const node = document.createElement(tag);
        node.textContent = text;
        preview.appendChild(node);
      };
      add('h2', plan.title);
      add('p', plan.context);
      if (values.selected_agent) add('p', 'Preferred agent identity: ' + values.selected_agent);
      add('p', plan.scope);
      const list = document.createElement('ol');
      plan.steps.forEach((text) => {
        const item = document.createElement('li');
        item.textContent = text;
        list.appendChild(item);
      });
      preview.appendChild(list);
      add('p', plan.constraints);
      add('p', plan.next);
    };
    showPlanStep = (index, focus = true) => {
      planStep = index;
      steps.forEach((step, i) => { step.hidden = i !== index; });
      progress.forEach((item, i) => {
        if (i === index) item.setAttribute('aria-current', 'step');
        else item.removeAttribute('aria-current');
      });
      back.hidden = index === 0;
      document.querySelector('[data-step-status]').textContent = `Step ${index + 1} of ${steps.length} · ${['Business details', 'Workflow priorities', 'Plan review & quote request'][index]}`;
      next.hidden = index === steps.length - 1;
      next.textContent = index === 0 ? 'Choose My Priorities →' : 'Preview My AI Plan →';
      submit.hidden = index !== steps.length - 1;
      submit.disabled = index !== steps.length - 1;
      planForm.querySelector('[data-form-status]').textContent = '';
      if (index === steps.length - 1) renderPlan();
      if (focus) steps[index].querySelector('legend').focus();
    };
    const advance = () => {
      const fields = [...steps[planStep].querySelectorAll('input, select, textarea')];
      if (!fields.map(validateField).every(Boolean)) {
        steps[planStep].querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      showPlanStep(Math.min(planStep + 1, steps.length - 1));
    };
    next.addEventListener('click', advance);
    back.addEventListener('click', () => showPlanStep(Math.max(0, planStep - 1)));
    planForm.querySelector('[data-edit-business]').addEventListener('click', () => showPlanStep(0));
    planForm.querySelector('[data-edit-priorities]').addEventListener('click', () => showPlanStep(1));
    planForm.addEventListener('submit', (event) => {
      if (planStep < steps.length - 1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        advance();
      }
    });
    // Errors returned for an earlier page must remain visible and editable.
    planForm.addEventListener('focusin', (event) => {
      const index = steps.findIndex((step) => step.contains(event.target));
      if (index >= 0 && index !== planStep) showPlanStep(index, false);
    });
    showPlanStep(0, false);
  }

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
    form.setAttribute('aria-busy', 'true');
    form.querySelectorAll('[data-plan-step]').forEach((step) => { step.inert = true; });
    form.querySelectorAll('[data-plan-back], [data-plan-next]').forEach((button) => { button.disabled = true; });
    submit.textContent = 'Sending…';
    status.textContent = '';
    status.className = 'form-status';

    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      const selectedProducts = [...form.querySelectorAll('[name="selected_products"]:checked')].map((field) => field.value);
      if (selectedProducts.length) {
        payload.selected_products = selectedProducts;
        payload.solution_interest = selectedProducts.join(' | ');
      }
      if (form.matches('[data-plan-builder]')) {
        const plan = window.RocketPlan.build(payload);
        payload.subject = 'AI implementation plan and tailored quote request';
        payload.message = window.RocketPlan.message(payload, plan);
      }
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
        form.querySelectorAll('[data-plan-step]').forEach((step) => { step.inert = false; });
        const fields = result.error?.fields || {};
        Object.entries(fields).forEach(([name, message]) => {
          const field = form.elements[name];
          if (field) setFieldError(field, message);
        });
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) {
          if (form.matches('[data-plan-builder]') && showPlanStep) {
            const index = [...form.querySelectorAll('[data-plan-step]')].findIndex((step) => step.contains(firstInvalid));
            if (index >= 0) showPlanStep(index, false);
          }
          firstInvalid.focus();
        }
        throw new Error(result.error?.message || 'The server could not accept the request.');
      }
      status.textContent = result.message || 'Your request was submitted successfully.';
      status.className = 'form-status is-success';
      window.location.assign(form.matches('[data-plan-builder]') ? './thank-you.html?request=plan' : './thank-you.html');
    } catch (error) {
      form.removeAttribute('aria-busy');
      form.querySelectorAll('[data-plan-step]').forEach((step) => { step.inert = false; });
      form.querySelectorAll('[data-plan-back], [data-plan-next]').forEach((button) => { button.disabled = false; });
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

  document.querySelectorAll('[data-ai-checkout]').forEach((checkout) => {
    const products = [...checkout.querySelectorAll('[name="selected_products"]')];
    const totalNode = checkout.querySelector('[data-checkout-total]');
    const monthlyNode = checkout.querySelector('[data-checkout-monthly]');
    const companySize = checkout.closest('form')?.querySelector('[name="company_size"]');
    const moduleFocus = checkout.querySelector('[name="module_focus"]');
    const paymentPanel = document.createElement('div');
    paymentPanel.className = 'checkout-payment';
    paymentPanel.innerHTML = '<div><strong>Secure one-time installation payment</strong><span>Visa and major cards · Apple Pay when available</span><small>By paying, you agree to the <a href="./terms.html">Terms</a>, <a href="./privacy.html">Privacy Policy</a>, <a href="./ai-cloud-terms.html">AI & Cloud Terms</a> and <a href="./refund-policy.html">Refund Policy</a>.</small></div><button class="button button-primary" type="button" data-stripe-checkout disabled>Pay $499 securely</button>';
    const cloudNote = document.createElement('p');
    cloudNote.className = 'checkout-cloud-note';
    cloudNote.innerHTML = '<strong>AI Cloud is separate.</strong> After installation, usage is billed by AI tokens, requests, or processing minutes. No recurring AI Cloud charge is included here.';
    const paymentStatus = document.createElement('p');
    paymentStatus.className = 'form-status';
    paymentStatus.dataset.paymentStatus = '';
    paymentStatus.setAttribute('aria-live', 'polite');
    checkout.append(paymentPanel, cloudNote, paymentStatus);
    const paymentButton = paymentPanel.querySelector('[data-stripe-checkout]');
    const sizeMultipliers = { '1–10 employees': 1, '11–20 employees': 1.5, '21–40 employees': 2.2, '41–60 employees': 3 };
    const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
    const updateCheckout = () => {
      const multiplier = sizeMultipliers[companySize?.value] || 1;
      const selected = products.filter((product) => product.checked);
      moduleFocus.required = selected.some((product) => product.value === 'Specialized AI Agent');
      if (!moduleFocus.required) setFieldError(moduleFocus, '');
      const oneTime = selected.filter((product) => !product.dataset.monthly).reduce((sum, product) => sum + Number(product.dataset.price) * (product.dataset.scalable ? multiplier : 1), 0);
      const monthly = selected.filter((product) => product.dataset.monthly).reduce((sum, product) => sum + Number(product.dataset.price), 0);
      totalNode.textContent = oneTime ? `${currency.format(oneTime)}+` : '$0';
      monthlyNode.textContent = monthly ? `+ ${currency.format(monthly)}/month` : 'No monthly services selected';
      const error = checkout.querySelector('[data-checkout-error]');
      if (selected.length && error) error.textContent = '';
      const directPaymentSelected = selected.length === 1 && selected[0].value === 'Specialized AI Agent';
      paymentButton.disabled = !directPaymentSelected;
      paymentButton.title = directPaymentSelected ? '' : 'Direct checkout is available for the Premium Specialized Agent only.';
    };
    products.forEach((product) => product.addEventListener('change', updateCheckout));
    companySize?.addEventListener('change', updateCheckout);
    const requestedSolution = new URLSearchParams(window.location.search).get('solution');
    const queryMap = {
      'AI Business Audit': null,
      'AI Agent': ['Specialized AI Agent', 'Operations & Administration'],
      'Workflow Automation': ['Specialized AI Agent', 'Operations & Administration'],
      'Customer Service': ['Specialized AI Agent', 'Customer Service'],
      'Sales System': ['Specialized AI Agent', 'Sales & CRM'],
      'AI Marketing': ['AI for Marketing', ''],
      'Content Production': ['AI for Marketing', ''],
      'AI Finance': ['AI for Finance', ''],
      'Predictive Analytics': ['AI for Finance', ''],
      'AI for HR': ['AI for HR (Workforce)', ''],
      'Executive Dashboard': ['AI for Finance', '']
    };
    const requestedConfig = queryMap[requestedSolution];
    if (requestedConfig) {
      const [productName, focus] = requestedConfig;
      const requestedProduct = products.find((product) => product.value === productName);
      if (requestedProduct) requestedProduct.checked = true;
      moduleFocus.value = focus;
    }
    const selectedAgent = new URLSearchParams(window.location.search).get('agent');
    if (selectedAgent) {
      const agentProduct = products.find((product) => product.value === 'Specialized AI Agent');
      if (agentProduct) agentProduct.checked = true;
      const agentFocusMap = {
        'Sales & Support': 'Sales & CRM',
        'Content & Marketing': 'Marketing & Content',
        'Operations & Analytics': 'Operations & Administration',
        'Executive Strategy Twin': 'Management & Analytics',
        'Communications Twin': 'Knowledge & Training',
        'Finance & Forecasting': 'Finance & Reporting',
        'Workflow Orchestrator': 'Operations & Administration',
        'Creative Director': 'Marketing & Content',
        'Security & Compliance': 'Operations & Administration'
      };
      if (agentFocusMap[selectedAgent]) moduleFocus.value = agentFocusMap[selectedAgent];
      const agentField = document.createElement('input');
      agentField.type = 'hidden';
      agentField.name = 'selected_agent';
      agentField.value = selectedAgent;
      checkout.appendChild(agentField);
      const selectionLabel = checkout.querySelector('.checkout-step');
      selectionLabel.textContent = `Selected: ${selectedAgent}`;
      selectionLabel.title = selectedAgent;
      checkout.classList.add('has-agent-selection');
    }
    updateCheckout();

    paymentButton.addEventListener('click', async () => {
      const form = checkout.closest('form');
      const email = form?.elements.email;
      const consent = form?.elements.consent;
      paymentStatus.textContent = '';
      paymentStatus.className = 'form-status';
      if (!email || !validateField(email) || !moduleFocus.value || !consent?.checked) {
        if (!moduleFocus.value) setFieldError(moduleFocus, 'Choose the agent specialization before checkout.');
        if (consent && !consent.checked) setFieldError(consent, 'Please confirm your consent and policy acknowledgment to continue.');
        paymentStatus.textContent = 'Add your email, choose the specialization and confirm the policy acknowledgment to continue.';
        paymentStatus.className = 'form-status is-error';
        (!email?.value ? email : (!moduleFocus.value ? moduleFocus : consent))?.focus();
        return;
      }
      paymentButton.disabled = true;
      paymentButton.textContent = 'Opening secure checkout…';
      try {
        const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            product_id: 'premium-specialized-agent',
            email: email.value.trim(),
            specialization: moduleFocus.value
          })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.checkout_url) throw new Error(result.error || 'Checkout is unavailable.');
        window.location.assign(result.checkout_url);
      } catch (error) {
        paymentStatus.textContent = error.message || 'Secure checkout is unavailable right now.';
        paymentStatus.className = 'form-status is-error';
        paymentButton.disabled = false;
        paymentButton.textContent = 'Pay $499 securely';
      }
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
