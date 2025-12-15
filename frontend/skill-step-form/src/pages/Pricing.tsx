import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Pricing = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">{t('pages.pricing.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('pages.pricing.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl bg-card border-2 border-border">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">{t('pages.pricing.free')}</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">{t('pages.pricing.forever')}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{t('pages.pricing.unlimitedResumes')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{t('pages.pricing.allTemplates')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{t('pages.pricing.aiSuggestions')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{t('pages.pricing.pdfDownload')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{t('pages.pricing.saveAndEdit')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{t('pages.pricing.atsOptimized')}</span>
              </li>
            </ul>
            <Link to="/create" className="block">
              <Button size="lg" variant="outline" className="w-full">
                {t('pages.pricing.getStartedFree')}
              </Button>
            </Link>
          </div>

          {/* Premium Plan - Coming Soon */}
          <div className="p-8 rounded-2xl bg-card border-2 border-primary relative">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {t('pages.pricing.comingSoon')}
              </span>
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">{t('pages.pricing.premium')}</h2>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">$9</span>
                <span className="text-muted-foreground">{t('pages.pricing.month')}</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{t('pages.pricing.everythingInFree')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{t('pages.pricing.advancedAnalysis')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{t('pages.pricing.coverLetterBuilder')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{t('pages.pricing.prioritySupport')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{t('pages.pricing.analytics')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{t('pages.pricing.customBranding')}</span>
              </li>
            </ul>
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90" disabled>
              {t('pages.pricing.comingSoon')}
            </Button>
          </div>
        </div>

        <div className="text-center p-6 rounded-lg bg-muted/30 border border-border">
          <p className="text-muted-foreground">
            {t('pages.pricing.allPlansInclude')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

