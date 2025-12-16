import { useLanguage } from "@/contexts/LanguageContext";

const Cookies = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">{t('pages.cookies.title')}</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm text-muted-foreground/80">{t('pages.cookies.lastUpdated')}</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.cookies.section1Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.cookies.section1Text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.cookies.section2Title')}</h2>
            
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">{t('pages.cookies.essentialTitle')}</h3>
              <p className="leading-relaxed mb-2">
                {t('pages.cookies.essentialText')}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">{t('pages.cookies.functionalTitle')}</h3>
              <p className="leading-relaxed mb-2">
                {t('pages.cookies.functionalText')}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">{t('pages.cookies.analyticsTitle')}</h3>
              <p className="leading-relaxed mb-2">
                {t('pages.cookies.analyticsText')}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.cookies.section3Title')}</h2>
            <p className="leading-relaxed mb-3">
              {t('pages.cookies.section3Text')}
            </p>
            <p className="leading-relaxed mb-3">{t('pages.cookies.section3Text2')}</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>{t('pages.cookies.section3Item1')}</li>
              <li>{t('pages.cookies.section3Item2')}</li>
              <li>{t('pages.cookies.section3Item3')}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.cookies.section4Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.cookies.section4Text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.cookies.section5Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.cookies.section5Text')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.cookies.section6Title')}</h2>
            <p className="leading-relaxed">
              {t('pages.cookies.section6Text')}{" "}
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

export default Cookies;

