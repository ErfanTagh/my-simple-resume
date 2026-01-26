import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Layout, 
  Download, 
  Star, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Clock,
  BookOpen
} from "lucide-react";
import { LandingTemplatePreview } from "./LandingTemplatePreview";
import { getBlogPosts } from "@/lib/blogPosts";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMemo } from "react";
import { SEO } from "@/components/SEO";

const Landing = () => {
  const { language, t } = useLanguage();
  const blogPosts = useMemo(() => getBlogPosts(language), [language]);
  
  const allTemplates = [
    { nameKey: 'templateModern', descKey: 'templateModernDesc', key: 'modern' as const },
    { nameKey: 'templateClassic', descKey: 'templateClassicDesc', key: 'classic' as const },
    { nameKey: 'templateCreative', descKey: 'templateCreativeDesc', key: 'creative' as const },
    { nameKey: 'templateMinimal', descKey: 'templateMinimalDesc', key: 'minimal' as const },
    { nameKey: 'templateLatex', descKey: 'templateLatexDesc', key: 'latex' as const },
    { nameKey: 'templateStarRover', descKey: 'templateStarRoverDesc', key: 'starRover' as const }
  ];
  return (
    <>
      <SEO
        title="123Resume - Professional CV Builder | Create Your Resume Online"
        description="Build your professional CV with our easy-to-use multi-step form. Create ATS-friendly resumes with multiple templates. Free CV builder with PDF export."
        keywords="CV builder, resume builder, create CV, professional resume, ATS resume, CV templates, resume templates, online CV maker"
      />
      <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-1/4 w-72 sm:w-[500px] h-72 sm:h-[500px] bg-primary/15 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-56 sm:w-96 h-56 sm:h-96 bg-primary/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[600px] h-80 sm:h-[600px] bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-full blur-3xl" />
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center space-y-8 sm:space-y-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary/10 border border-primary/20 text-xs sm:text-sm font-semibold text-primary animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {t('landing.badge')}
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>

            {/* Headline */}
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                {t('landing.headline1')}
              </h1>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold leading-[1.1] tracking-tight">
                <span className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent">
                  {t('landing.headline2')}
                </span>
              </h1>
            </div>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {t('landing.subheadline').split(t('landing.subheadlineHighlight'))[0]}
              <span className="text-foreground font-medium">{t('landing.subheadlineHighlight')}</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 pt-2 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/create" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 font-semibold">
                  {t('landing.ctaStartBuilding')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-2xl border-2 hover:bg-accent hover:-translate-y-0.5 transition-all duration-300 font-semibold">
                  {t('landing.ctaLogin')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Preview Cards */}
          <div className="mt-12 sm:mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
              {allTemplates.map((template, i) => (
                <div
                  key={template.key}
                  className="bg-card rounded-2xl border border-border p-3 sm:p-4 shadow-lg hover:shadow-[0_8px_25px_-5px_hsl(var(--primary)/0.35)] transition-all duration-300 hover:-translate-y-1.5"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="aspect-[3/4] bg-white rounded-lg mb-2 sm:mb-3 overflow-hidden border border-border shadow-inner relative max-h-[350px] sm:max-h-[420px]">
                    <div className="absolute inset-0 w-full h-full">
                      <LandingTemplatePreview templateName={template.key} />
                    </div>
                  </div>
                  <div className="space-y-0.5 pt-0.5 mb-3">
                    <h3 className="font-bold text-sm sm:text-base" style={{ color: 'hsl(215 25% 15%)' }}>{t(`landing.${template.nameKey}`)} {t('landing.templateLabel')}</h3>
                    <p className="text-xs font-medium line-clamp-2 mb-3" style={{ color: 'hsl(214 95% 45%)' }}>{t(`landing.${template.descKey}`)}</p>
                  </div>
                  <Link to={`/create?template=${template.key}`} className="block w-full">
                    <Button 
                      size="sm" 
                      className="w-full bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-semibold"
                    >
{t('landing.chooseThisTemplate')}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              {t('landing.featuresTitle')}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              {t('landing.featuresSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                icon: Layout,
                titleKey: "featureMultipleTemplates",
                descKey: "featureMultipleTemplatesDesc"
              },
              {
                icon: Sparkles,
                titleKey: "featureAIRating",
                descKey: "featureAIRatingDesc"
              },
              {
                icon: Zap,
                titleKey: "featureQuickEasy",
                descKey: "featureQuickEasyDesc"
              },
              {
                icon: Download,
                titleKey: "featureExportAnywhere",
                descKey: "featureExportAnywhereDesc"
              },
              {
                icon: CheckCircle2,
                titleKey: "featureATSOptimized",
                descKey: "featureATSOptimizedDesc"
              },
              {
                icon: Star,
                titleKey: "featureSaveEdit",
                descKey: "featureSaveEditDesc"
              }
            ].map((feature, i) => (
              <div
                key={feature.titleKey}
                className="p-4 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-1 sm:mb-2">{t(`landing.${feature.titleKey}`)}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{t(`landing.${feature.descKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              {t('landing.howItWorksTitle')}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              {t('landing.howItWorksSubtitle')}
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {[
              { step: 1, titleKey: "step1Title", descKey: "step1Desc" },
              { step: 2, titleKey: "step2Title", descKey: "step2Desc" },
              { step: 3, titleKey: "step3Title", descKey: "step3Desc" }
            ].map((item, i) => (
              <div key={item.step} className="flex items-start sm:items-center gap-4 sm:gap-8">
                <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl sm:text-2xl font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">{t(`landing.${item.titleKey}`)}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{t(`landing.${item.descKey}`)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <Link to="/create">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl">
                {t('landing.ctaStartBuildingNow')}
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent border border-border text-xs sm:text-sm font-medium text-accent-foreground mb-4">
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
              {t('landing.blogSectionBadge')}
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              {t('landing.blogSectionTitle')}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              {t('landing.blogSectionSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {blogPosts.slice(0, 3).map((post, i) => {
              const hasImage = post.image && typeof post.image === 'string';
              return (
              <Link to={`/blog/${post.id}`} key={post.id}>
                <article className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-[0_20px_40px_-15px_hsl(var(--primary)/0.25)] hover:border-primary/40 transition-all duration-500 cursor-pointer hover:-translate-y-2 h-full">
                  {/* Hero Image or Decorative background pattern */}
                  {hasImage ? (
                    <div className="aspect-[16/9] relative overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={`Featured image for blog post: ${post.title}${post.category ? ` about ${post.category}` : ''} on 123Resume`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Image failed to load, fallback to gradient design
                        }}
                      />
                      {/* Watermark */}
                      <div className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-white px-1.5 py-1 rounded-md shadow-sm">
                        <img 
                          src="/logoo.png" 
                          alt="123Resume Logo" 
                          className="h-5 w-auto object-contain"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={`aspect-[16/9] bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-4 right-4 w-20 h-20 border border-current rounded-full opacity-20" />
                        <div className="absolute bottom-4 left-4 w-12 h-12 border border-current rounded-lg rotate-12 opacity-20" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-current rounded-full opacity-10" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                          <BookOpen className={`w-8 h-8 sm:w-10 sm:h-10 ${post.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary/15 transition-colors">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-card-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </div>
                      <span className="font-medium">{post.date}</span>
                    </div>
                  </div>
                  {/* Hover arrow indicator */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </article>
              </Link>
              );
            })}
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <Link to="/blog">
              <Button variant="outline" size="lg" className="rounded-xl px-6 sm:px-8">
                {t('landing.viewAllArticles')}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Landing;

