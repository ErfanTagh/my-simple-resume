import { CVFormData } from "../types";
import { formatDateRange } from "@/lib/dateFormatter";
import { useLanguage } from "@/contexts/LanguageContext";

interface MinimalTemplateProps {
  data: CVFormData;
}

// Helper component for section headings with decorative lines
const SectionHeading = ({ title, fontSize, color }: { title: string; fontSize: string; color: string }) => (
  <div className="flex items-center gap-4 mb-3 mt-6">
    <div className="flex-1 border-t" style={{ borderColor: color }}></div>
    <h2 className="font-bold uppercase tracking-widest whitespace-nowrap" style={{ fontSize, color }}>
      {title}
    </h2>
    <div className="flex-1 border-t" style={{ borderColor: color }}></div>
  </div>
);

export const MinimalTemplate = ({ data }: MinimalTemplateProps) => {
  const { t } = useLanguage();
  const { personalInfo, workExperience, education, projects, certificates, languages, skills, sectionOrder, styling } = data;

  const defaultOrder = ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"];
  const orderedSections = sectionOrder || defaultOrder;

  // Extract styling options with defaults
  const fontFamily = styling?.fontFamily || "sans-serif";
  const fontSizeInput = styling?.fontSize || "medium";
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

  // Font size mappings - Increased differences for more noticeable size changes
  const fontSizeMap = {
    small: {
      xs: '0.5625rem',     // 9px
      sm: '0.6875rem',     // 11px
      base: '0.8125rem',   // 13px
      baseText: '0.625rem', // 10px (reduced from 11px)
      heading: '0.75rem',   // 12px (reduced from 13px)
    },
    medium: {
      xs: '0.75rem',       // 12px (+3px from small)
      sm: '0.9375rem',     // 15px (+4px from small)
      base: '1.125rem',    // 18px (+5px from small)
      baseText: '0.8125rem', // 13px (reduced from 15px)
      heading: '1rem',      // 16px (reduced from 18px)
    },
    large: {
      xs: '0.9375rem',     // 15px (+3px from medium)
      sm: '1.1875rem',     // 19px (+4px from medium)
      base: '1.4375rem',   // 23px (+5px from medium)
      baseText: '1rem',    // 16px (reduced from 19px)
      heading: '1.25rem',   // 20px (reduced from 23px)
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

  // Extract section-specific styling for personalInfo
  const personalInfoSectionStyling = styling?.sectionStyling?.personalInfo;
  // Use headingColor as fallback (blue) instead of titleColor (black) to match template defaults
  const personalInfoTitleColor = personalInfoSectionStyling?.titleColor || headingColor;
  const personalInfoTitleSize = personalInfoSectionStyling?.titleSize || fontSize;
  const personalInfoBodyColor = personalInfoSectionStyling?.bodyColor || textColor;
  const personalInfoBodySize = personalInfoSectionStyling?.bodySize || fontSize;

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

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        return personalInfo.summary && personalInfo.summary.trim() ? (
          <div key="summary">
            <SectionHeading title={t('resume.sections.professionalSummary') || 'Summary'} fontSize={personalInfoTitleSizes.heading} color={personalInfoTitleColor} />
            <p className="text-foreground leading-relaxed whitespace-pre-wrap" style={{ fontSize: personalInfoBodySizes.baseText, color: personalInfoBodyColor }}>{personalInfo.summary.trim()}</p>
          </div>
        ) : null;

      case "workExperience":
        return workExperience.some(exp => exp.position || exp.company) ? (
          <div key="workExperience">
            <SectionHeading title={t('resume.sections.experience') || 'Experience'} fontSize={workExperienceTitleSizes.heading} color={workExperienceStyling.titleColor} />
            <div className="space-y-3">
              {workExperience.map((exp, index) => (
                (exp.position || exp.company) && (
                  <div key={index} className="space-y-1">
                    {/* Position title on its own line */}
                    <h3 className="font-semibold mb-0.5" style={{ fontSize: workExperienceBodySizes.baseText, color: workExperienceStyling.bodyColor }}>{exp.position}</h3>
                    {/* Company/Location (left) and Date (right) on same line */}
                    <div className="flex justify-between items-center gap-4 mb-0.5">
                      <p style={{ fontSize: sizes.xs, color: workExperienceStyling.bodyColor }}>
                        {exp.company}{exp.location && ` • ${exp.location}`}
                      </p>
                      {(exp.startDate || exp.endDate) && (
                        <span className="whitespace-nowrap" style={{ fontSize: sizes.xs, color: workExperienceStyling.bodyColor }}>
                          {formatDateRange(exp.startDate, exp.endDate, t('resume.fields.present'))}
                        </span>
                      )}
                    </div>
                    {((exp.responsibilities && exp.responsibilities.length > 0) || exp.description) && (
                      <ul className="space-y-1 mt-2" style={{ fontSize: sizes.xs, color: workExperienceStyling.bodyColor }}>
                        {exp.responsibilities && exp.responsibilities.length > 0
                          ? exp.responsibilities.map((resp, i) => (
                            resp.responsibility && (
                              <li key={i} className="flex gap-2">
                                <span style={{ color: workExperienceStyling.bodyColor }}>•</span>
                                <span className="flex-1">{resp.responsibility}</span>
                              </li>
                            )
                          ))
                          : exp.description?.split('\n').filter(line => line.trim()).map((line, i) => (
                            <li key={i} className="flex gap-2">
                              <span style={{ color: workExperienceStyling.bodyColor }}>•</span>
                              <span className="flex-1">{line.trim()}</span>
                            </li>
                          ))
                        }
                      </ul>
                    )}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <p className="mt-1" style={{ fontSize: sizes.xs, color: workExperienceStyling.bodyColor }}>
                        {t('resume.sections.technologies')}: {exp.technologies.map(t => typeof t === 'string' ? t : t.technology).filter(Boolean).join(", ")}
                      </p>
                    )}
                    {exp.competencies && exp.competencies.length > 0 && (
                      <p className="mt-1" style={{ fontSize: sizes.xs, color: workExperienceStyling.bodyColor }}>
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
          <div key="education">
            <SectionHeading title={t('resume.sections.education') || 'Education'} fontSize={educationTitleSizes.heading} color={educationStyling.titleColor} />
            <div className="space-y-2.5">
              {education.map((edu, index) => (
                (edu.degree || edu.institution) && (
                  <div key={index} className="space-y-1">
                    {/* Degree on its own line */}
                    <h3 className="font-semibold mb-0.5" style={{ fontSize: educationBodySizes.baseText, color: educationStyling.bodyColor }}>{edu.degree}</h3>
                    {/* Institution/Location (left) and Date (right) on same line */}
                    <div className="flex justify-between items-center gap-4 mb-0.5">
                      <p style={{ fontSize: sizes.xs, color: educationStyling.bodyColor }}>
                        {edu.institution}{edu.location && ` • ${edu.location}`}
                      </p>
                      {(edu.startDate || edu.endDate) && (
                        <span className="whitespace-nowrap" style={{ fontSize: sizes.xs, color: educationStyling.bodyColor }}>
                          {formatDateRange(edu.startDate, edu.endDate, t('resume.fields.present'))}
                        </span>
                      )}
                    </div>
                    {edu.field && <p style={{ fontSize: sizes.xs, color: educationStyling.bodyColor }}>{edu.field}</p>}
                    {edu.keyCourses && edu.keyCourses.length > 0 && (
                      <p className="mt-1" style={{ fontSize: sizes.xs, color: educationStyling.bodyColor }}>
                        {t('resume.labels.keyCourses')}: {edu.keyCourses.map(c => typeof c === 'string' ? c : c.course).filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        return projects.some(proj => proj.name) ? (
          <div key="projects">
            <SectionHeading title={t('resume.sections.projects') || 'Projects'} fontSize={projectsTitleSizes.heading} color={projectsStyling.titleColor} />
            <div className="space-y-2.5">
              {projects.map((proj, index) => (
                proj.name && (
                  <div key={index} className="space-y-1">
                    {/* Project name (left) and Date (right) on same line */}
                    <div className="flex justify-between items-start gap-4 mb-0.5">
                      <h3 className="font-semibold flex-1" style={{ fontSize: projectsBodySizes.baseText, color: projectsStyling.bodyColor }}>{proj.name}</h3>
                      {(proj.startDate || proj.endDate) && (
                        <span className="text-xs whitespace-nowrap" style={{ color: projectsStyling.bodyColor }}>
                          {formatDateRange(proj.startDate, proj.endDate, t('resume.fields.present'))}
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="mt-1" style={{ fontSize: sizes.xs, color: projectsStyling.bodyColor }}>{proj.description}</p>
                    )}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="space-y-1 mt-1" style={{ fontSize: sizes.xs, color: projectsStyling.bodyColor }}>
                        {proj.highlights.map((highlight, i) => (
                          highlight.highlight && (
                            <li key={i} className="flex gap-2">
                              <span style={{ color: projectsStyling.bodyColor }}>•</span>
                              <span className="flex-1">{highlight.highlight}</span>
                            </li>
                          )
                        ))}
                      </ul>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <p className="mt-1" style={{ fontSize: sizes.xs, color: projectsStyling.bodyColor }}>
                        {t('resume.sections.technologies')}: {proj.technologies.map(techItem => techItem.technology).filter(Boolean).join(", ")}
                      </p>
                    )}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline mt-1 block" style={{ fontSize: sizes.xs, color: linkColor }}>
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
          <div key="certificates">
            <SectionHeading title={t('resume.sections.certifications') || 'Certifications'} fontSize={certificatesTitleSizes.heading} color={certificatesStyling.titleColor} />
            <div className="space-y-2">
              {certificates.map((cert, index) => (
                cert.name && (
                  <div key={index}>
                    {/* Certificate name on its own line */}
                    <h3 className="font-semibold mb-0.5" style={{ fontSize: certificatesBodySizes.baseText, color: certificatesStyling.bodyColor }}>{cert.name}</h3>
                    {/* Organization (left) and Date (right) on same line */}
                    <div className="flex justify-between items-center gap-4 mb-0.5">
                      <p style={{ fontSize: sizes.xs, color: certificatesStyling.bodyColor }}>{cert.organization}</p>
                    {(cert.issueDate || cert.expirationDate) && (
                        <span className="whitespace-nowrap" style={{ fontSize: sizes.xs, color: certificatesStyling.bodyColor }}>
                        {cert.issueDate} {cert.expirationDate && `- ${cert.expirationDate}`}
                        </span>
                    )}
                    </div>
                    {cert.credentialId && (
                      <p style={{ fontSize: sizes.xs, color: certificatesStyling.bodyColor }}>ID: {cert.credentialId}</p>
                    )}
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="hover:underline mt-1 block" style={{ fontSize: sizes.xs, color: linkColor }}>
                        {cert.url.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        return skills.some(s => s.skill) ? (
          <div key="skills">
            <SectionHeading title={t('resume.sections.skills') || 'Skills'} fontSize={skillsTitleSizes.heading} color={skillsStyling.titleColor} />
            <p className="leading-relaxed" style={{ fontSize: sizes.xs, color: skillsStyling.bodyColor }}>
              {skills.filter(s => s.skill).map(s => s.skill).join(", ")}
            </p>
          </div>
        ) : null;

      case "languages":
        return languages.some(lang => lang.language) ? (
          <div key="languages">
            <SectionHeading title={t('resume.sections.languages') || 'Languages'} fontSize={languagesTitleSizes.heading} color={languagesStyling.titleColor} />
            <div className="space-y-1">
              {languages.map((lang, index) => (
                lang.language && (
                  <div key={index} className="flex justify-between items-center gap-4 pr-2" style={{ fontSize: sizes.xs, color: languagesStyling.bodyColor }}>
                    <span>{lang.language}</span>
                    <span className="whitespace-nowrap flex-shrink-0" style={{ opacity: 0.7 }}>— {lang.proficiency}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "interests":
        return personalInfo.interests && personalInfo.interests.length > 0 && personalInfo.interests.some(i => i.interest) ? (
          <div key="interests">
            <SectionHeading title={t('resume.sections.interests') || 'Interests'} fontSize={personalInfoTitleSizes.heading} color={personalInfoTitleColor} />
            <p className="text-foreground leading-relaxed" style={{ fontSize: personalInfoBodySizes.baseText, color: personalInfoBodyColor }}>{personalInfo.interests.map(i => i.interest).filter(Boolean).join(", ")}</p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  // Build contact info array
  const contactItems: string[] = [];
  if (personalInfo.email) contactItems.push(personalInfo.email);
  if (personalInfo.phone) contactItems.push(personalInfo.phone);
  if (personalInfo.location) contactItems.push(personalInfo.location);
  if (personalInfo.linkedin) contactItems.push(personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, ''));
  if (personalInfo.github) contactItems.push(personalInfo.github.replace(/^https?:\/\/(www\.)?/, ''));
  if (personalInfo.website) contactItems.push(personalInfo.website.replace(/^https?:\/\/(www\.)?/, ''));

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
      <div className="resume-page-container bg-background text-foreground p-6 max-w-3xl mx-auto font-minimal" style={{ fontFamily: `"${fontFamily}", sans-serif` }}>
        {/* Header with large, widely-spaced name */}
        <div className="mb-6">
          <div className="flex items-start gap-6 mb-4">
            <div className="flex-1">
              <h1 className="font-bold mb-4" style={{ fontSize: '1.875rem', letterSpacing: '0.3em', fontWeight: titleBold ? 'bold' : 'normal', color: linkColor }}>
                {personalInfo.firstName.toUpperCase()} {personalInfo.lastName.toUpperCase()}
              </h1>
              {personalInfo.professionalTitle && personalInfo.professionalTitle.trim().length > 0 && (
                <p className="font-normal mb-4" style={{ fontSize: sizes.xs, color: textColor }}>{personalInfo.professionalTitle.trim()}</p>
              )}

              {/* Contact info in single line with separators */}
              {contactItems.length > 0 && (
                <p className="text-xs" style={{ color: textColor, opacity: 0.7 }}>
                  {contactItems.join(' | ')}
                </p>
              )}
            </div>

            {/* Profile image */}
            {personalInfo.profileImage ? (
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-sm overflow-hidden">
                  <img
                    src={personalInfo.profileImage}
                    alt={`Professional profile photo of ${personalInfo.firstName} ${personalInfo.lastName}${personalInfo.professionalTitle ? `, ${personalInfo.professionalTitle}` : ''}${personalInfo.location ? ` from ${personalInfo.location}` : ''}`}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: '50% 40%' }}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                  />
                </div>
              </div>
            ) : (
              <div className="flex-shrink-0 w-20 h-20 rounded-sm border border-foreground/20 bg-muted flex items-center justify-center photo-placeholder">
                <span className="text-xs text-muted-foreground">Photo</span>
              </div>
            )}
          </div>
        </div>

        {/* Sections with decorative headings and generous spacing */}
        <div>
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
