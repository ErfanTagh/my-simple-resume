import { CVFormData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LatexTemplateProps {
  data: CVFormData;
}

export const LatexTemplate = ({ data }: LatexTemplateProps) => {
  const { t } = useLanguage();
  const { personalInfo, workExperience, education, projects, certificates, languages, skills, sectionOrder } = data;
  
  const defaultOrder = ["summary", "skills", "projects", "education", "workExperience", "certificates", "languages", "interests"];
  const orderedSections = sectionOrder || defaultOrder;

  // Helper to format date range for LaTeX style (MM/YYYY format)
  const formatDateRangeLatex = (startDate: string | undefined, endDate: string | undefined): string => {
    if (!startDate && !endDate) return '';
    
    const formatDate = (dateStr: string | undefined): string => {
      if (!dateStr) return '';
      const match = dateStr.match(/^(\d{4})-(\d{2})$/);
      if (!match) return dateStr;
      const [, year, month] = match;
      return `${month}/${year}`;
    };
    
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : t('resume.fields.present');
    
    if (!start && !end) return '';
    if (!start) return end;
    
    return `${start} -- ${end}`;
  };

  // Render icon with text - more compact version
  const renderIconText = (Icon: any, text: string | undefined, url?: string) => {
    if (!text) return null;
    
    const content = (
      <div className="flex items-center gap-1 mb-0.5">
        <Icon className="h-3 w-3 text-foreground flex-shrink-0" />
        <span className="text-xs text-foreground truncate" style={{ lineHeight: '1.3' }}>
          {text}
        </span>
      </div>
    );
    
    if (url && (url.startsWith('http') || url.startsWith('mailto'))) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 block">
          {content}
        </a>
      );
    }
    
    return content;
  };

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
      case "skills":
        return null;

      case "projects":
        return projects && projects.length > 0 && projects.some(proj => proj.name) ? (
          <div key="projects" className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.projects').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <div className="space-y-1.5">
              {projects.map((proj, index) => {
                if (!proj.name) return null;
                
                const dateRange = formatDateRangeLatex(proj.startDate, proj.endDate);
                const technologies = proj.technologies 
                  ? proj.technologies
                      .map(t => typeof t === 'string' ? t : t.technology)
                      .filter(Boolean)
                      .join(', ')
                  : '';
                
                return (
                  <div key={index} className="flex gap-2 text-sm">
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground text-xs">
                      {dateRange}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground text-sm">{proj.name}</h3>
                        {proj.link && (
                          <a 
                            href={proj.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:underline flex-shrink-0 text-xs truncate max-w-[120px]"
                          >
                            {proj.link.replace(/^https?:\/\//, '').substring(0, 25)}
                          </a>
                        )}
                      </div>
                      {proj.description && (
                        <p className="text-foreground mb-0.5 leading-snug break-words text-sm">
                          {proj.description}
                        </p>
                      )}
                      {proj.highlights && proj.highlights.length > 0 && (
                        <ul className="text-foreground space-y-0.5 mt-0.5 mb-0.5 list-none pl-0">
                          {proj.highlights.map((highlight, i) => (
                            highlight.highlight && (
                              <li key={i} className="flex gap-1">
                                <span className="text-foreground flex-shrink-0 text-sm">•</span>
                                <span className="flex-1 break-words text-sm leading-snug">{highlight.highlight}</span>
                              </li>
                            )
                          ))}
                        </ul>
                      )}
                      {technologies && (
                        <p className="text-muted-foreground text-xs font-mono">
                          {technologies}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;

      case "education":
        return education && education.length > 0 && education.some(edu => edu.degree || edu.institution) ? (
          <div key="education" className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.education').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <div className="space-y-1.5">
              {education.map((edu, index) => {
                if (!edu.degree && !edu.institution) return null;
                
                const dateRange = formatDateRangeLatex(edu.startDate, edu.endDate);
                
                return (
                  <div key={index} className="flex gap-2 text-sm">
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground text-xs">
                      {dateRange}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground text-sm">{edu.degree || ''}</h3>
                        <div className="text-right">
                          <span className="text-sm font-bold text-foreground flex-shrink-0">
                            {edu.institution || ''}
                          </span>
                          {edu.location && (
                            <span className="text-xs text-muted-foreground block">{edu.location}</span>
                          )}
                        </div>
                      </div>
                      {edu.field && (
                        <p className="text-foreground leading-snug break-words text-sm">{edu.field}</p>
                      )}
                      {edu.keyCourses && edu.keyCourses.length > 0 && (
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {t('resume.labels.keyCourses')}: {edu.keyCourses.map(c => typeof c === 'string' ? c : c.course).filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;

      case "workExperience":
        return workExperience && workExperience.length > 0 && workExperience.some(exp => exp.position || exp.company) ? (
          <div key="workExperience" className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.experience').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <div className="space-y-2">
              {workExperience.map((exp, index) => {
                if (!exp.position && !exp.company) return null;
                
                const dateRange = formatDateRangeLatex(exp.startDate, exp.endDate);
                const responsibilities = exp.responsibilities 
                  ? exp.responsibilities.filter(r => r.responsibility).map(r => r.responsibility!)
                  : exp.description 
                  ? exp.description.split('\n').filter(line => line.trim())
                  : [];
                
                const technologies = exp.technologies 
                  ? exp.technologies
                      .map(t => typeof t === 'string' ? t : t.technology)
                      .filter(Boolean)
                  : [];
                
                return (
                  <div key={index} className="flex gap-2 text-sm">
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground text-xs">
                      {dateRange}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground text-sm">{exp.position || ''}</h3>
                        <div className="text-right">
                          <span className="text-sm font-bold text-foreground flex-shrink-0">
                            {exp.company || ''}
                          </span>
                          {exp.location && (
                            <span className="text-xs text-muted-foreground block">{exp.location}</span>
                          )}
                        </div>
                      </div>
                      {responsibilities.length > 0 && (
                        <ul className="text-foreground space-y-0.5 mt-0.5 mb-0.5 list-none pl-0">
                          {responsibilities.map((resp, i) => (
                            <li key={i} className="flex gap-1">
                              <span className="text-foreground flex-shrink-0 text-sm">•</span>
                              <span className="flex-1 break-words text-sm leading-snug">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {technologies.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                          {technologies.map((tech, i) => (
                            <span key={i} className="text-xs font-mono text-muted-foreground bg-muted/50 px-1 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {exp.competencies && exp.competencies.length > 0 && (
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {t('resume.labels.keyCompetencies')}: {exp.competencies.map(c => typeof c === 'string' ? c : c.competency).filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;

      case "certificates":
        return certificates && certificates.length > 0 && certificates.some(cert => cert.name) ? (
          <div key="certificates" className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.certifications').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <div className="space-y-1.5">
              {certificates.map((cert, index) => {
                if (!cert.name) return null;
                
                const dateRange = formatDateRangeLatex(cert.issueDate, cert.expirationDate);
                
                return (
                  <div key={index} className="flex gap-2 text-sm">
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground text-xs">
                      {dateRange || cert.issueDate || ''}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground text-sm">{cert.name}</h3>
                        <span className="text-sm font-bold text-foreground flex-shrink-0">
                          {cert.organization || ''}
                        </span>
                      </div>
                      {cert.credentialId && (
                        <p className="text-muted-foreground text-xs">{t('resume.fields.credentialId')}: {cert.credentialId}</p>
                      )}
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:underline text-xs block truncate max-w-[200px]">
                          {cert.url.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;

      case "languages":
        return languages && languages.length > 0 && languages.some(lang => lang.language) ? (
          <div key="languages" className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.languages').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <div className="pl-[15%] text-sm">
              {languages
                .filter(lang => lang.language)
                .map((lang, index, arr) => (
                  <span key={index} className="text-foreground">
                    <span className="font-bold">{lang.language}</span>
                    {lang.proficiency && ` - ${lang.proficiency}`}
                    {index < arr.length - 1 && ', '}
                  </span>
                ))}
            </div>
          </div>
        ) : null;

      case "interests":
        return personalInfo.interests && personalInfo.interests.length > 0 && personalInfo.interests.some(i => i.interest) ? (
          <div key="interests" className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.interests').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <p className="text-sm text-foreground pl-[15%]">
              {personalInfo.interests.filter(i => i.interest).map(i => i.interest).join(', ')}
            </p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim();
  const professionalTitle = (personalInfo.professionalTitle && personalInfo.professionalTitle.trim().length > 0) ? personalInfo.professionalTitle.trim() : '';

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
      <div className="resume-page-container bg-background text-foreground p-8 max-w-4xl mx-auto text-base" style={{ fontFamily: 'sans-serif', fontSize: '16px' }}>
      {/* Header: More spacious layout with full-width content */}
      <div className="-mx-8 -mt-8 px-8 pt-8 mb-6 border-b-2 border-foreground/30">
        <div className="flex items-start mb-6 gap-6">
          <div className="flex items-start gap-4 flex-shrink-0">
            {/* Profile image - using Tailwind classes like other templates */}
            {personalInfo.profileImage ? (
              <div className="flex-shrink-0">
                <div className="w-28 h-28 overflow-hidden rounded-sm border-2 border-foreground/40">
                  <img 
                    src={personalInfo.profileImage} 
                    alt={`Professional profile photo of ${fullName}${personalInfo.professionalTitle ? `, ${personalInfo.professionalTitle}` : ''}${personalInfo.location ? ` from ${personalInfo.location}` : ''}`}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: '50% 40%' }}
                    loading="lazy"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-shrink-0 w-28 h-28 bg-muted border-2 border-foreground/40 rounded-sm flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Photo</span>
              </div>
            )}
            
            <div className="flex-shrink-0 pt-2 flex flex-col gap-2">
            {fullName ? (
              <h1 className="text-3xl font-bold text-foreground uppercase mb-0 leading-tight">
                {fullName}
              </h1>
            ) : (
              <h1 className="text-3xl font-bold text-foreground uppercase mb-0 leading-tight">
                YOUR NAME HERE
              </h1>
            )}
            {professionalTitle ? (
              <p className="text-lg text-foreground mt-0 leading-tight font-medium">{professionalTitle}</p>
            ) : (
              <p className="text-lg text-foreground mt-0 leading-tight font-medium">Your Professional Title</p>
            )}
            </div>
          </div>
          
          {/* Contact info - more spacious, stacked layout using full width */}
          <div className="flex gap-6 flex-1 ml-auto justify-end pt-2">
            <div className="flex-shrink-0 min-w-[160px]">
              {personalInfo.website ? renderIconText(Globe, personalInfo.website, personalInfo.website) : renderIconText(Globe, "yourwebsite.com", "#")}
              {personalInfo.phone ? renderIconText(Phone, personalInfo.phone) : renderIconText(Phone, "+1 (555) 123-4567")}
              {personalInfo.location ? renderIconText(MapPin, personalInfo.location) : renderIconText(MapPin, "City, Country")}
            </div>
            
            <div className="flex-shrink-0 min-w-[200px]">
              {personalInfo.email ? renderIconText(Mail, personalInfo.email, `mailto:${personalInfo.email}`) : renderIconText(Mail, "your.email@example.com", "#")}
              {personalInfo.github ? renderIconText(Github, personalInfo.github, personalInfo.github) : renderIconText(Github, "github.com/username", "#")}
              {personalInfo.linkedin ? renderIconText(Linkedin, personalInfo.linkedin, personalInfo.linkedin) : renderIconText(Linkedin, "linkedin.com/in/username", "#")}
            </div>
          </div>
        </div>
      </div>

      {/* Summary and Skills - better responsive layout */}
      {(personalInfo.summary || (skills && skills.length > 0 && skills.some(s => s.skill))) && (
        <div className="mb-4">
          {/* Summary - full width if both exist, otherwise keep as is */}
          {personalInfo.summary && personalInfo.summary.trim() && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1.5">
                <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                  {t('resume.sections.summary').toUpperCase()}
                </h2>
                <div className="flex-1 border-t border-foreground"></div>
              </div>
              <p className="text-sm text-foreground leading-relaxed break-words whitespace-pre-wrap" style={{ lineHeight: '1.5' }}>
                {personalInfo.summary.trim()}
              </p>
            </div>
          )}
          
          {/* Skills - full width */}
          {skills && skills.length > 0 && skills.some(s => s.skill) && (
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1.5">
                <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                  {t('resume.sections.skills').toUpperCase()}
                </h2>
                <div className="flex-1 border-t border-foreground"></div>
              </div>
              <div className="text-[10px]">
                <div className="flex gap-2">
                  <span className="font-bold text-foreground flex-shrink-0" style={{ minWidth: '50px' }}>{t('resume.sections.skills')}:</span>
                  <span className="text-foreground flex-1 break-words" style={{ lineHeight: '1.5' }}>
                    {skills.filter(s => s.skill).map(s => s.skill).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Other sections */}
      <div className="space-y-0">
        {orderedSections
          .filter(section => section !== 'summary' && section !== 'skills')
          .map(section => renderSection(section))}
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