import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeAPI, Resume } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, Printer, Download } from 'lucide-react';
import { downloadResumePDFFromElement } from '@/lib/resumePdfUtils';
import { useLanguage } from '@/contexts/LanguageContext';

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

  const personalInfo = resume.personalInfo;

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
      <div className="resume-container" ref={resumeContentRef}>
        {/* Header Section */}
        <header className="resume-header">
          <div className="header-content">
            <div className="profile-info">
              <h1 className="name"><strong>{personalInfo.firstName} {personalInfo.lastName}</strong></h1>
              {personalInfo.professionalTitle && (
                <h2 className="title">{personalInfo.professionalTitle}</h2>
              )}
            </div>
            {personalInfo.profileImage && (
              <img src={personalInfo.profileImage} alt={`${personalInfo.firstName} ${personalInfo.lastName}`} className="profile-image" />
            )}
          </div>
        </header>

        {/* Main Content - Single Column */}
        <main className="resume-main">
          
          {/* Professional Summary Section */}
          {personalInfo.summary && personalInfo.summary.trim() && (
            <section className="resume-section">
              <h3 className="section-title">{t('resume.sections.professionalSummary')}</h3>
              <p style={{ fontSize: '0.9em', lineHeight: '1.5', color: '#495057' }}>
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Contact Section */}
          <section className="resume-section">
            <h3 className="section-title">{t('resume.sections.contact')}</h3>
            <div className="contact-info">
              {personalInfo.phone && (
                <div className="contact-item">
                  <span>{t('resume.fields.phone')}: {personalInfo.phone}</span>
                </div>
              )}
              <div className="contact-item">
                <span>{t('resume.fields.email')}: {personalInfo.email}</span>
              </div>
              {personalInfo.location && (
                <div className="contact-item">
                  <span>{t('resume.fields.location')}: {personalInfo.location}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="contact-item">
                  <span>{t('resume.fields.github')}: <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="contact-link">{personalInfo.github}</a></span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="contact-item">
                  <span>{t('resume.fields.linkedin')}: <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link">{personalInfo.linkedin}</a></span>
                </div>
              )}
              {personalInfo.website && (
                <div className="contact-item">
                  <span>{t('resume.fields.website')}: <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="contact-link">{personalInfo.website}</a></span>
                </div>
              )}
            </div>
          </section>

          {/* Education Section */}
          {resume.education && resume.education.length > 0 && 
           resume.education.some((edu) => edu.degree || edu.institution) && (
            <section className="resume-section">
              <h3 className="section-title">{t('resume.sections.education')}</h3>
              {resume.education.filter((edu) => edu.degree || edu.institution).map((edu, index) => (
                <div key={index} className="education-item">
                  <h4><strong>{edu.degree}</strong></h4>
                  <div className="education-header">
                    <p className="institution"><strong>{edu.institution}</strong></p>
                    {(edu.startDate || edu.endDate) && (
                      <p className="period">
                        {edu.startDate} - {edu.endDate || t('resume.fields.present')}
                      </p>
                    )}
                  </div>
                  {edu.location && (
                    <p className="location">{edu.location}</p>
                  )}
                  {edu.keyCourses && edu.keyCourses.length > 0 && 
                   edu.keyCourses.some((course) => course.course && course.course.trim()) && (
                    <div className="key-courses">
                      {edu.keyCourses
                        .filter((course) => course.course && course.course.trim())
                        .map((course, courseIndex) => (
                          <span key={courseIndex} className="course-tag">{course.course}</span>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Work Experience Section */}
          {resume.workExperience && resume.workExperience.length > 0 && 
           resume.workExperience.some((exp) => exp.position || exp.company) && (
            <section className="resume-section">
              <h3 className="section-title">{t('resume.sections.workExperience')}</h3>
              {resume.workExperience.filter((exp) => exp.position || exp.company).map((exp, index) => (
                <div key={index} className="experience-item">
                  <div className="experience-header">
                    <h4><strong>{exp.position}</strong></h4>
                  </div>
                  <div className="experience-place">
                    <span className="company"><strong>{exp.company}</strong></span>
                    {(exp.startDate || exp.endDate) && (
                      <span className="period">
                        {exp.startDate} - {exp.endDate || t('resume.fields.present')}
                      </span>
                    )}
                  </div>
                  {exp.location && (
                    <div className="experience-location">
                      <span>{exp.location}</span>
                    </div>
                  )}
                  {exp.description && (
                    <ul className="experience-details">
                      {exp.description.split('\n').filter(line => line.trim()).map((line, lineIndex) => (
                        <li key={lineIndex}>{line.trim()}</li>
                      ))}
                    </ul>
                  )}
                  {exp.technologies && exp.technologies.length > 0 && 
                   exp.technologies.some((tech) => tech.technology && tech.technology.trim()) && (
                    <div className="job-tech">
                      {exp.technologies
                        .filter((tech) => tech.technology && tech.technology.trim())
                        .map((tech, techIndex) => (
                          <span key={techIndex} className="tech-tag">{tech.technology}</span>
                        ))}
                    </div>
                  )}
                  {exp.competencies && exp.competencies.length > 0 && 
                   exp.competencies.some((comp) => comp.competency && comp.competency.trim()) && (
                    <div className="job-competencies">
                      {exp.competencies
                        .filter((comp) => comp.competency && comp.competency.trim())
                        .map((comp, compIndex) => (
                          <span key={compIndex} className="competency-bubble">{comp.competency}</span>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Projects Section */}
          {resume.projects && resume.projects.length > 0 && 
           resume.projects.some((project) => project.name && project.name.trim()) && (
            <section className="resume-section">
              <h3 className="section-title">{t('resume.sections.projects')}</h3>
              {resume.projects.filter((project) => project.name && project.name.trim()).map((project, index) => (
                <div key={index} className="project-item">
                  <div className="project-header">
                    <h4><strong>{project.name}</strong></h4>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                        {t('resume.labels.viewProject')}
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="project-description">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && 
                   project.technologies.some((tech) => tech.technology && tech.technology.trim()) && (
                    <div className="project-tech">
                      {project.technologies
                        .filter((tech) => tech.technology && tech.technology.trim())
                        .map((tech, techIndex) => (
                          <span key={techIndex} className="tech-tag">{tech.technology}</span>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Certifications Section */}
          {resume.certificates && resume.certificates.length > 0 && 
           resume.certificates.some((cert) => cert.name && cert.name.trim()) && (
            <section className="resume-section">
              <h3 className="section-title">{t('resume.sections.certifications')}</h3>
              {resume.certificates.filter((cert) => cert.name && cert.name.trim()).map((cert, index) => (
                <div key={index} className="certification-item">
                  <div className="certification-header">
                    <h4><strong>{cert.name}</strong></h4>
                    {cert.organization && (
                      <span className="certification-issuer">{cert.organization}</span>
                    )}
                  </div>
                  {cert.issueDate && (
                    <p className="certification-date">{cert.issueDate}</p>
                  )}
                  {cert.url && (
                    <a href={cert.url} target="_blank" rel="noopener noreferrer" className="certification-link">
                      {t('resume.labels.viewCertificate')}
                    </a>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Skills Section */}
          {resume.skills && resume.skills.length > 0 && (
            <section className="resume-section">
              <h3 className="section-title">{t('resume.sections.skills')}</h3>
              <div className="skill-tags">
                {resume.skills
                  .filter((skillObj) => skillObj.skill && skillObj.skill.trim())
                  .map((skillObj, index) => (
                    <span key={index} className="skill-tag">{skillObj.skill}</span>
                  ))}
              </div>
            </section>
          )}

          {/* Languages Section */}
          {resume.languages && resume.languages.length > 0 && 
           resume.languages.some((lang) => lang.language && lang.language.trim()) && (
            <section className="resume-section">
              <h3 className="section-title">{t('resume.sections.languages')}</h3>
              <div className="languages-list">
                {resume.languages
                  .filter((lang) => lang.language && lang.language.trim())
                  .map((lang, index) => (
                    <div key={index} className="language-item">
                      <span className="language-name">{lang.language}</span>
                      <span className="language-level">{lang.proficiency}</span>
                    </div>
                  ))}
              </div>
            </section>
          )}

          {/* Interests Section */}
          {personalInfo.interests && personalInfo.interests.length > 0 && 
           personalInfo.interests.some((interest) => interest.interest && interest.interest.trim()) && (
            <section className="resume-section">
              <h3 className="section-title">{t('resume.sections.interests')}</h3>
              <div className="interests-list">
                {personalInfo.interests
                  .filter((interest) => interest.interest && interest.interest.trim())
                  .map((interest, index) => (
                    <span key={index} className="interest-tag">{interest.interest}</span>
                  ))}
              </div>
            </section>
          )}

        </main>
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

