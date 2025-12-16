import { useLanguage } from "@/contexts/LanguageContext";

const DataProtection = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">{t('pages.dataProtection.title')}</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm text-muted-foreground/80">{t('pages.dataProtection.lastUpdated')}</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.dataProtection.section1Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.dataProtection.section1Text')}{" "}
              <a href="mailto:contact@123resume.de" className="text-primary hover:underline">
                contact@123resume.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.dataProtection.section2Title')}</h2>
            <p className="leading-relaxed mb-3">{t('pages.dataProtection.section2Text')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t('pages.dataProtection.section2Item1')}</li>
              <li>{t('pages.dataProtection.section2Item2')}</li>
              <li>{t('pages.dataProtection.section2Item3')}</li>
              <li>{t('pages.dataProtection.section2Item4')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.dataProtection.section3Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.dataProtection.section3Text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.dataProtection.section4Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.dataProtection.section4Text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.dataProtection.section5Title')}</h2>
            <p className="leading-relaxed mb-3">{t('pages.dataProtection.section5Text')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t('pages.dataProtection.section5Item1')}</li>
              <li>{t('pages.dataProtection.section5Item2')}</li>
              <li>{t('pages.dataProtection.section5Item3')}</li>
              <li>{t('pages.dataProtection.section5Item4')}</li>
              <li>{t('pages.dataProtection.section5Item5')}</li>
              <li>{t('pages.dataProtection.section5Item6')}</li>
              <li>{t('pages.dataProtection.section5Item7')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.dataProtection.section6Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.dataProtection.section6Text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.dataProtection.section7Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.dataProtection.section7Text')}{" "}
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

export default DataProtection;

