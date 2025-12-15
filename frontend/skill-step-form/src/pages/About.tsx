import { Link } from "react-router-dom";
import { FileText, Sparkles, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">{t('pages.about.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('pages.about.subtitle')}
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.about.ourMission')}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('pages.about.missionText')}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.about.whatWeOffer')}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-card border border-border">
                <Sparkles className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{t('pages.about.aiSuggestions')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('pages.about.aiSuggestionsDesc')}
                </p>
              </div>
              <div className="p-6 rounded-lg bg-card border border-border">
                <FileText className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{t('pages.about.professionalTemplates')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('pages.about.professionalTemplatesDesc')}
                </p>
              </div>
              <div className="p-6 rounded-lg bg-card border border-border">
                <Target className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{t('pages.about.atsOptimized')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('pages.about.atsOptimizedDesc')}
                </p>
              </div>
              <div className="p-6 rounded-lg bg-card border border-border">
                <Users className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{t('pages.about.userFriendly')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('pages.about.userFriendlyDesc')}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">{t('pages.about.whyChooseUs')}</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span>{t('pages.about.freeToUse')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span>{t('pages.about.saveAndEdit')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span>{t('pages.about.exportToPdf')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span>{t('pages.about.privacyFocused')}</span>
              </li>
            </ul>
          </section>

          <div className="text-center pt-8">
            <Link to="/create">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                {t('pages.about.startBuilding')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

