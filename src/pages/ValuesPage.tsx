import { Trophy, Users, Shield, Globe, HeartHandshake, Lightbulb } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';
import { useSEO } from '../hooks/useSEO';

const ICONS = [Trophy, Users, Shield, Globe, HeartHandshake, Lightbulb];

export default function ValuesPage() {
  const { t } = useLanguage();
  const v = t.valuesPage;
  useSEO({ title: t.nav.values, url: '/valores' });

  return (
    <>
      <PageHero label={v.label} title={t.nav.values} subtitle={v.heroSubtitle} />

      {/* Intro */}
      <section className="bg-white dark:bg-[#0d1624] pt-16 sm:pt-20 pb-4">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
          <p className="text-[#1F2937]/65 dark:text-white/55 text-base sm:text-lg leading-relaxed">
            {v.intro}
          </p>
        </div>
      </section>

      {/* Grid de valores */}
      <section className="bg-white dark:bg-[#0d1624] py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {v.values.map((value, i) => {
              const Icon = ICONS[i];
              return (
                <div
                  key={value.title}
                  className="group relative bg-[#F5F7FA] dark:bg-white/[0.03] rounded-2xl border border-[#003B73]/6 dark:border-white/8 p-7 hover:border-[#D9A441]/40 hover:shadow-[0_4px_24px_rgba(0,59,115,0.08)] dark:hover:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#003B73]/6 dark:bg-white/8 flex items-center justify-center group-hover:bg-[#D9A441]/10 transition-colors duration-200">
                      <Icon size={18} className="text-[#003B73] dark:text-white/70 group-hover:text-[#D9A441] transition-colors duration-200" />
                    </div>
                    <span className="font-['Cormorant_Garamond'] text-4xl font-semibold text-[#003B73]/8 dark:text-white/8 select-none leading-none">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] text-xl font-semibold text-[#003B73] dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-[#1F2937]/60 dark:text-white/50 text-[13px] leading-relaxed">
                    {value.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

