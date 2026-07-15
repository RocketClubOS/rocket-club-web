const agentData = {
  rocket: {
    image: '/static/images/agents/rocket.png',
    name: 'Rocket',
    role: 'Sales Agent',
    personality: 'Confident, energetic and persuasive.',
    description: 'Rocket responds to leads, qualifies opportunities and helps turn conversations into booked appointments.',
    capabilities: ['Lead qualification', 'Instant responses', 'Appointment booking', 'Automated follow-up', 'Sales assistance'],
    accent: 'Red',
    accentColor: '#ef1f2f'
  },
  robocop: {
    image: '/static/images/agents/robocop.png',
    name: 'RoboCop',
    role: 'Content Agent',
    personality: 'Creative, focused and precise.',
    description: 'RoboCop develops content concepts, captions, campaigns and promotional assets designed to attract attention.',
    capabilities: ['Content ideas', 'Captions', 'Video scripts', 'Campaign concepts', 'Content calendars'],
    accent: 'Blue',
    accentColor: '#268cff'
  },
  stella: {
    image: '/static/images/agents/stella.png',
    name: 'Stella',
    role: 'Support Agent',
    personality: 'Friendly, patient and helpful.',
    description: 'Stella answers questions, provides information and helps customers receive fast support.',
    capabilities: ['Customer support', 'Frequently asked questions', 'Product information', 'Service guidance', 'Multilingual assistance'],
    accent: 'Gold',
    accentColor: '#f3c75f'
  },
  kittydata: {
    image: '/static/images/agents/kittydata.png',
    name: 'KittyData',
    role: 'Analytics Agent',
    personality: 'Intelligent, curious and analytical.',
    description: 'KittyData organizes performance information and turns business data into clear insights.',
    capabilities: ['Performance tracking', 'Business reports', 'Campaign analysis', 'Trend identification', 'Actionable insights'],
    accent: 'Purple',
    accentColor: '#9a55ff'
  },
  automax: {
    image: '/static/images/agents/automax.png',
    name: 'AutoMax',
    role: 'Automation Agent',
    personality: 'Efficient, dependable and always active.',
    description: 'AutoMax connects workflows, sends follow-ups and handles repetitive operational tasks.',
    capabilities: ['Workflow automation', 'CRM updates', 'Follow-up messages', 'Notifications', 'Task routing'],
    accent: 'Green',
    accentColor: '#27c267'
  }
};

const solutionData = {
  marketing: {
    title: 'Generate More Customers',
    problem: 'Many businesses publish inconsistently, run disconnected campaigns and lose leads because their marketing and sales systems do not work together.',
    painPoints: ['Inconsistent content', 'Low-quality leads', 'Slow lead response', 'Disconnected campaigns', 'Weak follow-up'],
    solutions: ['AI content systems', 'Paid advertising', 'Landing pages', 'Sales agents', 'Lead qualification', 'Automated follow-up'],
    benefits: ['More consistent visibility', 'Faster lead response', 'Better-qualified opportunities', 'Improved campaign coordination', 'More sales opportunities'],
    applications: ['Video ad production', 'Social media campaigns', 'Lead capture pages', 'AI sales assistant', 'CRM follow-up automation'],
    impact: 'More consistent visibility, faster response and better-qualified opportunities across the funnel.',
    cta: 'Explore Marketing Solutions',
    accent: '#ef1f2f',
    previewLabel: 'Marketing & Sales'
  },
  support: {
    title: 'Never Miss Another Customer',
    problem: 'Customers expect immediate answers, but growing teams often cannot respond quickly across every channel.',
    painPoints: ['Missed messages', 'Slow response times', 'Repetitive questions', 'Limited service hours', 'Inconsistent answers'],
    solutions: ['AI support agents', 'Frequently asked question automation', 'Appointment scheduling', 'Omnichannel support', 'Customer request routing', 'Human escalation workflows'],
    benefits: ['Faster customer service', '24/7 availability', 'Lower repetitive workload', 'More consistent communication', 'Better customer experience'],
    applications: ['Website assistant', 'WhatsApp support', 'Appointment booking', 'Service information', 'Customer request classification'],
    impact: 'Faster responses and more dependable support without increasing headcount in the same way.',
    cta: 'Explore Support Solutions',
    accent: '#f3c75f',
    previewLabel: 'Customer Support'
  },
  operations: {
    title: 'Stop Running Your Business Manually',
    problem: 'As companies grow, spreadsheets, manual communication and disconnected workflows create delays, errors and unnecessary work.',
    painPoints: ['Repetitive administrative tasks', 'Information spread across systems', 'Manual data entry', 'Poor workflow visibility', 'Slow internal communication'],
    solutions: ['Process automation', 'Internal AI assistants', 'CRM integration', 'Workflow orchestration', 'Notifications and approvals', 'Operations dashboards'],
    benefits: ['Less manual work', 'Faster processes', 'Better organization', 'Fewer operational errors', 'More time for strategic work'],
    applications: ['Automated intake forms', 'CRM updates', 'Approval workflows', 'Internal knowledge assistant', 'Task routing'],
    impact: 'More organized operations and better visibility across the internal workflow.',
    cta: 'Explore Operations Solutions',
    accent: '#ef1f2f',
    previewLabel: 'Business Operations'
  },
  finance: {
    title: 'Know Your Numbers Faster',
    problem: 'Financial decisions become difficult when information is scattered, reporting is slow and critical indicators are reviewed too late.',
    painPoints: ['Manual financial reports', 'Spreadsheet overload', 'Delayed KPI visibility', 'Unclear cash-flow information', 'Repetitive reconciliation work'],
    solutions: ['Financial dashboards', 'Automated reporting', 'Expense organization', 'Revenue monitoring', 'KPI alerts', 'AI-assisted financial analysis'],
    benefits: ['Faster reporting', 'Better visibility', 'More informed decisions', 'Reduced manual work', 'Earlier detection of financial issues'],
    applications: ['Revenue dashboards', 'Expense categorization', 'Cash-flow summaries', 'Monthly reporting', 'KPI monitoring'],
    impact: 'Clearer reporting and better decision timing without relying on manual spreadsheet work.',
    cta: 'Explore Finance Solutions',
    accent: '#27c267',
    previewLabel: 'Finance'
  },
  hr: {
    title: 'Build A Smarter Workforce',
    problem: 'Hiring, onboarding and employee support consume valuable time when HR processes depend on emails, documents and repetitive manual work.',
    painPoints: ['Slow hiring workflows', 'Manual candidate screening', 'Repetitive onboarding', 'Scattered employee information', 'Delayed internal support'],
    solutions: ['Recruiting automation', 'Resume organization', 'Employee onboarding workflows', 'Internal HR assistant', 'Training support', 'Performance reporting'],
    benefits: ['Faster hiring coordination', 'More organized onboarding', 'Better employee access to information', 'Reduced repetitive HR work', 'Improved operational visibility'],
    applications: ['Candidate intake', 'Resume categorization', 'Onboarding checklists', 'Policy assistant', 'Training reminders'],
    impact: 'More organized HR operations and faster coordination across hiring and support tasks.',
    cta: 'Explore HR Solutions',
    accent: '#9a55ff',
    previewLabel: 'Human Resources'
  },
  analytics: {
    title: 'Turn Data Into Decisions',
    problem: 'Businesses collect information from many sources but often lack a clear way to understand performance or identify what requires attention.',
    painPoints: ['Data spread across platforms', 'Manual reporting', 'Unclear performance trends', 'Delayed decision-making', 'No centralized visibility'],
    solutions: ['Performance dashboards', 'Automated reports', 'Trend detection', 'KPI monitoring', 'Data summaries', 'AI-assisted insights'],
    benefits: ['Clearer business visibility', 'Faster reporting', 'Better prioritization', 'Earlier trend identification', 'More informed decisions'],
    applications: ['Marketing performance', 'Sales reporting', 'Operations monitoring', 'Customer-service analytics', 'Executive summaries'],
    impact: 'Better visibility and faster decision-making through a more connected intelligence layer.',
    cta: 'Explore Analytics Solutions',
    accent: '#9a55ff',
    previewLabel: 'Analytics & Intelligence'
  }
};

const chips = Array.from(document.querySelectorAll('.agent-chip'));
const image = document.getElementById('agent-image');
const accent = document.getElementById('agent-accent');
const name = document.getElementById('agent-name');
const role = document.getElementById('agent-role');
const personality = document.getElementById('agent-personality');
const description = document.getElementById('agent-description');
const capabilities = document.getElementById('agent-capabilities');
const agentDetail = document.querySelector('.agent-detail');

function updateAgent(agentKey) {
  const data = agentData[agentKey];
  if (!data) return;

  image.src = data.image;
  image.alt = `${data.name} agent illustration`;
  accent.textContent = data.accent;
  name.textContent = data.name;
  role.textContent = data.role;
  personality.textContent = data.personality;
  description.textContent = data.description;
  capabilities.innerHTML = data.capabilities.map((item) => `<li>${item}</li>`).join('');
  agentDetail.style.borderColor = `${data.accentColor}40`;
  chips.forEach((chip) => {
    const selected = chip.dataset.agent === agentKey;
    chip.classList.toggle('active', selected);
    chip.setAttribute('aria-selected', String(selected));
  });
}

chips.forEach((chip) => {
  chip.addEventListener('click', () => updateAgent(chip.dataset.agent));
});

updateAgent('rocket');

const solutionTabs = Array.from(document.querySelectorAll('.solution-tab'));
const solutionTitle = document.getElementById('solution-title');
const solutionProblem = document.getElementById('solution-problem');
const solutionPainPoints = document.getElementById('solution-pain-points');
const solutionSolutions = document.getElementById('solution-solutions');
const solutionBenefits = document.getElementById('solution-benefits');
const solutionApplications = document.getElementById('solution-applications');
const solutionImpact = document.getElementById('solution-impact');
const solutionPreview = document.getElementById('solution-preview');
const solutionPreviewLabel = document.getElementById('solution-preview-label');
const solutionCta = document.getElementById('solution-cta');
const solutionPanel = document.getElementById('solution-panel');

function updateSolution(solutionKey) {
  const data = solutionData[solutionKey];
  if (!data) return;

  if (solutionTitle) solutionTitle.textContent = data.title;
  if (solutionProblem) solutionProblem.textContent = data.problem;
  if (solutionPainPoints) solutionPainPoints.innerHTML = data.painPoints.map((item) => `<li>${item}</li>`).join('');
  if (solutionSolutions) solutionSolutions.innerHTML = data.solutions.map((item) => `<li>${item}</li>`).join('');
  if (solutionBenefits) solutionBenefits.innerHTML = data.benefits.map((item) => `<li>${item}</li>`).join('');
  if (solutionApplications) solutionApplications.innerHTML = data.applications.map((item) => `<li>${item}</li>`).join('');
  if (solutionImpact) solutionImpact.textContent = data.impact;
  if (solutionPreviewLabel) solutionPreviewLabel.textContent = data.previewLabel;
  if (solutionCta) {
    solutionCta.textContent = data.cta;
    solutionCta.style.background = `linear-gradient(90deg, ${data.accent}, #920b18)`;
  }
  if (solutionPanel) solutionPanel.style.borderColor = `${data.accent}40`;
  if (solutionPreview) solutionPreview.style.borderColor = `${data.accent}40`;
  solutionTabs.forEach((tab) => {
    const selected = tab.dataset.solution === solutionKey;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  const activeTab = solutionTabs.find((tab) => tab.dataset.solution === solutionKey);
  if (activeTab && solutionPanel) {
    solutionPanel.setAttribute('aria-labelledby', activeTab.id);
  }
}

solutionTabs.forEach((tab) => {
  tab.addEventListener('click', () => updateSolution(tab.dataset.solution));
  tab.addEventListener('keydown', (event) => {
    const currentIndex = solutionTabs.indexOf(tab);
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const nextTab = solutionTabs[(currentIndex + 1) % solutionTabs.length];
      nextTab.focus();
      updateSolution(nextTab.dataset.solution);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prevTab = solutionTabs[(currentIndex - 1 + solutionTabs.length) % solutionTabs.length];
      prevTab.focus();
      updateSolution(prevTab.dataset.solution);
    }
  });
});

updateSolution('marketing');

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.getElementById('year');
if (year) {
  year.textContent = new Date().getFullYear();
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealItems = Array.from(document.querySelectorAll('.reveal'));

if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
  });
});
