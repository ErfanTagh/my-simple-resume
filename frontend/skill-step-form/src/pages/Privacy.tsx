import { useLanguage } from "@/contexts/LanguageContext";

const Privacy = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">{t('pages.privacy.title')}</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm text-muted-foreground/80">{t('pages.privacy.lastUpdated')}</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.privacy.section1Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.privacy.section1Text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.privacy.section2Title')}</h2>
            <p className="leading-relaxed mb-3">{t('pages.privacy.section2Text')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t('pages.privacy.section2Item1')}</li>
              <li>{t('pages.privacy.section2Item2')}</li>
              <li>{t('pages.privacy.section2Item3')}</li>
              <li>{t('pages.privacy.section2Item4')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.privacy.section3Title')}</h2>
            <p className="leading-relaxed mb-3">{t('pages.privacy.section3Text')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t('pages.privacy.section3Item1')}</li>
              <li>{t('pages.privacy.section3Item2')}</li>
              <li>{t('pages.privacy.section3Item3')}</li>
              <li>{t('pages.privacy.section3Item4')}</li>
              <li>{t('pages.privacy.section3Item5')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.privacy.section4Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.privacy.section4Text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.privacy.section5Title')}</h2>
            <p className="leading-relaxed mb-3">{t('pages.privacy.section5Text')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t('pages.privacy.section5Item1')}</li>
              <li>{t('pages.privacy.section5Item2')}</li>
              <li>{t('pages.privacy.section5Item3')}</li>
              <li>{t('pages.privacy.section5Item4')}</li>
              <li>{t('pages.privacy.section5Item5')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.privacy.section6Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.privacy.section6Text')}{" "}
              <a href="mailto:contact@123resume.de" className="text-primary hover:underline">
                contact@123resume.de
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

