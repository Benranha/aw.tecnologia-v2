"use client";
import { useReducer, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { EASE, Reveal, Words } from "./ui";

/* =====================================================================
   Um sistema de controle simples, funcionando de verdade no navegador.
   Pedidos, estoque e histórico conversam entre si, e o perfil escolhido
   decide o que cada pessoa enxerga. Dados de exemplo, sem marca.
   ===================================================================== */

const ST = ["novo", "separando", "entrega", "concluido"] as const;
type St = (typeof ST)[number];
const ST_LABEL: Record<St, string> = { novo: "Novo", separando: "Separando", entrega: "Em entrega", concluido: "Concluído" };
const ST_CLS: Record<St, string> = {
  novo: "bg-[#fff1d6] text-[#9a5b00] ring-[#f2c66d]",
  separando: "bg-[#dcefff] text-[#0f63ad] ring-[#8cc6f5]",
  entrega: "bg-[#d9f4f1] text-[#0b7a72] ring-[#7fd6cc]",
  concluido: "bg-[#ddf5e6] text-[#18794a] ring-[#8edcb0]",
};
const ST_BAR: Record<St, string> = { novo: "#f2b544", separando: "#3fa7ff", entrega: "#22b8a8", concluido: "#3fcf8e" };

type Role = "gerente" | "vendas" | "estoque";
const ROLES: { id: Role; label: string; who: string }[] = [
  { id: "gerente", label: "Gerência", who: "Ana" },
  { id: "vendas", label: "Vendas", who: "Bruno" },
  { id: "estoque", label: "Estoque", who: "Carla" },
];
const CAN = {
  verValores: (r: Role) => r !== "estoque",
  verFaturamento: (r: Role) => r === "gerente",
  verEstoque: (r: Role) => r !== "vendas",
  novoPedido: (r: Role) => r !== "estoque",
  repor: (r: Role) => r !== "vendas",
};

type Order = { id: number; cliente: string; sku: string; qtd: number; valor: number; st: St };
type Item = { sku: string; nome: string; qtd: number; min: number; preco: number };
type Log = { id: number; hora: string; txt: string; tipo: "info" | "ok" | "warn" };
type State = { orders: Order[]; stock: Item[]; log: Log[]; clock: number; nextId: number; logId: number; touched: boolean };
type Action =
  | { type: "advance"; id: number; role: Role }
  | { type: "novo"; role: Role }
  | { type: "repor"; sku: string; delta: number; role: Role }
  | { type: "reset" };

const STOCK: Item[] = [
  { sku: "TON-01", nome: "Toner preto", qtd: 5, min: 4, preco: 210 },
  { sku: "A4-500", nome: "Papel A4 (caixa)", qtd: 24, min: 10, preco: 63 },
  { sku: "CAD-02", nome: "Cadeira de escritório", qtd: 4, min: 2, preco: 690 },
  { sku: "MON-24", nome: "Monitor 24”", qtd: 3, min: 2, preco: 890 },
  { sku: "TEC-SF", nome: "Teclado sem fio", qtd: 12, min: 5, preco: 89 },
];
const nomeDe = (sku: string) => STOCK.find((s) => s.sku === sku)!.nome;
const CLIENTES = ["Ótica Visão", "Construtora Norte", "Pet Shop Amigo", "Hotel Tropical", "Academia Força", "Colégio Saber"];

const hora = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const INIT: State = {
  orders: [
    { id: 1045, cliente: "Escola Aprender", sku: "MON-24", qtd: 2, valor: 1780, st: "novo" },
    { id: 1044, cliente: "Oficina Rio Negro", sku: "TEC-SF", qtd: 4, valor: 356, st: "novo" },
    { id: 1043, cliente: "Clínica Bem-Estar", sku: "TON-01", qtd: 2, valor: 420, st: "separando" },
    { id: 1042, cliente: "Padaria Central", sku: "A4-500", qtd: 3, valor: 189, st: "entrega" },
    { id: 1041, cliente: "Mercadinho Bom Preço", sku: "CAD-02", qtd: 1, valor: 690, st: "concluido" },
  ],
  stock: STOCK,
  log: [
    { id: 3, hora: "08:41", txt: "Pedido #1042 saiu para entrega · Ana", tipo: "info" },
    { id: 2, hora: "08:20", txt: "Faturado R$ 690,00 · Mercadinho Bom Preço", tipo: "ok" },
    { id: 1, hora: "08:02", txt: "Sistema aberto · bom dia!", tipo: "info" },
  ],
  clock: 8 * 60 + 47,
  nextId: 1046,
  logId: 3,
  touched: false,
};

function reducer(s: State, a: Action): State {
  if (a.type === "reset") return INIT;
  const clock = s.clock + 6 + ((s.logId * 7) % 9);
  const who = ROLES.find((r) => r.id === a.role)!.who;
  const add = (msgs: Omit<Log, "id" | "hora">[]) => {
    let id = s.logId;
    const nl = msgs.map((m) => ({ ...m, id: ++id, hora: hora(clock) }));
    return { log: [...nl.reverse(), ...s.log].slice(0, 40), logId: id, clock, touched: true };
  };

  if (a.type === "advance") {
    const o = s.orders.find((x) => x.id === a.id);
    if (!o || o.st === "concluido") return s;
    const next = ST[ST.indexOf(o.st) + 1];
    let stock = s.stock;
    const msgs: Omit<Log, "id" | "hora">[] = [];
    if (next === "separando") {
      const it = s.stock.find((i) => i.sku === o.sku)!;
      if (it.qtd < o.qtd) {
        return { ...s, ...add([{ txt: `Sem estoque para #${o.id}: faltam ${o.qtd - it.qtd} × ${it.nome}`, tipo: "warn" }]) };
      }
      stock = s.stock.map((i) => (i.sku === o.sku ? { ...i, qtd: i.qtd - o.qtd } : i));
      const now = it.qtd - o.qtd;
      msgs.push({ txt: `Pedido #${o.id} em separação · ${who}`, tipo: "info" });
      msgs.push({ txt: `Estoque baixou sozinho: ${it.nome} −${o.qtd} (restam ${now})`, tipo: "info" });
      if (now <= it.min) msgs.push({ txt: `Alerta: ${it.nome} abaixo do mínimo`, tipo: "warn" });
    } else if (next === "entrega") {
      msgs.push({ txt: `Pedido #${o.id} saiu para entrega · ${who}`, tipo: "info" });
    } else {
      msgs.push({ txt: `Faturado ${brl(o.valor)} · ${o.cliente}`, tipo: "ok" });
    }
    return { ...s, stock, orders: s.orders.map((x) => (x.id === o.id ? { ...x, st: next } : x)), ...add(msgs) };
  }

  if (a.type === "novo") {
    const n = s.nextId;
    const it = s.stock[n % s.stock.length];
    const qtd = 1 + (n % 3);
    const o: Order = { id: n, cliente: CLIENTES[n % CLIENTES.length], sku: it.sku, qtd, valor: it.preco * qtd, st: "novo" };
    return { ...s, nextId: n + 1, orders: [o, ...s.orders], ...add([{ txt: `Novo pedido #${n} · ${o.cliente} · ${who}`, tipo: "info" }]) };
  }

  const it = s.stock.find((i) => i.sku === a.sku)!;
  return {
    ...s,
    stock: s.stock.map((i) => (i.sku === a.sku ? { ...i, qtd: Math.max(0, i.qtd + a.delta) } : i)),
    ...add([{ txt: `Estoque: ${it.nome} ${a.delta > 0 ? "+" : ""}${a.delta} · ${who}`, tipo: a.delta > 0 ? "ok" : "info" }]),
  };
}

type Tab = "painel" | "pedidos" | "estoque";

function Lock({ txt }: { txt: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-paper2 px-2 py-1 text-[11px] text-ink-soft">
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none" aria-hidden>
        <rect x="1" y="5" width="8" height="6.5" rx="1.5" stroke="currentColor" />
        <path d="M3 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" />
      </svg>
      {txt}
    </span>
  );
}

function Chip({ st, onClick, pulse }: { st: St; onClick?: () => void; pulse?: boolean }) {
  const done = st === "concluido";
  return (
    <motion.button
      layout
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      disabled={done}
      data-cursor={done ? undefined : "avançar"}
      title={done ? "Concluído" : `Avançar para ${ST_LABEL[ST[ST.indexOf(st) + 1]]}`}
      className={`relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 transition-shadow ${ST_CLS[st]} ${
        done ? "cursor-default" : "hover:shadow-[0_0_0_3px_rgba(63,167,255,.25)]"
      } ${pulse ? "pulse" : ""}`}
    >
      <span className="size-1.5 rounded-full" style={{ background: ST_BAR[st] }} />
      {ST_LABEL[st]}
      {!done && <span aria-hidden className="opacity-60">→</span>}
    </motion.button>
  );
}

function App() {
  const [s, dispatch] = useReducer(reducer, INIT);
  const [role, setRole] = useState<Role>("gerente");
  const [tab, setTab] = useState<Tab>("painel");
  const [filtro, setFiltro] = useState<St | "todos">("todos");

  const changeRole = (r: Role) => {
    setRole(r);
    if (tab === "estoque" && !CAN.verEstoque(r)) setTab("painel");
  };
  const count = (st: St) => s.orders.filter((o) => o.st === st).length;
  const faturado = s.orders.filter((o) => o.st === "concluido").reduce((a, o) => a + o.valor, 0);
  const baixos = s.stock.filter((i) => i.qtd <= i.min);
  const firstOpen = s.orders.find((o) => o.st !== "concluido")?.id;
  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "painel", label: "Painel" },
    { id: "pedidos", label: "Pedidos", badge: s.orders.filter((o) => o.st !== "concluido").length },
    ...(CAN.verEstoque(role) ? [{ id: "estoque" as Tab, label: "Estoque", badge: baixos.length || undefined }] : []),
  ];
  const lista = s.orders.filter((o) => filtro === "todos" || o.st === filtro);

  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 bg-white text-ink shadow-[0_50px_120px_-30px_rgba(18,19,24,.45)]">
      {/* barra superior */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-black/10 bg-[#faf8f4] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-sm font-semibold">Controle · Sua Empresa</span>
        </div>
        <span className="rounded-full border border-black/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          dados de exemplo
        </span>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-xs text-ink-soft sm:inline">Ver como:</span>
          <LayoutGroup id="role">
            <div className="flex rounded-full bg-paper2 p-1" role="tablist" aria-label="Perfil">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  role="tab"
                  aria-selected={role === r.id}
                  onClick={() => changeRole(r.id)}
                  className="relative rounded-full px-3 py-1.5 text-xs font-semibold"
                >
                  {role === r.id && (
                    <motion.span layoutId="role-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <span className={`relative ${role === r.id ? "text-white" : "text-ink-soft"}`}>{r.label}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
      </div>

      <div className="grid md:grid-cols-[180px_1fr]">
        {/* navegação */}
        <nav className="flex gap-1 overflow-x-auto border-b border-black/10 bg-[#faf8f4] p-2 md:flex-col md:border-b-0 md:border-r md:p-3" aria-label="Seções do sistema">
          <LayoutGroup id="tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="relative flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium"
              >
                {tab === t.id && <motion.span layoutId="tab-bg" className="absolute inset-0 rounded-lg bg-white shadow-sm ring-1 ring-black/5" />}
                <span className="relative">{t.label}</span>
                {t.badge ? (
                  <span className={`relative rounded-full px-1.5 text-[10px] font-bold ${t.id === "estoque" ? "bg-[#ffe1dc] text-[#c2381f]" : "bg-paper2 text-ink-soft"}`}>
                    {t.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </LayoutGroup>
          <div className="mt-auto hidden pt-6 md:block">
            <div className="rounded-lg bg-white p-3 text-[11px] text-ink-soft ring-1 ring-black/5">
              Conectado como
              <div className="mt-1 text-sm font-semibold text-ink">{ROLES.find((r) => r.id === role)!.who}</div>
              {ROLES.find((r) => r.id === role)!.label}
            </div>
            <button onClick={() => dispatch({ type: "reset" })} className="mt-3 w-full rounded-lg px-3 py-2 text-left text-xs text-ink-soft hover:bg-white">
              ↺ Reiniciar demonstração
            </button>
          </div>
        </nav>

        {/* conteúdo */}
        <div className="h-[560px] overflow-y-auto p-4 md:h-[540px] md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab + role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {tab === "painel" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {ST.map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          setFiltro(st);
                          setTab("pedidos");
                        }}
                        className="group rounded-xl border border-black/10 p-3 text-left transition-colors hover:border-black/25"
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-ink-soft">
                          <span className="size-1.5 rounded-full" style={{ background: ST_BAR[st] }} />
                          {ST_LABEL[st]}
                        </div>
                        <motion.div key={count(st)} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-1 font-display text-3xl font-semibold">
                          {count(st)}
                        </motion.div>
                        <div className="text-[11px] text-ink-soft opacity-0 transition-opacity group-hover:opacity-100">ver pedidos →</div>
                      </button>
                    ))}
                  </div>

                  <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr]">
                    <div className="rounded-xl border border-black/10 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Faturado hoje</span>
                        {!CAN.verFaturamento(role) && <Lock txt="só a gerência vê" />}
                      </div>
                      <div className={`mt-2 font-display text-3xl font-semibold transition-all ${CAN.verFaturamento(role) ? "" : "select-none blur-md"}`}>
                        {CAN.verFaturamento(role) ? brl(faturado) : "R$ 0.000,00"}
                      </div>
                      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-paper2">
                        {ST.map((st) => (
                          <motion.span
                            key={st}
                            animate={{ width: `${(count(st) / s.orders.length) * 100}%` }}
                            transition={{ duration: 0.6, ease: EASE }}
                            style={{ background: ST_BAR[st] }}
                          />
                        ))}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-3 text-[11px] text-ink-soft">
                        {ST.map((st) => (
                          <span key={st}>
                            {ST_LABEL[st]} {Math.round((count(st) / s.orders.length) * 100)}%
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-black/10 p-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Alertas</span>
                      <div className="mt-2 space-y-2">
                        <AnimatePresence initial={false}>
                          {baixos.length === 0 && (
                            <motion.p key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-[#18794a]">
                              ✓ Nenhum item abaixo do mínimo
                            </motion.p>
                          )}
                          {baixos.map((i) => (
                            <motion.div
                              key={i.sku}
                              layout
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="flex items-center justify-between gap-2 rounded-lg bg-[#fff1ee] px-3 py-2 text-sm"
                            >
                              <span>
                                <b className="text-[#c2381f]">{i.nome}</b> · {i.qtd} un.
                              </span>
                              {CAN.repor(role) ? (
                                <button onClick={() => dispatch({ type: "repor", sku: i.sku, delta: 10, role })} className="rounded-md bg-ink px-2 py-1 text-[11px] font-semibold text-white">
                                  Repor +10
                                </button>
                              ) : (
                                <Lock txt="estoque" />
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-black/10 p-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Histórico · quem fez, o quê e quando</span>
                    <ul className="mt-2">
                      <AnimatePresence initial={false}>
                        {s.log.slice(0, 6).map((l) => (
                          <motion.li
                            key={l.id}
                            layout
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid grid-cols-[3rem_1fr] gap-2 overflow-hidden border-b border-black/5 py-1.5 text-[13px]"
                          >
                            <span className="font-mono text-ink-soft tabular-nums">{l.hora}</span>
                            <span className={l.tipo === "warn" ? "text-[#c2381f]" : l.tipo === "ok" ? "text-[#18794a]" : ""}>{l.txt}</span>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </div>
                </div>
              )}

              {tab === "pedidos" && (
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {(["todos", ...ST] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFiltro(f)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${filtro === f ? "bg-ink text-white" : "bg-paper2 text-ink-soft hover:bg-paper"}`}
                      >
                        {f === "todos" ? "Todos" : ST_LABEL[f]}
                      </button>
                    ))}
                    {CAN.novoPedido(role) ? (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setFiltro("todos");
                          dispatch({ type: "novo", role });
                        }}
                        className="ml-auto rounded-full bg-accent px-4 py-1.5 text-xs font-bold text-bg"
                      >
                        + Novo pedido
                      </motion.button>
                    ) : (
                      <span className="ml-auto">
                        <Lock txt="estoque não lança pedido" />
                      </span>
                    )}
                  </div>
                  {!s.touched && (
                    <p className="mt-3 rounded-lg bg-[#eef6ff] px-3 py-2 text-xs text-[#0f63ad]">
                      Dica: clique no status de um pedido para avançar. Ao entrar em separação, o estoque baixa sozinho.
                    </p>
                  )}
                  <ul className="mt-3">
                    <AnimatePresence initial={false}>
                      {lista.map((o) => (
                        <motion.li
                          key={o.id}
                          layout
                          initial={{ opacity: 0, backgroundColor: "#dcefff" }}
                          animate={{ opacity: 1, backgroundColor: "#ffffff" }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-b border-black/5 px-1 py-3 sm:grid-cols-[3.5rem_1fr_6rem_auto]"
                        >
                          <span className="hidden font-mono text-xs text-ink-soft sm:block">#{o.id}</span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-semibold">{o.cliente}</span>
                            <span className="block truncate text-xs text-ink-soft">
                              <span className="sm:hidden">#{o.id} · </span>
                              {nomeDe(o.sku)} × {o.qtd}
                            </span>
                          </span>
                          <span className="order-last col-span-2 text-xs tabular-nums sm:order-none sm:col-span-1 sm:text-right sm:text-sm">
                            {CAN.verValores(role) ? brl(o.valor) : <span className="tracking-widest text-ink-soft">•••••</span>}
                          </span>
                          <span className="justify-self-end">
                            <Chip st={o.st} pulse={!s.touched && o.id === firstOpen} onClick={() => dispatch({ type: "advance", id: o.id, role })} />
                          </span>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                  {lista.length === 0 && <p className="py-10 text-center text-sm text-ink-soft">Nenhum pedido neste status.</p>}
                </div>
              )}

              {tab === "estoque" && (
                <ul className="space-y-2">
                  {s.stock.map((i) => {
                    const low = i.qtd <= i.min;
                    const pct = Math.min(100, (i.qtd / (i.min * 4)) * 100);
                    return (
                      <motion.li layout key={i.sku} className={`rounded-xl border p-3 ${low ? "border-[#f4b5a8] bg-[#fff8f6]" : "border-black/10"}`}>
                        <div className="flex items-center gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-semibold">{i.nome}</span>
                              {low && <span className="rounded bg-[#ffe1dc] px-1.5 text-[10px] font-bold uppercase text-[#c2381f]">baixo</span>}
                            </div>
                            <span className="font-mono text-[11px] text-ink-soft">
                              {i.sku} · mínimo {i.min}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => dispatch({ type: "repor", sku: i.sku, delta: -1, role })}
                              className="grid size-8 place-items-center rounded-lg bg-paper2 font-bold hover:bg-paper"
                              aria-label={`Retirar 1 ${i.nome}`}
                            >
                              −
                            </button>
                            <motion.span key={i.qtd} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="w-10 text-center font-display text-xl font-semibold tabular-nums">
                              {i.qtd}
                            </motion.span>
                            <button
                              onClick={() => dispatch({ type: "repor", sku: i.sku, delta: 1, role })}
                              className="grid size-8 place-items-center rounded-lg bg-ink font-bold text-white"
                              aria-label={`Adicionar 1 ${i.nome}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper2">
                          <motion.div animate={{ width: `${pct}%` }} className="h-full rounded-full" style={{ background: low ? "#e5533a" : "#3fcf8e" }} />
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="border-t border-black/10 bg-[#faf8f4] px-4 py-2 md:hidden">
        <button onClick={() => dispatch({ type: "reset" })} className="text-xs text-ink-soft">
          ↺ Reiniciar demonstração
        </button>
      </div>
    </div>
  );
}

const PASSOS = [
  ["01", "Clique no status de um pedido", "Ele avança de etapa, e quando entra em separação o estoque baixa sozinho. Sem ninguém digitar de novo."],
  ["02", "Troque o perfil em “Ver como”", "Gerência vê o faturamento. Vendas vê os pedidos. Estoque vê o estoque. Cada um encontra o que é seu."],
  ["03", "Olhe o histórico no painel", "Tudo fica registrado com hora e nome. A resposta existe quando alguém perguntar."],
];

export default function Demo() {
  return (
    <section id="sistema" className="relative bg-paper py-24 text-ink md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Reveal>
              <p className="label mb-5 text-accent-deep">Experimente · funciona de verdade</p>
            </Reveal>
            <Words
              text={"Um sistema de controle *simples.*\nTeste agora, aqui mesmo."}
              accent="text-accent-deep"
              className="font-display text-[clamp(2.2rem,5vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.03em]"
            />
          </div>
          <Reveal delay={0.15}>
            <p className="max-w-[44ch] text-lg text-ink-soft">
              Pedidos, estoque e histórico, conversando entre si. É uma demonstração com dados de exemplo, mas é assim que
              um sistema da AW funciona no dia a dia: no computador da empresa e no celular de quem está na rua.
            </p>
          </Reveal>
        </div>

        <Reveal kind="scale" className="mt-14">
          <App />
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {PASSOS.map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 0.1}>
              <div className="border-t border-ink/15 pt-5">
                <span className="font-mono text-xs text-accent-deep">{n}</span>
                <h3 className="mt-2 font-display text-xl font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-ink-soft">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
