import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Sitemap page component
 * Fetches dynamic sitemap from backend API and serves as XML
 */
export default function Sitemap() {
  const [sitemapXml, setSitemapXml] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchSitemap = async () => {
      try {
        // Fetch sitemap from backend API
        const response = await fetch('/api/sitemap.xml');
        if (response.ok) {
          const xml = await response.text();
          setSitemapXml(xml);
        } else {
          // Fallback to static sitemap if API fails
          const staticResponse = await fetch('/sitemap.xml');
          if (staticResponse.ok) {
            const staticXml = await staticResponse.text();
            setSitemapXml(staticXml);
          }
        }
      } catch (error) {
        console.error('Failed to fetch sitemap:', error);
        // Try to load static sitemap as fallback
        try {
          const staticResponse = await fetch('/sitemap.xml');
          if (staticResponse.ok) {
            const staticXml = await staticResponse.text();
            setSitemapXml(staticXml);
          }
        } catch (e) {
          // If both fail, set empty
          setSitemapXml('');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSitemap();
  }, [location.pathname]);

  // Set content type to XML
  useEffect(() => {
    if (sitemapXml && !isLoading) {
      // Create a blob and download it, or just set the document content
      // For SEO, we want to serve it as XML
      document.contentType = 'application/xml';
    }
  }, [sitemapXml, isLoading]);

  // Return XML content
  if (isLoading) {
    return null; // Or a loading indicator
  }

  // This won't work well in React - we need to serve it differently
  // Instead, we'll configure nginx or use a different approach
  return null;
}

/**
 * Function to fetch and return sitemap XML
 * This can be used by a server-side route or nginx proxy
 */
export async function getSitemapXml(): Promise<string> {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
    const response = await fetch(`${apiBaseUrl}/sitemap.xml`);
    if (response.ok) {
      return await response.text();
    }
  } catch (error) {
    console.error('Failed to fetch dynamic sitemap:', error);
  }
  
  // Fallback to static
  try {
    const staticResponse = await fetch('/sitemap.xml');
    if (staticResponse.ok) {
      return await staticResponse.text();
    }
  } catch (e) {
    console.error('Failed to fetch static sitemap:', e);
  }
  
  return '';
}

