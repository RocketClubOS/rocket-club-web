(() => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');

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

  document.querySelectorAll('[data-hero-stage]').forEach((stage) => {
    const buttons = stage.querySelectorAll('[data-hero-mode]');
    const images = stage.querySelectorAll('[data-hero-image]');
    const panels = stage.querySelectorAll('[data-engine-panel]');
    const status = stage.querySelector('[data-hero-status]');

    const loadModeImage = (mode) => {
      const image = Array.from(images).find((item) => item.dataset.heroImage === mode);
      if (image && !image.getAttribute('src') && image.dataset.src) image.src = image.dataset.src;
      return image;
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const mode = button.dataset.heroMode;
        loadModeImage(mode);

        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        });
        images.forEach((image) => {
          const active = image.dataset.heroImage === mode;
          image.classList.toggle('is-active', active);
          image.setAttribute('aria-hidden', String(!active));
        });
        panels.forEach((panel) => {
          const active = panel.dataset.enginePanel === mode;
          panel.classList.toggle('is-active', active);
          panel.setAttribute('aria-hidden', String(!active));
        });
        if (status) status.textContent = `${mode === 'operations' ? 'Operations Engine' : 'Growth Engine'} selected`;
      });
      button.addEventListener('pointerenter', () => loadModeImage(button.dataset.heroMode));
      button.addEventListener('focus', () => loadModeImage(button.dataset.heroMode));
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        const currentIndex = Array.from(buttons).indexOf(button);
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const nextButton = buttons[(currentIndex + direction + buttons.length) % buttons.length];
        nextButton.focus();
        nextButton.click();
      });
    });
  });

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
