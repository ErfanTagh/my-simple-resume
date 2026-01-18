import { CVFormData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LatexTemplateProps {
  data: CVFormData;
}

export const LatexTemplate = ({ data }: LatexTemplateProps) => {
  const { t } = useLanguage();
  const { personalInfo, workExperience, education, projects, certificates, languages, skills, sectionOrder, styling } = data;

  const defaultOrder = ["summary", "skills", "projects", "education", "workExperience", "certificates", "languages", "interests"];
  const orderedSections = sectionOrder || defaultOrder;

  // Extract styling options with defaults
  const fontFamily = styling?.fontFamily || "sans-serif";
  const fontSizeInput = styling?.fontSize || "medium";
  // Ensure fontSize is valid to prevent crashes
  const fontSize: "small" | "medium" | "large" =
    (fontSizeInput === "small" || fontSizeInput === "medium" || fontSizeInput === "large")
      ? fontSizeInput
      : "medium";
  const titleColor = styling?.titleColor || "#1f2937";
  const titleBold = styling?.titleBold ?? true;
  const headingColor = styling?.headingColor || "#1f2937";
  const headingBold = styling?.headingBold ?? true;
  const textColor = styling?.textColor || "#1f2937";
  const linkColor = styling?.linkColor || "#2563eb";

  // Extract section-specific styling for personalInfo
  const personalInfoSectionStyling = styling?.sectionStyling?.personalInfo;
  const personalInfoTitleColor = personalInfoSectionStyling?.titleColor || titleColor;
  const personalInfoTitleSize = personalInfoSectionStyling?.titleSize || fontSize;
  const personalInfoBodyColor = personalInfoSectionStyling?.bodyColor || textColor;
  const personalInfoBodySize = personalInfoSectionStyling?.bodySize || fontSize;

  // Font size mappings - all relative to ensure consistency
  const fontSizeMap = {
    small: {
      base: '14px',        // Main text
      name: '22px',        // Name in header
      title: '15px',       // Professional title
      heading: '11px',     // Section headings
      body: '14px',        // Body text in sections
      small: '12px',       // Small text (dates, links)
      xs: '10px',          // Extra small (technologies, courses)
    },
    medium: {
      base: '16px',        // Main text
      name: '24px',        // Name in header  
      title: '16px',       // Professional title
      heading: '11px',     // Section headings (consistent)
      body: '14px',        // Body text in sections
      small: '12px',       // Small text (dates, links)
      xs: '10px',          // Extra small (technologies, courses)
    },
    large: {
      base: '18px',        // Main text
      name: '26px',        // Name in header
      title: '18px',       // Professional title
      heading: '11px',     // Section headings (consistent)
      body: '16px',        // Body text in sections
      small: '13px',       // Small text (dates, links)
      xs: '11px',          // Extra small (technologies, courses)
    },
  };

  const sizes = fontSizeMap[fontSize];

  // Size mappings for personalInfo section-specific sizes
  const personalInfoTitleSizes = fontSizeMap[personalInfoTitleSize];
  const personalInfoBodySizes = fontSizeMap[personalInfoBodySize];

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

    // Format text for display - shorten long URLs
    let displayText = text;
    if (url) {
      // For LinkedIn, show just the path or shortened version
      if (text.includes('linkedin.com')) {
        const match = text.match(/linkedin\.com\/in\/(.+)/i);
        if (match) {
          displayText = `linkedin.com/in/${match[1]}`;
        } else {
          displayText = text.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
        }
      } else if (text.includes('github.com')) {
        displayText = text.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
      } else if (text.startsWith('http')) {
        displayText = text.replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
      }
    }

    const content = (
      <div className="flex items-center gap-1 mb-0.5 min-w-0">
        <Icon className="h-3 w-3 flex-shrink-0" style={{ color: personalInfoBodyColor }} />
        <span className="truncate min-w-0" style={{ fontSize: personalInfoBodySizes.small, color: personalInfoBodyColor, lineHeight: '1.3' }}>
          {displayText}
        </span>
      </div>
    );

    if (url && (url.startsWith('http') || url.startsWith('mailto'))) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 block min-w-0">
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
              <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                {t('resume.sections.projects').toUpperCase()}
              </h2>
              <div className="flex-1 border-t" style={{ borderColor: headingColor }}></div>
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
                  <div key={index} className="flex gap-2" style={{ fontSize: sizes.body }}>
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground" style={{ fontSize: sizes.small }}>
                      {dateRange}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground" style={{ fontSize: sizes.body }}>{proj.name}</h3>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:underline flex-shrink-0 truncate max-w-[120px]"
                            style={{ fontSize: sizes.small }}
                          >
                            {proj.link.replace(/^https?:\/\//, '').substring(0, 25)}
                          </a>
                        )}
                      </div>
                      {proj.description && (
                        <p className="text-foreground mb-0.5 leading-snug break-words" style={{ fontSize: sizes.body }}>
                          {proj.description}
                        </p>
                      )}
                      {proj.highlights && proj.highlights.length > 0 && (
                        <ul className="text-foreground space-y-0.5 mt-0.5 mb-0.5 list-none pl-0">
                          {proj.highlights.map((highlight, i) => (
                            highlight.highlight && (
                              <li key={i} className="flex gap-1">
                                <span className="text-foreground flex-shrink-0" style={{ fontSize: sizes.body }}>•</span>
                                <span className="flex-1 break-words leading-snug" style={{ fontSize: sizes.body }}>{highlight.highlight}</span>
                              </li>
                            )
                          ))}
                        </ul>
                      )}
                      {technologies && (
                        <p className="text-muted-foreground font-mono" style={{ fontSize: sizes.xs }}>
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
              <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                {t('resume.sections.education').toUpperCase()}
              </h2>
              <div className="flex-1 border-t" style={{ borderColor: headingColor }}></div>
            </div>
            <div className="space-y-1.5">
              {education.map((edu, index) => {
                if (!edu.degree && !edu.institution) return null;

                const dateRange = formatDateRangeLatex(edu.startDate, edu.endDate);

                return (
                  <div key={index} className="flex gap-2" style={{ fontSize: sizes.body }}>
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground" style={{ fontSize: sizes.small }}>
                      {dateRange}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground" style={{ fontSize: sizes.body }}>{edu.degree || ''}</h3>
                        <div className="text-right">
                          <span className="font-bold text-foreground flex-shrink-0" style={{ fontSize: sizes.body }}>
                            {edu.institution || ''}
                          </span>
                          {edu.location && (
                            <span className="text-muted-foreground block" style={{ fontSize: sizes.small }}>{edu.location}</span>
                          )}
                        </div>
                      </div>
                      {edu.field && (
                        <p className="text-foreground leading-snug break-words" style={{ fontSize: sizes.body }}>{edu.field}</p>
                      )}
                      {edu.keyCourses && edu.keyCourses.length > 0 && (
                        <p className="text-muted-foreground mt-0.5" style={{ fontSize: sizes.xs }}>
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
              <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                {t('resume.sections.experience').toUpperCase()}
              </h2>
              <div className="flex-1 border-t" style={{ borderColor: headingColor }}></div>
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
                  <div key={index} className="flex gap-2" style={{ fontSize: sizes.body }}>
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground" style={{ fontSize: sizes.small }}>
                      {dateRange}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground" style={{ fontSize: sizes.body }}>{exp.position || ''}</h3>
                        <div className="text-right">
                          <span className="font-bold text-foreground flex-shrink-0" style={{ fontSize: sizes.body }}>
                            {exp.company || ''}
                          </span>
                          {exp.location && (
                            <span className="text-muted-foreground block" style={{ fontSize: sizes.small }}>{exp.location}</span>
                          )}
                        </div>
                      </div>
                      {responsibilities.length > 0 && (
                        <ul className="text-foreground space-y-0.5 mt-0.5 mb-0.5 list-none pl-0">
                          {responsibilities.map((resp, i) => (
                            <li key={i} className="flex gap-1">
                              <span className="text-foreground flex-shrink-0" style={{ fontSize: sizes.body }}>•</span>
                              <span className="flex-1 break-words leading-snug" style={{ fontSize: sizes.body }}>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {technologies.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                          {technologies.map((tech, i) => (
                            <span key={i} className="font-mono text-muted-foreground bg-muted/50 px-1 py-0.5 rounded" style={{ fontSize: sizes.xs }}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                      {exp.competencies && exp.competencies.length > 0 && (
                        <p className="text-muted-foreground mt-0.5" style={{ fontSize: sizes.xs }}>
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
              <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                {t('resume.sections.certifications').toUpperCase()}
              </h2>
              <div className="flex-1 border-t" style={{ borderColor: headingColor }}></div>
            </div>
            <div className="space-y-1.5">
              {certificates.map((cert, index) => {
                if (!cert.name) return null;

                const dateRange = formatDateRangeLatex(cert.issueDate, cert.expirationDate);

                return (
                  <div key={index} className="flex gap-2" style={{ fontSize: sizes.body }}>
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground" style={{ fontSize: sizes.small }}>
                      {dateRange || cert.issueDate || ''}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground" style={{ fontSize: sizes.body }}>{cert.name}</h3>
                        <span className="font-bold text-foreground flex-shrink-0" style={{ fontSize: sizes.body }}>
                          {cert.organization || ''}
                        </span>
                      </div>
                      {cert.credentialId && (
                        <p className="text-muted-foreground" style={{ fontSize: sizes.xs }}>{t('resume.fields.credentialId')}: {cert.credentialId}</p>
                      )}
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:underline block truncate max-w-[200px]" style={{ fontSize: sizes.xs }}>
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
              <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                {t('resume.sections.languages').toUpperCase()}
              </h2>
              <div className="flex-1 border-t" style={{ borderColor: headingColor }}></div>
            </div>
            <div className="pl-[15%]" style={{ fontSize: sizes.body }}>
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
              <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                {t('resume.sections.interests').toUpperCase()}
              </h2>
              <div className="flex-1 border-t" style={{ borderColor: headingColor }}></div>
            </div>
            <p className="text-foreground pl-[15%]" style={{ fontSize: sizes.body }}>
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
      <div className="resume-page-container bg-background text-foreground p-8 max-w-4xl mx-auto" style={{ fontFamily: fontFamily, fontSize: sizes.base }}>
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
                <div className="flex-shrink-0 w-28 h-28 bg-muted border-2 border-foreground/40 rounded-sm flex items-center justify-center photo-placeholder">
                  <span className="text-xs text-muted-foreground">Photo</span>
                </div>
              )}

              <div className="flex-shrink-0 pt-2 flex flex-col gap-2">
                {fullName ? (
                  <h1 className="uppercase mb-0 leading-tight" style={{ fontSize: personalInfoTitleSizes.name, fontWeight: titleBold ? 'bold' : 'normal', color: personalInfoTitleColor }}>
                    {fullName}
                  </h1>
                ) : (
                  <h1 className="uppercase mb-0 leading-tight" style={{ fontSize: personalInfoTitleSizes.name, fontWeight: titleBold ? 'bold' : 'normal', color: personalInfoTitleColor }}>
                    YOUR NAME HERE
                  </h1>
                )}
                {professionalTitle ? (
                  <p className="mt-0 leading-tight font-medium" style={{ fontSize: personalInfoBodySizes.title, color: personalInfoBodyColor }}>{professionalTitle}</p>
                ) : (
                  <p className="mt-0 leading-tight font-medium" style={{ fontSize: personalInfoBodySizes.title, color: personalInfoBodyColor }}>Your Professional Title</p>
                )}
              </div>
            </div>

            {/* Contact info - more spacious, stacked layout using full width */}
            <div className="flex flex-1 ml-auto justify-end pt-2">
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
                  <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                    {t('resume.sections.summary').toUpperCase()}
                  </h2>
                  <div className="flex-1 border-t" style={{ borderColor: headingColor }}></div>
                </div>
                <p className="leading-relaxed break-words whitespace-pre-wrap" style={{ fontSize: sizes.base, color: textColor, lineHeight: '1.5' }}>
                  {personalInfo.summary.trim()}
                </p>
              </div>
            )}

            {/* Skills - full width */}
            {skills && skills.length > 0 && skills.some(s => s.skill) && (
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: sizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: headingColor }}>
                    {t('resume.sections.skills').toUpperCase()}
                  </h2>
                  <div className="flex-1 border-t" style={{ borderColor: headingColor }}></div>
                </div>
                <div>
                  <div className="flex gap-2">
                    <span className="font-bold flex-shrink-0" style={{ fontSize: '10px', color: textColor, minWidth: '50px' }}>{t('resume.sections.skills')}:</span>
                    <span className="flex-1 break-words" style={{ fontSize: '10px', color: textColor, lineHeight: '1.5' }}>
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