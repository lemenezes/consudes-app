import { Link } from 'react-router-dom';
import { BookOpen, Target, HeartHandshake, Users, Award, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageShell from '../components/PageShell';
import { useSEO } from '../hooks/useSEO';

export default function InstitucionalPage() {
  const { t } = useLanguage();
  useSEO({ title: t.nav.institutional, url: '/institucional' });

  const cards = [
    { to: '/historia',        label: t.nav.history,          desc: t.historyPage.heroSubtitle,         Icon: BookOpen },
    { to: '/missao',          label: t.nav.mission,          desc: t.missionPage.heroSubtitle,         Icon: Target },
    { to: '/valores',         label: t.nav.values,           desc: t.valuesPage.heroSubtitle,          Icon: HeartHandshake },
    { to: '/equipe',          label: t.nav.team,             desc: t.teamPage.subtitle,                Icon: Users },
    { to: '/ex-presidentes',  label: t.nav.formerPresidents, desc: t.formerPresidentsPage.subtitle,    Icon: Award },
  ];

  return (
    <>
      <PageShell label="CONSUDES" title={t.nav.institutional} breadcrumbs={[{ label: t.nav.institutional }]}>

      <section className="bg-[#F5F7FA] dark:bg-[#080e1a] py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8">
          <div className="grid sm:grid-cols-2 gap-4">
            {cards.map(({ to, label, desc, Icon }) => (
              <Link
                key={to}
                to={to}
                className="group flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-[#0d1624] border border-[#003B73]/8 dark:border-white/8 hover:border-[#D9A441]/50 dark:hover:border-[#D9A441]/40 hover:shadow-[0_4px_20px_rgba(0,57,115,0.10)] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.30)] transition-all duration-200"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#0057A8]/8 dark:bg-white/5 flex items-center justify-center group-hover:bg-[#0057A8]/12 dark:group-hover:bg-white/10 transition-colors">
                  <Icon size={19} className="text-[#0057A8] dark:text-white/60 group-hover:text-[#D9A441] transition-colors" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="font-semibold text-[#003B73] dark:text-white/90 text-sm group-hover:text-[#0057A8] dark:group-hover:text-white transition-colors mb-1">
                    {label}
                  </h3>
                  <p className="text-[#1F2937]/55 dark:text-white/40 text-[12px] leading-relaxed">{desc}</p>
                </div>
                <ArrowRight size={14} className="flex-shrink-0 text-[#D9A441] opacity-0 group-hover:opacity-100 mt-1 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      </PageShell>
    </>
  );
}
