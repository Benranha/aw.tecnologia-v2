"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useScroll,
  useSpring,
  type Variants,
} from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;
export const WA = "https://wa.me/5592993462335";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollBar />
      <Cursor />
      {children}
    </MotionConfig>
  );
}

const KINDS: Record<string, Variants> = {
  up: { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -70 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 70 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } },
  clip: {
    hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
    show: { opacity: 1, clipPath: "inset(0 0 0% 0)" },
  },
};

export function Reveal({
  children,
  kind = "up",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  kind?: keyof typeof KINDS;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={KINDS[kind]}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Título que sobe palavra por palavra. Palavras entre *asteriscos* ganham destaque. */
export function Words({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  accent = "text-accent",
}: {
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  delay?: number;
  accent?: string;
}) {
  const lines = text.split("\n");
  return (
    <Tag className={className} aria-label={text.replace(/\*/g, "")}>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{ staggerChildren: 0.06, delayChildren: delay }}
      >
        {lines.map((line, li) => (
          <Fragment key={li}>
            {line.split(" ").map((w, i) => {
              const em = w.startsWith("*");
              const clean = w.replace(/\*/g, "");
              return (
                <Fragment key={i}>
                  <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
                    <motion.span
                      className={`inline-block ${em ? `font-serif italic font-normal ${accent}` : ""}`}
                      variants={{
                        hidden: { y: "110%", rotate: 4 },
                        show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: EASE } },
                      }}
                    >
                      {clean}
                    </motion.span>
                  </span>{" "}
                </Fragment>
              );
            })}
            {li < lines.length - 1 && <br />}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}

export function CountUp({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(to);
      return;
    }
    const c = animate(0, to, { duration: 2, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className={className} aria-label={`${to}${suffix}`}>
      <span aria-hidden>{v}</span>
      {suffix && (
        <span aria-hidden className="ml-1 align-top text-[0.45em]">
          {suffix}
        </span>
      )}
    </span>
  );
}

/** Puxa o conteúdo na direção do mouse, como um ímã. */
export function Magnetic({
  children,
  strength = 0.35,
  className = "",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 180, damping: 14, mass: 0.4 });
  const y = useSpring(0, { stiffness: 180, damping: 14, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={`inline-block ${className}`}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/** Spotlight: atualiza --mx/--my de cada .spot dentro do container. */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      el.querySelectorAll<HTMLElement>(".spot").forEach((c) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", `${e.clientX - r.left}px`);
        c.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);
  return ref;
}

/** Inclina o elemento em 3D conforme o mouse. */
export function Tilt({
  children,
  className = "",
  max = 7,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 150, damping: 15 });
  const ry = useSpring(0, { stiffness: 150, damping: 15 });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = ref.current!.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry.set(px * max * 2);
        rx.set(-py * max * 2);
      }}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

function ScrollBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[90] h-[2px] origin-left bg-accent"
    />
  );
}

function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOn(true);
  }, []);
  useEffect(() => {
    if (!on) return;
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = (e.target as Element | null)?.closest?.("a,button,[data-cursor]") as HTMLElement | null;
      const r = ring.current;
      if (!r) return;
      r.dataset.hover = t ? "1" : "0";
      if (label.current) label.current.textContent = t?.dataset.cursor ?? (t ? "clique" : "");
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const loop = () => {
      raf = 0;
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      if (ring.current) ring.current.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      if (Math.abs(x - cx) + Math.abs(y - cy) > 0.3) raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move, { passive: true });
    return () => {
      removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [on]);
  if (!on) return null;
  return (
    <div ref={ring} className="cursor-ring" aria-hidden>
      <span ref={label} />
    </div>
  );
}
