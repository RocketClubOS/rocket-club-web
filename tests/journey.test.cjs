// Run with Node and jsdom available on NODE_PATH. No real leads are sent.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM, VirtualConsole } = require('jsdom');
const root = path.resolve(__dirname, '..');
function setup() {
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'book-call.html'), 'utf8'), {
    url: 'https://example.test/book-call.html?solution=AI%20Finance&agent=Finance%20Twin',
    runScripts: 'outside-only', virtualConsole: new VirtualConsole()
  });
  const w = dom.window;
  w.fetch = async () => { throw new Error('Offline test'); };
  for (const file of ['plan.js', 'forms.js']) w.eval(fs.readFileSync(path.join(root, 'js', file), 'utf8'));
  const form = w.document.querySelector('form');
  const set = (name, value) => { form.elements.namedItem(name).value = value; };
  const click = selector => w.document.querySelector(selector).click();
  const step = () => [...form.querySelectorAll('[data-plan-step]')].findIndex(el => !el.hidden);
  const fill = () => {
    for (const field of form.querySelectorAll('input:not([type=hidden]), select, textarea')) {
      if (field.name === 'company_fax') continue;
      if (field.tagName === 'SELECT') field.selectedIndex = 1;
      else if (field.type === 'checkbox') field.checked = true;
      else field.value = field.type === 'email' ? 'test@example.test' : 'Sample business workflow with measurable goals';
    }
  };
  return { w, form, set, click, step, fill, dom };
}
test('validates each step, preserves selections and permits editing', () => {
  const t = setup();
  assert.equal(t.step(), 0);
  assert.equal(t.form.elements.priority.value, 'AI for Finance');
  t.click('[data-plan-next]');
  assert.equal(t.step(), 0);
  assert.equal(t.form.elements.business_name.getAttribute('aria-invalid'), 'true');
  t.fill();
  t.click('[data-plan-next]');
  assert.equal(t.step(), 1);
  t.set('priority', 'AI for Finance');
  t.click('[data-plan-next]');
  assert.equal(t.step(), 2);
  assert.match(t.form.querySelector('[data-plan-preview]').textContent, /Finance Twin/);
  assert.match(t.form.querySelector('[data-plan-preview]').textContent, /reporting workflow/);
  t.click('[data-edit-business]');
  assert.equal(t.step(), 0);
  assert.ok(t.form.elements.business_name.value);
  t.dom.window.close();
});
test('renders user text safely and keeps contact message within backend limit', () => {
  const t = setup(); t.fill();
  for (const el of t.form.querySelectorAll('input[maxlength], textarea[maxlength]')) el.value = 'x'.repeat(el.maxLength);
  for (const el of t.form.querySelectorAll('select')) el.value = [...el.options].sort((a,b) => b.value.length-a.value.length)[0].value;
  const values = Object.fromEntries(new t.w.FormData(t.form));
  values.selected_agent = 'x'.repeat(100); values.solution_interest = 'x'.repeat(100);
  const plan = t.w.RocketPlan.build(values);
  assert.ok(t.w.RocketPlan.message(values, plan).length <= 2000);
  t.set('business_name', '<img src=x onerror=alert(1)>');
  t.click('[data-plan-next]'); t.click('[data-plan-next]');
  assert.equal(t.form.querySelector('[data-plan-preview] img'), null);
  t.dom.window.close();
});
test('failed submission retains data and permits a retry; payload is a quote request', async () => {
  const t = setup(); t.fill(); t.click('[data-plan-next]'); t.click('[data-plan-next]');
  let payload;
  t.w.fetch = async (_, options) => { payload = JSON.parse(options.body); throw new Error('Offline'); };
  t.click('[data-plan-submit]');
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(payload.form_type, 'contact');
  assert.match(payload.subject, /quote request/);
  assert.match(payload.message, /not a booking/);
  assert.match(payload.message, /Finance Twin/);
  assert.equal(payload.consent, true);
  assert.equal(t.form.querySelector('[data-plan-submit]').disabled, false);
  assert.match(t.form.querySelector('[data-form-status]').textContent, /try again/);
  assert.ok(t.form.elements.email.value);
  t.dom.window.close();
});
test('server field errors reveal the earlier step', async () => {
  const t = setup(); t.fill(); t.click('[data-plan-next]'); t.click('[data-plan-next]');
  t.w.fetch = async () => ({ ok: false, json: async () => ({ error: { fields: { business_name: 'Check the business name.' } } }) });
  t.click('[data-plan-submit]');
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.equal(t.step(), 0);
  assert.equal(t.w.document.activeElement, t.form.elements.business_name);
  t.dom.window.close();
});
