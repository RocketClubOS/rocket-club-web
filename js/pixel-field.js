(() => {
  const canvas = document.querySelector('[data-pixel-field]');
  if (!canvas || window.matchMedia('(max-width: 760px), (prefers-reduced-motion: reduce)').matches) return;
  const stage = canvas.closest('[data-hero-stage]');
  const ctx = canvas.getContext('2d');
  const pointer = { x: -999, y: -999, active: false };
  let width = 0; let height = 0; let pixels = []; let frame = 0;
  const resize = () => { const box = stage.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 1.5); width = box.width; height = box.height; canvas.width = width * dpr; canvas.height = height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); pixels = []; for (let y = 24; y < height; y += 16) for (let x = 24; x < width; x += 16) pixels.push({ x, y, phase: Math.random() * Math.PI * 2, hot: Math.random() > .88 }); };
  const move = (event) => { const box = stage.getBoundingClientRect(); pointer.x = event.clientX - box.left; pointer.y = event.clientY - box.top; pointer.active = true; };
  const leave = () => { pointer.active = false; };
  const draw = (time) => { ctx.clearRect(0, 0, width, height); const t = time * .001; pixels.forEach((pixel) => { const distance = Math.hypot(pixel.x - pointer.x, pixel.y - pointer.y); const wave = pointer.active ? Math.max(0, 1 - distance / 180) : 0; const pulse = (Math.sin(t * 1.25 + pixel.phase) + 1) * .5; const alpha = .06 + pulse * .13 + wave * .48 + (pixel.hot ? .08 : 0); const size = 1.5 + wave * 2.2 + (pixel.hot ? .5 : 0); ctx.fillStyle = pixel.hot || wave > .35 ? `rgba(243,199,95,${alpha})` : `rgba(239,31,47,${alpha})`; ctx.fillRect(pixel.x, pixel.y, size, size); }); frame = requestAnimationFrame(draw); };
  window.addEventListener('resize', resize, { passive: true }); stage.addEventListener('pointermove', move, { passive: true }); stage.addEventListener('pointerleave', leave, { passive: true }); resize(); frame = requestAnimationFrame(draw); window.addEventListener('pagehide', () => cancelAnimationFrame(frame), { once: true });
})();
