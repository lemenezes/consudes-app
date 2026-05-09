import { useLanguage } from '../context/LanguageContext';
import PageHero from '../components/PageHero';

export default function TransparencyPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageHero
        label="CONSUDES"
        title={t.nav.transparency}
        subtitle="Documentos, relatórios e prestação de contas da confederação."
      />
      <section className="bg-white dark:bg-[#0d1624] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {['Estatuto Social', 'Relatório Anual 2024', 'Ata de Assembléia', 'Balanço Financeiro'].map((doc) => (
            <div key={doc} className="flex items-center justify-between border border-gray-200 dark:border-white/10 rounded-xl px-6 py-4">
              <span className="text-[#003B73] dark:text-white font-medium">{doc}</span>
              <span className="text-xs text-[#1F2937]/40 dark:text-white/30 border border-gray-200 dark:border-white/10 px-3 py-1 rounded-full">
                Em breve
              </span>
            </div>
          ))}
        </div>
        <p className="text-center text-[#1F2937]/40 dark:text-white/30 text-sm mt-12">
          Conteúdo em construção
        </p>
      </section>
    </>
  );
}
