import { useEffect, useRef } from "react";
import "./water.css";

export default function WaterBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const host = canvas.parentElement;
    let width = 0;
    let height = 0;
    let animationId;
    let time = 0;
    let mouse = { x: -1000, y: -1000, active: false };
    let ripples = [];

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = event => {
      const rect = host.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      mouse.active = true;
      if (Math.random() > 0.78) {
        ripples.push({ x: mouse.x, y: mouse.y, radius: 2, alpha: 0.5, speed: 1.4 + Math.random() * 1.4 });
      }
    };

    const onPointerLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const draw = () => {
      time += 0.012;
      ctx.clearRect(0, 0, width, height);
      const base = ctx.createLinearGradient(0, 0, width, height);
      base.addColorStop(0, "#080707");
      base.addColorStop(0.5, "#100b09");
      base.addColorStop(1, "#030303");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, width, height);

      for (let layer = 0; layer < 7; layer++) {
        ctx.beginPath();
        const yBase = height * (0.12 + layer * 0.13);
        const amplitude = 12 + layer * 3;
        for (let x = 0; x <= width; x += 5) {
          const distance = Math.hypot(x - mouse.x, yBase - mouse.y);
          const influence = mouse.active ? Math.max(0, 1 - distance / 260) : 0;
          const wave = Math.sin(x * 0.009 + time * (1 + layer * 0.12)) * amplitude + Math.sin(x * 0.019 - time * 1.5 + layer) * 8;
          const pointerWave = Math.sin(distance * 0.045 - time * 5) * influence * 34;
          const y = yBase + wave + pointerWave;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255, ${65 + layer * 12}, 12, ${0.10 + Math.sin(time + layer) * 0.045})`;
        ctx.lineWidth = 1.5 + (layer % 3);
        ctx.shadowBlur = 18;
        ctx.shadowColor = "#ff5a0a";
        ctx.stroke();
      }

      if (mouse.active) {
        const glow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 210);
        glow.addColorStop(0, "rgba(255, 90, 10, 0.19)");
        glow.addColorStop(0.35, "rgba(255, 55, 0, 0.08)");
        glow.addColorStop(1, "rgba(255, 55, 0, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      ripples = ripples.filter(ripple => ripple.alpha > 0.015);
      ripples.forEach(ripple => {
        ripple.radius += ripple.speed;
        ripple.alpha *= 0.975;
        ctx.beginPath();
        ctx.ellipse(ripple.x, ripple.y, ripple.radius * 1.8, ripple.radius * 0.55, -0.15, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 112, 35, ${ripple.alpha})`;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ff5a0a";
        ctx.stroke();
      });
      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(host);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="water-background" aria-hidden="true" />;
}

