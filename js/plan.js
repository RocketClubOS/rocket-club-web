/* A transparent, rules-based starting brief; not an AI-generated or approved quote. */
(() => {
  const scopes = {
    'Sales & customer service': 'Pilot one inbound workflow: answer approved FAQs, capture lead details and hand off exceptions to your team.',
    'AI for Marketing': 'Pilot one content workflow: draft from approved brand material, route for review and measure publishing effort.',
    'AI for Finance': 'Pilot one reporting workflow: organize approved inputs, flag discrepancies and route every financial decision to a responsible person.',
    'AI for HR (Workforce)': 'Pilot one internal knowledge workflow: answer policy questions from approved sources and escalate employee-specific requests to HR.'
  };
  window.RocketPlan = {
    build(values) {
      return {
        title: `${values.priority || 'AI'} · starting scope`,
        scope: scopes[values.priority] || scopes['Sales & customer service'],
        context: `${values.business_name} · ${values.industry} · ${values.company_size} · ${values.locations}`,
        steps: [
          `Map your workflow and agree on a measurable baseline: ${values.challenge}`,
          `Review access and integration feasibility for: ${values.current_tools}. Data needs: ${values.data_needs}.`,
          `Test a limited pilot against your volume (${values.volume}), including mistakes and human handoffs.`,
          'Launch only after acceptance testing, team training and approval of the final scope.'
        ],
        constraints: `Budget preference: ${values.budget}. Desired start: ${values.timeline}. Neither confirms price or availability.`,
        next: 'Rocket Club reviews feasibility, confirms dependencies and prepares a scoped proposal. Installation and ongoing AI Cloud usage are quoted separately. Scheduling follows approval and agreed payment/readiness requirements.'
      };
    },
    message(values, plan) {
      return [
        'AI IMPLEMENTATION PLAN / QUOTE REQUEST — not a booking',
        plan.context, plan.title, plan.scope,
        `Current workflow and success goal: ${values.challenge}`,
        `Tools: ${values.current_tools}; volume: ${values.volume}; data: ${values.data_needs}`,
        plan.constraints,
        values.selected_agent ? `Preferred identity: ${values.selected_agent}` : '',
        values.solution_interest ? `Original interest: ${values.solution_interest}` : '',
        values.message ? `Additional notes: ${values.message}` : '',
        'Next: feasibility review, written scope and quote, customer approval, then implementation scheduling.'
      ].filter(Boolean).join('\n');
    }
  };
})();
