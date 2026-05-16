import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useSEO } from '../hooks/useSEO';

export default function NotFoundPage() {
  const { t } = useLanguage();
  useSEO({ title: '404', url: '' });

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <span className="block text-[120px] font-bold leading-none text-[#0057A8]/10 dark:text-white/5 select-none" aria-hidden="true">
        404
      </span>
      <h1 className="text-2xl font-bold text-[#003B73] dark:text-white mt-2 mb-3">
        {t.notFound.title}
      </h1>
      <p className="text-[#1F2937]/55 dark:text-white/40 text-sm max-w-sm mb-8">
        {t.notFound.subtitle}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0057A8] hover:bg-[#003B73] text-white text-sm font-semibold transition-colors"
      >
        {t.notFound.back}
      </Link>
    </div>
  );
}
