"use client";
import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------
   A teia: fios radiais + espiral, que cedem quando o mouse encosta,
   ondulam no clique e sustentam uma aranha procedural (pernas com
   cinemática inversa e marcha alternada) que segue o cursor.
   ------------------------------------------------------------------ */

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type P = { bx: number; by: number; ox: number; oy: number; vx: number; vy: number; dew: boolean };
type Leg = {
  side: number; n: number; group: number;
  fx: number; fy: number; sx: number; sy: number; tx: number; ty: number; t: number;
};

const HIP_F = [5, 2, -1, -4];
const REST_F = [32, 13, -8, -26];
const REST_L = [30, 37, 36, 29];
const ACC = "63,167,255";

export default function WebCanvas({
  spider = true,
  cx: cxr = 0.7,
  cy: cyr = 0.45,
  dim = 1,
}: {
  spider?: boolean;
  cx?: number;
  cy?: number;
  dim?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const SP = 18, RG = 15;
    const r = rng(11);
    const ang = Array.from({ length: SP }, (_, i) => (i / SP) * Math.PI * 2 + (r() - 0.5) * 0.2);
    const jit = Array.from({ length: SP * RG }, () => [r(), r(), r()]);

    let W = 0, H = 0, cx = 0, cy = 0, S = 1;
    let pts: P[][] = [];
    const m = { x: -1e4, y: -1e4, in: false, last: 0 };
    const ripples: { x: number; y: number; t: number }[] = [];
    const sp = { x: 0, y: 0, a: -Math.PI / 2, vx: 0, vy: 0, flee: 0 };
    let legs: Leg[] = [];

    const world = (f: number, l: number): [number, number] => {
      const c = Math.cos(sp.a), s = Math.sin(sp.a);
      return [sp.x + (c * f - s * l) * S, sp.y + (s * f + c * l) * S];
    };

    function size() {
      const b = cv!.parentElement!.getBoundingClientRect();
      W = b.width;
      H = b.height;
      const d = Math.min(2, devicePixelRatio || 1);
      cv!.width = Math.round(W * d);
      cv!.height = Math.round(H * d);
      cv!.style.width = W + "px";
      cv!.style.height = H + "px";
      ctx!.setTransform(d, 0, 0, d, 0, 0);
      const mob = W < 768;
      S = mob ? 0.8 : 1.22;
      cx = W * (mob ? 0.6 : cxr);
      cy = H * (mob ? 0.3 : cyr);
      const R = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy));
      pts = [];
      for (let k = 0; k < RG; k++) {
        const row: P[] = [];
        const rk = R * Math.pow((k + 1) / RG, 1.4);
        for (let i = 0; i < SP; i++) {
          const j = jit[k * SP + i];
          const rr = rk * (1 + (j[0] - 0.5) * 0.07);
          const a = ang[i] + (j[1] - 0.5) * 0.025;
          row.push({ bx: cx + Math.cos(a) * rr, by: cy + Math.sin(a) * rr, ox: 0, oy: 0, vx: 0, vy: 0, dew: j[2] > 0.88 });
        }
        pts.push(row);
      }
      if (!sp.x) {
        sp.x = mob ? W * 0.72 : cx - W * 0.06;
        sp.y = mob ? H * 0.2 : cy + H * 0.12;
      }
      legs = [];
      for (const side of [-1, 1])
        for (let n = 0; n < 4; n++) {
          const [x, y] = world(REST_F[n], side * REST_L[n]);
          legs.push({ side, n, group: (n + (side > 0 ? 1 : 0)) % 2, fx: x, fy: y, sx: x, sy: y, tx: x, ty: y, t: 1 });
        }
    }

    function stepWeb(now: number) {
      const R1 = 170 * S, R2 = 95 * S;
      for (let i = ripples.length - 1; i >= 0; i--) if (now - ripples[i].t > 3000) ripples.splice(i, 1);
      for (const row of pts)
        for (const p of row) {
          let tx = 0, ty = 0;
          if (m.in) {
            const dx = m.x - p.bx, dy = m.y - p.by, d = Math.hypot(dx, dy);
            if (d < R1) {
              const f = (1 - d / R1) ** 2 * 0.32;
              tx += dx * f;
              ty += dy * f;
            }
          }
          if (spider) {
            const dx = sp.x - p.bx, dy = sp.y - p.by, d = Math.hypot(dx, dy);
            if (d < R2) {
              const f = (1 - d / R2) ** 2 * 0.16;
              tx += dx * f;
              ty += dy * f;
            }
          }
          for (const rp of ripples) {
            const age = (now - rp.t) / 1000;
            const dx = p.bx - rp.x, dy = p.by - rp.y, d = Math.hypot(dx, dy) || 1;
            if (d > age * 560) continue;
            const w = Math.sin(d * 0.045 - age * 10) * Math.exp(-age * 1.7) * Math.exp(-d / 420) * 18;
            tx += (dx / d) * w;
            ty += (dy / d) * w;
          }
          p.vx = (p.vx + (tx - p.ox) * 0.14) * 0.76;
          p.vy = (p.vy + (ty - p.oy) * 0.14) * 0.76;
          p.ox += p.vx;
          p.oy += p.vy;
        }
    }

    function drawWeb() {
      const X = (p: P) => p.bx + p.ox, Y = (p: P) => p.by + p.oy;
      ctx!.lineCap = "round";
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = `rgba(236,232,223,${0.075 * dim})`;
      ctx!.beginPath();
      for (let i = 0; i < SP; i++) {
        ctx!.moveTo(cx, cy);
        for (let k = 0; k < RG; k++) ctx!.lineTo(X(pts[k][i]), Y(pts[k][i]));
      }
      for (let k = 0; k < RG; k++) {
        const row = pts[k];
        for (let i = 0; i < SP; i++) {
          const a = row[i], b = row[(i + 1) % SP];
          const mx = (X(a) + X(b)) / 2, my = (Y(a) + Y(b)) / 2;
          ctx!.moveTo(X(a), Y(a));
          ctx!.quadraticCurveTo(mx + (cx - mx) * 0.07, my + (cy - my) * 0.07, X(b), Y(b));
        }
      }
      ctx!.stroke();

      // brilho dos fios perto do mouse e da aranha
      const foci: [number, number, number][] = [];
      if (m.in) foci.push([m.x, m.y, 260 * S]);
      if (spider) foci.push([sp.x, sp.y, 120 * S]);
      if (foci.length) {
        const glow = (x: number, y: number) => {
          let a = 0;
          for (const [fx, fy, fr] of foci) {
            const d = Math.hypot(x - fx, y - fy);
            if (d < fr) a = Math.max(a, (1 - d / fr) ** 1.6);
          }
          return a;
        };
        ctx!.lineWidth = 1.15;
        for (let k = 0; k < RG; k++)
          for (let i = 0; i < SP; i++) {
            const a = pts[k][i], b = pts[k][(i + 1) % SP];
            const mx = (X(a) + X(b)) / 2, my = (Y(a) + Y(b)) / 2;
            const g = glow(mx, my);
            if (g > 0.02) {
              ctx!.strokeStyle = `rgba(${ACC},${g * 0.75 * dim})`;
              ctx!.beginPath();
              ctx!.moveTo(X(a), Y(a));
              ctx!.quadraticCurveTo(mx + (cx - mx) * 0.07, my + (cy - my) * 0.07, X(b), Y(b));
              ctx!.stroke();
            }
            const pa = k ? pts[k - 1][i] : null;
            const ax = pa ? X(pa) : cx, ay = pa ? Y(pa) : cy;
            const g2 = glow((ax + X(a)) / 2, (ay + Y(a)) / 2);
            if (g2 > 0.02) {
              ctx!.strokeStyle = `rgba(${ACC},${g2 * 0.6 * dim})`;
              ctx!.beginPath();
              ctx!.moveTo(ax, ay);
              ctx!.lineTo(X(a), Y(a));
              ctx!.stroke();
            }
          }
      }

      // gotas de orvalho
      for (const row of pts)
        for (const p of row) {
          if (!p.dew) continue;
          const x = X(p), y = Y(p);
          const d = m.in ? Math.hypot(x - m.x, y - m.y) : 1e4;
          const g = d < 220 ? 1 - d / 220 : 0;
          ctx!.fillStyle = g > 0 ? `rgba(${ACC},${(0.3 + g * 0.7) * dim})` : `rgba(236,232,223,${0.22 * dim})`;
          ctx!.beginPath();
          ctx!.arc(x, y, 1.3 + g * 1.4, 0, 7);
          ctx!.fill();
        }
    }

    function stepSpider(now: number) {
      const active = m.in && now - m.last < 4500;
      let tx: number, ty: number;
      if (now < sp.flee) {
        tx = sp.x + (sp.x - m.x) * 2;
        ty = sp.y + (sp.y - m.y) * 2;
      } else if (active) {
        tx = m.x;
        ty = m.y;
      } else {
        const t = now / 1000;
        const mob = W < 768;
        tx = cx + Math.cos(t * 0.23) * W * (mob ? 0.28 : 0.17);
        ty = cy + Math.sin(t * 0.31) * H * (mob ? 0.08 : 0.22);
      }
      tx = Math.max(30, Math.min(W - 30, tx));
      ty = Math.max(30, Math.min(H - 30, ty));
      const dx = tx - sp.x, dy = ty - sp.y, d = Math.hypot(dx, dy);
      const maxS = (now < sp.flee ? 7 : 3.3) * S;
      const want = d > 30 * S ? Math.min(maxS, d * 0.05) : 0;
      const ux = d ? dx / d : 0, uy = d ? dy / d : 0;
      sp.vx += (ux * want - sp.vx) * 0.09;
      sp.vy += (uy * want - sp.vy) * 0.09;
      sp.x += sp.vx;
      sp.y += sp.vy;
      const spd = Math.hypot(sp.vx, sp.vy);
      const turn = (target: number, k: number) => {
        let da = target - sp.a;
        da = Math.atan2(Math.sin(da), Math.cos(da));
        sp.a += da * k;
      };
      if (spd > 0.25) turn(Math.atan2(sp.vy, sp.vx), 0.12);
      else if (active && d > 4) turn(Math.atan2(dy, dx), 0.05);

      let cur = legs.find((l) => l.t < 1)?.group ?? -1;
      for (const l of legs) {
        let [x, y] = world(REST_F[l.n], l.side * REST_L[l.n]);
        x += sp.vx * 7;
        y += sp.vy * 7;
        if (l.t < 1) {
          l.tx = x;
          l.ty = y;
          l.t = Math.min(1, l.t + 0.17);
          const e = l.t < 0.5 ? 2 * l.t * l.t : 1 - (-2 * l.t + 2) ** 2 / 2;
          l.fx = l.sx + (l.tx - l.sx) * e;
          l.fy = l.sy + (l.ty - l.sy) * e;
        } else {
          const off = Math.hypot(x - l.fx, y - l.fy);
          const thr = (spd > 0.25 ? 19 : 8) * S;
          if (off > thr && (cur === -1 || cur === l.group)) {
            cur = l.group;
            l.sx = l.fx;
            l.sy = l.fy;
            l.tx = x;
            l.ty = y;
            l.t = 0;
          }
        }
      }
    }

    function drawSpider(now: number) {
      const L1 = 25 * S, L2 = 31 * S;
      const g = ctx!.createRadialGradient(sp.x, sp.y, 0, sp.x, sp.y, 70 * S);
      g.addColorStop(0, "rgba(63,167,255,.18)");
      g.addColorStop(1, "rgba(63,167,255,0)");
      ctx!.fillStyle = g;
      ctx!.fillRect(sp.x - 70 * S, sp.y - 70 * S, 140 * S, 140 * S);

      ctx!.strokeStyle = "rgba(236,232,223,.92)";
      ctx!.fillStyle = "rgba(236,232,223,.9)";
      for (const l of legs) {
        const [hx, hy] = world(HIP_F[l.n], l.side * 4);
        let fx = l.fx, fy = l.fy;
        const dx = fx - hx, dy = fy - hy;
        let d = Math.hypot(dx, dy) || 1;
        const maxd = L1 + L2 - 1;
        if (d > maxd) {
          fx = hx + (dx / d) * maxd;
          fy = hy + (dy / d) * maxd;
          d = maxd;
        }
        d = Math.max(d, Math.abs(L1 - L2) + 1);
        const base = Math.atan2(dy, dx);
        const al = Math.acos(Math.min(1, Math.max(-1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
        const k1: [number, number] = [hx + Math.cos(base + al) * L1, hy + Math.sin(base + al) * L1];
        const k2: [number, number] = [hx + Math.cos(base - al) * L1, hy + Math.sin(base - al) * L1];
        const far = (k: [number, number]) => Math.hypot(k[0] - sp.x, k[1] - sp.y);
        const k = far(k1) > far(k2) ? k1 : k2;
        ctx!.lineWidth = 2 * S;
        ctx!.beginPath();
        ctx!.moveTo(hx, hy);
        ctx!.lineTo(k[0], k[1]);
        ctx!.stroke();
        ctx!.lineWidth = 1.15 * S;
        ctx!.beginPath();
        ctx!.moveTo(k[0], k[1]);
        ctx!.lineTo(fx, fy);
        ctx!.stroke();
        ctx!.beginPath();
        ctx!.arc(k[0], k[1], 1.4 * S, 0, 7);
        ctx!.fill();
      }

      ctx!.save();
      ctx!.translate(sp.x, sp.y);
      ctx!.rotate(sp.a);
      const br = 1 + Math.sin(now / 600) * 0.03;
      ctx!.fillStyle = "#0b0d12";
      ctx!.strokeStyle = "rgba(236,232,223,.92)";
      ctx!.lineWidth = 1.4 * S;
      ctx!.beginPath();
      ctx!.ellipse(-15 * S, 0, 13 * S * br, 9.5 * S * br, 0, 0, 7);
      ctx!.fill();
      ctx!.stroke();
      ctx!.strokeStyle = `rgba(${ACC},.95)`;
      ctx!.lineWidth = 1.3 * S;
      ctx!.beginPath();
      ctx!.moveTo(-8 * S, -3.6 * S);
      ctx!.lineTo(-12.5 * S, 0);
      ctx!.lineTo(-8 * S, 3.6 * S);
      ctx!.moveTo(-14 * S, -3.6 * S);
      ctx!.lineTo(-18.5 * S, 0);
      ctx!.lineTo(-14 * S, 3.6 * S);
      ctx!.stroke();
      ctx!.strokeStyle = "rgba(236,232,223,.92)";
      ctx!.lineWidth = 1.4 * S;
      ctx!.beginPath();
      ctx!.ellipse(2 * S, 0, 7.5 * S, 6.5 * S, 0, 0, 7);
      ctx!.fill();
      ctx!.stroke();
      ctx!.lineWidth = 1.1 * S;
      ctx!.beginPath();
      ctx!.moveTo(8 * S, -2.5 * S);
      ctx!.quadraticCurveTo(13 * S, -4.5 * S, 14.5 * S, -2 * S);
      ctx!.moveTo(8 * S, 2.5 * S);
      ctx!.quadraticCurveTo(13 * S, 4.5 * S, 14.5 * S, 2 * S);
      ctx!.stroke();
      ctx!.fillStyle = `rgb(${ACC})`;
      for (const [ex, ey] of [[6, -2], [6, 2], [4.3, -3.6], [4.3, 3.6]]) {
        ctx!.beginPath();
        ctx!.arc(ex * S, ey * S, 0.95 * S, 0, 7);
        ctx!.fill();
      }
      ctx!.restore();
    }

    let raf = 0, vis = true;
    const frame = (now: number) => {
      raf = 0;
      stepWeb(now);
      if (spider) stepSpider(now);
      ctx.clearRect(0, 0, W, H);
      drawWeb();
      if (spider) drawSpider(now);
      if (vis && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && !reduce && vis && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      drawWeb();
      if (spider) drawSpider(0);
    };

    size();
    if (reduce) drawStatic();
    else start();

    const ro = new ResizeObserver(() => {
      size();
      if (reduce) drawStatic();
    });
    ro.observe(cv.parentElement!);
    const io = new IntersectionObserver(([e]) => {
      vis = e.isIntersecting;
      start();
    });
    io.observe(cv);

    const onMove = (e: PointerEvent) => {
      const b = cv.getBoundingClientRect();
      m.x = e.clientX - b.left;
      m.y = e.clientY - b.top;
      m.in = m.x >= 0 && m.y >= 0 && m.x <= W && m.y <= H;
      m.last = performance.now();
    };
    const onDown = (e: PointerEvent) => {
      onMove(e);
      if (!m.in || (e.target as Element).closest?.("a,button")) return;
      ripples.push({ x: m.x, y: m.y, t: performance.now() });
      if (spider && Math.hypot(m.x - sp.x, m.y - sp.y) < 90 * S) sp.flee = performance.now() + 1100;
    };
    const onLeave = () => (m.in = false);
    const onVis = () => start();
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [spider, cxr, cyr, dim]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 block" />;
}
