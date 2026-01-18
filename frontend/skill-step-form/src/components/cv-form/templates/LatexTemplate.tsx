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

  // Helper function to get section-specific styling
  const getSectionStyling = (sectionName: string) => {
    const sectionStyling = styling?.sectionStyling?.[sectionName];
    return {
      titleColor: sectionStyling?.titleColor || headingColor,
      titleSize: sectionStyling?.titleSize || fontSize,
      bodyColor: sectionStyling?.bodyColor || textColor,
      bodySize: sectionStyling?.bodySize || fontSize,
    };
  };

  // Extract section-specific styling for all sections
  const workExperienceStyling = getSectionStyling('workExperience');
  const projectsStyling = getSectionStyling('projects');
  const educationStyling = getSectionStyling('education');
  const certificatesStyling = getSectionStyling('certificates');
  const skillsStyling = getSectionStyling('skills');
  const languagesStyling = getSectionStyling('languages');

  // Size mappings for personalInfo section-specific sizes
  const personalInfoTitleSizes = fontSizeMap[personalInfoTitleSize];
  const personalInfoBodySizes = fontSizeMap[personalInfoBodySize];

  // Create size mappings for each section
  const workExperienceTitleSizes = fontSizeMap[workExperienceStyling.titleSize];
  const workExperienceBodySizes = fontSizeMap[workExperienceStyling.bodySize];
  const projectsTitleSizes = fontSizeMap[projectsStyling.titleSize];
  const projectsBodySizes = fontSizeMap[projectsStyling.bodySize];
  const educationTitleSizes = fontSizeMap[educationStyling.titleSize];
  const educationBodySizes = fontSizeMap[educationStyling.bodySize];
  const certificatesTitleSizes = fontSizeMap[certificatesStyling.titleSize];
  const certificatesBodySizes = fontSizeMap[certificatesStyling.bodySize];
  const skillsTitleSizes = fontSizeMap[skillsStyling.titleSize];
  const skillsBodySizes = fontSizeMap[skillsStyling.bodySize];
  const languagesTitleSizes = fontSizeMap[languagesStyling.titleSize];
  const languagesBodySizes = fontSizeMap[languagesStyling.bodySize];

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
        <span className="break-words min-w-0 flex-1" style={{ fontSize: personalInfoBodySizes.small, color: personalInfoBodyColor, lineHeight: '1.3', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
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
              <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: projectsTitleSizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: projectsStyling.titleColor }}>
                {t('resume.sections.projects').toUpperCase()}
              </h2>
              <div className="flex-1 border-t" style={{ borderColor: projectsStyling.titleColor }}></div>
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
                  <div key={index} className="flex gap-2" style={{ fontSize: projectsBodySizes.body }}>
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground" style={{ fontSize: projectsBodySizes.small }}>
                      {dateRange}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold" style={{ fontSize: projectsBodySizes.body, color: projectsStyling.bodyColor }}>{proj.name}</h3>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:underline flex-shrink-0 truncate max-w-[120px]"
                            style={{ fontSize: projectsBodySizes.small }}
                          >
                            {proj.link.replace(/^https?:\/\//, '').substring(0, 25)}
                          </a>
                        )}
                      </div>
                      {proj.description && (
                        <p className="mb-0.5 leading-snug break-words" style={{ fontSize: projectsBodySizes.body, color: projectsStyling.bodyColor }}>
                          {proj.description}
                        </p>
                      )}
                      {proj.highlights && proj.highlights.length > 0 && (
                        <ul className="space-y-0.5 mt-0.5 mb-0.5 list-none pl-0">
                          {proj.highlights.map((highlight, i) => (
                            highlight.highlight && (
                              <li key={i} className="flex gap-1">
                                <span className="flex-shrink-0" style={{ fontSize: projectsBodySizes.body, color: projectsStyling.bodyColor }}>•</span>
                                <span className="flex-1 break-words leading-snug" style={{ fontSize: projectsBodySizes.body, color: projectsStyling.bodyColor }}>{highlight.highlight}</span>
                              </li>
                            )
                          ))}
                        </ul>
                      )}
                      {technologies && (
                        <p className="text-muted-foreground font-mono" style={{ fontSize: projectsBodySizes.xs }}>
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
              <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: educationTitleSizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: educationStyling.titleColor }}>
                {t('resume.sections.education').toUpperCase()}
              </h2>
              <div className="flex-1 border-t" style={{ borderColor: educationStyling.titleColor }}></div>
            </div>
            <div className="space-y-1.5">
              {education.map((edu, index) => {
                if (!edu.degree && !edu.institution) return null;

                const dateRange = formatDateRangeLatex(edu.startDate, edu.endDate);

                return (
                  <div key={index} className="flex gap-2" style={{ fontSize: educationBodySizes.body }}>
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground" style={{ fontSize: educationBodySizes.small }}>
                      {dateRange}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold" style={{ fontSize: educationBodySizes.body, color: educationStyling.bodyColor }}>{edu.degree || ''}</h3>
                        <div className="text-right">
                          <span className="font-bold flex-shrink-0" style={{ fontSize: educationBodySizes.body, color: educationStyling.bodyColor }}>
                            {edu.institution || ''}
                          </span>
                          {edu.location && (
                            <span className="text-muted-foreground block" style={{ fontSize: educationBodySizes.small }}>{edu.location}</span>
                          )}
                        </div>
                      </div>
                      {edu.field && (
                        <p className="leading-snug break-words" style={{ fontSize: educationBodySizes.body, color: educationStyling.bodyColor }}>{edu.field}</p>
                      )}
                      {edu.keyCourses && edu.keyCourses.length > 0 && (
                        <p className="text-muted-foreground mt-0.5" style={{ fontSize: educationBodySizes.xs }}>
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
              <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: workExperienceTitleSizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: workExperienceStyling.titleColor }}>
                {t('resume.sections.experience').toUpperCase()}
              </h2>
              <div className="flex-1 border-t" style={{ borderColor: workExperienceStyling.titleColor }}></div>
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
                  <div key={index} className="flex gap-2" style={{ fontSize: workExperienceBodySizes.body }}>
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground" style={{ fontSize: workExperienceBodySizes.small }}>
                      {dateRange}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold" style={{ fontSize: workExperienceBodySizes.body, color: workExperienceStyling.bodyColor }}>{exp.position || ''}</h3>
                        <div className="text-right">
                          <span className="font-bold flex-shrink-0" style={{ fontSize: workExperienceBodySizes.body, color: workExperienceStyling.bodyColor }}>
                            {exp.company || ''}
                          </span>
                          {exp.location && (
                            <span className="text-muted-foreground block" style={{ fontSize: workExperienceBodySizes.small }}>{exp.location}</span>
                          )}
                        </div>
                      </div>
                      {responsibilities.length > 0 && (
                        <ul className="space-y-0.5 mt-0.5 mb-0.5 list-none pl-0">
                          {responsibilities.map((resp, i) => (
                            <li key={i} className="flex gap-1">
                              <span className="flex-shrink-0" style={{ fontSize: workExperienceBodySizes.body, color: workExperienceStyling.bodyColor }}>•</span>
                              <span className="flex-1 break-words leading-snug" style={{ fontSize: workExperienceBodySizes.body, color: workExperienceStyling.bodyColor }}>{resp}</span>
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
              <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: certificatesTitleSizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: certificatesStyling.titleColor }}>
                {t('resume.sections.certifications').toUpperCase()}
              </h2>
              <div className="flex-1 border-t" style={{ borderColor: certificatesStyling.titleColor }}></div>
            </div>
            <div className="space-y-1.5">
              {certificates.map((cert, index) => {
                if (!cert.name) return null;

                const dateRange = formatDateRangeLatex(cert.issueDate, cert.expirationDate);

                return (
                  <div key={index} className="flex gap-2" style={{ fontSize: certificatesBodySizes.body }}>
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground" style={{ fontSize: certificatesBodySizes.small }}>
                      {dateRange || cert.issueDate || ''}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold" style={{ fontSize: certificatesBodySizes.body, color: certificatesStyling.bodyColor }}>{cert.name}</h3>
                        <span className="font-bold flex-shrink-0" style={{ fontSize: certificatesBodySizes.body, color: certificatesStyling.bodyColor }}>
                          {cert.organization || ''}
                        </span>
                      </div>
                      {cert.credentialId && (
                        <p className="text-muted-foreground" style={{ fontSize: certificatesBodySizes.xs }}>{t('resume.fields.credentialId')}: {cert.credentialId}</p>
                      )}
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:underline block truncate max-w-[200px]" style={{ fontSize: certificatesBodySizes.xs }}>
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
              <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: languagesTitleSizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: languagesStyling.titleColor }}>
                {t('resume.sections.languages').toUpperCase()}
              </h2>
              <div className="flex-1 border-t" style={{ borderColor: languagesStyling.titleColor }}></div>
            </div>
            <div className="pl-[15%]" style={{ fontSize: languagesBodySizes.body, color: languagesStyling.bodyColor }}>
              {languages
                .filter(lang => lang.language)
                .map((lang, index, arr) => (
                  <span key={index}>
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
              <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: personalInfoTitleSizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: personalInfoTitleColor }}>
                {t('resume.sections.interests').toUpperCase()}
              </h2>
              <div className="flex-1 border-t" style={{ borderColor: personalInfoTitleColor }}></div>
            </div>
            <p className="pl-[15%]" style={{ fontSize: personalInfoBodySizes.body, color: personalInfoBodyColor }}>
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
      <div className="resume-page-container bg-background text-foreground p-8 max-w-4xl mx-auto" style={{ fontFamily: fontFamily, fontSize: sizes.base, overflow: 'visible' }}>
        {/* Header: Side-by-side layout with flexible contact info container */}
        <div className="-mx-8 px-8 pt-8 mb-6 border-b-2 border-foreground/30" style={{ overflow: 'visible' }}>
          <div className="flex items-start mb-6 gap-6" style={{ minWidth: 0, overflow: 'visible' }}>
            {/* Name and professional title container - fixed size with max-width */}
            <div className="flex items-start gap-4 flex-shrink-0" style={{ maxWidth: '50%', minWidth: 0 }}>
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

              <div className="pt-0 flex flex-col gap-2 flex-shrink-0 min-w-0 flex-1">
                {fullName ? (
                  <h1 className="uppercase mb-0 leading-tight break-words" style={{ fontSize: personalInfoTitleSizes.name, fontWeight: titleBold ? 'bold' : 'normal', color: personalInfoTitleColor }}>
                    {fullName}
                  </h1>
                ) : (
                  <h1 className="uppercase mb-0 leading-tight break-words" style={{ fontSize: personalInfoTitleSizes.name, fontWeight: titleBold ? 'bold' : 'normal', color: personalInfoTitleColor }}>
                    YOUR NAME HERE
                  </h1>
                )}
                {professionalTitle ? (
                  <p className="mt-0 leading-tight font-medium break-words" style={{ fontSize: personalInfoBodySizes.title, color: personalInfoBodyColor }}>{professionalTitle}</p>
                ) : (
                  <p className="mt-0 leading-tight font-medium break-words" style={{ fontSize: personalInfoBodySizes.title, color: personalInfoBodyColor }}>Your Professional Title</p>
                )}
              </div>
            </div>

            {/* Contact info - can shrink when needed */}
            <div className="flex gap-2 flex-1 min-w-0 pt-2 justify-end" style={{ minWidth: '280px', maxWidth: '50%', overflow: 'visible' }}>
              <div className="flex-shrink-0 min-w-0" style={{ maxWidth: '160px' }}>
                {personalInfo.website ? renderIconText(Globe, personalInfo.website, personalInfo.website) : renderIconText(Globe, "yourwebsite.com", "#")}
                {personalInfo.phone ? renderIconText(Phone, personalInfo.phone) : renderIconText(Phone, "+1 (555) 123-4567")}
                {personalInfo.location ? renderIconText(MapPin, personalInfo.location) : renderIconText(MapPin, "City, Country")}
              </div>

              <div className="flex-shrink-0 min-w-0" style={{ maxWidth: '180px' }}>
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
                  <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: personalInfoTitleSizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: personalInfoTitleColor }}>
                    {t('resume.sections.summary').toUpperCase()}
                  </h2>
                  <div className="flex-1 border-t" style={{ borderColor: personalInfoTitleColor }}></div>
                </div>
                <p className="leading-relaxed break-words whitespace-pre-wrap" style={{ fontSize: personalInfoBodySizes.base, color: personalInfoBodyColor, lineHeight: '1.5' }}>
                  {personalInfo.summary.trim()}
                </p>
              </div>
            )}

            {/* Skills - full width */}
            {skills && skills.length > 0 && skills.some(s => s.skill) && (
              <div className="mb-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <h2 className="uppercase tracking-wide flex-shrink-0" style={{ fontSize: skillsTitleSizes.heading, fontWeight: headingBold ? 'bold' : 'normal', color: skillsStyling.titleColor }}>
                    {t('resume.sections.skills').toUpperCase()}
                  </h2>
                  <div className="flex-1 border-t" style={{ borderColor: skillsStyling.titleColor }}></div>
                </div>
                <div>
                  <div className="flex gap-2">
                    <span className="font-bold flex-shrink-0" style={{ fontSize: skillsBodySizes.xs, color: skillsStyling.bodyColor, minWidth: '50px' }}>{t('resume.sections.skills')}:</span>
                    <span className="flex-1 break-words" style={{ fontSize: skillsBodySizes.xs, color: skillsStyling.bodyColor, lineHeight: '1.5' }}>
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