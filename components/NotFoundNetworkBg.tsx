'use client';

import { useEffect, useRef } from 'react';

type Point = { x: number; y: number; vx: number; vy: number };

/** Samples the "404" glyph shape into a field of drifting points, connects
 *  nearby ones with faint lines, and redraws every frame — a slow-moving
 *  neural-network effect instead of a static image. Respects
 *  prefers-reduced-motion by drawing one static frame instead of animating. */
export function NotFoundNetworkBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let points: Point[] = [];
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function sampleGlyphPoints(w: number, h: number): Point[] {
      // Render "404" to an offscreen canvas, then sample its filled pixels
      // into a sparse point field so the network literally forms the digits.
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      // getBoundingClientRect() returns fractional CSS px (e.g. 670.4), but
      // the canvas element rounds that to an integer when assigned above.
      // ImageData's row stride is that rounded integer width, so the pixel
      // index math below MUST use off.width/off.height (post-rounding), not
      // the original fractional w/h — otherwise every row is misaligned and
      // the sample silently finds nothing.
      const cw = off.width;
      const ch = off.height;
      const octx = off.getContext('2d');
      if (!octx) return [];
      octx.fillStyle = '#000';
      octx.font = `900 ${Math.round(ch * 0.62)}px Arial, sans-serif`;
      octx.textAlign = 'center';
      octx.textBaseline = 'middle';
      octx.fillText('404', cw / 2, ch / 2);

      const data = octx.getImageData(0, 0, cw, ch).data;
      const step = Math.max(6, Math.round(cw / 110));
      const pts: Point[] = [];
      for (let y = 0; y < ch; y += step) {
        for (let x = 0; x < cw; x += step) {
          const alpha = data[(y * cw + x) * 4 + 3];
          if (alpha > 120) {
            pts.push({
              x: x + (Math.random() - 0.5) * step * 0.6,
              y: y + (Math.random() - 0.5) * step * 0.6,
              vx: (Math.random() - 0.5) * 0.15,
              vy: (Math.random() - 0.5) * 0.15,
            });
          }
        }
      }
      return pts;
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.scale(dpr, dpr);
      points = sampleGlyphPoints(width, height);
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (const p of points) {
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
      }

      // Connect nearby points — the classic constellation look.
      const maxDist = Math.max(22, width * 0.03);
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.22 * (1 - dist / maxDist)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of points) {
        ctx.fillStyle = 'rgba(79, 70, 229, 0.85)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    resize();
    draw();

    const onResize = () => {
      cancelAnimationFrame(raf);
      resize();
      draw();
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="h-[220px] w-full sm:h-[280px]"
    />
  );
}
