import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
  structuredData?: object;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export const SEO = ({
  title = '123Resume - Professional CV Builder | Create Your Resume Online',
  description = 'Build your professional CV with our easy-to-use multi-step form. Create ATS-friendly resumes with multiple templates. Free CV builder with PDF export.',
  keywords = 'CV builder, resume builder, create CV, professional resume, ATS resume, CV templates, resume templates, online CV maker',
  image = 'https://123resume.de/resume-icon.svg',
  url,
  type = 'website',
  noindex = false,
  structuredData,
  author,
  publishedTime,
  modifiedTime,
}: SEOProps) => {
  const location = useLocation();
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:site_name', '123Resume', true);
    updateMetaTag('og:locale', 'en_US', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Robots meta tag
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow');
    }

    // Language attribute
    const html = document.documentElement;
    html.setAttribute('lang', 'en');

    // Article-specific meta tags
    if (type === 'article') {
      if (author) updateMetaTag('article:author', author, true);
      if (publishedTime) updateMetaTag('article:published_time', publishedTime, true);
      if (modifiedTime) updateMetaTag('article:modified_time', modifiedTime, true);
    }

    // Structured Data (JSON-LD)
    let structuredDataScript = document.querySelector('script[type="application/ld+json"]');
    if (structuredData) {
      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(structuredData);
    } else {
      // Default Organization and Website structured data
      const defaultStructuredData = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://123resume.de/#organization',
            name: '123Resume',
            url: 'https://123resume.de',
            logo: {
              '@type': 'ImageObject',
              url: 'https://123resume.de/resume-icon.svg',
              width: 512,
              height: 512,
            },
            sameAs: [],
          },
          {
            '@type': 'WebSite',
            '@id': 'https://123resume.de/#website',
            url: 'https://123resume.de',
            name: '123Resume - Professional CV Builder',
            description: description,
            publisher: {
              '@id': 'https://123resume.de/#organization',
            },
          },
        ],
      };

      if (!structuredDataScript) {
        structuredDataScript = document.createElement('script');
        structuredDataScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(defaultStructuredData);
    }
  }, [title, description, keywords, image, currentUrl, type, noindex, location.pathname, structuredData, author, publishedTime, modifiedTime]);

  return null;
};

