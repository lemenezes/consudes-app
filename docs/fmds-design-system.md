# Design System FMDS — Documentação para Reuso no CONSUDES

> Documento gerado a partir da análise direta do código-fonte de `/Users/lmiglioli/dev/fmds-app`.  
> Data: maio de 2026. Não alterar código — apenas referência de design.

---

## 1. Design Tokens (CSS `@theme`)

O FMDS usa **Tailwind v4** com tokens definidos em `src/index.css` via bloco `@theme`. Isso gera automaticamente classes utilitárias como `bg-fmds-red`, `text-fmds-body`, etc.

```css
@theme {
  /* ─── Cores principais ─── */
  --color-fmds-red:      #CC1E2A;   /* vermelho primário: CTAs, header, bordas de acento */
  --color-fmds-red-dark: #A81520;   /* hover/press sobre vermelho */
  --color-fmds-red-pale: #FDE8EA;   /* fundo hover suave de CTAs brancos */

  /* ─── Fundo escuro ─── */
  --color-fmds-dark:     #111111;   /* header, footer, PageShell, seções escuras */

  /* ─── Texto ─── */
  --color-fmds-body:     #374151;   /* texto padrão de parágrafos */
  --color-fmds-muted:    #5E6773;   /* texto secundário, metadados */

  /* ─── Estrutura ─── */
  --color-fmds-border:   #E5E7EB;   /* bordas de cards e dividers */
  --color-fmds-surface:  #F5F5F5;   /* fundo de seções alternadas e cards */
  --color-fmds-white:    #FFFFFF;

  /* ─── Tipografia ─── */
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;

  /* ─── Sombras ─── */
  --shadow-card:  0 1px 3px 0 rgb(0 0 0 / 0.06), 0 4px 16px 0 rgb(0 0 0 / 0.08);
  --shadow-raise: 0 4px 24px 0 rgb(204 30 42 / 0.18);  /* sombra avermelhada em destaque */
}
```

### Cores adicionais usadas inline (não tokenizadas)

| Contexto | Valor | Uso |
|---|---|---|
| Hero background | `#0C0C0C` | Mais escuro que `fmds-dark` |
| Eyebrow hero | `#E84455` | Ligeiramente mais claro que o vermelho principal |
| Gradient text | `#CC1E2A → #FF4D5A` | `.text-gradient-red` |
| Topbar desktop | `bg-fmds-dark` | `#111111` |

---

## 2. Tipografia

**Família:** `Inter` (Google Fonts) — sans-serif humanista, neutral e editorial.

**Configuração global:**
```css
body {
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.65;
  color: var(--color-fmds-body);
  -webkit-font-smoothing: antialiased;
}
```

### Hierarquia de títulos

| Elemento | Classes Tailwind | Tamanho efetivo | Uso |
|---|---|---|---|
| H1 Hero | `font-black leading-[1.0] tracking-tight` + `clamp(2.4rem, 5.5vw, 4.5rem)` inline | 38–72px fluido | Apenas na homepage hero |
| H1 PageShell | `text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight` | 30–48px | Todas as páginas internas |
| H2 seção | `text-3xl sm:text-4xl font-black text-fmds-dark leading-tight` | 30–36px | News, seções de conteúdo |
| H2 história | `text-2xl sm:text-3xl font-black text-fmds-dark leading-tight` | 24–30px | Páginas institucionais |
| H3 card destaque | `text-lg sm:text-xl font-black text-fmds-dark leading-snug` | 18–20px | Card de notícia featured |
| H3 card secundário | `font-bold text-fmds-dark text-sm leading-snug` | 14px | Cards menores |
| Nome de modalidade | `font-bold text-fmds-dark text-sm` | 14px | Card de modalidade |

### Textos de corpo e suporte

| Elemento | Classes | Tamanho |
|---|---|---|
| Parágrafo hero | `text-white/80 text-sm sm:text-base font-light leading-relaxed` | 14–16px |
| Parágrafo editorial | `text-fmds-body leading-relaxed text-[15px]` | 15px |
| Slogan hero | `text-fmds-red font-black text-xl sm:text-2xl tracking-tight` | 20–24px |
| Label de seção | `.section-label` (11px, bold, uppercase, tracking 0.12em) | 11px |
| Section eyebrow inline | `text-[11px] font-bold uppercase tracking-[0.2em] text-fmds-red` | 11px |
| Nav desktop | `text-[13px] font-medium` | 13px |
| Nav mobile itens | `text-[15px] font-semibold` | 15px |
| Footer group heading | `text-xs font-semibold uppercase tracking-[0.18em]` | 12px |
| Footer links | `text-xs text-white/80` | 12px |
| Topbar | `text-xs text-white/50` | 12px |
| Muted/meta | `text-fmds-muted text-xs` | 12px |

### Stats bar (padrão recorrente)

| Parte | Classes |
|---|---|
| Valor | `text-xl sm:text-3xl font-black text-white tabular-nums` |
| Label | `text-[10px] font-bold uppercase tracking-widest text-white/40` |

### Padrão `.section-label` (CSS global)

```css
.section-label {
  display: inline-block;
  font-size: 0.6875rem;       /* 11px */
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-fmds-red);
  border-left: 3px solid var(--color-fmds-red);
  padding-left: 0.625rem;
  margin-bottom: 1rem;
}
```

### Padrão eyebrow inline com linha

```tsx
<div className="flex items-center gap-2.5 mb-3">
  <div className="h-px w-6 bg-fmds-red flex-shrink-0" aria-hidden="true" />
  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-fmds-red">
    {section}
  </p>
</div>
```

### Padrão divisor de grupo com linha que se expande

```tsx
<div className="flex items-center gap-3 mb-5">
  <div className="h-px w-6 bg-fmds-red flex-shrink-0" />
  <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-fmds-red whitespace-nowrap">
    {label}
  </h2>
  <div className="h-px flex-1 bg-fmds-border" />
</div>
```

---

## 3. Paleta de Cores — Uso Prático

### Cores primárias

| Token / Classe | Hex | Uso principal |
|---|---|---|
| `fmds-red` | `#CC1E2A` | Header, CTAs primários, bordas de acento, foco global |
| `fmds-red-dark` | `#A81520` | Hover/press em botões vermelhos |
| `fmds-red-pale` | `#FDE8EA` | Hover de botão CTA branco sobre fundo vermelho |
| `fmds-dark` | `#111111` | Header bg, footer bg, PageShell bg, drawer bg |
| `fmds-body` | `#374151` | Texto corrido |
| `fmds-muted` | `#5E6773` | Texto secundário, datas, metadados |
| `fmds-border` | `#E5E7EB` | Bordas de cards, dividers |
| `fmds-surface` | `#F5F5F5` | Fundo de seções News/alternadas, card DocumentCard |

### Backgrounds por contexto

| Área | Classe/Valor |
|---|---|
| Hero | `bg-[#0C0C0C]` com gradiente `from-[#0C0C0C] via-[#111111] to-[#130203]` |
| Header / Footer | `bg-fmds-red` (light) / `bg-fmds-dark` (dark mode) |
| PageShell (interno) | `bg-fmds-dark` |
| Stats bars | `bg-fmds-dark` |
| Seções de conteúdo | `bg-white` ou `bg-fmds-surface` (alternado) |
| Cards | `bg-white` com `border-fmds-border` |
| Side drawer mobile | `bg-fmds-dark` |
| Overlay mobile | `bg-black/60 backdrop-blur-[2px]` |

### Cores semânticas (badges de categoria)

| Categoria | Badge classes |
|---|---|
| Assembleia | `bg-amber-100 text-amber-800 border border-amber-200` |
| Campeonato | `bg-violet-100 text-violet-800` |
| Copa | `bg-orange-100 text-orange-800` |
| Futsal | `bg-blue-100 text-blue-800 border border-blue-200` |
| Futebol | `bg-emerald-100 text-emerald-800 border border-emerald-200` |
| Futebol Society | `bg-lime-100 text-lime-800` |
| Vôlei | `bg-cyan-100 text-cyan-800 border border-cyan-200` |
| Boliche | `bg-pink-100 text-pink-800` |
| Tênis de Mesa | `bg-teal-100 text-teal-800` |
| Badminton | `bg-indigo-100 text-indigo-800` |
| Institucional | `bg-fmds-red/10 text-fmds-red` |

### Cores de status (CalendarioPage)

| Status | Classes inativo | Dot |
|---|---|---|
| Finalizada | `bg-gray-100 text-gray-500 border-gray-200` | `bg-gray-400` |
| Homologada | `bg-green-50 text-green-700 border-green-200` | `bg-green-500` |
| Em andamento | `bg-blue-50 text-blue-700 border-blue-200` | `bg-blue-500` |
| A confirmar | `bg-amber-50 text-amber-700 border-amber-200` | `bg-amber-500` |
| Aberta | `bg-orange-50 text-orange-700 border-orange-200` | `bg-orange-400` |

### Red glow (atmósferico, hero e PageShell)

```tsx
{/* Grandes blurs de acento vermelho — decorativos */}
<div className="absolute -bottom-1/4 -right-1/4 w-[60%] aspect-square rounded-full bg-fmds-red/8 blur-[160px]" />
<div className="absolute -top-1/4 -left-1/4 w-[45%] aspect-square rounded-full bg-fmds-red/4 blur-[120px]" />
```

---

## 4. Sombras

| Token / Classe | Valor | Uso |
|---|---|---|
| `shadow-card` (token) | `0 1px 3px rgb(0 0 0/0.06), 0 4px 16px rgb(0 0 0/0.08)` | Cards secundários hover |
| `shadow-raise` (token) | `0 4px 24px rgb(204 30 42/0.18)` | Cards em destaque, hover featured |
| Dropdown desktop | `shadow-[0_12px_48px_rgba(0,0,0,0.22)]` | Painel dropdown |
| Mobile drawer | `shadow-[-8px_0_48px_rgba(0,0,0,0.55)]` | Side drawer |
| Card modalidade hover | `hover:shadow-[0_4px_20px_rgba(204,30,42,0.08)]` | Cards hover leve |
| Header scrolled | `shadow-[0_2px_16px_rgba(0,0,0,0.28)]` | Header após scroll |
| Historia destaque | `shadow-raise` (avermelhado) | Bloco dark em destaque |

---

## 5. Border Radius

| Classe | Uso |
|---|---|
| `rounded` (4px) | Botões CTA pequenos, badges/pills sem borda arredondada total |
| `rounded-lg` (8px) | Botões primários, cards padrão, Logo container, ícone container |
| `rounded-xl` (12px) | Itens mobile nav, modal cards, dropdown panels, cards de filiada |
| `rounded-2xl` (16px) | Bloco historia destaque, filiada logo, empty state |
| `rounded-3xl` (24px) | Loading/skeleton containers |
| `rounded-full` | Filter chips, social icons, scrollbar |

---

## 6. Espaçamento e Layout

### Container padrão
```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Seções verticais

| Contexto | Classes |
|---|---|
| Seções principais (News, etc.) | `py-16 lg:py-24` |
| Conteúdo de página interna | `py-10 sm:py-14` |
| Stats bar | `py-5` por célula |
| Header height | `h-16` (mobile) / `h-20` (desktop) |
| Topbar desktop | `h-8` |

### Grid layouts

| Padrão | Classes |
|---|---|
| News (featured + lista) | `grid-cols-1 lg:grid-cols-3` (featured ocupa `lg:col-span-2`) |
| Stats hero | `grid-cols-4 divide-x divide-white/[0.10]` |
| Stats páginas internas | `grid-cols-3 divide-x divide-white/10` (ou cols-2/4) |
| Cards filiadas/modalidades | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| Footer | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` |

---

## 7. Componentes

### 7.1 Botões

#### Primário (fundo vermelho)
```tsx
// Grande (hero/CTA principal)
<button className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-lg bg-fmds-red text-white font-bold text-sm tracking-wide hover:bg-fmds-red/90 active:scale-[0.97] transition-all duration-200">

// Pequeno (cards, DocumentCard)
<button className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-fmds-red text-white text-xs font-bold hover:bg-fmds-red-dark transition-colors">
```

#### Ghost/outline (sobre fundo escuro)
```tsx
<button className="inline-flex items-center justify-center px-8 py-4 rounded-lg border border-white/30 text-white/90 font-semibold text-sm tracking-wide hover:border-white/55 hover:bg-white/[0.06] active:scale-[0.97] transition-all duration-200">
```

#### Branco sobre vermelho (header CTA)
```tsx
// Desktop
<a className="inline-flex items-center px-3 py-2 rounded bg-white text-fmds-red font-bold text-xs hover:bg-fmds-red-pale transition-colors">

// Mobile drawer (full width)
<a className="flex items-center justify-center w-full px-5 py-4 rounded-xl bg-white text-fmds-red font-bold text-[15px] hover:bg-fmds-red-pale transition-colors">
```

#### Link com seta animada
```tsx
<Link className="inline-flex items-center gap-1.5 text-fmds-red font-semibold text-sm hover:gap-2.5 transition-all group">
  Ver todas
  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
</Link>
```

### 7.2 Filter Chips / Pills

```tsx
// Padrão base
className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all duration-150 cursor-pointer border select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-fmds-red"

// Inativo: bg-white text-fmds-body border-fmds-border hover:border-fmds-dark/40
// Ativo dark: bg-fmds-dark text-white border-fmds-dark
// Ativo vermelho: bg-fmds-red text-white border-fmds-red
// Ativo blue: bg-blue-600 text-white border-blue-600
```

### 7.3 Badges de categoria

```tsx
// Tamanho padrão
<span className={`px-2.5 py-1 rounded text-xs font-bold ${catStyle[category]}`}>

// Com borda (variante)
<span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${catStyle[category]}`}>

// Mini (EventoCard)
<span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-fmds-red/10 text-fmds-red">
```

### 7.4 Cards

#### Card de notícia (featured)
```tsx
<article className="bg-white rounded-lg border border-fmds-border overflow-hidden flex flex-col hover:shadow-[var(--shadow-raise)] transition-shadow">
  <div className="p-5 sm:p-7 flex flex-col flex-1">
    {/* badge + data */}
    {/* h3 */}
    {/* excerpt */}
    {/* link "ler mais" */}
  </div>
  <div className="h-1 bg-fmds-red" /> {/* acento vermelho inferior */}
</article>
```

#### Card de notícia (secundário)
```tsx
<article className="bg-white rounded-lg border border-fmds-border p-5 flex flex-col hover:shadow-[var(--shadow-card)] transition-shadow">
```

#### Card de modalidade/item com ícone
```tsx
<Link className="group flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-fmds-border bg-white hover:border-fmds-red/30 hover:shadow-[0_4px_20px_rgba(204,30,42,0.08)] hover:-translate-y-0.5 transition-all duration-200">
  <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-fmds-red/8 group-hover:bg-fmds-red/14 flex items-center justify-center text-fmds-red transition-colors">
    {icon}
  </div>
  <div className="min-w-0 flex-1 pt-0.5">
    <p className="font-bold text-fmds-dark group-hover:text-fmds-red text-sm mb-0.5 transition-colors">{name}</p>
    <p className="text-fmds-muted text-xs leading-relaxed">{desc}</p>
  </div>
  <ChevronRight size={14} className="flex-shrink-0 mt-1 text-fmds-muted/30 group-hover:text-fmds-red group-hover:translate-x-0.5 transition-all self-center" />
</Link>
```

#### DocumentCard
```tsx
<div className="flex items-center gap-4 rounded-lg border border-fmds-border bg-fmds-surface px-5 py-4">
  <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-fmds-red/10 flex items-center justify-center">
    <FileText size={22} className="text-fmds-red" />
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-xs font-semibold text-fmds-dark mb-0.5 truncate">{description}</p>
    <p className="text-[11px] text-fmds-muted truncate capitalize">{filename}</p>
  </div>
  <a className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded bg-fmds-red text-white text-xs font-bold hover:bg-fmds-red-dark transition-colors">
    <Download size={12} /> {label}
  </a>
</div>
```

#### Card com top accent (Filiadas)
```tsx
<li className="bg-white rounded-2xl border border-fmds-border overflow-hidden">
  <div className="h-[3px] bg-fmds-red" /> {/* acento superior */}
  <div className="h-36 bg-fmds-surface border-b border-fmds-border" /> {/* imagem/logo */}
  <div className="p-6 space-y-3">
    {/* conteúdo */}
  </div>
</li>
```

#### Card evento (CalendarioPage)
```tsx
<div className="group flex gap-0 rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all">
  <div className="w-1 flex-shrink-0 bg-fmds-red" /> {/* barra lateral de âmbito */}
  <div className="flex-1 flex flex-col p-3 sm:p-4">
    {/* data block + badges + nome */}
  </div>
</div>
```

#### Card highlight dark (história)
```tsx
<div className="rounded-2xl bg-fmds-dark overflow-hidden shadow-raise">
  <div className="flex flex-col sm:flex-row">
    <div className="sm:w-48 bg-fmds-red flex flex-col items-center justify-center py-8 px-6">
      {/* valor/data em destaque */}
    </div>
    <div className="p-6 sm:p-8">
      {/* texto */}
    </div>
  </div>
</div>
```

### 7.5 Stats Bar

Componente padrão presente em praticamente todas as páginas internas.

```tsx
<section className="bg-fmds-dark border-b border-white/10" aria-label="Resumo">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <dl className="grid grid-cols-3 divide-x divide-white/10">
      {stats.map(({ value, label }) => (
        <div key={label} className="py-5 px-4 sm:px-10 text-center">
          <dt className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-0.5">{label}</dt>
          <dd className="text-xl sm:text-2xl font-black text-white">{value}</dd>
        </div>
      ))}
    </dl>
  </div>
</section>
```

### 7.6 PageShell (cabeçalho de página interna)

Componente `<PageShell>` — estrutura universal de todas as páginas internas.

```
bg-fmds-dark
  ├── Red atmospheric blurs (decorativo, aria-hidden)
  ├── Breadcrumb nav (text-xs text-white/35, ChevronRight separators)
  ├── Section eyebrow (linha vermelha + label uppercase)
  ├── H1 (text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight)
  └── Subtitle (text-white/50 text-sm sm:text-base)

h-[2px] bg-gradient-to-r from-transparent via-fmds-red to-transparent  ← divisor
```

```tsx
<div className="relative pt-[5.5rem] lg:pt-[7rem] bg-fmds-dark overflow-hidden isolate">
  {/* ... glow e conteúdo ... */}
  <div className="h-[2px] bg-gradient-to-r from-transparent via-fmds-red to-transparent" />
</div>
```

### 7.7 Header

```
fixed top-0 z-[100]
├── Topbar (bg-fmds-dark h-8, texto branco/50, informação institucional)
└── Nav bar (bg-fmds-red, h-16/h-20)
    ├── Logo: rounded-lg p-1.5 bg-white + FMDS font-black text-[1.35rem]
    ├── Nav desktop: text-[13px] font-medium text-white/90, rounded px-2.5 py-2
    │   ├── Hover: hover:bg-white/10 hover:text-white
    │   ├── Active: bg-white/20 text-white
    │   └── Dropdown: bg-white rounded-xl border shadow + h-0.5 bg-fmds-red topo
    ├── CTA "Fale Conosco": bg-white text-fmds-red font-bold text-xs rounded
    └── Hamburguer: w-11 h-11 3 spans animados
```

**Shadow ao scroll:** `shadow-[0_2px_16px_rgba(0,0,0,0.28)]` (dinâmico via `scrolled` state)

### 7.8 Footer

```
bg-fmds-dark text-white
├── h-1 bg-fmds-red (acento superior)
├── max-w-7xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4
│   ├── Brand (logo + tagline + redes sociais)
│   └── 3x grupos de links (accordion mobile / heading estático desktop)
│       └── heading: text-xs font-semibold uppercase tracking-[0.18em] text-white/65
│           links: text-xs text-white/80 hover:text-white
└── Bottom bar: border-t border-white/[0.07]
    └── endereço + copyright
```

**Grupos heading mobile:** accordion com `max-h-0 → max-h-[500px] transition-[max-height]`

**Social icons:** `w-9 h-9 rounded bg-white/10 hover:bg-fmds-red text-white/70 hover:text-white`

### 7.9 Side drawer mobile

```
fixed top-0 right-0 h-[100dvh] z-[110]
w-[min(340px,88vw)]
bg-fmds-dark
shadow-[-8px_0_48px_rgba(0,0,0,0.55)]
translate-x-full → translate-x-0 (transition 300ms ease-in-out)

├── Header: h-16 bg-fmds-red (logo + botão fechar X)
├── h-0.5 bg-fmds-red/60 (divisor)
└── nav overflow-y-auto py-3 px-3
    ├── Itens com accordion (max-h-0 → max-h-[800px])
    │   └── Sub-itens: border-l-2 border-fmds-red/40 pl-4
    └── CTA "Fale Conosco" (bg-white text-fmds-red)
```

**Overlay:** `fixed inset-0 z-[105] bg-black/60 backdrop-blur-[2px]`

### 7.10 Breadcrumb

```tsx
<nav aria-label="Localização atual" className="flex items-center gap-1.5 flex-wrap text-xs text-white/35 mb-5">
  <Link to="/" className="hover:text-white/65 transition-colors">Início</Link>
  {crumbs.map((crumb, i) => (
    <span key={i} className="flex items-center gap-1.5">
      <ChevronRight size={11} className="text-white/25" />
      {crumb.href
        ? <Link to={crumb.href} className="hover:text-white/65">{crumb.label}</Link>
        : <span className="text-white/65">{crumb.label}</span>
      }
    </span>
  ))}
</nav>
```

### 7.11 Skeleton / Loading states

```tsx
// Blocos de skeleton em fundo claro
<div className="h-4 w-full bg-fmds-border rounded animate-pulse" />

// Blocos de skeleton em fundo escuro
<div className="h-2 w-24 rounded bg-white/10 animate-pulse" />

// Spinner vermelho
<div className="h-6 w-6 animate-spin rounded-full border-2 border-fmds-red border-t-transparent" />

// Container de empty state
<div className="rounded-3xl border border-fmds-border bg-white/80 p-8 text-center shadow-sm">
  <div className="mx-auto mb-4 flex h-12 w-12 rounded-full bg-fmds-red/10">
    {/* spinner ou ícone */}
  </div>
  <p className="text-sm font-semibold text-fmds-dark">Carregando...</p>
</div>
```

---

## 8. Transições e Animações

| Elemento | Transição |
|---|---|
| Cores (botões, links) | `transition-colors duration-150/200` |
| Layout (drawer, accordion) | `transition-all duration-300 ease-in-out` |
| Hover cards (lift) | `hover:-translate-y-0.5 transition-all duration-200` |
| Botão active press | `active:scale-[0.97]` |
| Seta "ler mais" | `group-hover:translate-x-0.5 transition-transform` |
| Dropdown fade | `opacity-0 -translate-y-2 → opacity-100 translate-y-0` |
| Route fade-in | `pageFadeIn: opacity 0→1 + translateY 6px→0, 200ms` |
| Hamburguer → X | `rotate-45 translate-y-[7px]` nos spans |
| Scroll behavior | `smooth` |

**Preferência de movimento reduzido:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Foco e Acessibilidade

```css
/* Global */
:focus-visible {
  outline: 3px solid var(--color-fmds-red);
  outline-offset: 3px;
  border-radius: 2px;
}
```

**Em elementos sobre fundo escuro:**
```
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
```

**Skip link:**
```css
.skip-link {
  position: absolute; top: -100%;
  z-index: 9999;
  background: var(--color-fmds-dark); color: white;
  /* aparece em :focus */
}
```

---

## 10. Padrões Visuais Recorrentes

### Dark hero + seções claras alternadas

```
Hero [bg: #0C0C0C] → Stats strip [bg: black/20] 
→ Seção [bg: fmds-surface] → Seção [bg: white] → Footer [bg: fmds-dark]
```

### Red left bar (acento editorial)

Usado em: submenus, sub-itens mobile, eyebrows de seção, barras laterais no hero.

```tsx
<div className="w-[3px] h-full bg-fmds-red" />          // vertical, na barra hero
<div className="border-l-2 border-fmds-red/40 pl-4" />  // sub-itens mobile nav
```

### Gradiente de borda entre seções

```tsx
<div className="h-[2px] bg-gradient-to-r from-transparent via-fmds-red to-transparent" />
```

### Dot grid decorativo (hero)

```tsx
<svg className="absolute inset-0 w-full h-full opacity-[0.04]">
  <defs>
    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="white" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#dots)" />
</svg>
```

### Ícone container vermelho suave

```tsx
<div className="w-11 h-11 rounded-lg bg-fmds-red/8 group-hover:bg-fmds-red/14 flex items-center justify-center text-fmds-red transition-colors">
  {icon}
</div>
```

### Acento superior/inferior nos cards

```tsx
<div className="h-1 bg-fmds-red" />          // inferior (news card)
<div className="h-[3px] bg-fmds-red" />       // superior (filiada card)
```

---

## 11. Dark Mode

O FMDS implementa dark mode via **classe `.dark` no `<html>`** (não via `prefers-color-scheme`).

```css
@variant dark (&:where(.dark, .dark *));
```

Principais overrides:
- Header: `dark:bg-fmds-dark dark:border-b dark:border-fmds-red/50`
- Dropdown: `dark:bg-[#1E1E1E] dark:border-[#2D2D2D]`
- Logo container: `dark:bg-fmds-red` (fundo muda pois logo muda)
- Footer: usa logo alternativo `dark:block`
- Badges de categoria em dark: `dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800` etc.

---

## 12. Componentes mais Reutilizáveis

Ordenados por impacto e frequência de uso:

1. **`<PageShell>`** — cabeçalho universal de página interna (título, subtitle, breadcrumb, eyebrow, gradiente divisor)
2. **Stats Bar** — padrão `bg-fmds-dark grid-cols-N divide-x` com valores grandes e labels pequenas
3. **Section eyebrow** — linha vermelha + label uppercase 11px + divisor horizontal expansível
4. **`<FilterChip>`** — pill toggle com variantes dark/red/colored, rounded-full
5. **Category badge** — `px-2.5 py-1 rounded text-xs font-bold` com mapeamento por cor
6. **Card com icon container** — `rounded-xl border bg-white hover:border-fmds-red/30 hover:shadow hover:-translate-y-0.5` com slot de ícone
7. **`<DocumentCard>`** — card de PDF com ícone + descrição + botão download
8. **`<PageShell>` red gradient divider** — `h-[2px] bg-gradient-to-r from-transparent via-fmds-red to-transparent`
9. **Skeleton pattern** — blocos `animate-pulse bg-fmds-border` ou `bg-white/10`
10. **Arrow link animado** — `hover:gap-2.5 + ArrowRight group-hover:translate-x-0.5`

---

## 13. Aplicação no CONSUDES

### Estado atual do CONSUDES (diferenças identificadas)

| Aspecto | FMDS | CONSUDES atual |
|---|---|---|
| Cor primária | Vermelho `#CC1E2A` | Azul `#002D5E` / `#0057A8` |
| Cor de acento | — | Dourado `#D9A441` |
| Tokens CSS | `@theme` com `--color-fmds-*` | Nenhum — cores hardcoded inline |
| Header bg | `bg-fmds-red` (vermelho) | `bg-white dark:bg-[#0a1220]` |
| Nav texto | Branco sobre vermelho | Azul escuro sobre branco |
| Topbar | `bg-fmds-dark` 8px | `bg-[#002D5E]` 8px |
| `section-label` | CSS global com border-left | Não existe |
| PageShell | Componente dedicado | `<PageHero>` parcialmente equivalente |
| Stats bar | Padrão em todas as páginas | Inexistente sistematicamente |
| Tokens sombra | `--shadow-card`, `--shadow-raise` | Inexistentes |
| `@theme` tokens | Sim, completo | Não — dark mode usa `@custom-variant` |
| Multilingue | Não | Sim (PT/ES/EN) |

### Estratégia de adoção

O CONSUDES tem paleta diferente (azul/dourado × vermelho), mas a **estrutura e padrões visuais** do FMDS são totalmente aplicáveis com substituição de cores.

#### Passo 1 — Definir tokens no `index.css`

```css
@theme {
  /* ─── Paleta CONSUDES ─── */
  --color-c-primary:     #002D5E;    /* azul escuro: header, footer, seções escuras */
  --color-c-primary-mid: #0057A8;    /* azul médio: links, CTAs secundários */
  --color-c-accent:      #D9A441;    /* dourado: destaques, hover CTAs brancos */
  --color-c-accent-dark: #B8872C;    /* dourado hover */
  --color-c-accent-pale: #FDF3DC;    /* fundo hover suave */

  --color-c-body:        #374151;    /* texto (igual ao FMDS) */
  --color-c-muted:       #5E6773;    /* texto secundário (igual ao FMDS) */
  --color-c-border:      #E5E7EB;    /* bordas (igual ao FMDS) */
  --color-c-surface:     #F5F5F5;    /* fundo seções (igual ao FMDS) */

  --font-sans: "Inter", system-ui, sans-serif;

  --shadow-card:  0 1px 3px 0 rgb(0 0 0 / 0.06), 0 4px 16px 0 rgb(0 0 0 / 0.08);
  --shadow-raise: 0 4px 24px 0 rgb(0 45 94 / 0.18);  /* sombra azulada */
}
```

#### Passo 2 — Criar `<PageShell>` equivalente

Copiar o componente do FMDS, substituindo `fmds-red` → `c-primary` e `fmds-dark` → `c-primary`.

#### Passo 3 — Criar `.section-label` no CSS global

```css
.section-label {
  display: inline-block;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-c-accent);
  border-left: 3px solid var(--color-c-accent);  /* usar dourado no CONSUDES */
  padding-left: 0.625rem;
  margin-bottom: 1rem;
}
```

#### Passo 4 — Adotar Stats Bar em páginas de listagem

Toda página com listagem (notícias, federações, etc.) deve ter a stats bar dark no topo da seção de conteúdo.

#### Passo 5 — Padronizar cards

Substituir cards ad-hoc por três variantes reutilizáveis:
- **Card simples:** `bg-white rounded-lg border border-c-border hover:shadow-card`
- **Card destaque:** `bg-white rounded-xl border border-c-border hover:border-c-primary/30 hover:-translate-y-0.5 hover:shadow-raise`
- **Card documento:** mesma estrutura do `<DocumentCard>` do FMDS

---

## 14. Inconsistências do FMDS a Evitar no CONSUDES

### 14.1 Cores de categoria incoerentes

As cores de badge de categoria do FMDS usam Tailwind semântico (`amber`, `violet`, etc.) de forma ad-hoc, **definidas em múltiplos arquivos duplicados** (`News.tsx`, `NoticiasPage.tsx`, `NoticiaDetalhePage.tsx`). No CONSUDES, centralizar em um único objeto exportado:

```ts
// src/utils/categoryStyles.ts
export const CATEGORY_BADGE: Record<string, string> = {
  Assembleia: 'bg-amber-100 text-amber-800 border border-amber-200',
  // ...
}
```

### 14.2 `shadow-raise` hardcoded em dois valores

Em `News.tsx` usa `hover:shadow-[var(--shadow-raise)]`, mas em outros cards usa o valor literal. No CONSUDES, usar sempre o token.

### 14.3 Hero background não tokenizado

`#0C0C0C` no hero é diferente de `fmds-dark` (`#111111`) mas ambos são hardcoded em locais diferentes. No CONSUDES, tokenizar os dois explicitamente se necessário.

### 14.4 Falta de PageShell em algumas páginas

Algumas páginas antigas do FMDS ainda não usam `<PageShell>` (verificar `AcessibilidadePage`, `ContatoPage`). No CONSUDES, toda página interna deve usar o equivalente.

### 14.5 Inconsistência no tamanho dos stats

Nas páginas internas, o valor alterna entre `text-xl sm:text-2xl` e `text-xl sm:text-3xl`. Padronizar em `text-2xl sm:text-3xl` no CONSUDES.

### 14.6 Skeleton duplicado

O padrão de skeleton (`SkeletonCard`, `SkeletonRow`) existe tanto em `FiliadasPage.tsx` quanto em outras páginas, porém cada um é definido localmente. No CONSUDES, extrair para componente `<Skeleton>` reutilizável (o CONSUDES já tem `src/components/Skeleton.tsx` — verificar se está padronizado).

---

## 15. Guia Visual Prático — Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────┐
│  PADRÃO VISUAL FMDS / CONSUDES                                  │
├─────────────────────────────────────────────────────────────────┤
│  Fonte           Inter, 16px base, line-height 1.65             │
│  Cor primária    Vermelho #CC1E2A (FMDS) / Azul #002D5E        │
│  Cor acento      (nenhum no FMDS) / Dourado #D9A441 (CONSUDES) │
│  Cor texto       #374151 (corpo), #5E6773 (muted)              │
│  Border          #E5E7EB                                         │
│  Surface         #F5F5F5                                         │
├─────────────────────────────────────────────────────────────────┤
│  Container       max-w-7xl mx-auto px-4 sm:px-6 lg:px-8        │
│  Seção major     py-16 lg:py-24                                 │
│  Seção interna   py-10 sm:py-14                                 │
├─────────────────────────────────────────────────────────────────┤
│  H1 hero         font-black, clamp fluid, tracking-tight        │
│  H1 page         text-3xl→5xl font-black tracking-tight        │
│  H2              text-3xl→4xl font-black                        │
│  Section label   11px bold uppercase, border-left 3px accent   │
│  Section eyebrow linha 6px + 11px bold uppercase tracking-[0.2em] │
│  Stats value     text-2xl→3xl font-black tabular-nums          │
│  Stats label     10px bold uppercase tracking-widest text/40   │
├─────────────────────────────────────────────────────────────────┤
│  Botão primário  px-8 py-4 rounded-lg font-bold sm tracking    │
│                  hover:bg-{primary}/90 active:scale-[0.97]     │
│  Botão ghost     border border-white/30 hover:bg-white/[0.06]  │
│  Filter chip     px-2.5 py-1 rounded-full 11px bold border     │
│  Badge cat       px-2.5 py-1 rounded 12px bold cor semântica   │
├─────────────────────────────────────────────────────────────────┤
│  Card padrão     bg-white rounded-lg border hover:shadow-card  │
│  Card destaque   rounded-xl hover:border/30 hover:-translate-y │
│  Card top accent h-[3px] bg-{primary} no topo                  │
│  Card bottom bar h-1 bg-{primary} no rodapé                    │
│  Card dark split left panel bg-{primary} + right text          │
├─────────────────────────────────────────────────────────────────┤
│  radius lg=8px  xl=12px  2xl=16px  3xl=24px  full=pills/social │
│  shadow card: leve 2 camadas | raise: tinted {primary}/0.18    │
│  transition: colors 150ms | all 200ms | drawer 300ms           │
├─────────────────────────────────────────────────────────────────┤
│  Layout hero     dark bg + glow blurs + dot grid + left bar    │
│  Stats bar       bg-dark border-b grid-cols-N divide-x         │
│  Page shell      dark bg + breadcrumb + eyebrow + h1 + divider │
│  Seções          surface ↔ white ↔ dark (alternado)            │
├─────────────────────────────────────────────────────────────────┤
│  Focus           outline 3px {primary} offset 3px (global)     │
│                  ring-2 ring-white/50 (sobre fundo escuro)      │
│  Reduced motion  respeitar sempre via @media                    │
└─────────────────────────────────────────────────────────────────┘
```

---

*Fim do documento. Referência: `fmds-app/src/index.css`, `components/Header.tsx`, `components/Footer.tsx`, `components/Hero.tsx`, `components/PageShell.tsx`, `components/News.tsx`, `components/DocumentCard.tsx`, `pages/NoticiasPage.tsx`, `pages/institucional/FiliadasPage.tsx`, `pages/eventos/CalendarioPage.tsx`, `pages/eventos/ModalidadesPage.tsx`, `pages/institucional/HistoriaPage.tsx`.*
