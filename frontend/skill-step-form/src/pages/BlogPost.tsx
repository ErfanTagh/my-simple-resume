import { Link, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  BookOpen, 
  Clock, 
  ArrowLeft,
  ArrowRight,
  Share2,
  Twitter,
  Linkedin
} from "lucide-react";
import { getBlogPost, getBlogPosts } from "@/lib/blogPosts";
import { useLanguage } from "@/contexts/LanguageContext";
import { blogPostAPI, BlogPost } from "@/lib/api";
import { SEO } from "@/components/SEO";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);
  
  // Fetch blog post from API with fallback to static
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const apiPost = await blogPostAPI.getById(id, language);
        setPost(apiPost);
      } catch (error) {
        // Fallback to static posts
        const staticPost = getBlogPost(id, language);
        setPost(staticPost);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [id, language]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  // Get all posts for navigation (try API first, fallback to static)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const apiPosts = await blogPostAPI.getAll(language);
        const staticPosts = getBlogPosts(language);
        const apiPostIds = new Set(apiPosts.map(p => p.id));
        const merged = [...apiPosts, ...staticPosts.filter(p => !apiPostIds.has(p.id))];
        setAllPosts(merged);
      } catch {
        setAllPosts(getBlogPosts(language));
      }
    };
    fetchAllPosts();
  }, [language]);
  
  const currentIndex = allPosts.findIndex(p => p.id === id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];
    let inList = false;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 text-muted-foreground mb-6 ml-4">
            {listItems.map((item, i) => (
              <li key={i} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl sm:text-3xl font-bold text-foreground mt-10 mb-4">
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl sm:text-2xl font-semibold text-foreground mt-8 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      } else if (trimmed.startsWith('- ')) {
        inList = true;
        listItems.push(trimmed.replace('- ', ''));
      } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        flushList();
        elements.push(
          <p key={index} className="font-semibold text-foreground mb-2">
            {trimmed.replace(/\*\*/g, '')}
          </p>
        );
      } else if (trimmed.length > 0) {
        flushList();
        // Handle inline bold text
        const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
        elements.push(
          <p key={index} className="text-muted-foreground leading-relaxed mb-4">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-foreground font-semibold">{part.replace(/\*\*/g, '')}</strong>;
              }
              return part;
            })}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  const postUrl = `https://123resume.de/blog/${post.id}`;
  const postImage = post.coverImage || post.image || 'https://123resume.de/resume-icon.svg';
  const postDescription = post.excerpt || post.content?.substring(0, 160) || 'Read our latest resume tips and career advice';
  
  // Structured data for article
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: postDescription,
    image: postImage,
    datePublished: post.publishedAt || post.createdAt || new Date().toISOString(),
    dateModified: post.updatedAt || post.publishedAt || post.createdAt || new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: '123Resume',
    },
    publisher: {
      '@type': 'Organization',
      name: '123Resume',
      logo: {
        '@type': 'ImageObject',
        url: 'https://123resume.de/resume-icon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  };

  return (
    <>
      <SEO
        title={`${post.title} | 123Resume Blog`}
        description={postDescription}
        keywords={`${post.category || 'resume tips'}, career advice, job search, ${post.title}`}
        image={postImage}
        url={postUrl}
        type="article"
        structuredData={articleStructuredData}
        publishedTime={post.publishedAt || post.createdAt}
        modifiedTime={post.updatedAt || post.publishedAt || post.createdAt}
      />
      <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary flex items-center justify-center">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">{t('common.appName')}</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/blog">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">All Articles</span>
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

      {/* Article Header */}
      <header className="pt-24 sm:pt-32 pb-8 sm:pb-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {t('common.back')}
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 hover:bg-primary/15 transition-colors">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-6">
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground pb-6 border-b border-border">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
            <span>{post.date}</span>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs uppercase tracking-wider">Share:</span>
              <button className="w-8 h-8 rounded-full bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      <div className="px-4 sm:px-6 mb-12">
        <div className="container mx-auto max-w-4xl">
          {post.image ? (
            <div className="aspect-[21/9] rounded-2xl overflow-hidden border border-border shadow-lg relative">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
              {/* Watermark */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">123Resume</span>
              </div>
            </div>
          ) : (
            <div className={`aspect-[21/9] bg-gradient-to-br ${post.gradient} rounded-2xl relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-8 right-8 w-32 h-32 border border-current rounded-full opacity-20" />
                <div className="absolute bottom-8 left-8 w-20 h-20 border border-current rounded-lg rotate-12 opacity-20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-current rounded-full opacity-10" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                  <BookOpen className={`w-12 h-12 sm:w-16 sm:h-16 ${post.iconColor}`} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <article className="px-4 sm:px-6 pb-16">
        <div className="container mx-auto max-w-3xl">
          <div className="prose prose-lg max-w-none font-sans" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
            {renderContent(post.content)}
          </div>
        </div>
      </article>

      {/* CTA Box */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 sm:p-12 border border-primary/20 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {t('blog.ctaTitle')}
            </h3>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              {t('blog.ctaSubtitle')}
            </p>
            <Link to="/create">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-xl">
                {t('navigation.startBuildingFree')}
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation Between Posts */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="container mx-auto max-w-3xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost && (
              <Link to={`/blog/${prevPost.id}`} className="group">
                <div className="p-4 sm:p-6 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    {t('common.previous')}
                  </div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {prevPost.title}
                  </h4>
                </div>
              </Link>
            )}
            {nextPost && (
              <Link to={`/blog/${nextPost.id}`} className="group sm:ml-auto">
                <div className="p-4 sm:p-6 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 transition-all text-right">
                  <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground mb-2">
                    {t('common.next')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {nextPost.title}
                  </h4>
                </div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">123Resume</span>
            </Link>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              © 2025 123Resume. Build your dream career.
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default BlogPost;

