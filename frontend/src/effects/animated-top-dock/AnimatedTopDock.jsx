import { useEffect, useRef } from 'react';
import { Home, Flower2, Shapes, Heart, Mail } from 'lucide-react';
import './styles.css';

const links = [
  { label: 'Home', href: '#home', Icon: Home },
  { label: 'Flowers', href: '#collection', Icon: Flower2 },
  { label: 'Categories', href: '#categories', Icon: Shapes },
  { label: 'About', href: '#about', Icon: Heart },
  { label: 'Contact', href: '#contact', Icon: Mail },
];

export function AnimatedTopDock() {
  const canvasRef = useRef(null);
  const dockRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !host || !ctx) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    let width = 0, height = 0, raf = 0, running = true;
    const count = 34;
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random(), y: Math.random(), r: 1.1 + Math.random() * 2.5,
      vx: (Math.random() - .5) * .00018, vy: (Math.random() - .5) * .00018,
      phase: Math.random() * Math.PI * 2, hue: 135 + Math.random() * 65, i
    }));
    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width); height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (time = 0) => {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!reduceMotion) { p.x += p.vx; p.y += p.vy; }
        if (p.x < -.03 || p.x > 1.03) p.vx *= -1;
        if (p.y < -.03 || p.y > 1.03) p.vy *= -1;
        const x = p.x * width + Math.sin(time * .00035 + p.phase) * 5;
        const y = p.y * height + Math.cos(time * .0003 + p.phase) * 4;
        const glow = ctx.createRadialGradient(x, y, 0, x, y, p.r * 5);
        glow.addColorStop(0, `hsla(${p.hue}, 62%, 78%, .62)`);
        glow.addColorStop(1, `hsla(${p.hue}, 62%, 78%, 0)`);
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, p.r * 5, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(x, y, p.r * .55, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j], dx = (p.x - q.x) * width, dy = (p.y - q.y) * height;
          const dist = Math.hypot(dx, dy);
          if (dist < 72) { ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 72) * .12})`; ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(q.x * width, q.y * height); ctx.stroke(); }
        }
      }
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    const observer = new ResizeObserver(resize); observer.observe(host);
    const visibility = () => { if (document.hidden) cancelAnimationFrame(raf); else if (!reduceMotion) raf = requestAnimationFrame(draw); };
    document.addEventListener('visibilitychange', visibility);
    return () => { running = false; cancelAnimationFrame(raf); observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    const items = itemRefs.current.filter(Boolean);
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduced) return;
    let raf = 0, pointerX = -1000;
    const states = items.map(() => ({ value: 0, velocity: 0 }));
    const measure = () => {
      const bounds = dock.getBoundingClientRect();
      items.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const distance = Math.abs(pointerX - center);
        const t = Math.max(0, Math.min(1, 1 - distance / 160));
        const target = t * t * (3 - 2 * t);
        const s = states[i]; s.velocity += (target - s.value) * .19; s.velocity *= .70; s.value += s.velocity;
        el.style.setProperty('--dock-grow', s.value.toFixed(4));
      });
      raf = requestAnimationFrame(measure);
    };
    const move = e => { pointerX = e.clientX; };
    const leave = () => { pointerX = -1000; };
    dock.addEventListener('pointermove', move); dock.addEventListener('pointerleave', leave);
    raf = requestAnimationFrame(measure);
    return () => { cancelAnimationFrame(raf); dock.removeEventListener('pointermove', move); dock.removeEventListener('pointerleave', leave); };
  }, []);

  const navigate = href => {
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return <div className="animated-dock-wrap">
    <canvas ref={canvasRef} className="dock-particle-field" aria-hidden="true" />
    <nav className="animated-glass-dock" ref={dockRef} aria-label="Main navigation">
      {links.map(({ label, href, Icon }, index) => <button key={href} ref={el => itemRefs.current[index] = el}
        className="animated-dock-item" type="button" onClick={() => navigate(href)}>
        <span className="dock-icon"><Icon size={17} strokeWidth={1.8}/></span><span className="dock-label">{label}</span>
      </button>)}
    </nav>
  </div>;
}
