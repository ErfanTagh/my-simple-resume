import { CVFormData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatDateRange } from "@/lib/dateFormatter";

interface ModernTemplateProps {
  data: CVFormData;
}

export const ModernTemplate = ({ data }: ModernTemplateProps) => {
  const { t } = useLanguage();
  const { personalInfo, workExperience, education, projects, certificates, languages, skills, sectionOrder, styling } = data;
  
  const defaultOrder = ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"];
  const orderedSections = sectionOrder || defaultOrder;
  
  // Extract styling options with defaults
  const fontFamily = styling?.fontFamily || "Inter";
  const fontSize = styling?.fontSize || "medium";
  const titleColor = styling?.titleColor || "#1f2937";
  const titleBold = styling?.titleBold ?? true;
  const headingColor = styling?.headingColor || "#2563eb";
  const headingBold = styling?.headingBold ?? true;
  const textColor = styling?.textColor || "#1f2937";
  const linkColor = styling?.linkColor || "#2563eb";
  
  // Font size mappings
  const fontSizeMap = {
    small: {
      base: '0.75rem',      // 12px
      sm: '0.875rem',       // 14px
      baseText: '0.75rem',  // 12px
      title: '1.5rem',      // 24px
      heading: '0.875rem',  // 14px
      xs: '0.625rem',       // 10px
    },
    medium: {
      base: '0.875rem',     // 14px
      sm: '1rem',           // 16px
      baseText: '0.875rem', // 14px
      title: '1.875rem',    // 30px
      heading: '1.125rem',  // 18px
      xs: '0.75rem',        // 12px
    },
    large: {
      base: '1rem',         // 16px
      sm: '1.125rem',       // 18px
      baseText: '1rem',     // 16px
      title: '2.25rem',     // 36px
      heading: '1.25rem',   // 20px
      xs: '0.875rem',       // 14px
    },
  };
  
  const sizes = fontSizeMap[fontSize];
  
  // Helper function for section headings
  const getHeadingStyle = () => ({
    color: headingColor,
    fontWeight: headingBold ? 'bold' : 'normal',
    borderColor: headingColor,
    fontSize: sizes.heading,
  });
  
  // Helper function for section headings className
  const getHeadingClassName = () => "mb-3 border-b-2 pb-1";

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        return personalInfo.summary && personalInfo.summary.trim() ? (
          <div key="summary" className="mb-6" data-resume-section="true">
            <h2 
              className={`text-lg mb-3 border-b-2 pb-1`}
              style={{ 
                color: headingColor,
                fontWeight: headingBold ? 'bold' : 'normal',
                borderColor: headingColor
              }}
            >
              {t('resume.sections.professionalSummary').toUpperCase()}
            </h2>
            <p className="leading-relaxed whitespace-pre-wrap" style={{ color: textColor, fontSize: sizes.baseText }}>
              {personalInfo.summary.trim()}
            </p>
          </div>
        ) : null;

      case "workExperience":
        return workExperience.some(exp => exp.position || exp.company) ? (
          <div key="workExperience" className="mb-6" data-resume-section="true">
            <h2 className={getHeadingClassName()} style={getHeadingStyle()}>{t('resume.sections.experience').toUpperCase()}</h2>
            <div className="space-y-4">
              {workExperience.map((exp, index) => (
                (exp.position || exp.company) && (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-foreground">{exp.position}</h3>
                        <p className="text-sm font-semibold text-primary">{exp.company}</p>
                        {exp.location && <p className="text-xs text-muted-foreground">{exp.location}</p>}
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDateRange(exp.startDate, exp.endDate, t('resume.fields.present'))}</span>
                        </div>
                      )}
                    </div>
                    {exp.description && <p className="text-muted-foreground mb-2" style={{ color: textColor, fontSize: sizes.sm }}>{exp.description}</p>}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="space-y-1 mb-2" style={{ fontSize: sizes.sm }}>
                        {exp.responsibilities.map((resp, i) => (
                          resp.responsibility && (
                            <li key={i} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span className="flex-1">{resp.responsibility}</span>
                            </li>
                          )
                        ))}
                      </ul>
                    )}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <p className="text-xs text-primary mt-2">
                        {t('resume.sections.technologies')}: {exp.technologies.map(t => typeof t === 'string' ? t : t.technology).filter(Boolean).join(", ")}
                      </p>
                    )}
                    {exp.competencies && exp.competencies.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('resume.labels.keyCompetencies')}: {exp.competencies.map(c => typeof c === 'string' ? c : c.competency).filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        return education.some(edu => edu.degree || edu.institution) ? (
          <div key="education" className="mb-6" data-resume-section="true">
            <h2 className={getHeadingClassName()} style={getHeadingStyle()}>{t('resume.sections.education').toUpperCase()}</h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                (edu.degree || edu.institution) && (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-foreground">{edu.degree}</h3>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        {edu.location && <p className="text-xs text-muted-foreground">{edu.location}</p>}
                        {edu.field && <p className="text-sm text-muted-foreground italic">{edu.field}</p>}
                        {edu.keyCourses && edu.keyCourses.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('resume.labels.keyCourses')}: {edu.keyCourses.map(c => typeof c === 'string' ? c : c.course).filter(Boolean).join(", ")}
                          </p>
                        )}
                      </div>
                      {(edu.startDate || edu.endDate) && (
                        <span className="text-xs text-muted-foreground">{formatDateRange(edu.startDate, edu.endDate, t('resume.fields.present'))}</span>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        return projects.some(proj => proj.name) ? (
          <div key="projects" className="mb-6" data-resume-section="true">
            <h2 className={getHeadingClassName()} style={getHeadingStyle()}>{t('resume.sections.projects').toUpperCase()}</h2>
            <div className="space-y-3">
              {projects.map((proj, index) => (
                proj.name && (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-foreground">{proj.name}</h3>
                      {(proj.startDate || proj.endDate) && (
                        <span className="text-xs text-muted-foreground">{formatDateRange(proj.startDate, proj.endDate, t('resume.fields.present'))}</span>
                      )}
                    </div>
                    {proj.description && <p className="text-sm text-muted-foreground mb-2">{proj.description}</p>}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="text-sm text-foreground space-y-1 mb-2">
                        {proj.highlights.map((highlight, i) => (
                          highlight.highlight && (
                            <li key={i} className="flex gap-2">
                              <span className="text-primary">•</span>
                              <span className="flex-1">{highlight.highlight}</span>
                            </li>
                          )
                        ))}
                      </ul>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <p className="text-xs text-primary mt-1">
                        {t('resume.sections.technologies')}: {proj.technologies.map(t => typeof t === 'string' ? t : t.technology).filter(Boolean).join(", ")}
                      </p>
                    )}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 block">
                        {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "certificates":
        return certificates.some(cert => cert.name) ? (
          <div key="certificates" className="mb-6" data-resume-section="true">
            <h2 className={getHeadingClassName()} style={getHeadingStyle()}>{t('resume.sections.certifications').toUpperCase()}</h2>
            <div className="space-y-2">
              {certificates.map((cert, index) => (
                cert.name && (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-foreground">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">{cert.organization}</p>
                        {(cert.issueDate || cert.expirationDate) && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {cert.issueDate} {cert.expirationDate && `- ${cert.expirationDate}`}
                          </p>
                        )}
                        {cert.credentialId && (
                          <p className="text-xs text-muted-foreground">ID: {cert.credentialId}</p>
                        )}
                        {cert.url && (
                          <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 block">
                            {cert.url.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        return skills.some(s => s.skill) ? (
          <div key="skills" className="mb-6" data-resume-section="true">
            <h2 className={getHeadingClassName()} style={getHeadingStyle()}>{t('resume.sections.skills').toUpperCase()}</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, index) => (
                s.skill && (
                  <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {s.skill}
                  </span>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "languages":
        return languages.some(lang => lang.language) ? (
          <div key="languages" className="mb-6" data-resume-section="true">
            <h2 className={getHeadingClassName()} style={getHeadingStyle()}>{t('resume.sections.languages').toUpperCase()}</h2>
            <div className="space-y-2">
              {languages.map((lang, index) => (
                lang.language && (
                  <div key={index} className="text-sm flex justify-between items-center gap-4 pr-2">
                    <span className="font-semibold text-foreground">{lang.language}</span>
                    <span className="text-muted-foreground whitespace-nowrap flex-shrink-0">{lang.proficiency}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "interests":
        return personalInfo.interests && personalInfo.interests.length > 0 && personalInfo.interests.some(i => i.interest) ? (
          <div key="interests" className="mb-6" data-resume-section="true">
            <h2 className={getHeadingClassName()} style={getHeadingStyle()}>{t('resume.sections.interests').toUpperCase()}</h2>
            <p className="text-sm" style={{ color: textColor, fontSize: sizes.baseText }}>{personalInfo.interests.map(i => i.interest).filter(Boolean).join(", ")}</p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <>
      <style>{`
        /* Apply padding for both screen (preview) and print */
        .resume-page-container {
          padding-top: 32px !important;
          padding-bottom: 32px !important;
        }
        @media print {
          @page {
            size: A4;
            margin: 15mm 0 0 0;
            background: var(--pdf-background, hsl(var(--background))) !important;
          }
          @page :first {
            margin-top: 0;
          }
          html, body {
            background: var(--pdf-background, hsl(var(--background))) !important;
            min-height: 100%;
            height: 100%;
          }
          .resume-page-container {
            min-height: 297mm !important;
            background: var(--pdf-background, hsl(var(--background))) !important;
            width: 210mm;
            margin: 0 auto;
            /* Use flexbox to ensure last page fills */
            display: flex;
            flex-direction: column;
          }
          /* Content wrapper should not grow */
          .resume-page-container > div:not([aria-hidden="true"]) {
            flex: 0 0 auto;
          }
          /* Spacer div at end will fill remaining space */
          .resume-page-container > div[aria-hidden="true"] {
            flex: 1 1 auto !important;
            min-height: 0;
            background: var(--pdf-background, hsl(var(--background))) !important;
          }
          /* Prevent sections from breaking awkwardly */
          div[class*="mb-"] {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
      <div 
        className="resume-page-container bg-background text-foreground p-8 max-w-4xl mx-auto"
        style={{ fontFamily: `"${fontFamily}", ui-sans-serif, system-ui, sans-serif` }}
      >
      {/* Header with colored background */}
      <div className="bg-primary/5 -mx-8 -mt-8 px-8 py-6 mb-6 border-l-4 border-primary">
        <div className="flex items-start gap-6">
          <div className="flex-1">
        <h1 
          className="mb-2"
          style={{ 
            color: titleColor,
            fontWeight: titleBold ? 'bold' : 'normal',
            fontSize: sizes.title,
            lineHeight: '1.2',
          }}
        >
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.professionalTitle && personalInfo.professionalTitle.trim().length > 0 && (
          <p className="text-base text-primary font-semibold mb-2">{personalInfo.professionalTitle.trim()}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mt-3">
          {personalInfo.email && (
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate">{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2 min-w-0">
              <Phone className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate">{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate">{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2 min-w-0">
              <Linkedin className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate">{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2 min-w-0">
              <Github className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate">{personalInfo.github}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate">{personalInfo.website}</span>
            </div>
          )}
            </div>
          </div>
          
          {/* Profile image */}
          {personalInfo.profileImage && (
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-md border-2 border-primary overflow-hidden">
                <img 
                  src={personalInfo.profileImage} 
                  alt={`Professional profile photo of ${personalInfo.firstName} ${personalInfo.lastName}${personalInfo.professionalTitle ? `, ${personalInfo.professionalTitle}` : ''}${personalInfo.location ? ` from ${personalInfo.location}` : ''}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {orderedSections.map(section => renderSection(section))}
      </div>
      
      {/* Spacer to ensure last page fills full height */}
      <div aria-hidden="true" style={{ flex: '1 1 auto', minHeight: 0 }}></div>

      {/* Page Number Footer */}
      <style>{`
        /* Hide page numbers in preview (screen) */
        .page-number-footer {
          display: none;
        }
        @media print {
          @page {
            margin-bottom: 20mm;
            margin-top: 15mm;
            @bottom-center {
              content: counter(page);
              font-size: ${sizes.xs};
              color: ${textColor};
              opacity: 0.6;
            }
          }
          @page :first {
            margin-top: 0;
          }
          /* Ensure our footer is hidden in print */
          .page-number-footer {
            display: none !important;
          }
        }
      `}</style>
      <div className="page-number-footer"></div>
      </div>
    </>
  );
};
