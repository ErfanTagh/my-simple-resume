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
  const fontSizeInput = styling?.fontSize || "medium";
  // Ensure fontSize is valid to prevent crashes
  const fontSize: "small" | "medium" | "large" =
    (fontSizeInput === "small" || fontSizeInput === "medium" || fontSizeInput === "large")
      ? fontSizeInput
      : "medium";
  const titleColor = styling?.titleColor || "#1f2937";
  const titleBold = styling?.titleBold ?? true;
  const headingColor = styling?.headingColor || "#2563eb";
  const headingBold = styling?.headingBold ?? true;
  const textColor = styling?.textColor || "#1f2937";
  const linkColor = styling?.linkColor || "#2563eb";

  // Extract section-specific styling for personalInfo
  const personalInfoSectionStyling = styling?.sectionStyling?.personalInfo;
  // Use headingColor as fallback (blue) instead of titleColor (black) to match template defaults
  const personalInfoTitleColor = personalInfoSectionStyling?.titleColor || headingColor;
  const personalInfoTitleSize = personalInfoSectionStyling?.titleSize || fontSize;
  const personalInfoBodyColor = personalInfoSectionStyling?.bodyColor || textColor;
  const personalInfoBodySize = personalInfoSectionStyling?.bodySize || fontSize;

  // Font size mappings - Increased differences for more noticeable size changes
  const fontSizeMap = {
    small: {
      base: '0.6875rem',    // 11px
      sm: '0.8125rem',      // 13px
      baseText: '0.625rem', // 10px (reduced from 11px)
      title: '1.25rem',     // 20px (reduced from 22px)
      heading: '0.75rem',   // 12px (reduced from 13px)
      xs: '0.5625rem',      // 9px
    },
    medium: {
      base: '0.9375rem',    // 15px (+4px from small)
      sm: '1.125rem',       // 18px (+5px from small)
      baseText: '0.8125rem', // 13px (reduced from 15px)
      title: '1.625rem',    // 26px (reduced from 30px)
      heading: '1rem',      // 16px (reduced from 18px)
      xs: '0.75rem',        // 12px (+3px from small)
    },
    large: {
      base: '1.1875rem',    // 19px (+4px from medium)
      sm: '1.4375rem',      // 23px (+5px from medium)
      baseText: '1rem',    // 16px (reduced from 19px)
      title: '2rem',        // 32px (reduced from 38px)
      heading: '1.25rem',   // 20px (reduced from 23px)
      xs: '0.9375rem',      // 15px (+3px from medium)
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

  // Helper function for section headings (keep for backward compatibility, but sections should use section-specific styling)
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
                color: personalInfoTitleColor,
                fontWeight: headingBold ? 'bold' : 'normal',
                borderColor: personalInfoTitleColor,
                fontSize: personalInfoTitleSizes.heading
              }}
            >
              {t('resume.sections.professionalSummary').toUpperCase()}
            </h2>
            <p className="leading-relaxed whitespace-pre-wrap" style={{ color: personalInfoBodyColor, fontSize: personalInfoBodySizes.baseText }}>
              {personalInfo.summary.trim()}
            </p>
          </div>
        ) : null;

      case "workExperience":
        return workExperience.some(exp => exp.position || exp.company) ? (
          <div key="workExperience" className="mb-6" data-resume-section="true">
            <h2 className={getHeadingClassName()} style={{ color: workExperienceStyling.titleColor, fontWeight: headingBold ? 'bold' : 'normal', borderColor: workExperienceStyling.titleColor, fontSize: workExperienceTitleSizes.heading }}>{t('resume.sections.experience').toUpperCase()}</h2>
            <div className="space-y-4">
              {workExperience.map((exp, index) => (
                (exp.position || exp.company) && (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold" style={{ fontSize: workExperienceBodySizes.baseText, color: workExperienceStyling.bodyColor }}>{exp.position}</h3>
                        <p className="font-semibold" style={{ fontSize: workExperienceBodySizes.baseText, color: workExperienceStyling.bodyColor }}>{exp.company}</p>
                        {exp.location && <p style={{ fontSize: workExperienceBodySizes.xs, color: workExperienceStyling.bodyColor }}>{exp.location}</p>}
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <div className="flex items-center gap-1" style={{ fontSize: workExperienceBodySizes.xs, color: workExperienceStyling.bodyColor }}>
                          <Calendar className="h-3 w-3" />
                          <span>{formatDateRange(exp.startDate, exp.endDate, t('resume.fields.present'))}</span>
                        </div>
                      )}
                    </div>
                    {exp.description && <p className="mb-2" style={{ color: workExperienceStyling.bodyColor, fontSize: workExperienceBodySizes.baseText }}>{exp.description}</p>}
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="space-y-1 mb-2" style={{ fontSize: workExperienceBodySizes.baseText, color: workExperienceStyling.bodyColor }}>
                        {exp.responsibilities.map((resp, i) => (
                          resp.responsibility && (
                            <li key={i} className="flex gap-2">
                              <span style={{ color: workExperienceStyling.bodyColor }}>•</span>
                              <span className="flex-1">{resp.responsibility}</span>
                            </li>
                          )
                        ))}
                      </ul>
                    )}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <p className="mt-2" style={{ fontSize: workExperienceBodySizes.xs, color: workExperienceStyling.bodyColor }}>
                        {t('resume.sections.technologies')}: {exp.technologies.map(t => typeof t === 'string' ? t : t.technology).filter(Boolean).join(", ")}
                      </p>
                    )}
                    {exp.competencies && exp.competencies.length > 0 && (
                      <p className="mt-1" style={{ fontSize: workExperienceBodySizes.xs, color: workExperienceStyling.bodyColor }}>
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
            <h2 className={getHeadingClassName()} style={{ color: educationStyling.titleColor, fontWeight: headingBold ? 'bold' : 'normal', borderColor: educationStyling.titleColor, fontSize: educationTitleSizes.heading }}>{t('resume.sections.education').toUpperCase()}</h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                (edu.degree || edu.institution) && (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold" style={{ fontSize: educationBodySizes.baseText, color: educationStyling.bodyColor }}>{edu.degree}</h3>
                        <p style={{ fontSize: educationBodySizes.baseText, color: educationStyling.bodyColor }}>{edu.institution}</p>
                        {edu.location && <p style={{ fontSize: educationBodySizes.xs, color: educationStyling.bodyColor }}>{edu.location}</p>}
                        {edu.field && <p className="italic" style={{ fontSize: educationBodySizes.baseText, color: educationStyling.bodyColor }}>{edu.field}</p>}
                        {edu.keyCourses && edu.keyCourses.length > 0 && (
                          <p className="mt-1" style={{ fontSize: educationBodySizes.xs, color: educationStyling.bodyColor }}>
                            {t('resume.labels.keyCourses')}: {edu.keyCourses.map(c => typeof c === 'string' ? c : c.course).filter(Boolean).join(", ")}
                          </p>
                        )}
                      </div>
                      {(edu.startDate || edu.endDate) && (
                        <span style={{ fontSize: educationBodySizes.xs, color: educationStyling.bodyColor }}>{formatDateRange(edu.startDate, edu.endDate, t('resume.fields.present'))}</span>
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
            <h2 className={getHeadingClassName()} style={{ color: projectsStyling.titleColor, fontWeight: headingBold ? 'bold' : 'normal', borderColor: projectsStyling.titleColor, fontSize: projectsTitleSizes.heading }}>{t('resume.sections.projects').toUpperCase()}</h2>
            <div className="space-y-3">
              {projects.map((proj, index) => (
                proj.name && (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold" style={{ fontSize: projectsBodySizes.baseText, color: projectsStyling.bodyColor }}>{proj.name}</h3>
                      {(proj.startDate || proj.endDate) && (
                        <span style={{ fontSize: projectsBodySizes.xs, color: projectsStyling.bodyColor }}>{formatDateRange(proj.startDate, proj.endDate, t('resume.fields.present'))}</span>
                      )}
                    </div>
                    {proj.description && <p className="mb-2" style={{ fontSize: projectsBodySizes.baseText, color: projectsStyling.bodyColor }}>{proj.description}</p>}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="space-y-1 mb-2" style={{ fontSize: projectsBodySizes.baseText, color: projectsStyling.bodyColor }}>
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
                      <p className="mt-1" style={{ fontSize: projectsBodySizes.xs, color: projectsStyling.bodyColor }}>
                        {t('resume.sections.technologies')}: {proj.technologies.map(t => typeof t === 'string' ? t : t.technology).filter(Boolean).join(", ")}
                      </p>
                    )}
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline mt-1 block" style={{ fontSize: projectsBodySizes.xs, color: linkColor }}>
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
            <h2 className={getHeadingClassName()} style={{ color: certificatesStyling.titleColor, fontWeight: headingBold ? 'bold' : 'normal', borderColor: certificatesStyling.titleColor, fontSize: certificatesTitleSizes.heading }}>{t('resume.sections.certifications').toUpperCase()}</h2>
            <div className="space-y-2">
              {certificates.map((cert, index) => (
                cert.name && (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold" style={{ fontSize: certificatesBodySizes.baseText, color: certificatesStyling.bodyColor }}>{cert.name}</h3>
                        <p style={{ fontSize: certificatesBodySizes.baseText, color: certificatesStyling.bodyColor }}>{cert.organization}</p>
                        {(cert.issueDate || cert.expirationDate) && (
                          <p className="mt-1" style={{ fontSize: certificatesBodySizes.xs, color: certificatesStyling.bodyColor }}>
                            {cert.issueDate} {cert.expirationDate && `- ${cert.expirationDate}`}
                          </p>
                        )}
                        {cert.credentialId && (
                          <p style={{ fontSize: certificatesBodySizes.xs, color: certificatesStyling.bodyColor }}>ID: {cert.credentialId}</p>
                        )}
                        {cert.url && (
                          <a href={cert.url} target="_blank" rel="noopener noreferrer" className="hover:underline mt-1 block" style={{ fontSize: certificatesBodySizes.xs, color: linkColor }}>
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
            <h2 className={getHeadingClassName()} style={{ color: skillsStyling.titleColor, fontWeight: headingBold ? 'bold' : 'normal', borderColor: skillsStyling.titleColor, fontSize: skillsTitleSizes.heading }}>{t('resume.sections.skills').toUpperCase()}</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, index) => (
                s.skill && (
                  <span key={index} className="px-3 py-1 rounded-full font-medium" style={{ fontSize: skillsBodySizes.xs, color: skillsStyling.bodyColor, backgroundColor: `${skillsStyling.bodyColor}15` }}>
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
            <h2 className={getHeadingClassName()} style={{ color: languagesStyling.titleColor, fontWeight: headingBold ? 'bold' : 'normal', borderColor: languagesStyling.titleColor, fontSize: languagesTitleSizes.heading }}>{t('resume.sections.languages').toUpperCase()}</h2>
            <div className="space-y-2">
              {languages.map((lang, index) => (
                lang.language && (
                  <div key={index} className="flex justify-between items-center gap-4 pr-2" style={{ fontSize: languagesBodySizes.xs, color: languagesStyling.bodyColor }}>
                    <span className="font-semibold">{lang.language}</span>
                    <span className="whitespace-nowrap flex-shrink-0" style={{ color: languagesStyling.bodyColor, opacity: 0.7 }}>{lang.proficiency}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "interests":
        return personalInfo.interests && personalInfo.interests.length > 0 && personalInfo.interests.some(i => i.interest) ? (
          <div key="interests" className="mb-6" data-resume-section="true">
            <h2 className={getHeadingClassName()} style={{ color: personalInfoTitleColor, fontWeight: headingBold ? 'bold' : 'normal', borderColor: personalInfoTitleColor, fontSize: personalInfoTitleSizes.heading }}>{t('resume.sections.interests').toUpperCase()}</h2>
            <p style={{ color: personalInfoBodyColor, fontSize: personalInfoBodySizes.baseText }}>{personalInfo.interests.map(i => i.interest).filter(Boolean).join(", ")}</p>
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
      <div
        className="resume-page-container bg-background text-foreground p-8 max-w-4xl mx-auto"
        style={{ fontFamily: `"${fontFamily}", ui-sans-serif, system-ui, sans-serif` }}
      >
        {/* Header with colored background */}
        <div className="-mx-8 -mt-8 px-8 py-6 mb-6 border-l-4" style={{ backgroundColor: `${linkColor}0D`, borderColor: linkColor }}>
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h1
                className="mb-2"
                style={{
                  color: linkColor,
                  fontWeight: titleBold ? 'bold' : 'normal',
                  fontSize: sizes.title,
                  lineHeight: '1.2',
                }}
              >
                {personalInfo.firstName} {personalInfo.lastName}                                
              </h1>
              {personalInfo.professionalTitle && personalInfo.professionalTitle.trim().length > 0 && (
                <p className="font-semibold mb-2" style={{ fontSize: sizes.base, color: textColor }}>{personalInfo.professionalTitle.trim()}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3" style={{ fontSize: sizes.xs, color: textColor }}>
                {personalInfo.email && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Mail className="h-4 w-4 flex-shrink-0" style={{ color: linkColor }} />
                    <span className="truncate">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Phone className="h-4 w-4 flex-shrink-0" style={{ color: linkColor }} />
                    <span className="truncate">{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: linkColor }} />
                    <span className="truncate">{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Linkedin className="h-4 w-4 flex-shrink-0" style={{ color: linkColor }} />
                    <span className="truncate">{personalInfo.linkedin}</span>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Github className="h-4 w-4 flex-shrink-0" style={{ color: linkColor }} />
                    <span className="truncate">{personalInfo.github}</span>
                  </div>
                )}
                {personalInfo.website && (
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe className="h-4 w-4 flex-shrink-0" style={{ color: linkColor }} />
                    <span className="truncate">{personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile image */}
            {personalInfo.profileImage ? (
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-md border-2 overflow-hidden" style={{ borderColor: linkColor }}>
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
              <div className="flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-md border-2 bg-muted flex items-center justify-center photo-placeholder" style={{ borderColor: linkColor }}>
                <span className="text-xs text-muted-foreground">Photo</span>
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
          /* Hide photo placeholders in print/PDF */
          .photo-placeholder {
            display: none !important;
          }
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
