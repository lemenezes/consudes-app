import { ArrowRight, Users, BookOpen, HeartHandshake, Globe, Mail, Phone } from 'lucide-react';

const PROGRAMS = [
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Fortalecimento Institucional',
    description: 'Apoio à gestão e governança das entidades filiadas, promovendo capacitação e boas práticas organizacionais.',
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Formação e Capacitação',
    description: 'Cursos, oficinas e eventos de capacitação para lideranças e colaboradores das organizações da sociedade civil.',
  },
  {
    icon: <HeartHandshake className="w-6 h-6" />,
    title: 'Articulação em Rede',
    description: 'Conexão entre entidades para troca de experiências, ações conjuntas e incidência em políticas públicas.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Advocacy e Representação',
    description: 'Representação das entidades filiadas nos espaços de diálogo com o poder público e organismos internacionais.',
  },
];

const STATS = [
  { value: '60+', label: 'Entidades filiadas' },
  { value: '20', label: 'Anos de atuação' },
  { value: '15', label: 'Estados atendidos' },
  { value: '100k+', label: 'Pessoas beneficiadas' },
];

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0A3D62] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A3D62] via-[#0C5A86] to-[#1DAFD9] opacity-90" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#1DAFD9]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-[#0C5A86]/40 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <span className="inline-block text-white/70 text-xs sm:text-sm font-medium tracking-widest uppercase px-5 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-8">
            Conselho de Entidades
          </span>

          <h1 data-testid="hero-title" className="font-['Cormorant_Garamond'] text-5xl sm:text-6xl lg:text-7xl font-semibold text-white leading-[1.1] tracking-tight mb-6">
            Unindo forças pela<br/>
            <span className="text-[#7FD6E8] italic">transformação social</span>
          </h1>

          <p className="text-white/60 text-base sm:text-lg mb-10 max-w-xl mx-auto font-light tracking-wide">
            A CONSUDES articula entidades da sociedade civil para fortalecer a atuação coletiva em prol dos direitos sociais e da cidadania.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <a
              href="#sobre"
              className="inline-flex items-center gap-2 bg-white text-[#0C5A86] font-semibold px-8 py-3.5 rounded-xl hover:bg-[#f0f8ff] transition-colors shadow-lg text-sm sm:text-base"
            >
              Conheça a CONSUDES
              <ArrowRight size={16} />
            </a>
            <a
              href="#contato"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              Entre em contato
            </a>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
            {STATS.map(({ value, label }, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{value}</p>
                <p className="text-white/50 text-xs mt-0.5 tracking-wider uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-[1px]">
          <svg viewBox="0 0 1440 56" className="w-full text-[#FCFCFB] dark:text-[#071a28]" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,56 C360,0 720,56 1080,28 C1260,14 1380,0 1440,0 L1440,56 Z" />
          </svg>
        </div>
      </section>

      {/* ─── Sobre ────────────────────────────────────────────────────────── */}
      <section id="sobre" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-[#0C5A86] dark:text-sky-400 text-xs font-semibold tracking-widest uppercase mb-3">
              Quem somos
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-800 dark:text-slate-100 mb-6 leading-tight">
              Uma rede de entidades comprometidas com o bem comum
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-4">
              A CONSUDES — Conselho de Entidades — é uma organização sem fins lucrativos que reúne e representa entidades da sociedade civil, promovendo articulação, capacitação e incidência política em defesa dos direitos sociais.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8">
              Fundada com o objetivo de fortalecer o terceiro setor, atuamos em rede para ampliar o impacto das organizações filiadas e garantir sua sustentabilidade e governança.
            </p>
            <a
              href="#programas"
              className="inline-flex items-center gap-2 text-[#0C5A86] dark:text-sky-400 font-semibold text-sm hover:underline"
            >
              Ver nossos programas
              <ArrowRight size={15} />
            </a>
          </div>

          {/* Visual block */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A3D62] to-[#1DAFD9] p-1">
              <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 sm:p-10">
                <div className="grid grid-cols-2 gap-4">
                  {STATS.map(({ value, label }, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 text-center border border-slate-100 dark:border-slate-700"
                    >
                      <p className="text-2xl font-bold text-[#0C5A86] dark:text-sky-400 tabular-nums">{value}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-tight">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#1DAFD9]/10 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* ─── Programas ────────────────────────────────────────────────────── */}
      <section id="programas" className="bg-slate-50 dark:bg-slate-900/50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-[#0C5A86] dark:text-sky-400 text-xs font-semibold tracking-widest uppercase mb-3">
              O que fazemos
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
              Nossos programas
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-sm max-w-md mx-auto">
              Atuamos em quatro eixos estratégicos para fortalecer as entidades filiadas e ampliar seu impacto social.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROGRAMS.map(({ icon, title, description }, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-sky-100/80 dark:hover:shadow-slate-900/60 hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 dark:border-slate-700/50 hover:border-sky-200 dark:hover:border-sky-800/50"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-[#0C5A86] dark:text-sky-400 flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-2 leading-snug">
                  {title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Notícias placeholder ─────────────────────────────────────────── */}
      <section id="noticias" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <span className="inline-block text-[#0C5A86] dark:text-sky-400 text-xs font-semibold tracking-widest uppercase mb-3">
            Fique por dentro
          </span>
          <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
            Notícias e eventos
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            Em breve publicaremos nossas últimas novidades aqui.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/50 shadow-sm"
            >
              <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 animate-pulse" />
              <div className="p-5">
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full w-1/3 mb-3 animate-pulse" />
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full w-full mb-2 animate-pulse" />
                <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full w-3/4 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Contato / CTA ────────────────────────────────────────────────── */}
      <section id="contato" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-[#0A3558]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A3558] via-[#0F5C88] to-[#38B6D9]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_110%,rgba(29,175,217,0.18),transparent)]" />
          <div className="relative px-8 py-14 text-center">
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-semibold text-white mb-3">
              Fale com a CONSUDES
            </h2>
            <p className="text-white/60 mb-8 text-sm sm:text-base tracking-wide max-w-md mx-auto">
              Entre em contato para saber mais sobre filiação, programas e como podemos apoiar sua entidade.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:contato@consudes.org.br"
                className="inline-flex items-center gap-2 bg-white text-[#0C5A86] font-semibold px-7 py-3 rounded-xl hover:bg-[#f0f8ff] transition-colors shadow-lg text-sm"
              >
                <Mail size={16} />
                contato@consudes.org.br
              </a>
              <a
                href="tel:+551100000000"
                className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-7 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm"
              >
                <Phone size={16} />
                (11) 0000-0000
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
