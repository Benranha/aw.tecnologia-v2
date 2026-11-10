"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import WebCanvas from "./WebCanvas";
import { EASE, Magnetic, WA, Words } from "./ui";

const LINKS = [
  ["#sistema", "O sistema"],
  ["#servicos", "Serviços"],
  ["#para-quem", "Para quem"],
  ["#processo", "Como trabalhamos"],
  ["#duvidas", "Dúvidas"],
] as const;

export function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setSolid(scrollY > 40);
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid ? "border-b border-line bg-bg/90 backdrop-blur-xl" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-10">
          <a href="#topo" className="flex items-center gap-2.5" data-cursor="topo">
            <Image src="/logo-mark.png" alt="" width={30} height={29} priority />
            <span className="font-display text-[1.05rem] font-semibold tracking-tight">AW Tecnologia</span>
          </a>
          <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
            {LINKS.map(([h, t]) => (
              <a key={h} href={h} className="group relative py-2 text-sm text-fg/75 transition-colors hover:text-fg">
                {t}
                <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-accent transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Magnetic>
              <a
                href={WA}
                data-cursor="falar"
                className="hidden rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-accent sm:inline-block"
              >
                Falar no WhatsApp
              </a>
            </Magnetic>
            <button
              onClick={() => setOpen(true)}
              className="grid size-11 place-items-center rounded-full border border-line lg:hidden"
              aria-label="Abrir menu"
            >
              <span className="flex flex-col gap-1.5">
                <span className="h-px w-5 bg-fg" />
                <span className="h-px w-5 bg-fg" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="fixed inset-0 z-[60] flex flex-col bg-accent px-6 pb-10 pt-6 text-bg"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex justify-end">
              <button onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full border border-bg/30" aria-label="Fechar menu">
                ✕
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-2">
              {LINKS.map(([h, t], i) => (
                <motion.a
                  key={h}
                  href={h}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: EASE }}
                  className="font-display text-5xl font-semibold tracking-tight"
                >
                  {t}
                </motion.a>
              ))}
            </nav>
            <a href={WA} className="mt-auto rounded-full bg-bg px-6 py-4 text-center font-semibold text-fg">
              Falar no WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Hero() {
  return (
    <section id="topo" className="relative min-h-[100svh] overflow-hidden bg-bg">
      <WebCanvas />
      {/* leitura do texto sobre a teia */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_60%,#07080b_15%,transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />

      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-end px-5 pb-10 pt-28 md:justify-center md:px-10 md:pb-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="label mb-6 flex items-center gap-3 text-muted"
        >
          <span className="inline-block size-1.5 rounded-full bg-accent shadow-[0_0_12px_#3fa7ff]" />
          Manaus · desde 2003
        </motion.p>

        <Words
          as="h1"
          delay={0.3}
          text={"Tudo da sua empresa,\n*conectado.*\nNum lugar só."}
          className="max-w-[14ch] font-display text-[clamp(2.9rem,8.4vw,7.6rem)] font-semibold leading-[0.95] tracking-[-0.035em]"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          className="mt-7 max-w-[44ch] text-base text-fg/70 md:text-lg"
        >
          Sistemas, sites e aplicativos sob medida que juntam o que hoje está espalhado em planilhas, cadernos e
          grupos de WhatsApp. Cada pessoa vê o que precisa ver.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.05 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Magnetic>
            <a
              href="#sistema"
              data-cursor="testar"
              className="group inline-flex items-center gap-3 rounded-full bg-accent py-2 pl-6 pr-2 font-semibold text-bg transition-colors hover:bg-fg"
            >
              Testar um sistema ao vivo
              <span className="grid size-10 place-items-center rounded-full bg-bg text-fg transition-transform duration-500 group-hover:rotate-90">
                ↓
              </span>
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href={WA}
              data-cursor="falar"
              className="inline-flex items-center rounded-full border border-fg/25 px-6 py-4 font-semibold transition-colors hover:border-fg hover:bg-fg hover:text-bg"
            >
              Falar no WhatsApp
            </a>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="mt-14 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-5"
        >
          <dl className="flex gap-8 md:gap-12">
            {[
              ["22", "anos de mercado"],
              ["200+", "projetos entregues"],
              ["9", "frentes de serviço"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-display text-2xl font-semibold md:text-3xl">{n}</dt>
                <dd className="text-xs text-muted md:text-sm">{l}</dd>
              </div>
            ))}
          </dl>
          <p className="label hidden items-center gap-2 text-muted md:flex">
            <span className="text-accent">✦</span> mexa o mouse · clique na teia
          </p>
          <p className="label flex items-center gap-2 text-muted md:hidden">
            <span className="text-accent">✦</span> toque na teia
          </p>
        </motion.div>
      </div>
    </section>
  );
}
