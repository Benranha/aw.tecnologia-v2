"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

/* Seis lugares onde a informação se perde hoje. Ao rolar, cada pedaço
   endireita, encaixa numa janela e vira um painel do sistema. */

type Pos = { x: number; y: number; r: number };
type C = { d: Pos; m: Pos; chaos: React.ReactNode; order: React.ReactNode };

const fs = "text-[clamp(9px,1.05vw,13px)]";

function Ord({ k, v, sub, bar }: { k: string; v: string; sub: string; bar?: number[] }) {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-line bg-bg3 p-[7%]">
      <span className={`font-mono uppercase tracking-widest text-muted ${fs}`}>{k}</span>
      <div>
        <div className="font-display text-[clamp(13px,1.9vw,24px)] font-semibold leading-tight text-fg">{v}</div>
        <div className={`mt-1 text-muted ${fs}`}>{sub}</div>
      </div>
      {bar ? (
        <div className="flex h-[18%] items-end gap-[4%]">
          {bar.map((b, i) => (
            <span key={i} className="flex-1 rounded-sm bg-accent/80" style={{ height: `${b}%` }} />
          ))}
        </div>
      ) : (
        <div className="h-1 w-full overflow-hidden rounded bg-line">
          <div className="h-full w-2/3 bg-ok" />
        </div>
      )}
    </div>
  );
}

const CARDS: C[] = [
  {
    d: { x: 1, y: 4, r: -8 },
    m: { x: 2, y: 3, r: -8 },
    chaos: (
      <div className="flex h-full flex-col overflow-hidden rounded-md bg-[#f4f6f2] text-[#1b3a26] shadow-2xl">
        <div className={`truncate bg-[#1f7a46] px-[6%] py-[5%] leading-tight font-mono text-white ${fs}`}>Planilha_FINAL_v3_agora_vai.xlsx</div>
        <div className="grid flex-1 grid-cols-4 grid-rows-5">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className={`border-b border-r border-[#c9d3cb] px-1 font-mono ${fs} ${i === 9 ? "bg-red-100 font-bold text-red-600" : ""}`}>
              {i === 9 ? "#REF!" : i % 4 === 0 ? ["Cliente", "João", "Maria?", "ver c/ Ana", ""][i / 4] : ""}
            </span>
          ))}
        </div>
      </div>
    ),
    order: <Ord k="Pedidos" v="18 em aberto" sub="atualizado agora" bar={[40, 65, 50, 85, 70, 95]} />,
  },
  {
    d: { x: 64, y: 1, r: 6 },
    m: { x: 52, y: 1, r: 7 },
    chaos: (
      <div className="flex h-full flex-col justify-center gap-[6%] rounded-2xl bg-[#0b141a] p-[7%] shadow-2xl">
        <span className={`font-mono text-[#8696a0] ${fs}`}>Grupo: Operação 🔥 (47)</span>
        <div className={`self-start rounded-lg rounded-tl-none bg-[#202c33] px-[7%] py-[5%] text-[#e9edef] ${fs}`}>
          Alguém sabe se o pedido do João saiu??
        </div>
        <div className={`self-end rounded-lg rounded-tr-none bg-[#005c4b] px-[7%] py-[5%] text-[#e9edef] ${fs}`}>
          acho q sim, pergunta pro Pedro
        </div>
        <span className={`text-right font-mono text-[#8696a0] ${fs}`}>✓✓ visto por 14</span>
      </div>
    ),
    order: <Ord k="Pedido #1042" v="Saiu para entrega" sub="10:21 · R. Nogueira" />,
  },
  {
    d: { x: 37, y: 30, r: -4 },
    m: { x: 27, y: 33, r: -4 },
    chaos: (
      <div className="flex h-full flex-col justify-center bg-[#ffe066] p-[9%] text-[#3a2f00] shadow-2xl [clip-path:polygon(0_0,100%_2%,98%_100%,2%_97%)]">
        <span className="font-serif text-[clamp(14px,2.2vw,30px)] italic leading-none">LIGAR P/ FORNECEDOR!!!</span>
        <span className="mt-2 font-serif text-[clamp(11px,1.4vw,18px)] italic">(urgente, acabou o toner)</span>
      </div>
    ),
    order: <Ord k="Alerta automático" v="Repor toner" sub="estoque abaixo do mínimo" />,
  },
  {
    d: { x: 4, y: 57, r: 5 },
    m: { x: 3, y: 56, r: 6 },
    chaos: (
      <div
        className="flex h-full flex-col justify-center bg-[#fbf8f1] p-[8%] pl-[16%] text-[#2a2a6e] shadow-2xl"
        style={{ backgroundImage: "repeating-linear-gradient(#fbf8f1 0 18px,#cfd8e8 18px 19px)", boxShadow: "inset 10% 0 0 0 #f2b8b8" }}
      >
        <span className="font-serif text-[clamp(13px,1.8vw,24px)] italic">Fiado:</span>
        <span className="font-serif text-[clamp(12px,1.6vw,21px)] italic">Sr. Carlos — R$ 230</span>
        <span className="font-serif text-[clamp(11px,1.3vw,17px)] italic text-red-700">pagou?? ver depois</span>
      </div>
    ),
    order: <Ord k="Contas a receber" v="R$ 230,00" sub="Sr. Carlos · vence sexta" />,
  },
  {
    d: { x: 66, y: 50, r: -6 },
    m: { x: 53, y: 52, r: -6 },
    chaos: (
      <div className="flex h-full flex-col gap-[5%] rounded-md bg-white p-[7%] text-[#202124] shadow-2xl">
        <span className={`font-mono text-[#5f6368] ${fs}`}>Caixa de entrada (1.284)</span>
        <span className={`font-semibold ${fs}`}>RE: RE: RE: ENC: orçamento atualizado (2)</span>
        <span className={`text-[#5f6368] ${fs}`}>Segue a versão certa agora, desconsiderar a anterior…</span>
        <span className={`mt-auto font-mono text-[#5f6368] ${fs}`}>📎 orcamento_final_FINAL.pdf</span>
      </div>
    ),
    order: <Ord k="Orçamentos" v="4 aguardando" sub="aprovação da diretoria" bar={[60, 60, 60, 60]} />,
  },
  {
    d: { x: 35, y: 63, r: 8 },
    m: { x: 28, y: 76, r: 6 },
    chaos: (
      <div className="flex h-full items-center gap-[7%] rounded-full bg-[#2b2f3a] px-[9%] text-[#f3f0ea] shadow-2xl">
        <span className="grid aspect-square w-[24%] shrink-0 place-items-center rounded-full bg-amber text-[clamp(14px,2vw,26px)]">🤷</span>
        <span className={`leading-snug ${fs}`}>“Só a Dona Marta sabe onde fica isso. Ela tá de férias.”</span>
      </div>
    ),
    order: <Ord k="Histórico" v="Quem, o quê, quando" sub="tudo registrado, sempre" />,
  },
];

function ordered(i: number, mob: boolean) {
  if (mob) {
    const w = 44.5, h = 26.5;
    return { x: 4 + (i % 2) * (w + 3), y: 11 + Math.floor(i / 2) * (h + 2), w, h };
  }
  const w = 29.3, h = 39;
  return { x: 4 + (i % 3) * (w + 2), y: 15 + Math.floor(i / 3) * (h + 3), w, h };
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function Piece({ c, i, e, mob }: { c: C; i: number; e: MotionValue<number>; mob: boolean }) {
  const ch = mob ? c.m : c.d;
  const o = ordered(i, mob);
  const left = useTransform(e, (v) => `${lerp(ch.x, o.x, v)}%`);
  const top = useTransform(e, (v) => `${lerp(ch.y, o.y, v)}%`);
  const rotate = useTransform(e, (v) => lerp(ch.r, 0, v));
  const a = useTransform(e, [0.35, 0.6], [1, 0]);
  const b = useTransform(e, [0.45, 0.72], [0, 1]);
  return (
    <motion.div
      style={{ left, top, rotate, width: `${o.w}%`, height: `${o.h}%`, zIndex: 10 + i }}
      whileHover={{ scale: 1.06, zIndex: 40 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className="absolute"
      data-cursor="ei!"
    >
      <motion.div style={{ opacity: a }} className="absolute inset-0">
        {c.chaos}
      </motion.div>
      <motion.div style={{ opacity: b }} className="absolute inset-0">
        {c.order}
      </motion.div>
    </motion.div>
  );
}

export default function Chaos() {
  const ref = useRef<HTMLElement>(null);
  const [mob, setMob] = useState(false);
  useEffect(() => {
    const q = matchMedia("(max-width: 900px)");
    const f = () => setMob(q.matches);
    f();
    q.addEventListener("change", f);
    return () => q.removeEventListener("change", f);
  }, []);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const e = useTransform(p, (v) => {
    const t = Math.min(1, Math.max(0, (v - 0.12) / 0.58));
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  });
  const frameO = useTransform(e, [0.4, 0.85], [0, 1]);
  const frameS = useTransform(e, [0.4, 0.85], [0.94, 1]);
  const h1 = useTransform(e, [0.25, 0.48], [1, 0]);
  const h1y = useTransform(e, [0.25, 0.48], [0, -30]);
  const h2 = useTransform(e, [0.52, 0.75], [0, 1]);
  const h2y = useTransform(e, [0.52, 0.75], [30, 0]);
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative h-[320vh] bg-bg" aria-label="Do caos ao sistema">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden lg:flex-row lg:items-center">
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-20 md:px-10 lg:absolute lg:inset-x-0 lg:top-1/2 lg:-translate-y-1/2 lg:pt-0">
          <div className="relative h-[8.5rem] sm:h-[9.5rem] lg:h-[24rem] lg:w-[34%]">
            <motion.div style={{ opacity: h1, y: h1y }} className="absolute inset-0 flex flex-col justify-end lg:justify-center">
              <p className="label mb-4 text-amber">Hoje</p>
              <h2 className="font-display text-[clamp(1.7rem,3.6vw,3.4rem)] font-semibold leading-[1.02] tracking-tight">
                A informação mora em <span className="font-serif font-normal italic text-amber">seis lugares</span> diferentes.
              </h2>
              <p className="mt-4 hidden max-w-[34ch] text-fg/60 lg:block">
                E sempre falta justamente aquela que alguém pediu agora. Role para ver o que acontece.
              </p>
            </motion.div>
            <motion.div style={{ opacity: h2, y: h2y }} className="absolute inset-0 flex flex-col justify-end lg:justify-center">
              <p className="label mb-4 text-accent">Com a AW</p>
              <h2 className="font-display text-[clamp(1.7rem,3.6vw,3.4rem)] font-semibold leading-[1.02] tracking-tight">
                Tudo num lugar só. <span className="font-serif font-normal italic text-accent">Quem precisa ver, vê.</span>
              </h2>
              <p className="mt-4 hidden max-w-[34ch] text-fg/60 lg:block">
                Sem jogar fora o que já funciona. A gente organiza, conecta e coloca no ar.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="relative mx-auto mt-2 w-full max-w-7xl flex-1 px-5 pb-6 md:px-10 lg:mt-0 lg:flex lg:h-full lg:items-center lg:justify-end lg:pb-0">
          <div className="relative mx-auto aspect-[3/4.6] max-h-full w-full max-w-[420px] lg:mx-0 lg:aspect-[16/10.5] lg:w-[62%] lg:max-w-none">
            <motion.div
              style={{ opacity: frameO, scale: frameS }}
              className="absolute inset-0 rounded-2xl border border-line bg-bg2 shadow-[0_40px_120px_-20px_rgba(63,167,255,.25)]"
            >
              <div className="flex h-[8%] items-center gap-2 border-b border-line px-[3%] lg:h-[11%]">
                <span className="size-2 rounded-full bg-[#ff5f57]" />
                <span className="size-2 rounded-full bg-[#febc2e]" />
                <span className="size-2 rounded-full bg-[#28c840]" />
                <span className="ml-3 font-mono text-[10px] uppercase tracking-widest text-muted">painel · sua empresa</span>
              </div>
            </motion.div>
            {CARDS.map((c, i) => (
              <Piece key={i} c={c} i={i} e={e} mob={mob} />
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 hidden w-40 -translate-x-1/2 lg:block">
          <div className="h-px w-full bg-line">
            <motion.div style={{ width: bar }} className="h-px bg-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}
