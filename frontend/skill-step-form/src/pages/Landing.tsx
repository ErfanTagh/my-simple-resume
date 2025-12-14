import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
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
import { blogPosts } from "./Blog";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">123Resume</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Log In
              </Button>
            </Link>
            <Link to="/create">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs sm:text-sm">
                <span className="hidden sm:inline">Start Building Free</span>
                <span className="sm:hidden">Start Free</span>
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent border border-border text-xs sm:text-sm font-medium text-accent-foreground">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              AI-Powered Resume Builder
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Build Your Dream
              <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Resume in Minutes
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              Create professional, ATS-friendly resumes with AI-powered suggestions. 
              Stand out from the crowd and land your dream job.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
              <Link to="/create" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  Start Building Free
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl border-2">
                  Log In
                </Button>
              </Link>
            </div>

          </div>

          {/* Preview Cards */}
          <div className="mt-12 sm:mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                { name: 'Modern', key: 'modern' as const },
                { name: 'Classic', key: 'classic' as const },
                { name: 'Creative', key: 'creative' as const }
              ].map((template, i) => (
                <div
                  key={template.key}
                  className="bg-card rounded-2xl border border-border p-4 sm:p-6 shadow-lg hover:shadow-[0_8px_25px_-5px_hsl(var(--primary)/0.35)] transition-all duration-300 hover:-translate-y-1.5"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="aspect-[3/4] bg-white rounded-lg mb-3 sm:mb-4 overflow-hidden border border-border shadow-inner relative">
                    <div className="absolute inset-0">
                      <LandingTemplatePreview templateName={template.key} />
                    </div>
                  </div>
                  <div className="space-y-1 pt-2">
                    <h3 className="font-bold text-lg sm:text-xl" style={{ color: 'hsl(215 25% 15%)' }}>{template.name} Template</h3>
                    <p className="text-sm font-medium" style={{ color: 'hsl(214 95% 45%)' }}>Professional & ATS-friendly</p>
                  </div>
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
              Everything You Need to Succeed
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Our powerful features help you create the perfect resume in no time
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                icon: Layout,
                title: "Multiple Templates",
                description: "Choose from 4 professionally designed templates that suit your style"
              },
              {
                icon: Sparkles,
                title: "AI-Powered Rating",
                description: "Get instant feedback and suggestions to improve your resume"
              },
              {
                icon: Zap,
                title: "Quick & Easy",
                description: "Build your resume step-by-step with our intuitive form wizard"
              },
              {
                icon: Download,
                title: "Export Anywhere",
                description: "Download your resume as PDF ready for any application"
              },
              {
                icon: CheckCircle2,
                title: "ATS Optimized",
                description: "Ensure your resume passes Applicant Tracking Systems"
              },
              {
                icon: Star,
                title: "Save & Edit",
                description: "Store multiple versions and come back to edit anytime"
              }
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="p-4 sm:p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-1 sm:mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{feature.description}</p>
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
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Three simple steps to your perfect resume
            </p>
          </div>

          <div className="space-y-8 sm:space-y-12">
            {[
              { step: 1, title: "Fill in your details", description: "Enter your personal info, experience, education, and skills" },
              { step: 2, title: "Choose a template", description: "Pick from our professional templates that match your style" },
              { step: 3, title: "Download & Apply", description: "Export your resume and start applying to your dream jobs" }
            ].map((item, i) => (
              <div key={item.step} className="flex items-start sm:items-center gap-4 sm:gap-8">
                <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl sm:text-2xl font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <Link to="/create">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl">
                Start Building Now
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
              Career Insights
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4">
              Resume Tips & Career Advice
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Expert guidance to help you land your dream job faster
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
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          console.error('Failed to load image:', post.image);
                        }}
                      />
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
                View All Articles
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-border bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">123Resume</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              © 2025 123Resume. Build your dream career.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

