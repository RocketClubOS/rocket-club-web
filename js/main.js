(() => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');

  if (nav) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = [
      ['solutions.html', 'Solutions'],
      ['industries.html', 'Industries'],
      ['agents.html', 'AI Agents'],
      ['how-it-works.html', 'How It Works'],
      ['trust-center.html', 'Trust']
    ];
    nav.innerHTML = navItems.map(([href, label]) => `<a href="./${href}"${currentPage === href ? ' aria-current="page"' : ''}>${label}</a>`).join('') + '<a class="button button-small button-primary" href="./book-call.html">Build Your AI Plan</a>';
  }

  const closeNav = () => {
    if (!toggle || !nav) return;
    nav.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      nav.classList.toggle('active', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeNav();
        toggle.focus();
      }
    });
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeNav();
    });
  }

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const legalLinks = '<a href="./service-agreement.html">Service Terms</a><a href="./privacy.html">Privacy</a><a href="./terms.html">Terms</a><a href="./ai-cloud-terms.html">AI & Cloud</a><a href="./refund-policy.html">Refunds</a><a href="./cookie-policy.html">Cookies</a>';
  let footer = document.querySelector('.site-footer');
  if (!footer) {
    footer = document.createElement('footer');
    footer.className = 'site-footer site-footer-legal-only';
    footer.innerHTML = '<div class="container footer-bottom"><p>Rocket Club business and legal information.</p><p>© <span data-year></span> Rocket Club. All rights reserved.</p></div>';
    // The first script may be in <head> or injected inside another element.
    // Appending never depends on that script being a direct child of <body>.
    document.body.appendChild(footer);
    footer.querySelector('[data-year]').textContent = new Date().getFullYear();
  }
  footer.querySelectorAll('a').forEach((link) => {
    if (link.textContent.includes('Privacy (coming soon)')) {
      link.href = './privacy.html';
      link.textContent = 'Privacy Policy';
      link.removeAttribute('aria-label');
    }
  });
  const footerBottom = footer.querySelector('.footer-bottom');
  if (footerBottom) {
    const existingNotice = footerBottom.querySelector('p');
    if (existingNotice) existingNotice.textContent = 'Responsible AI · Clear terms · Privacy by design';
    const legalNav = document.createElement('nav');
    legalNav.className = 'footer-legal-links';
    legalNav.setAttribute('aria-label', 'Legal');
    legalNav.innerHTML = legalLinks;
    footerBottom.insertBefore(legalNav, footerBottom.lastElementChild);
  }


  if (window.location.pathname.endsWith('/thank-you.html') && new URLSearchParams(window.location.search).get('request') === 'plan') {
    const main = document.querySelector('main');
    main.querySelector('.section-label').textContent = 'Plan request received';
    main.querySelector('h1').textContent = 'Your next step: scope and quote review.';
    main.querySelector('.lead').textContent = 'We will review your business brief and contact you to clarify feasibility, deliverables, installation pricing and AI Cloud usage costs. No appointment has been booked. Implementation scheduling follows your approval of the proposal and completion of agreed payment and readiness requirements.';
  }

  if (window.location.pathname.endsWith('/thank-you.html') && !new URLSearchParams(window.location.search).has('request')) {
    const lead = document.querySelector('main .lead');
    if (lead) lead.textContent = 'Your request has been recorded for review. Sending this form does not approve a scope, authorize a payment, or schedule implementation.';
  }

  if (window.location.pathname.endsWith('/request-demo.html')) {
    document.title = 'Request a Written AI Implementation Quote | Rocket Club';
    const heading = document.querySelector('main .page-hero h1');
    const label = document.querySelector('main .page-hero .section-label');
    const intro = document.querySelector('main .page-hero .lead');
    if (heading) heading.innerHTML = 'Start powering your business with <span class="gradient-text">AI</span>';
    if (label) label.textContent = 'Plan & Quote';
    if (intro) intro.textContent = 'Tell us what you want to improve. We’ll review your needs and prepare a written scope and quote—no payment or implementation date is taken on this form.';
  }

  if (window.location.pathname.endsWith('/contact.html')) {
    const contactPlaceholder = document.querySelector('.contact-placeholder');
    if (contactPlaceholder) {
      contactPlaceholder.innerHTML = 'Rocket Club LLC · New Jersey, United States<br><a href="mailto:rocketclub23@gmail.com">rocketclub23@gmail.com</a><br>Use this email for support, billing and privacy or data-deletion requests.';
    }
  }

  document.querySelectorAll('.agent-premium-offer').forEach((offer) => {
    const note = document.createElement('small');
    note.textContent = 'Starting estimate only; final pricing may change based on your company and agreed scope of work.';
    offer.appendChild(note);
  });

  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? true;
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((item) => observer.observe(item));
  } else {
    reveals.forEach((item) => item.classList.add('is-visible'));
  }
})();
