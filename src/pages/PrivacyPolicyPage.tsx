import { useLanguage } from "../context/LanguageContext";

export default function PrivacyPolicyPage() {
  const { t } = useLanguage();

  const privacy = t.privacyPolicy;

  return (
    <main className="bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-300">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-2xl border border-consudes-blue/10 bg-blue-50 px-6 py-7 dark:border-white/10 dark:bg-white/5 sm:px-8 sm:py-8">
          <h1 className="text-3xl font-bold tracking-tight text-consudes-blue dark:text-white sm:text-4xl">
            {privacy.title}
          </h1>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {privacy.lastUpdated}
          </p>

          <p className="mt-6 text-base leading-7">{privacy.intro}</p>
        </div>

        <div className="space-y-10">
          <Section title={privacy.aboutTitle}>
            <p>{privacy.aboutText}</p>
          </Section>

          <Section title={privacy.dataTitle}>
            <p>{privacy.dataIntro}</p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              {privacy.dataItems.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title={privacy.collectionTitle}>
            <ul className="list-disc space-y-2 pl-6">
              {privacy.collectionItems.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title={privacy.purposeTitle}>
            <ul className="list-disc space-y-2 pl-6">
              {privacy.purposeItems.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title={privacy.cookiesTitle}>
            <p>{privacy.cookiesIntro}</p>

            <div className="mt-5 space-y-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
                <h3 className="font-semibold text-consudes-blue dark:text-white">
                  {privacy.necessaryTitle}
                </h3>

                <p className="mt-2 leading-7">{privacy.necessaryText}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/5">
                <h3 className="font-semibold text-consudes-blue dark:text-white">
                  {privacy.analyticsTitle}
                </h3>

                <p className="mt-2 leading-7">{privacy.analyticsText}</p>

                <ul className="mt-4 list-disc space-y-2 pl-6">
                  <li>{privacy.googleAnalytics}</li>
                  <li>{privacy.microsoftClarity}</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title={privacy.sharingTitle}>
            <p>{privacy.sharingText}</p>
          </Section>

          <Section title={privacy.internationalTransfersTitle}>
            <p>{privacy.internationalTransfersText}</p>
          </Section>

          <Section title={privacy.securityTitle}>
            <p>{privacy.securityText}</p>
          </Section>

          <Section title={privacy.retentionTitle}>
            <p>{privacy.retentionText}</p>
          </Section>

          <Section title={privacy.rightsTitle}>
            <p>{privacy.rightsIntro}</p>

            <ul className="mt-4 list-disc space-y-2 pl-6">
              {privacy.rightsItems.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>

          <Section title={privacy.brazilTitle}>
            <p>{privacy.brazilText}</p>
          </Section>

          <Section title={privacy.preferencesTitle}>
            <p>{privacy.preferencesText}</p>
          </Section>

          <Section title={privacy.minorsTitle}>
            <p>{privacy.minorsText}</p>
          </Section>

          <Section title={privacy.contactTitle}>
            <p>{privacy.contactText}</p>

            <p className="mt-3 font-medium text-consudes-blue dark:text-consudes-gold">
              contato@consudes.com
            </p>
          </Section>

          <Section title={privacy.updatesTitle}>
            <p>{privacy.updatesText}</p>
          </Section>
        </div>
      </section>
    </main>
  );
}

function Section({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-bold text-consudes-blue dark:text-white">
        {title}
      </h2>

      <div className="mt-3 leading-7">{children}</div>
    </section>
  );
}
