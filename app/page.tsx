import Image from "next/image";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import SystemDemo from "@/components/SystemDemo";

const WA = "https://wa.me/5592993462335";

const SERVICOS: [string, string][] = [
  ["Websites e portais", "Sites institucionais, portais corporativos e landing pages, otimizados para conversão e busca."],
  ["Sistemas web", "ERPs, CRMs, intranets e sistemas sob medida que automatizam processos."],
  ["Plataformas digitais", "E-commerce, educação online, marketplace e SaaS personalizados."],
  ["Aplicativos mobile", "Apps nativos e híbridos para iOS e Android, integrados aos seus sistemas."],
  ["Integração com ERP", "Conecta seu sistema aos ERPs do mercado, eliminando retrabalho, com dados em tempo real."],
  ["Integração com HelpDesk", "Unifica as plataformas de suporte ao resto do ecossistema."],
  ["Integração com CRM", "Centraliza o relacionamento com clientes e dá escala às vendas."],
  ["Governança em TI", "Gestão e governança de TI terceirizadas, com processos, políticas e controles."],
  ["Consultoria em tecnologia", "Apoio na contratação de serviços de tecnologia, com análise técnica."],
];

const DIFERENCIAIS: [string, string][] = [
  ["Equipe multidisciplinar.", "Designers, desenvolvedores e estrategistas trabalhando de forma integrada."],
  ["Metodologia ágil.", "Entregas em etapas, com você vendo a coisa andar em vez de esperar no escuro."],
  ["Suporte contínuo.", "Manutenção, evolução e suporte técnico depois que o sistema entra no ar."],
];

const wrap = "mx-auto w-full max-w-5xl px-5 md:px-8";
const kicker = "mb-5 text-[.7rem] uppercase tracking-[.14em] text-ink-soft";
const h2 = "max-w-[24ch] text-[1.9rem] leading-[1.12] md:text-5xl";
const btn =
  "inline-flex min-h-11 items-center rounded-[3px] bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-navy focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-navy";

export default function Home() {
  return (
    <>
      <header className="border-b border-rule bg-canvas">
        <div className={`${wrap} flex items-center justify-between gap-4 py-4`}>
          <a href="#topo" className="flex items-center gap-2.5">
            <Image src="/logo-mark.png" alt="" width={32} height={31} priority />
            <b className="font-display text-base font-semibold">AW Tecnologia</b>
          </a>
          <nav aria-label="Principal" className="flex items-center gap-5 text-sm font-semibold text-navy">
            <a href="#servicos" className="hidden min-h-11 items-center underline-offset-4 hover:underline sm:inline-flex">Serviços</a>
            <a href="#sobre" className="hidden min-h-11 items-center underline-offset-4 hover:underline sm:inline-flex">Sobre</a>
            <a href={WA} className="inline-flex min-h-11 items-center underline underline-offset-4">Falar pelo WhatsApp</a>
          </nav>
        </div>
      </header>

      <main id="topo">
        {/* 1 · Título */}
        <section className="bg-canvas">
          <div className={`${wrap} flex min-h-[88vh] flex-col justify-center py-14 md:py-22`}>
            <Reveal>
              <h1 className="max-w-[21ch] text-[clamp(2.5rem,6.2vw,4.2rem)] leading-[1.05]">
                Tudo num lugar só.<br />
                <span className="sm:whitespace-nowrap">Quem precisa ver, vê.</span>
              </h1>
              <p className="mt-5 max-w-[46ch] text-lg text-ink-soft">
                A AW desenvolve os sistemas, sites e aplicativos que juntam o que hoje está espalhado.
              </p>
              <a href={WA} className={`${btn} mt-7`}>Falar pelo WhatsApp</a>
              <p className="mt-10 border-t border-rule pt-4 text-sm text-ink-soft">22 anos · 200 projetos · Manaus, desde 2003</p>
            </Reveal>
          </div>
        </section>

        {/* 2 · Sistema (scroll opera a tela) */}
        <SystemDemo />

        {/* 3 · Serviços */}
        <section id="servicos" className="bg-canvas py-14 md:py-22">
          <div className={wrap}>
            <Reveal>
              <p className={kicker}>O que a AW faz</p>
              <h2 className={h2}>Nove frentes, uma casa só.</h2>
              <p className="mt-5 max-w-[46ch] text-lg text-ink-soft">Da ideia à entrega, e depois da entrega também.</p>
            </Reveal>
            <ul className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
              {SERVICOS.map(([t, d], k) => (
                <li key={t} className="border-t border-rule pb-6 pt-5">
                  <Reveal delay={(k % 3) * 60}>
                    <h3 className="mb-1.5 text-[1.02rem] leading-snug">{t}</h3>
                    <p className="text-sm text-ink-soft">{d}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 4 · Por que a AW */}
        <section id="sobre" className="bg-paper py-14 md:py-22">
          <div className={wrap}>
            <Reveal>
              <p className={kicker}>Desde 2003</p>
              <h2 className={h2}>Em 22 anos, esse cenário já apareceu aqui muitas vezes.</h2>
              <p className="mt-5 max-w-[46ch] text-lg text-ink-soft">E ele tem solução. Quase nunca a solução é começar tudo de novo.</p>
            </Reveal>
            <Reveal className="mt-10 grid gap-5 sm:grid-cols-3 sm:gap-8">
              <div>
                <div className="font-display text-[clamp(2.6rem,5vw,3.4rem)] leading-none text-accent"><CountUp to={22} /></div>
                <p className="mt-1.5 text-sm text-ink-soft">anos de mercado, desde 2003</p>
              </div>
              <div>
                <div className="font-display text-[clamp(2.6rem,5vw,3.4rem)] leading-none text-accent"><CountUp to={200} /></div>
                <p className="mt-1.5 text-sm text-ink-soft">projetos entregues</p>
              </div>
              <div>
                <div className="font-display text-[clamp(2.6rem,5vw,3.4rem)] leading-none text-accent">Manaus</div>
                <p className="mt-1.5 text-sm text-ink-soft">onde a equipe está</p>
              </div>
            </Reveal>
            <ul className="mt-10 grid max-w-3xl gap-4">
              {DIFERENCIAIS.map(([b, s], k) => (
                <li key={b}>
                  <Reveal delay={k * 70}>
                    <b className="font-semibold">{b}</b> <span className="text-[.9rem] text-ink-soft">{s}</span>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5 · Clientes (placeholder até confirmar nomes e autorização) */}
        <section className="bg-canvas py-14 md:py-22">
          <div className={wrap}>
            <Reveal>
              <p className={kicker}>Quem já passou por aqui</p>
              <h2 className={h2}>Duzentos projetos deixam muita gente pelo caminho.</h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-px border border-rule bg-rule md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, k) => (
                <div key={k} className="flex aspect-[16/7] items-center justify-center bg-canvas text-[.64rem] uppercase tracking-[.12em] text-[#a29eac]">
                  a preencher
                </div>
              ))}
            </div>
            <p className="mt-3 text-[.78rem] text-ink-soft">
              Espaço reservado. Nenhum cliente é exibido aqui antes de a AW confirmar o nome e a autorização.
            </p>
          </div>
        </section>

        {/* 6 · Fecho */}
        <section id="contato" className="bg-deep text-[#f3f0ea]">
          <div className={`${wrap} flex min-h-[88vh] flex-col justify-center py-14`}>
            <Reveal>
              <p className={`${kicker} text-[#8f8a9c]`}>Falar com a AW</p>
              <h2 className={h2}>Não custa nada descobrir se dá para resolver.</h2>
              <p className="mt-5 max-w-[42ch] text-lg">
                A conversa começa no WhatsApp, no{" "}
                <a href={WA} className="text-[#6fc3f0] underline underline-offset-4">(92) 99346-2335</a>, e quem
                responde é alguém da equipe, não um robô. Se a AW não for a melhor saída para o seu caso, a gente
                diz isso também.
              </p>
              <a href={WA} className={`${btn} mt-7`}>Falar pelo WhatsApp</a>
            </Reveal>
            <footer className="mt-14 flex flex-wrap gap-x-6 gap-y-1 border-t border-white/15 pt-6 text-xs text-[#8f8a9c]">
              <span>AW Tecnologia</span>
              <span>CNPJ 06.256.957/0001-80</span>
              <span>Manaus, Amazonas</span>
              <span>© 2026</span>
            </footer>
          </div>
        </section>
      </main>

      <a
        href={WA}
        className="fixed bottom-4 right-4 z-50 inline-flex min-h-11 items-center rounded-full bg-accent px-4.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgb(22_21_28/.22)] hover:bg-navy"
      >
        WhatsApp
      </a>
    </>
  );
}
