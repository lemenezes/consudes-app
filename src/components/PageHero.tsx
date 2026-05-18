interface PageHeroProps {
  label: string;
  title: string;
  subtitle?: string;
}

export default function PageHero({ label, title, subtitle }: PageHeroProps) {
  return (
    <section className="relative bg-consudes-navy overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-consudes-blue via-consudes-blue-mid to-consudes-blue-light opacity-80" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-consudes-blue-light/20 rounded-full blur-3xl" />
      </div>
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-consudes-gold/60 via-consudes-gold/20 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
        <span className="inline-block text-consudes-gold text-xs font-bold tracking-[0.3em] uppercase mb-4">
          {label}
        </span>
        <h1 className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-[1.1] tracking-tight mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto font-light text-balance">
            {subtitle}
          </p>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 translate-y-[1px]">
        <svg viewBox="0 0 1440 40" className="w-full text-white dark:text-consudes-dark-body" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,40 C480,0 960,40 1440,0 L1440,40 Z" />
        </svg>
      </div>
    </section>
  );
}
