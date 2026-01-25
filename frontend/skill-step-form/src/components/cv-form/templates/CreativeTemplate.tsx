import { CVFormData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { formatDateRange } from "@/lib/dateFormatter";
import { useLanguage } from "@/contexts/LanguageContext";

interface CreativeTemplateProps {
  data: CVFormData;
}

export const CreativeTemplate = ({ data }: CreativeTemplateProps) => {
  const { t } = useLanguage();
  const { personalInfo, workExperience, education, projects, certificates, languages, skills, sectionOrder, styling } = data;

  const defaultOrder = ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"];
  const orderedSections = sectionOrder || defaultOrder;

  // Extract styling options with defaults
  const fontFamily = styling?.fontFamily || "Inter";
  const fontSizeInput = styling?.fontSize || "medium";
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

  // Font size mappings - Reduced sizes for more compact layout
  const fontSizeMap = {
    small: {
      heading: '0.9375rem',   // 15px (reduced from 18px)
      base: '0.75rem',        // 12px (reduced from 14px)
      sm: '0.6875rem',        // 11px (reduced from 12px)
      xs: '0.5625rem',        // 9px (reduced from 10px)
      sectionHeading: '1.125rem', // 18px (reduced from 22px)
      lg: '0.875rem',         // 14px (reduced from 16px)
    },
    medium: {
      heading: '1.25rem',     // 20px (reduced from 24px)
      base: '0.875rem',       // 14px (reduced from 16px)
      sm: '0.75rem',          // 12px (reduced from 14px)
      xs: '0.625rem',         // 10px (reduced from 12px)
      sectionHeading: '1.375rem', // 22px (reduced from 24px)
      lg: '1rem',             // 16px (reduced from 18px)
    },
    large: {
      heading: '1.625rem',    // 26px (reduced from 30px)
      base: '1rem',           // 16px (reduced from 18px)
      sm: '0.875rem',         // 14px (reduced from 16px)
      xs: '0.75rem',          // 12px (reduced from 14px)
      sectionHeading: '1.75rem', // 28px (reduced from 30px)
      lg: '1.125rem',         // 20px (reduced from 22px)
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
  const personalInfoTitleColor = personalInfoSectionStyling?.titleColor || titleColor;
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
          <div key="summary" className="mb-3">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-2 italic" style={{ fontSize: `calc(${personalInfoTitleSizes.sectionHeading} * 0.8)`, fontWeight: headingBold ? '900' : 'bold', color: personalInfoTitleColor }}>{t('resume.sections.aboutMe')}</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap" style={{ fontSize: personalInfoBodySizes.sm, color: personalInfoBodyColor }}>{personalInfo.summary.trim()}</p>
            </div>
          </div>
        ) : null;

      case "workExperience":
        return workExperience.some(exp => exp.position || exp.company) ? (
          <div key="workExperience" className="mb-3">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-2 italic" style={{ fontSize: `calc(${workExperienceTitleSizes.sectionHeading} * 0.8)`, fontWeight: headingBold ? '900' : 'bold', color: workExperienceStyling.titleColor }}>{t('resume.sections.experience')}</h2>
              <div className="space-y-2">
                {workExperience.map((exp, index) => (
                  (exp.position || exp.company) && (
                    <div key={index} className="relative">
                      <div className="absolute -left-[26px] w-3 h-3 rounded-full bg-primary"></div>
                      {/* Position title on its own line */}
                      <h3 className="font-bold text-foreground mb-0.5" style={{ fontSize: sizes.lg }}>{exp.position}</h3>
                      {/* Company/Location (left) and Date (right) on same line */}
                      <div className="flex justify-between items-center gap-4 mb-0.5">
                        <p className="font-semibold" style={{ fontSize: sizes.base, color: headingColor }}>
                          {exp.company}{exp.location && ` • ${exp.location}`}
                        </p>
                        {(exp.startDate || exp.endDate) && (
                          <span className="text-muted-foreground whitespace-nowrap" style={{ fontSize: sizes.xs }}>
                            {formatDateRange(exp.startDate, exp.endDate, t('resume.fields.present'))}
                          </span>
                        )}
                      </div>
                      {((exp.responsibilities && exp.responsibilities.length > 0) || exp.description) && (
                        <ul className="text-muted-foreground space-y-0.5 mt-1.5" style={{ fontSize: sizes.sm }}>
                          {exp.responsibilities && exp.responsibilities.length > 0
                            ? exp.responsibilities.map((resp, i) => (
                              resp.responsibility && (
                                <li key={i} className="flex gap-2">
                                  <span className="text-primary font-bold">•</span>
                                  <span className="flex-1">{resp.responsibility}</span>
                                </li>
                              )
                            ))
                            : exp.description?.split('\n').filter(line => line.trim()).map((line, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-primary font-bold">•</span>
                                <span className="flex-1">{line.trim()}</span>
                              </li>
                            ))
                          }
                        </ul>
                      )}
                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {exp.technologies.map((tech, i) => (
                            tech.technology && (
                              <span key={i} className="px-2 py-0.5 bg-primary/20 rounded" style={{ fontSize: sizes.xs, color: headingColor }}>
                                {typeof tech === 'string' ? tech : tech.technology}
                              </span>
                            )
                          ))}
                        </div>
                      )}
                      {exp.competencies && exp.competencies.length > 0 && (
                        <p className="text-muted-foreground mt-1.5" style={{ fontSize: sizes.xs }}>
                          {t('resume.labels.keyCompetencies')}: {exp.competencies.map(c => typeof c === 'string' ? c : c.competency).filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        ) : null;

      case "education":
        return education.some(edu => edu.degree || edu.institution) ? (
          <div key="education" className="mb-3">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-2 italic" style={{ fontSize: `calc(${educationTitleSizes.sectionHeading} * 0.8)`, fontWeight: headingBold ? '900' : 'bold', color: educationStyling.titleColor }}>{t('resume.sections.education')}</h2>
              <div className="space-y-2">
                {education.map((edu, index) => (
                  (edu.degree || edu.institution) && (
                    <div key={index} className="relative">
                      <div className="absolute -left-[26px] w-3 h-3 rounded-full bg-primary"></div>
                      {/* Degree on its own line */}
                      <h3 className="font-bold text-foreground mb-0.5" style={{ fontSize: sizes.lg }}>{edu.degree}</h3>
                      {/* Institution/Location (left) and Date (right) on same line */}
                      <div className="flex justify-between items-center gap-4 mb-0.5">
                        <p className="text-muted-foreground" style={{ fontSize: sizes.sm }}>
                          {edu.institution}{edu.location && ` • ${edu.location}`}
                        </p>
                        {(edu.startDate || edu.endDate) && (
                          <span className="text-muted-foreground whitespace-nowrap" style={{ fontSize: sizes.xs }}>
                            {formatDateRange(edu.startDate, edu.endDate, t('resume.fields.present'))}
                          </span>
                        )}
                      </div>
                      {edu.field && <p className="text-muted-foreground italic" style={{ fontSize: sizes.sm }}>{edu.field}</p>}
                      {edu.keyCourses && edu.keyCourses.length > 0 && (
                        <p className="text-muted-foreground mt-0.5" style={{ fontSize: sizes.xs }}>
                          {t('resume.labels.keyCourses')}: {edu.keyCourses.map(c => typeof c === 'string' ? c : c.course).filter(Boolean).join(", ")}
                        </p>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        ) : null;

      case "projects":
        return projects.some(proj => proj.name) ? (
          <div key="projects" className="mb-3">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-2 italic" style={{ fontSize: `calc(${projectsTitleSizes.sectionHeading} * 0.8)`, fontWeight: headingBold ? '900' : 'bold', color: projectsStyling.titleColor }}>{t('resume.sections.projects')}</h2>
              <div className="space-y-2">
                {projects.map((proj, index) => (
                  proj.name && (
                    <div key={index} className="relative">
                      <div className="absolute -left-[26px] w-3 h-3 rounded-full bg-primary"></div>
                      {/* Project name (left) and Date (right) on same line */}
                      <div className="flex justify-between items-start gap-4 mb-0.5">
                        <h3 className="font-bold text-foreground flex-1" style={{ fontSize: sizes.lg }}>{proj.name}</h3>
                        {(proj.startDate || proj.endDate) && (
                          <span className="text-muted-foreground whitespace-nowrap" style={{ fontSize: sizes.xs }}>
                            {formatDateRange(proj.startDate, proj.endDate, t('resume.fields.present'))}
                          </span>
                        )}
                      </div>
                      {proj.description && (
                        <p className="text-muted-foreground mt-0.5" style={{ fontSize: sizes.sm }}>{proj.description}</p>
                      )}
                      {proj.highlights && proj.highlights.length > 0 && (
                        <ul className="text-muted-foreground space-y-0.5 mt-1" style={{ fontSize: sizes.sm }}>
                          {proj.highlights.map((highlight, i) => (
                            highlight.highlight && (
                              <li key={i} className="flex gap-2">
                                <span className="text-primary font-bold">•</span>
                                <span className="flex-1">{highlight.highlight}</span>
                              </li>
                            )
                          ))}
                        </ul>
                      )}
                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {proj.technologies.map((tech, i) => (
                            tech.technology && (
                              <span key={i} className="px-2 py-0.5 bg-primary/20 rounded" style={{ fontSize: sizes.xs, color: headingColor }}>
                                {tech.technology}
                              </span>
                            )
                          ))}
                        </div>
                      )}
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline mt-1.5 block" style={{ fontSize: sizes.xs, color: linkColor }}>
                          {proj.link.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        ) : null;

      case "certificates":
        return certificates.some(cert => cert.name) ? (
          <div key="certificates" className="mb-3">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-2 italic" style={{ fontSize: `calc(${certificatesTitleSizes.sectionHeading} * 0.8)`, fontWeight: headingBold ? '900' : 'bold', color: certificatesStyling.titleColor }}>{t('resume.sections.certifications')}</h2>
              <div className="space-y-1.5">
                {certificates.map((cert, index) => (
                  cert.name && (
                    <div key={index} className="relative">
                      <div className="absolute -left-[26px] w-3 h-3 rounded-full bg-primary"></div>
                      {/* Certificate name on its own line */}
                      <h3 className="font-bold text-foreground mb-0.5">{cert.name}</h3>
                      {/* Organization (left) and Date (right) on same line */}
                      <div className="flex justify-between items-center gap-4 mb-0.5">
                        <p className="text-muted-foreground" style={{ fontSize: sizes.sm }}>{cert.organization}</p>
                        {(cert.issueDate || cert.expirationDate) && (
                          <span className="text-muted-foreground whitespace-nowrap" style={{ fontSize: sizes.xs }}>
                            {cert.issueDate} {cert.expirationDate && `- ${cert.expirationDate}`}
                          </span>
                        )}
                      </div>
                      {cert.credentialId && (
                        <p className="text-muted-foreground" style={{ fontSize: sizes.xs }}>ID: {cert.credentialId}</p>
                      )}
                      {cert.url && (
                        <a href={cert.url} target="_blank" rel="noopener noreferrer" className="hover:underline mt-0.5 block" style={{ fontSize: sizes.xs, color: linkColor }}>
                          {cert.url.replace(/^https?:\/\/(www\.)?/, '')}
                        </a>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        ) : null;

      case "skills":
        return skills.some(s => s.skill) ? (
          <div key="skills" className="mb-3">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-2 italic" style={{ fontSize: `calc(${skillsTitleSizes.sectionHeading} * 0.8)`, fontWeight: headingBold ? '900' : 'bold', color: skillsStyling.titleColor }}>{t('resume.sections.skills')}</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, index) => (
                  s.skill && (
                    <span key={index} className="px-2 py-1 bg-primary text-primary-foreground rounded font-bold" style={{ fontSize: sizes.xs }}>
                      {s.skill}
                    </span>
                  )
                ))}
              </div>
            </div>
          </div>
        ) : null;

      case "languages":
        return languages.some(lang => lang.language) ? (
          <div key="languages" className="mb-3">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-2 italic" style={{ fontSize: `calc(${languagesTitleSizes.sectionHeading} * 0.8)`, fontWeight: headingBold ? '900' : 'bold', color: languagesStyling.titleColor }}>{t('resume.sections.languages')}</h2>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang, index) => (
                  lang.language && (
                    <div key={index} className="bg-primary/5 p-2 rounded-lg">
                      <p className="font-bold text-foreground">{lang.language}</p>
                      <p className="text-muted-foreground" style={{ fontSize: sizes.sm }}>{lang.proficiency}</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        ) : null;

      case "interests":
        return personalInfo.interests && personalInfo.interests.length > 0 && personalInfo.interests.some(i => i.interest) ? (
          <div key="interests" className="mb-3">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-2 italic" style={{ fontSize: `calc(${personalInfoTitleSizes.sectionHeading} * 0.8)`, fontWeight: headingBold ? '900' : 'bold', color: personalInfoTitleColor }}>{t('resume.sections.interests')}</h2>
              <p className="text-foreground" style={{ fontSize: personalInfoBodySizes.sm, color: personalInfoBodyColor }}>{personalInfo.interests.map(i => i.interest).filter(Boolean).join(", ")}</p>
            </div>
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
          padding-top: 20px !important;
          padding-bottom: 20px !important;
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
      <div className="resume-page-container bg-gradient-to-br from-background to-primary/5 text-foreground p-4 max-w-4xl mx-auto font-creative" style={{ fontFamily: `"${fontFamily}", ui-sans-serif, system-ui, sans-serif` }}>
        {/* Bold creative header */}
        <div className="mb-4">
          <div className="flex items-start gap-6 mb-4">
            <div className="flex-1">
              <h1 className="font-black mb-0 italic tracking-tight" style={{ fontSize: '1.75rem', fontWeight: titleBold ? '900' : 'bold', color: titleColor, lineHeight: '1.1' }}>
                {personalInfo.firstName}
              </h1>
              <h1 className="font-black mb-1 italic tracking-tight" style={{ fontSize: '1.75rem', fontWeight: titleBold ? '900' : 'bold', color: headingColor, lineHeight: '1.1' }}>
                {personalInfo.lastName}
              </h1>
              {personalInfo.professionalTitle && personalInfo.professionalTitle.trim().length > 0 && (
                <p className="font-bold mb-2 italic" style={{ fontSize: '0.9375rem', color: headingColor }}>{personalInfo.professionalTitle.trim()}</p>
              )}

              <div className="flex flex-wrap gap-1 text-muted-foreground mt-2" style={{ fontSize: sizes.xs }}>
                {personalInfo.email && (
                  <div className="flex items-center gap-1 bg-background/50 px-2 py-0.5 rounded-full">
                    <Mail className="h-3 w-3 text-primary" />
                    <span>{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-1 bg-background/50 px-2 py-0.5 rounded-full">
                    <Phone className="h-3 w-3 text-primary" />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center gap-1 bg-background/50 px-2 py-0.5 rounded-full">
                    <MapPin className="h-3 w-3 text-primary" />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="flex items-center gap-1 bg-background/50 px-2 py-0.5 rounded-full min-w-0 max-w-fit">
                    <Linkedin className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="truncate" style={{ fontSize: sizes.xs }}>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="flex items-center gap-1 bg-background/50 px-2 py-0.5 rounded-full min-w-0 max-w-fit">
                    <Github className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="truncate" style={{ fontSize: sizes.xs }}>{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </div>
                )}
                {personalInfo.website && (
                  <div className="flex items-center gap-1 bg-background/50 px-2 py-0.5 rounded-full min-w-0 max-w-fit">
                    <Globe className="h-3 w-3 text-primary flex-shrink-0" />
                    <span className="truncate" style={{ fontSize: sizes.xs }}>{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile image */}
            {personalInfo.profileImage ? (
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg border-4 border-primary shadow-lg overflow-hidden">
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
              <div className="flex-shrink-0 w-16 h-16 rounded-lg border-4 border-primary shadow-lg bg-muted flex items-center justify-center photo-placeholder">
                <span className="text-muted-foreground" style={{ fontSize: sizes.xs }}>Photo</span>
              </div>
            )}
          </div>
        </div>

        {/* Sections with creative timeline */}
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
