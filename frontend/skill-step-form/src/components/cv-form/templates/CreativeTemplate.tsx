import React, { useEffect, useRef } from "react";
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
  const spacerRef = useRef<HTMLDivElement>(null);

  // Debug logging for page issues
  useEffect(() => {
    const container = document.querySelector('.resume-page-container');
    if (container) {
      const containerHeight = container.getBoundingClientRect().height;
      const computedStyle = window.getComputedStyle(container);
      const minHeight = computedStyle.minHeight;

      // Calculate content height (excluding spacer)
      const contentDivs = container.querySelectorAll(':scope > div:not([aria-hidden="true"])');
      let contentHeight = 0;
      contentDivs.forEach(div => {
        contentHeight += div.getBoundingClientRect().height;
      });

      // Convert px to mm (1mm ≈ 3.779527559px at 96dpi)
      const pxToMm = (px: number) => px / 3.779527559;

      console.log('[CreativeTemplate Debug] ===== PAGE DEBUG INFO =====');
      console.log('[CreativeTemplate Debug] Container height:', containerHeight.toFixed(2), 'px (', pxToMm(containerHeight).toFixed(2), 'mm)');
      console.log('[CreativeTemplate Debug] Container min-height:', minHeight);
      console.log('[CreativeTemplate Debug] Content height (without spacer):', contentHeight.toFixed(2), 'px (', pxToMm(contentHeight).toFixed(2), 'mm)');
      console.log('[CreativeTemplate Debug] Estimated pages from content:', Math.ceil(pxToMm(contentHeight) / 297));
      console.log('[CreativeTemplate Debug] Remaining space for spacer:', (containerHeight - contentHeight).toFixed(2), 'px (', pxToMm(containerHeight - contentHeight).toFixed(2), 'mm)');

      if (spacerRef.current) {
        const spacerHeight = spacerRef.current.getBoundingClientRect().height;
        const spacerStyle = window.getComputedStyle(spacerRef.current);
        console.log('[CreativeTemplate Debug] Spacer actual height:', spacerHeight.toFixed(2), 'px (', pxToMm(spacerHeight).toFixed(2), 'mm)');
        console.log('[CreativeTemplate Debug] Spacer max-height:', spacerStyle.maxHeight);
        console.log('[CreativeTemplate Debug] Spacer flex:', spacerStyle.flex);
        console.log('[CreativeTemplate Debug] Spacer computed height:', spacerStyle.height);

        // Check if spacer might cause page break
        const estimatedTotalHeight = contentHeight + spacerHeight;
        const contentPages = Math.ceil(pxToMm(contentHeight) / 297);
        const estimatedPages = Math.ceil(pxToMm(estimatedTotalHeight) / 297);
        const remainingOnLastPage = (contentPages * 297) - pxToMm(contentHeight);

        console.log('[CreativeTemplate Debug] Content pages:', contentPages);
        console.log('[CreativeTemplate Debug] Remaining space on last page:', remainingOnLastPage.toFixed(2), 'mm');
        console.log('[CreativeTemplate Debug] Estimated total height:', estimatedTotalHeight.toFixed(2), 'px (', pxToMm(estimatedTotalHeight).toFixed(2), 'mm)');
        console.log('[CreativeTemplate Debug] Estimated total pages:', estimatedPages);

        if (estimatedPages > contentPages) {
          console.warn('[CreativeTemplate Debug] ⚠️ WARNING: Spacer is creating extra page!');
          console.warn('[CreativeTemplate Debug] Content pages:', contentPages, ', Total pages:', estimatedPages);
          console.warn('[CreativeTemplate Debug] Spacer height:', pxToMm(spacerHeight).toFixed(2), 'mm, Remaining on last page:', remainingOnLastPage.toFixed(2), 'mm');

          // Dynamically adjust spacer if it would create new page
          if (spacerRef.current && pxToMm(spacerHeight) > remainingOnLastPage) {
            const safeSpacerHeight = Math.max(0, remainingOnLastPage - 10); // Leave 10mm buffer
            spacerRef.current.style.maxHeight = `${safeSpacerHeight}mm`;
            console.log('[CreativeTemplate Debug] ✅ Adjusted spacer max-height to:', safeSpacerHeight.toFixed(2), 'mm to prevent extra page');
          }
        } else {
          console.log('[CreativeTemplate Debug] ✅ Spacer is within safe limits');
        }
      }

      // Check for page breaks in print preview
      const printMedia = window.matchMedia('print');
      console.log('[CreativeTemplate Debug] Print media active:', printMedia.matches);
      console.log('[CreativeTemplate Debug] ============================');
    }
  }, [data]);

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

  // Font size mappings - Increased differences for more noticeable size changes
  const fontSizeMap = {
    small: {
      heading: '0.875rem',    // 14px
      base: '0.6875rem',      // 11px
      sm: '0.625rem',         // 10px
      xs: '0.5rem',           // 8px
      sectionHeading: '1rem', // 16px
      lg: '0.8125rem',        // 13px
      baseText: '0.625rem',   // 10px (reduced from 11px)
    },
    medium: {
      heading: '1.25rem',     // 20px (+6px from small)
      base: '0.9375rem',      // 15px (+4px from small)
      sm: '0.8125rem',        // 13px (+3px from small)
      xs: '0.6875rem',        // 11px (+3px from small)
      sectionHeading: '1.5rem', // 24px (+8px from small)
      lg: '1.125rem',         // 18px (+5px from small)
      baseText: '0.8125rem',  // 13px (reduced from 15px)
    },
    large: {
      heading: '1.625rem',    // 26px (+6px from medium)
      base: '1.1875rem',      // 19px (+4px from medium)
      sm: '1rem',             // 16px (+3px from medium)
      xs: '0.875rem',         // 14px (+3px from medium)
      sectionHeading: '2rem', // 32px (+8px from medium)
      lg: '1.4375rem',        // 23px (+5px from medium)
      baseText: '1rem',       // 16px (reduced from 19px)
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
          <div key="summary" className="mb-3">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-2 italic" style={{ fontSize: `calc(${personalInfoTitleSizes.sectionHeading} * 0.8)`, fontWeight: headingBold ? '900' : 'bold', color: personalInfoTitleColor }}>{t('resume.sections.aboutMe')}</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap" style={{ fontSize: personalInfoBodySizes.baseText, color: personalInfoBodyColor }}>{personalInfo.summary.trim()}</p>
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
                      <h3 className="font-bold mb-0.5" style={{ fontSize: workExperienceBodySizes.baseText, color: workExperienceStyling.bodyColor }}>{exp.position}</h3>
                      {/* Company/Location (left) and Date (right) on same line */}
                      <div className="flex justify-between items-center gap-4 mb-0.5">
                        <p className="font-semibold" style={{ fontSize: workExperienceBodySizes.baseText, color: workExperienceStyling.bodyColor }}>
                          {exp.company}{exp.location && ` • ${exp.location}`}
                        </p>
                        {(exp.startDate || exp.endDate) && (
                          <span className="whitespace-nowrap" style={{ fontSize: workExperienceBodySizes.xs, color: workExperienceStyling.bodyColor }}>
                            {formatDateRange(exp.startDate, exp.endDate, t('resume.fields.present'))}
                          </span>
                        )}
                      </div>
                      {((exp.responsibilities && exp.responsibilities.length > 0) || exp.description) && (
                        <ul className="space-y-0.5 mt-1.5" style={{ fontSize: workExperienceBodySizes.baseText, color: workExperienceStyling.bodyColor }}>
                          {exp.responsibilities && exp.responsibilities.length > 0
                            ? exp.responsibilities.map((resp, i) => (
                              resp.responsibility && (
                                <li key={i} className="flex gap-2">
                                  <span className="font-bold" style={{ color: workExperienceStyling.bodyColor }}>•</span>
                                  <span className="flex-1">{resp.responsibility}</span>
                                </li>
                              )
                            ))
                            : exp.description?.split('\n').filter(line => line.trim()).map((line, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="font-bold" style={{ color: workExperienceStyling.bodyColor }}>•</span>
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
                              <span key={i} className="px-2 py-0.5 rounded" style={{ fontSize: sizes.xs, color: workExperienceStyling.bodyColor, backgroundColor: `${workExperienceStyling.bodyColor}20` }}>
                                {typeof tech === 'string' ? tech : tech.technology}
                              </span>
                            )
                          ))}
                        </div>
                      )}
                      {exp.competencies && exp.competencies.length > 0 && (
                        <p className="mt-1.5" style={{ fontSize: sizes.xs, color: workExperienceStyling.bodyColor }}>
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
                      <h3 className="font-bold mb-0.5" style={{ fontSize: educationBodySizes.baseText, color: educationStyling.bodyColor }}>{edu.degree}</h3>
                      {/* Institution/Location (left) and Date (right) on same line */}
                      <div className="flex justify-between items-center gap-4 mb-0.5">
                        <p style={{ fontSize: educationBodySizes.baseText, color: educationStyling.bodyColor }}>
                          {edu.institution}{edu.location && ` • ${edu.location}`}
                        </p>
                        {(edu.startDate || edu.endDate) && (
                          <span className="whitespace-nowrap" style={{ fontSize: educationBodySizes.xs, color: educationStyling.bodyColor }}>
                            {formatDateRange(edu.startDate, edu.endDate, t('resume.fields.present'))}
                          </span>
                        )}
                      </div>
                      {edu.field && <p className="italic" style={{ fontSize: educationBodySizes.baseText, color: educationStyling.bodyColor }}>{edu.field}</p>}
                      {edu.keyCourses && edu.keyCourses.length > 0 && (
                        <p className="mt-0.5" style={{ fontSize: sizes.xs, color: educationStyling.bodyColor }}>
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
                        <h3 className="font-bold flex-1" style={{ fontSize: projectsBodySizes.baseText, color: projectsStyling.bodyColor }}>{proj.name}</h3>
                        {(proj.startDate || proj.endDate) && (
                          <span className="whitespace-nowrap" style={{ fontSize: projectsBodySizes.xs, color: projectsStyling.bodyColor }}>
                            {formatDateRange(proj.startDate, proj.endDate, t('resume.fields.present'))}
                          </span>
                        )}
                      </div>
                      {proj.description && (
                        <p className="mt-0.5" style={{ fontSize: projectsBodySizes.baseText, color: projectsStyling.bodyColor }}>{proj.description}</p>
                      )}
                      {proj.highlights && proj.highlights.length > 0 && (
                        <ul className="space-y-0.5 mt-1" style={{ fontSize: projectsBodySizes.baseText, color: projectsStyling.bodyColor }}>
                          {proj.highlights.map((highlight, i) => (
                            highlight.highlight && (
                              <li key={i} className="flex gap-2">
                                <span className="font-bold" style={{ color: projectsStyling.bodyColor }}>•</span>
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
                              <span key={i} className="px-2 py-0.5 rounded" style={{ fontSize: sizes.xs, color: projectsStyling.bodyColor, backgroundColor: `${projectsStyling.bodyColor}20` }}>
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
                      <h3 className="font-bold mb-0.5" style={{ color: certificatesStyling.bodyColor }}>{cert.name}</h3>
                      {/* Organization (left) and Date (right) on same line */}
                      <div className="flex justify-between items-center gap-4 mb-0.5">
                        <p style={{ fontSize: certificatesBodySizes.baseText, color: certificatesStyling.bodyColor }}>{cert.organization}</p>
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
                    <span key={index} className="px-2 py-1 rounded font-bold" style={{ fontSize: skillsBodySizes.xs, color: skillsStyling.bodyColor, backgroundColor: `${skillsStyling.bodyColor}15` }}>
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
                    <div key={index} className="p-2 rounded-lg" style={{ backgroundColor: `${languagesStyling.bodyColor}15` }}>
                      <p className="font-bold" style={{ color: languagesStyling.bodyColor }}>{lang.language}</p>
                      <p style={{ fontSize: languagesBodySizes.xs, color: languagesStyling.bodyColor }}>{lang.proficiency}</p>
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
              <p className="text-foreground" style={{ fontSize: personalInfoBodySizes.baseText, color: personalInfoBodyColor }}>{personalInfo.interests.map(i => i.interest).filter(Boolean).join(", ")}</p>
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
          /* Ensure pages fill to A4 height in preview too */
          min-height: 297mm;
          display: flex;
          flex-direction: column;
        }
        /* Constrain spacer in preview mode too */
        .resume-page-container > div[aria-hidden="true"] {
          flex: 1 1 0;
          min-height: 0;
          max-height: 50mm;
          overflow: hidden;
        }
        @media print {
          /* Hide photo placeholders in print/PDF */
          .photo-placeholder {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 0;
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
            background: var(--pdf-background, hsl(var(--background))) !important;
            width: 210mm;
            margin: 0 auto;
            display: block;
            /* Remove min-height - let content flow naturally */
          }
          /* Hide spacer div in PDF - it causes empty pages */
          .resume-page-container > div[aria-hidden="true"] {
            display: none !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
          /* Remove spacer div styling - we'll use padding on container instead */
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

        {/* Removed spacer div - using padding-bottom approach instead */}

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
