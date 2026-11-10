"use client";
import { useEffect, useRef, useState } from "react";

type Status = "aberto" | "campo" | "feito";
const ORDENS: {
  id: number; ttl: string; st: Status; n: string; pt: string; trail: [string, string][];
}[] = [
  { id: 1042, ttl: "Ar-condicionado, sala 3", st: "campo", n: "i",
    pt: "A informação já está lá. Ninguém procura em quatro lugares antes de responder um cliente.",
    trail: [["08:12", "Aberta por Recepção"], ["09:04", "Atribuída a R. Nogueira"], ["10:21", "Técnico a caminho"], ["11:35", "Em atendimento"]] },
  { id: 1041, ttl: "Troca de roteador, loja 2", st: "feito", n: "ii",
    pt: "Fica registrado o que foi feito, por quem e quando, para a resposta existir quando alguém perguntar.",
    trail: [["07:50", "Aberta por Operação"], ["08:15", "Atribuída a C. Lima"], ["09:40", "Peça retirada do estoque"], ["10:58", "Concluída e assinada"]] },
  { id: 1040, ttl: "Ponto de rede, depósito", st: "aberto", n: "iii",
    pt: "Quem é do financeiro vê o financeiro. Quem é da operação vê a operação. Cada um encontra o que é seu.",
    trail: [["11:02", "Aberta por Almoxarifado"], ["11:09", "Aguardando aprovação"], ["11:40", "Aprovada por Diretoria"]] },
  { id: 1038, ttl: "Suporte ao PDV, caixa 4", st: "campo", n: "iv",
    pt: "Funciona no computador da empresa e no celular de quem está na rua, com os mesmos dados nos dois.",
    trail: [["13:05", "Aberta por Financeiro"], ["13:18", "Atribuída a C. Lima"], ["14:02", "Em atendimento pelo celular"]] },
];
const CHIP: Record<Status, [string, string]> = {
  aberto: ["text-wait", "Aguardando"],
  campo: ["text-accent", "Em campo"],
  feito: ["text-ok", "Concluída"],
};
const count = (s: Status) => ORDENS.filter((o) => o.st === s).length;

export default function SystemDemo() {
  const section = useRef<HTMLElement>(null);
  const [p, setP] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setStill(reduce.matches);
    update();
    reduce.addEventListener("change", update);
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = section.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        setP(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0);
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    return () => {
      reduce.removeEventListener("change", update);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  const t = Math.min(0.99999, p) * ORDENS.length;
  const i = still ? 0 : Math.min(ORDENS.length - 1, Math.floor(t));
  const inside = t - i;
  const o = ORDENS[i];

  return (
    <section ref={section} id="sistema" className="bg-paper" style={{ height: still ? "auto" : "300vh" }}>
      <div className={still ? "" : "sticky top-0 flex min-h-screen items-center"}>
        <div className="mx-auto w-full max-w-5xl px-5 py-5 md:px-8 md:py-12">
          <p className="mb-2 text-[.7rem] md:mb-5 uppercase tracking-[.14em] text-ink-soft">O sistema, funcionando</p>
          <h2 className="hidden max-w-[26ch] text-xl leading-tight md:block md:text-4xl">
            Vocês cresceram. O jeito de controlar precisa crescer junto.
          </h2>

          <div className="mt-3 grid gap-3 md:mt-8 md:grid-cols-[1.35fr_1fr] md:gap-10">
            <div className="overflow-hidden rounded-md border border-rule bg-white shadow-[0_10px_30px_rgb(22_21_28/.09)] md:order-none">
              <div className="flex items-center gap-2 border-b border-rule bg-[#f7f5f1] px-3.5 py-2.5">
                <span className="size-2 rounded-full bg-[#d6d0c6]" /><span className="size-2 rounded-full bg-[#d6d0c6]" /><span className="size-2 rounded-full bg-[#d6d0c6]" />
                <span className="ml-2 text-xs font-semibold">Ordens de serviço</span>
                <span className="ml-auto rounded-full border border-rule px-2 py-0.5 text-[.62rem] uppercase tracking-widest text-[#7b7685]">dados de exemplo</span>
              </div>
              <div className="grid min-h-0 md:min-h-76 md:grid-cols-[1.25fr_1fr]">
                <div className="border-b border-rule md:border-b-0 md:border-r">
                  {ORDENS.map((x, k) => (
                    <div key={x.id}
                      className={`grid grid-cols-[3.6rem_1fr_auto] items-center gap-3 border-b border-ink/10 px-3.5 py-2 text-[.8rem] md:py-3 transition-colors last:border-b-0 ${k === i ? "bg-[#eaf4fb] shadow-[inset_3px_0_0_var(--color-accent)]" : ""}`}>
                      <span className="tabular-nums text-[#7b7685]">#{x.id}</span>
                      <span>{x.ttl}</span>
                      <span className={`whitespace-nowrap rounded-full border border-current px-2 py-0.5 text-[.66rem] ${CHIP[x.st][0]}`}>{CHIP[x.st][1]}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <div className="text-xs uppercase tracking-wider text-[#7b7685]">Histórico da ordem</div>
                  <div className="font-display mb-3 text-lg">#{o.id}</div>
                  <ol>
                    {o.trail.map(([h, who], k) => {
                      const ini = (k + 0.15) / (o.trail.length + 0.35);
                      const a = still ? 1 : Math.max(0, Math.min(1, (inside - ini) / 0.22));
                      return (
                        <li key={h} className="grid grid-cols-[3.2rem_1fr] gap-2.5 border-b border-ink/10 py-1 text-xs"
                          style={{ opacity: a, transform: `translateY(${(1 - a) * 5}px)` }}>
                          <span className="tabular-nums text-[#7b7685]">{h}</span>
                          <span className="text-ink-soft">{who}</span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-rule bg-[#f7f5f1] px-3.5 py-2.5 text-xs text-ink-soft">
                <span><b className="tabular-nums text-ink">{count("aberto")}</b> aguardando</span>
                <span><b className="tabular-nums text-ink">{count("campo")}</b> em campo</span>
                <span><b className="tabular-nums text-ink">{count("feito")}</b> concluídas</span>
              </div>
            </div>

            <div className="md:self-start max-md:order-first" aria-live="polite">
              <p className="font-display mb-2 text-accent">{o.n}</p>
              <p className="font-display text-[.95rem] leading-snug md:min-h-[6.5em] md:text-3xl">{o.pt}</p>
            </div>
          </div>
          <p className="mt-3 hidden text-xs text-ink-soft md:block">Tela de demonstração, com dados de exemplo. Os números do rodapé são calculados a partir da própria lista.</p>
        </div>
      </div>
    </section>
  );
}
