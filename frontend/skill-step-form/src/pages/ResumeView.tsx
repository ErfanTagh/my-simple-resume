import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeAPI, Resume } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, Printer, Download } from 'lucide-react';
import { downloadResumePDFFromElement } from '@/lib/resumePdfUtils';
import { useLanguage } from '@/contexts/LanguageContext';
import { ModernTemplate } from '@/components/cv-form/templates/ModernTemplate';
import { ClassicTemplate } from '@/components/cv-form/templates/ClassicTemplate';
import { MinimalTemplate } from '@/components/cv-form/templates/MinimalTemplate';
import { CreativeTemplate } from '@/components/cv-form/templates/CreativeTemplate';
import { LatexTemplate } from '@/components/cv-form/templates/LatexTemplate';
import { StarRoverTemplate } from '@/components/cv-form/templates/StarRoverTemplate';
import { CVFormData } from '@/components/cv-form/types';

export default function ResumeView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [resume, setResume] = useState<Resume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const resumeContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      loadResume(id);
    }
  }, [id]);

  useEffect(() => {
    // Load partitioned resume stylesheets in correct order
    const cssFiles = [
      '/resume-base.css',
      '/resume-header.css',
      '/resume-sections.css',
      '/resume-education.css',
      '/resume-experience.css',
      '/resume-projects.css',
      '/resume-skills.css',
      '/resume-languages.css',
      '/resume-certifications.css',
      '/resume-interests.css',
      '/resume-responsive.css',
      '/resume-print.css',
    ];

    const links: HTMLLinkElement[] = [];

    // Load all CSS files
    cssFiles.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      links.push(link);
    });

    // Load Google Fonts (Inter)
    const googleFonts = document.createElement('link');
    googleFonts.rel = 'stylesheet';
    googleFonts.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(googleFonts);
    links.push(googleFonts);

    return () => {
      // Cleanup: remove all links
      links.forEach((link) => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, []);

  const loadResume = async (resumeId: string) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await resumeAPI.getById(resumeId);
      setResume(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    // Open browser print dialog - users can choose to print or save as PDF
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!resumeContentRef.current || !id || !resume) return;

    try {
      await downloadResumePDFFromElement(id, resumeContentRef.current, resume);
    } catch (error: any) {
      setError(error.message || 'Failed to generate PDF');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'Resume not found'}</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/resumes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Resumes
          </Button>
        </div>
      </div>
    );
  }

  // Convert Resume to CVFormData format for template rendering
  const convertResumeToFormData = (resume: Resume): CVFormData => {
    return {
      template: resume.template || 'modern',
      personalInfo: resume.personalInfo,
      workExperience: resume.workExperience || [],
      education: resume.education || [],
      projects: resume.projects || [],
      certificates: resume.certificates || [],
      skills: resume.skills || [],
      languages: resume.languages || [],
      sectionOrder: resume.sectionOrder || []
    };
  };

  // Render the appropriate template component
  const renderTemplate = () => {
    const formData = convertResumeToFormData(resume);
    const template = resume.template || 'modern';

    switch (template) {
      case 'classic':
        return <ClassicTemplate data={formData} />;
      case 'minimal':
        return <MinimalTemplate data={formData} />;
      case 'creative':
        return <CreativeTemplate data={formData} />;
      case 'latex':
        return <LatexTemplate data={formData} />;
      case 'starRover':
        return <StarRoverTemplate data={formData} />;
      case 'modern':
      default:
        return <ModernTemplate data={formData} />;
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Action Buttons - Hide on print */}
      <div className="no-print" style={{ padding: '20px', textAlign: 'center', backgroundColor: 'white', borderBottom: '1px solid #e9ecef' }}>
        <div style={{ maxWidth: '210mm', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="outline" onClick={() => navigate('/resumes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            {t('common.print')}
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="mr-2 h-4 w-4" />
            {t('common.downloadPDF')}
          </Button>
        </div>
      </div>

      {/* Resume Content */}
      <div className="resume-container" ref={resumeContentRef} style={{ maxWidth: '210mm', margin: '0 auto', backgroundColor: 'white', padding: '40px' }}>
        {renderTemplate()}
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          /* Hide page title and URL in print */
          @page {
            margin: 0;
          }
        }
        /* Global print styles - hide header and footer site-wide when printing */
        @media print {
          header:not(.resume-header),
          footer,
          .no-print,
          header.no-print {
            display: none !important;
            visibility: hidden !important;
          }
        }
      `}</style>
    </div>
  );
}

