# AW Tecnologia — site

Next.js 16 (App Router) + Tailwind CSS 4 + Motion.

```bash
npm install
npm run dev     # desenvolvimento
npm run build   # produção
```

## Estrutura
- `components/WebCanvas.tsx` — teia interativa em canvas e aranha procedural que segue o cursor (clique gera onda; clicar perto da aranha a espanta).
- `components/Chaos.tsx` — seção fixa em que as "seis fontes de bagunça" se organizam num painel conforme a rolagem.
- `components/Demo.tsx` — sistema de controle de demonstração (pedidos, estoque, histórico e perfis de acesso), com dados de exemplo.
- `components/Sections.tsx` — serviços, letreiro, público, processo, números, dúvidas e contato.
- `components/ui.tsx` — primitivas de animação (revelação, título palavra a palavra, ímã, inclinação 3D, holofote, cursor).

Todas as animações respeitam `prefers-reduced-motion`.
