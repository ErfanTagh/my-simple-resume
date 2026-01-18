import { CVFormData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { formatDateRange } from "@/lib/dateFormatter";
import { useLanguage } from "@/contexts/LanguageContext";

interface StarRoverTemplateProps {
  data: CVFormData;
}

const ACCENT_COLOR = "#141E61"; // Navy blue accent

export const StarRoverTemplate = ({ data }: StarRoverTemplateProps) => {
  const { t } = useLanguage();
  const { personalInfo, workExperience, education, projects, certificates, languages, skills, sectionOrder, styling } = data;
  
  const defaultOrder = ["summary", "education", "workExperience", "projects", "certificates", "skills", "languages", "interests"];
  const orderedSections = sectionOrder || defaultOrder;

  // Extract styling options with defaults
  const fontFamily = styling?.fontFamily || "monospace";
  const fontSizeInput = styling?.fontSize || "medium";
  const fontSize: "small" | "medium" | "large" = 
    (fontSizeInput === "small" || fontSizeInput === "medium" || fontSizeInput === "large") 
      ? fontSizeInput 
      : "medium";
  const titleColor = styling?.titleColor || "#141E61";
  const titleBold = styling?.titleBold ?? true;
  const headingColor = styling?.headingColor || "#141E61";
  const headingBold = styling?.headingBold ?? true;
  const textColor = styling?.textColor || "#1f2937";
  const linkColor = styling?.linkColor || "#141E61";
  
  // Font size mappings - StarRover uses text-base (16px), text-sm (14px), text-xs (12px)
  const fontSizeMap = {
    small: {
      base: '0.875rem',     // 14px (text-sm)
      sm: '0.75rem',        // 12px (text-xs)
      xs: '0.625rem',       // 10px
      heading: '0.875rem',  // 14px
    },
    medium: {
      base: '1rem',         // 16px (text-base)
      sm: '0.875rem',       // 14px (text-sm)
      xs: '0.75rem',        // 12px (text-xs)
      heading: '1rem',      // 16px
    },
    large: {
      base: '1.125rem',     // 18px
      sm: '1rem',           // 16px
      xs: '0.875rem',       // 14px
      heading: '1.125rem',  // 18px
    },
  };
  
  const sizes = fontSizeMap[fontSize];

  // Helper to format date range for Star Rover style (MMM YYYY format)
  const formatDateRangeStar = (startDate: string | undefined, endDate: string | undefined): string => {
    if (!startDate && !endDate) return '';
    
    const formatDate = (dateStr: string | undefined): string => {
      if (!dateStr) return '';
      const match = dateStr.match(/^(\d{4})-(\d{2})$/);
      if (!match) return dateStr;
      const [, year, month] = match;
      const monthNum = parseInt(month, 10);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (monthNum < 1 || monthNum > 12) return dateStr;
      return `${monthNames[monthNum - 1]} ${year}`;
    };
    
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : t('resume.fields.present');
    
    if (!start && !end) return '';
    if (!start) return end;
    
    return `${start} -- ${end}`;
  };

  // Render contact info icon
  const renderContactIcon = (Icon: any, text: string | undefined, url?: string) => {
    if (!text) return null;
    
    const content = (
      <>
        <Icon className="h-3 w-3 text-muted-foreground inline mr-1.5" />
        {url && (url.startsWith('http') || url.startsWith('mailto')) ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:underline">
            {text.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}
          </a>
        ) : (
          <span className="text-muted-foreground">{text}</span>
        )}
      </>
    );
    
    return <span style={{ fontSize: sizes.sm }}>{content}</span>;
  };

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        return personalInfo.summary && personalInfo.summary.trim() ? (
          <div key="summary" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
                <h2 className="font-bold uppercase tracking-wide px-2" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                  {t('resume.sections.summary').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
              </div>
            </div>
            <p className="text-foreground leading-relaxed break-words whitespace-pre-wrap" style={{ fontSize: sizes.base, color: textColor }}>{personalInfo.summary.trim()}</p>
          </div>
        ) : null;

      case "education":
        return education && education.length > 0 && education.some(edu => edu.degree || edu.institution) ? (
          <div key="education" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
                <h2 className="font-bold uppercase tracking-wide px-2" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                  {t('resume.sections.education').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
              </div>
            </div>
            <div className="space-y-3">
              {education.map((edu, index) => {
                if (!edu.degree && !edu.institution) return null;
                
                const dateRange = formatDateRangeStar(edu.startDate, edu.endDate);
                const hasAux = edu.degree && edu.institution;
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold uppercase tracking-wide text-foreground" style={{ fontSize: sizes.heading }}>
                        {edu.institution || edu.degree}
                        {hasAux && (
                          <span className="font-normal normal-case italic text-foreground">
                            {' | '}{edu.degree}
                          </span>
                        )}
                      </h3>
                      {dateRange && (
                        <span className="font-normal flex-shrink-0" style={{ fontSize: sizes.sm, color: headingColor }}>
                          {dateRange}
                        </span>
                      )}
                    </div>
                    {edu.location && (
                      <span className="font-normal" style={{ fontSize: sizes.sm, color: headingColor }}>
                        {edu.location}
                      </span>
                    )}
                    {edu.field && (
                      <ul className="text-foreground space-y-0.5 mt-1 list-none pl-0" style={{ fontSize: sizes.base }}>
                        <li className="break-words">{edu.field}</li>
                      </ul>
                    )}
                    {edu.keyCourses && edu.keyCourses.length > 0 && (
                      <p className="text-muted-foreground mt-1" style={{ fontSize: sizes.sm }}>
                        {t('resume.labels.keyCourses')}: {edu.keyCourses.map(c => typeof c === 'string' ? c : c.course).filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;

      case "workExperience":
        return workExperience && workExperience.length > 0 && workExperience.some(exp => exp.position || exp.company) ? (
          <div key="workExperience" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
                <h2 className="font-bold uppercase tracking-wide px-2" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                  {t('resume.sections.experience').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
              </div>
            </div>
            <div className="space-y-3">
              {workExperience.map((exp, index) => {
                if (!exp.position && !exp.company) return null;
                
                const dateRange = formatDateRangeStar(exp.startDate, exp.endDate);
                const responsibilities = exp.responsibilities 
                  ? exp.responsibilities.filter(r => r.responsibility).map(r => r.responsibility!)
                  : exp.description 
                  ? exp.description.split('\n').filter(line => line.trim())
                  : [];
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold uppercase tracking-wide text-foreground" style={{ fontSize: sizes.heading }}>
                        {exp.company || exp.position}
                      </h3>
                      {exp.location && (
                        <span className="font-normal flex-shrink-0" style={{ fontSize: sizes.sm, color: headingColor }}>
                          {exp.location}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="font-bold text-foreground" style={{ fontSize: sizes.sm }}>{exp.position || exp.company}</h4>
                      {dateRange && (
                        <span className="font-normal flex-shrink-0" style={{ fontSize: sizes.sm, color: headingColor }}>
                          {dateRange}
                        </span>
                      )}
                    </div>
                    {responsibilities.length > 0 && (
                      <ul className="text-foreground space-y-0.5 mt-1 list-none pl-0" style={{ fontSize: sizes.base }}>
                        {responsibilities.map((resp, i) => (
                          <li key={i} className="break-words">• {resp}</li>
                        ))}
                      </ul>
                    )}
                    {exp.competencies && exp.competencies.length > 0 && (
                      <p className="text-muted-foreground mt-1" style={{ fontSize: sizes.sm }}>
                        {t('resume.labels.keyCompetencies')}: {exp.competencies.map(c => typeof c === 'string' ? c : c.competency).filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;

      case "projects":
        return projects && projects.length > 0 && projects.some(proj => proj.name) ? (
          <div key="projects" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
                <h2 className="font-bold uppercase tracking-wide px-2" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                  {t('resume.sections.projects').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
              </div>
            </div>
            <div className="space-y-3">
              {projects.map((proj, index) => {
                if (!proj.name) return null;
                
                const dateRange = formatDateRangeStar(proj.startDate, proj.endDate);
                const technologies = proj.technologies 
                  ? proj.technologies
                      .map(t => typeof t === 'string' ? t : t.technology)
                      .filter(Boolean)
                      .join(', ')
                  : '';
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold uppercase tracking-wide text-foreground" style={{ fontSize: sizes.heading }}>
                        {proj.name}
                        {proj.link && (
                          <span className="font-normal normal-case ml-2" style={{ fontSize: sizes.xs }}>
                            <a 
                              href={proj.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:underline"
                            >
                              {proj.link.replace(/^https?:\/\//, '').split('/')[0]}
                            </a>
                          </span>
                        )}
                      </h3>
                      {dateRange && (
                        <span className="font-normal flex-shrink-0" style={{ fontSize: sizes.sm, color: headingColor }}>
                          {dateRange}
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-foreground mt-1 break-words" style={{ fontSize: sizes.base, color: textColor }}>{proj.description}</p>
                    )}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="text-foreground space-y-0.5 mt-1 list-none pl-0" style={{ fontSize: sizes.base }}>
                        {proj.highlights.map((highlight, i) => (
                          highlight.highlight && (
                            <li key={i} className="break-words">• {highlight.highlight}</li>
                          )
                        ))}
                      </ul>
                    )}
                    {technologies && (
                      <p className="text-muted-foreground mt-1 break-words" style={{ fontSize: sizes.xs }}>{technologies}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;

      case "certificates":
        return certificates && certificates.length > 0 && certificates.some(cert => cert.name) ? (
          <div key="certificates" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
                <h2 className="font-bold uppercase tracking-wide px-2" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                  {t('resume.sections.certifications').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
              </div>
            </div>
            <div className="space-y-1">
              {certificates.map((cert, index) => {
                if (!cert.name) return null;
                
                const dateRange = formatDateRangeStar(cert.issueDate, cert.expirationDate);
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-foreground break-words" style={{ fontSize: sizes.sm }}>{cert.name}, {cert.organization || ''}</span>
                        {cert.credentialId && (
                          <span className="text-muted-foreground ml-2" style={{ fontSize: sizes.xs }}>{t('resume.fields.credentialId')}: {cert.credentialId}</span>
                        )}
                        {cert.url && (
                          <a href={cert.url} target="_blank" rel="noopener noreferrer" className="hover:underline ml-2 block" style={{ fontSize: sizes.xs, color: linkColor }}>
                            {cert.url.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        )}
                      </div>
                      {dateRange && (
                        <span className="font-normal flex-shrink-0" style={{ fontSize: sizes.sm, color: headingColor }}>
                          {dateRange || cert.issueDate || ''}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;

      case "skills":
        return skills && skills.length > 0 && skills.some(s => s.skill) ? (
          <div key="skills" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
                <h2 className="font-bold uppercase tracking-wide px-2" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                  {t('resume.sections.skills').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
              </div>
            </div>
            <div className="text-foreground break-words" style={{ fontSize: sizes.sm }}>
              <span className="font-semibold">{t('resume.sections.skills')}: </span>
              {skills.filter(s => s.skill).map(s => s.skill).join(', ')}
            </div>
          </div>
        ) : null;

      case "languages":
        return languages && languages.length > 0 && languages.some(lang => lang.language) ? (
          <div key="languages" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
                <h2 className="font-bold uppercase tracking-wide px-2" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                  {t('resume.sections.languages').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
              </div>
            </div>
            <div className="text-foreground break-words" style={{ fontSize: sizes.sm }}>
              <span className="font-semibold">{t('resume.sections.languages')}: </span>
              {languages
                .filter(lang => lang.language)
                .map((lang, index, arr) => (
                  <span key={index}>
                    {lang.language}{lang.proficiency ? ` - ${lang.proficiency}` : ''}
                    {index < arr.length - 1 && ', '}
                  </span>
                ))}
            </div>
          </div>
        ) : null;

      case "interests":
        return personalInfo.interests && personalInfo.interests.length > 0 && personalInfo.interests.some(i => i.interest) ? (
          <div key="interests" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
                <h2 className="font-bold uppercase tracking-wide px-2" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                  {t('resume.sections.interests').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${headingColor}` }}></div>
              </div>
            </div>
            <div className="text-foreground break-words" style={{ fontSize: sizes.sm }}>
              <span className="font-semibold">{t('resume.sections.interests')}: </span>
              {personalInfo.interests.filter(i => i.interest).map(i => i.interest).join(', ')}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim().toUpperCase();

  return (
    <>
      <style>{`
        /* Apply padding for both screen (preview) and print */
        .resume-page-container {
          padding-top: 32px !important;
          padding-bottom: 32px !important;
        }
        @media print {
          /* Hide photo placeholders in print/PDF */
          .photo-placeholder {
            display: none !important;
          }
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
      <div className="resume-page-container bg-background text-foreground p-8 max-w-4xl mx-auto" style={{ fontFamily: `"${fontFamily}", monospace`, fontSize: sizes.base }}>
      {/* Header: Large name in navy with optional photo - full width layout */}
      <div className="-mx-8 -mt-8 px-8 pt-8 mb-6 border-b-2" style={{ borderColor: headingColor }}>
        <div className="flex items-center justify-between mb-4 gap-6">
          <div className="flex-1">
            <h1 className="font-black mb-2" style={{ fontSize: '2.25rem', fontWeight: titleBold ? '900' : 'bold', color: titleColor, letterSpacing: '0.02em' }}>
              {fullName || 'YOUR NAME'}
            </h1>
            {personalInfo.professionalTitle && personalInfo.professionalTitle.trim().length > 0 && (
              <p className="font-semibold mb-2" style={{ fontSize: '1.125rem', color: headingColor }}>
                {personalInfo.professionalTitle.trim().toUpperCase()}
              </p>
            )}
          </div>
          
          {/* Profile photo on the right */}
          {personalInfo.profileImage ? (
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-md border-2 overflow-hidden" style={{ borderColor: headingColor }}>
                <img 
                  src={personalInfo.profileImage} 
                  alt={`Professional profile photo of ${personalInfo.firstName} ${personalInfo.lastName}${personalInfo.professionalTitle ? `, ${personalInfo.professionalTitle}` : ''}${personalInfo.location ? ` from ${personalInfo.location}` : ''}`}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: '50% 40%' }}
                  loading="lazy"
                />
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0 w-28 h-28 rounded-md border-2 bg-muted flex items-center justify-center photo-placeholder" style={{ borderColor: headingColor }}>
              <span className="text-muted-foreground" style={{ fontSize: sizes.xs }}>Photo</span>
            </div>
          )}
        </div>
        
        {/* Contact info - full width horizontal layout */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2" style={{ fontSize: sizes.sm }}>
          <div className="flex flex-wrap items-center gap-4">
            {personalInfo.phone ? renderContactIcon(Phone, personalInfo.phone, `tel:${personalInfo.phone}`) : renderContactIcon(Phone, "+1 (555) 123-4567", "#")}
            {personalInfo.email ? renderContactIcon(Mail, personalInfo.email, `mailto:${personalInfo.email}`) : renderContactIcon(Mail, "your.email@example.com", "#")}
            {personalInfo.location ? renderContactIcon(MapPin, personalInfo.location) : renderContactIcon(MapPin, "City, Country")}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {personalInfo.linkedin ? renderContactIcon(Linkedin, personalInfo.linkedin, personalInfo.linkedin) : renderContactIcon(Linkedin, "linkedin.com/in/username", "#")}
            {personalInfo.github ? renderContactIcon(Github, personalInfo.github, personalInfo.github) : renderContactIcon(Github, "github.com/username", "#")}
            {personalInfo.website ? renderContactIcon(Globe, personalInfo.website, personalInfo.website) : renderContactIcon(Globe, "yourwebsite.com", "#")}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-1">
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
              font-size: 10px;
              color: #6b7280;
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

