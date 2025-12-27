import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    // Track 404 errors silently
  }, [location.pathname]);

  return (
    <>
      <SEO
        title="Page Not Found - 123Resume"
        description="The page you're looking for doesn't exist."
        noindex={true}
      />
      <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">{t('pages.notFound.title')}</h1>
        <p className="mb-4 text-xl text-muted-foreground">{t('pages.notFound.message')}</p>
        <Link to="/" className="text-primary underline hover:text-primary/80">
          {t('pages.notFound.returnHome')}
        </Link>
      </div>
      </div>
    </>
  );
};

export default NotFound;
