import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">{t('pages.terms.title')}</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm text-muted-foreground/80">{t('pages.terms.lastUpdated')}</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.terms.section1Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.terms.section1Text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.terms.section2Title')}</h2>
            <p className="leading-relaxed mb-3">{t('pages.terms.section2Text')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t('pages.terms.section2Item1')}</li>
              <li>{t('pages.terms.section2Item2')}</li>
              <li>{t('pages.terms.section2Item3')}</li>
            </ul>
            <p className="leading-relaxed mt-3">{t('pages.terms.section2NotPermit')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t('pages.terms.section2NotPermitItem1')}</li>
              <li>{t('pages.terms.section2NotPermitItem2')}</li>
              <li>{t('pages.terms.section2NotPermitItem3')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.terms.section3Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.terms.section3Text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.terms.section4Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.terms.section4Text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.terms.section5Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.terms.section5Text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.terms.section6Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.terms.section6Text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.terms.section7Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.terms.section7Text')}{" "}
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

export default Terms;

