import { Mail, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import PageShell from '../components/PageShell';

const CONTACT_EMAIL = 'contato@consudes.com';

export default function ContactPage() {
  const { t } = useLanguage();
  return (
    <PageShell
     
      title={t.contact.title}
      subtitle={t.contact.subtitle}
      breadcrumbs={[{ label: t.contact.title }]}
    >
      <section className="bg-white dark:bg-consudes-dark-body py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-4 border border-gray-200 dark:border-white/10 rounded-xl px-6 py-5 hover:border-[#0057A8]/40 transition-colors group"
          >
            <span className="w-10 h-10 rounded-full bg-[#0057A8]/10 flex items-center justify-center text-[#0057A8] group-hover:bg-[#0057A8] group-hover:text-white transition-colors">
              <Mail size={18} />
            </span>
            <div>
              <p className="text-xs text-[#1F2937]/40 dark:text-white/30 uppercase tracking-wider mb-0.5">E-mail</p>
              <p className="text-[#003B73] dark:text-white font-medium">{CONTACT_EMAIL}</p>
            </div>
          </a>
          <div className="flex items-center gap-4 border border-gray-200 dark:border-white/10 rounded-xl px-6 py-5">
            <span className="w-10 h-10 rounded-full bg-[#0057A8]/10 flex items-center justify-center text-[#0057A8]">
              <Phone size={18} />
            </span>
            <div>
              <p className="text-xs text-[#1F2937]/40 dark:text-white/30 uppercase tracking-wider mb-0.5">{t.contact.phoneLabel}</p>
              <p className="text-[#1F2937]/40 dark:text-white/30 text-sm">{t.contact.phoneSoon}</p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
