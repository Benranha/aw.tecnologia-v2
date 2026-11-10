"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import WebCanvas from "./WebCanvas";
import { CountUp, EASE, Magnetic, Reveal, Tilt, WA, Words, useSpotlight } from "./ui";

/* ------------------------------ ícones ------------------------------ */
const I = {
  site: <path d="M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01" />,
  sistema: <path d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z" />,
  plataforma: <path d="M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5" />,
  app: <path d="M7 2h10v20H7zM11 18h2" />,
  erp: <path d="M4 7h16M4 12h16M4 17h10M18 15l3 2-3 2" />,
  helpdesk: <path d="M4 13a8 8 0 0 1 16 0v4h-3v-5h3M4 12v5h3v-5H4M17 17a5 5 0 0 1-5 4" />,
  crm: <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M17 8a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6" />,
  governanca: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3zM9 12l2 2 4-4" />,
  consultoria: <path d="M4 5h16v11H8l-4 4V5zM8 9h8M8 12h5" />,
};
function Icon({ d }: { d: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="size-7 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" aria-hidden>
      {d}
    </svg>
  );
}

/* ------------------------------ serviços ------------------------------ */
const SERV: { t: string; d: string; g: string; ic: React.ReactNode; wide?: boolean }[] = [
  { t: "Sistemas web", d: "ERPs, CRMs, intranets e sistemas sob medida que automatizam o que hoje é feito na mão.", g: "Construir", ic: I.sistema, wide: true },
  { t: "Websites e portais", d: "Sites institucionais, portais e landing pages pensados para converter e aparecer na busca.", g: "Construir", ic: I.site },
  { t: "Aplicativos mobile", d: "Apps para iOS e Android, integrados aos seus sistemas, para quem trabalha na rua.", g: "Construir", ic: I.app },
  { t: "Plataformas digitais", d: "E-commerce, educação online, marketplace e SaaS personalizados para o seu modelo de negócio.", g: "Construir", ic: I.plataforma, wide: true },
  { t: "Integração com ERP", d: "Seu sistema conversando com o ERP que você já usa. Fim do retrabalho, dados em tempo real.", g: "Conectar", ic: I.erp },
  { t: "Integração com CRM", d: "Relacionamento com clientes centralizado, para vender mais sem perder o fio.", g: "Conectar", ic: I.crm },
  { t: "Integração com HelpDesk", d: "As plataformas de suporte ligadas ao resto da empresa, sem ilhas de informação.", g: "Conectar", ic: I.helpdesk },
  { t: "Governança em TI", d: "Gestão de TI terceirizada, com processos, políticas e controles que fazem sentido.", g: "Orientar", ic: I.governanca, wide: true },
  { t: "Consultoria em tecnologia", d: "Apoio técnico na hora de contratar tecnologia, para não comprar gato por lebre.", g: "Orientar", ic: I.consultoria },
];
const G_CLS: Record<string, string> = { Construir: "text-accent", Conectar: "text-amber", Orientar: "text-ok" };

export function Services() {
  const ref = useSpotlight<HTMLDivElement>();
  return (
    <section id="servicos" className="relative bg-bg py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <Reveal kind="left">
              <p className="label mb-5 text-muted">O que a AW faz · 9 frentes</p>
            </Reveal>
            <Words text={"Construir. *Conectar.*\nOrientar."} className="font-display text-[clamp(2.4rem,6vw,5.4rem)] font-semibold leading-[0.95] tracking-[-0.035em]" />
          </div>
          <Reveal kind="right" delay={0.1}>
            <p className="max-w-[36ch] text-fg/60">Da ideia à entrega, e depois da entrega também. Uma casa só para o que hoje você resolve com cinco fornecedores.</p>
          </Reveal>
        </div>

        <div ref={ref} className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SERV.map((s, i) => (
            <Reveal key={s.t} delay={(i % 3) * 0.08} className={s.wide ? "lg:col-span-2" : ""}>
              <Tilt className="h-full">
                <article className="spot group flex h-full min-h-60 flex-col rounded-2xl border border-line bg-bg2 p-6 transition-colors duration-500 hover:bg-bg3 md:p-8" data-cursor="ver">
                  <div className="flex items-start justify-between">
                    <span className={G_CLS[s.g]}>
                      <Icon d={s.ic} />
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {String(i + 1).padStart(2, "0")} · <span className={G_CLS[s.g]}>{s.g}</span>
                    </span>
                  </div>
                  <h3 className="mt-auto pt-10 font-display text-2xl font-semibold tracking-tight md:text-[1.7rem]">{s.t}</h3>
                  <p className="mt-2 max-w-[48ch] text-sm leading-relaxed text-fg/55 transition-colors duration-500 group-hover:text-fg/80">{s.d}</p>
                </article>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ letreiro ------------------------------ */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-35%", "0%"]);
  const w1 = ["Sites", "Sistemas", "Aplicativos", "Integrações", "Sites", "Sistemas", "Aplicativos", "Integrações"];
  const w2 = ["Governança", "Consultoria", "Suporte", "Manaus", "Governança", "Consultoria", "Suporte", "Manaus"];
  return (
    <div ref={ref} className="overflow-hidden border-y border-line bg-bg py-10 md:py-14" aria-hidden>
      {[{ x: x1, w: w1 }, { x: x2, w: w2 }].map((row, k) => (
        <motion.div key={k} style={{ x: row.x }} className="flex whitespace-nowrap font-display text-[clamp(3rem,11vw,10rem)] font-bold uppercase leading-[1] tracking-[-0.04em]">
          {row.w.map((w, i) => (
            <span key={i} className="flex items-center">
              <span className="outline-text px-4 md:px-8">{w}</span>
              <span className="text-[0.4em] text-accent">✦</span>
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

/* ------------------------------ para quem ------------------------------ */
const PUB = [
  ["Comércio e varejo", "Estoque no caderno, venda no WhatsApp, caixa na planilha.", "Pedido, estoque e caixa conversando entre si, com alerta antes de faltar produto."],
  ["Prestadores de serviço", "Ordem de serviço perdida entre a recepção e o técnico.", "Cada ordem com dono, prazo e histórico, aberta até no celular de quem está em campo."],
  ["Clínicas e consultórios", "Agenda num lugar, atendimento noutro, financeiro num terceiro.", "Agenda, atendimento e financeiro juntos, com acesso separado por perfil."],
  ["Indústria e logística", "Ninguém sabe em que etapa o pedido está.", "Cada etapa visível, do pedido à entrega, com quem fez e quando."],
  ["Escolas e cursos", "Matrícula, mensalidade e recado para os pais, cada um num canto.", "Plataforma própria de ensino e gestão, do jeito da sua escola."],
  ["Empresas que cresceram", "O controle que servia para 5 pessoas não serve para 50.", "Um sistema que cresce junto, sem precisar começar tudo de novo."],
];

export function Audience() {
  const [open, setOpen] = useState<number | null>(0);
  const [hov, setHov] = useState<number | null>(null);
  return (
    <section id="para-quem" className="bg-paper py-24 text-ink md:py-36">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-10 lg:grid-cols-[0.9fr_1.4fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal kind="clip">
            <p className="label mb-5 text-accent-deep">Para quem</p>
          </Reveal>
          <Words
            accent="text-accent-deep"
            text={"Feito para quem tem empresa de verdade, *não* para quem coleciona software."}
            className="font-display text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-[1] tracking-[-0.03em]"
          />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-[38ch] text-ink-soft">Clique em cada linha para ver a dor de hoje e o que muda com o sistema.</p>
          </Reveal>
        </div>

        <ul className="border-t border-ink/15">
          {PUB.map(([t, dor, sol], i) => {
            const on = open === i || hov === i;
            const exp = open === i;
            return (
              <li key={t} className="border-b border-ink/15" onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
                <button
                  onClick={() => setOpen(exp ? null : i)}
                  aria-expanded={exp}
                  className="group relative w-full overflow-hidden py-6 text-left md:py-7"
                  data-cursor="abrir"
                >
                  <span className={`absolute inset-0 origin-bottom bg-ink transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${on ? "scale-y-100" : "scale-y-0"}`} />
                  <span className="relative flex items-center justify-between gap-6 px-2 md:px-5">
                    <span className={`flex items-baseline gap-4 transition-all duration-500 ${on ? "translate-x-2 text-paper" : ""}`}>
                      <span className={`font-mono text-xs ${on ? "text-accent" : "text-ink-soft"}`}>{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-display text-[clamp(1.4rem,2.8vw,2.4rem)] font-semibold tracking-tight">{t}</span>
                    </span>
                    <span className={`grid size-10 shrink-0 place-items-center rounded-full border text-lg transition-all duration-500 ${exp ? "rotate-45 border-accent bg-accent text-bg" : on ? "border-paper/40 text-paper" : "border-ink/20"}`}>+</span>
                  </span>
                  <AnimatePresence initial={false}>
                    {exp && (
                      <motion.span
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="relative block overflow-hidden"
                      >
                        <span className="grid gap-4 px-2 pt-5 md:grid-cols-2 md:px-5 md:pl-14">
                          <span className="block">
                            <span className="label block text-amber">Hoje</span>
                            <span className="mt-1 block text-paper/70">{dor}</span>
                          </span>
                          <span className="block">
                            <span className="label block text-accent">Com o sistema</span>
                            <span className="mt-1 block text-paper">{sol}</span>
                          </span>
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------ processo ------------------------------ */
const PASSOS = [
  ["Conversa", "Você conta como as coisas funcionam hoje, pelo WhatsApp ou pessoalmente. Sem compromisso e sem tecniquês."],
  ["Diagnóstico", "A gente mapeia onde a informação se perde e separa o que precisa mudar do que já funciona bem."],
  ["Desenho", "Você vê como as telas vão ficar antes do sistema ser construído, e ajusta o que for preciso."],
  ["Entregas em etapas", "Partes do sistema entram em uso cedo. Você vê a coisa andar em vez de esperar no escuro."],
  ["Suporte contínuo", "Manutenção, evolução e suporte técnico depois que tudo está no ar. A AW continua por perto."],
];

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const h = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section id="processo" className="relative overflow-hidden bg-bg py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-10 lg:grid-cols-2">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal kind="left">
            <p className="label mb-5 text-muted">Como trabalhamos</p>
          </Reveal>
          <Words text={"Sem mistério.\nSem *esperar no escuro.*"} className="font-display text-[clamp(2.2rem,5vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.03em]" />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-[40ch] text-fg/60">
              Em 22 anos, esse cenário já apareceu aqui muitas vezes. E ele tem solução. Quase nunca a solução é começar tudo de novo.
            </p>
          </Reveal>
        </div>
        <ol ref={ref} className="relative pl-10 md:pl-14">
          <span className="absolute left-3 top-2 bottom-2 w-px bg-line md:left-4" />
          <motion.span style={{ height: h }} className="absolute left-3 top-2 w-px bg-accent shadow-[0_0_14px_#3fa7ff] md:left-4" />
          {PASSOS.map(([t, d], i) => (
            <Reveal key={t} kind="right" delay={0.05} className="relative pb-14 last:pb-0">
              <span className="absolute -left-10 top-1 grid size-7 place-items-center rounded-full border border-accent bg-bg font-mono text-[10px] text-accent md:-left-[3.1rem]">
                {i + 1}
              </span>
              <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{t}</h3>
              <p className="mt-2 max-w-[46ch] text-fg/60">{d}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------ números ------------------------------ */
export function Stats() {
  const items: [number, string, string][] = [
    [22, "", "anos de mercado, desde 2003"],
    [200, "+", "projetos entregues"],
    [9, "", "frentes de serviço"],
    [0, "", "robôs no atendimento"],
  ];
  return (
    <section className="relative overflow-hidden bg-accent py-20 text-bg md:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-5 md:px-10 lg:grid-cols-4">
        {items.map(([n, s, l], i) => (
          <Reveal key={l} kind="scale" delay={i * 0.08}>
            <div className="border-t border-bg/25 pt-5">
              <CountUp to={n} suffix={s} className="font-display text-[clamp(3.6rem,8vw,7rem)] font-bold leading-none tracking-[-0.05em]" />
              <p className="mt-3 max-w-[18ch] text-sm font-medium text-bg/75">{l}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ dúvidas ------------------------------ */
const FAQ = [
  ["Quanto custa um sistema?", "Depende do tamanho do que precisa ser resolvido. Por isso a conversa vem antes do orçamento: a primeira conversa não custa nada, e você sai dela sabendo o caminho e o investimento."],
  ["Preciso jogar fora o que já uso?", "Quase nunca. Na maioria dos casos a AW integra o que já funciona (ERP, CRM, planilhas) e organiza o resto em volta."],
  ["Funciona no celular?", "Sim. O mesmo sistema funciona no computador da empresa e no celular de quem está na rua, com os mesmos dados nos dois."],
  ["Quanto tempo leva?", "Depende do escopo, mas as entregas são em etapas: partes do sistema entram em uso antes do projeto inteiro terminar."],
  ["E depois que o sistema entra no ar?", "A AW continua junto, com manutenção, evolução e suporte técnico. O sistema acompanha o crescimento da empresa."],
  ["Quem me atende?", "Alguém da equipe, não um robô. E se a AW não for a melhor saída para o seu caso, a gente diz isso também."],
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="duvidas" className="bg-bg2 py-24 md:py-36">
      <div className="mx-auto max-w-4xl px-5 md:px-10">
        <Reveal kind="clip">
          <p className="label mb-5 text-center text-muted">Dúvidas comuns</p>
        </Reveal>
        <Words text="Perguntas que todo mundo *faz.*" className="text-center font-display text-[clamp(2.2rem,5vw,4.2rem)] font-semibold leading-[1] tracking-[-0.03em]" />
        <div className="mt-14 divide-y divide-line border-y border-line">
          {FAQ.map(([q, a], i) => {
            const on = open === i;
            return (
              <div key={q}>
                <button onClick={() => setOpen(on ? null : i)} aria-expanded={on} className="group flex w-full items-center justify-between gap-6 py-6 text-left">
                  <span className={`font-display text-lg font-medium transition-colors md:text-2xl ${on ? "text-accent" : "group-hover:text-accent"}`}>{q}</span>
                  <motion.span animate={{ rotate: on ? 135 : 0 }} transition={{ duration: 0.4, ease: EASE }} className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-lg">
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }} className="overflow-hidden">
                      <p className="max-w-[60ch] pb-7 text-fg/65">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ fechamento ------------------------------ */
export function FinalCta() {
  return (
    <section id="contato" className="relative overflow-hidden bg-bg">
      <WebCanvas spider={false} cx={0.5} cy={0.55} dim={0.8} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,#07080b_75%)]" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-center px-5 py-28 text-center md:px-10">
        <Reveal kind="clip">
          <p className="label mb-6 text-muted">Falar com a AW</p>
        </Reveal>
        <Words
          text={"Não custa nada descobrir\nse dá pra *resolver.*"}
          className="font-display text-[clamp(2.4rem,7vw,6.6rem)] font-semibold leading-[0.95] tracking-[-0.04em]"
        />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-7 max-w-[46ch] text-fg/65 md:text-lg">
            A conversa começa no WhatsApp e quem responde é alguém da equipe, não um robô. Se a AW não for a melhor saída para o seu caso, a gente diz isso também.
          </p>
        </Reveal>
        <Reveal kind="scale" delay={0.3} className="mt-12">
          <Magnetic strength={0.45}>
            <a
              href={WA}
              data-cursor="bora!"
              className="group relative grid size-44 place-items-center overflow-hidden rounded-full bg-accent font-display text-lg font-semibold text-bg md:size-52"
            >
              <span className="absolute inset-0 translate-y-full rounded-full bg-fg transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0" />
              <span className="relative leading-tight">
                Chamar no
                <br />
                WhatsApp ↗
              </span>
            </a>
          </Magnetic>
        </Reveal>
        <a href={WA} className="mt-6 font-mono text-sm text-fg/60 underline-offset-4 hover:text-fg hover:underline">
          (92) 99346-2335
        </a>
      </div>
      <footer className="relative border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-xs text-muted md:px-10">
          <span className="font-display text-sm font-semibold text-fg">AW Tecnologia</span>
          <span>CNPJ 06.256.957/0001-80</span>
          <span>Manaus, Amazonas · desde 2003</span>
          <span>© 2026</span>
          <a href="#topo" className="text-fg/70 hover:text-accent">
            Voltar ao topo ↑
          </a>
        </div>
      </footer>
    </section>
  );
}

export function FloatWA() {
  return (
    <motion.a
      href={WA}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_30px_rgba(37,211,102,.45)]"
      aria-label="Falar no WhatsApp"
      data-cursor="oi!"
    >
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.4.8 3.2.6a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z" />
      </svg>
    </motion.a>
  );
}
