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
  
  // Font size mappings - Creative uses text-2xl (24px), text-lg (18px), text-base (16px), text-sm (14px), text-xs (12px)
  const fontSizeMap = {
    small: {
      heading: '1.125rem',  // 18px (text-lg)
      base: '0.875rem',     // 14px (text-sm)
      sm: '0.75rem',        // 12px (text-xs)
      xs: '0.625rem',       // 10px
      sectionHeading: '1.375rem', // 22px
    },
    medium: {
      heading: '1.5rem',    // 24px (text-2xl)
      base: '1rem',         // 16px (text-base)
      sm: '0.875rem',       // 14px (text-sm)
      xs: '0.75rem',        // 12px (text-xs)
      sectionHeading: '1.5rem', // 24px
      lg: '1.125rem',       // 18px (text-lg)
    },
    large: {
      heading: '1.875rem',  // 30px
      base: '1.125rem',     // 18px
      sm: '1rem',           // 16px
      xs: '0.875rem',       // 14px
      sectionHeading: '1.875rem', // 30px
      lg: '1.375rem',       // 22px
    },
  };
  
  const sizes = fontSizeMap[fontSize];

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        return personalInfo.summary && personalInfo.summary.trim() ? (
          <div key="summary" className="mb-6">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-3 italic" style={{ fontSize: sizes.sectionHeading, fontWeight: headingBold ? '900' : 'bold', color: headingColor }}>{t('resume.sections.aboutMe')}</h2>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap" style={{ fontSize: sizes.sm, color: textColor }}>{personalInfo.summary.trim()}</p>
            </div>
          </div>
        ) : null;

      case "workExperience":
        return workExperience.some(exp => exp.position || exp.company) ? (
          <div key="workExperience" className="mb-6">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-4 italic" style={{ fontSize: sizes.sectionHeading, fontWeight: headingBold ? '900' : 'bold', color: headingColor }}>{t('resume.sections.experience')}</h2>
              <div className="space-y-5">
                {workExperience.map((exp, index) => (
                  (exp.position || exp.company) && (
                    <div key={index} className="relative">
                      <div className="absolute -left-[26px] w-3 h-3 rounded-full bg-primary"></div>
                      <h3 className="font-bold text-foreground" style={{ fontSize: sizes.lg }}>{exp.position}</h3>
                      <p className="font-semibold" style={{ fontSize: sizes.base, color: headingColor }}>{exp.company}{exp.location && ` • ${exp.location}`}</p>
                      {(exp.startDate || exp.endDate) && (
                        <p className="text-muted-foreground mt-1" style={{ fontSize: sizes.xs }}>
                          {formatDateRange(exp.startDate, exp.endDate, t('resume.fields.present'))}
                        </p>
                      )}
                      {((exp.responsibilities && exp.responsibilities.length > 0) || exp.description) && (
                        <ul className="text-muted-foreground space-y-1 mt-2" style={{ fontSize: sizes.sm }}>
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
                        <div className="flex flex-wrap gap-1 mt-2">
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
                        <p className="text-muted-foreground mt-2" style={{ fontSize: sizes.xs }}>
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
          <div key="education" className="mb-6">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-4 italic" style={{ fontSize: sizes.sectionHeading, fontWeight: headingBold ? '900' : 'bold', color: headingColor }}>{t('resume.sections.education')}</h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  (edu.degree || edu.institution) && (
                    <div key={index} className="relative">
                      <div className="absolute -left-[26px] w-3 h-3 rounded-full bg-primary"></div>
                      <h3 className="text-lg font-bold text-foreground">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground">{edu.institution}{edu.location && ` • ${edu.location}`}</p>
                      {edu.field && <p className="text-sm text-muted-foreground italic">{edu.field}</p>}
                      {edu.keyCourses && edu.keyCourses.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
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
          <div key="projects" className="mb-6">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="text-2xl font-black mb-4 text-primary italic">{t('resume.sections.projects')}</h2>
              <div className="space-y-4">
                {projects.map((proj, index) => (
                  proj.name && (
                    <div key={index} className="relative">
                      <div className="absolute -left-[26px] w-3 h-3 rounded-full bg-primary"></div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-foreground" style={{ fontSize: sizes.lg }}>{proj.name}</h3>
                        {(proj.startDate || proj.endDate) && (
                          <span className="text-muted-foreground" style={{ fontSize: sizes.xs }}>
                            {formatDateRange(proj.startDate, proj.endDate, t('resume.fields.present'))}
                          </span>
                        )}
                      </div>
                      {proj.description && (
                        <p className="text-muted-foreground mt-1" style={{ fontSize: sizes.sm }}>{proj.description}</p>
                      )}
                      {proj.highlights && proj.highlights.length > 0 && (
                        <ul className="text-muted-foreground space-y-1 mt-1" style={{ fontSize: sizes.sm }}>
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
                        <div className="flex flex-wrap gap-1 mt-2">
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
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="hover:underline mt-2 block" style={{ fontSize: sizes.xs, color: linkColor }}>
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
          <div key="certificates" className="mb-6">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-4 italic" style={{ fontSize: sizes.sectionHeading, fontWeight: headingBold ? '900' : 'bold', color: headingColor }}>{t('resume.sections.certifications')}</h2>
              <div className="space-y-3">
                {certificates.map((cert, index) => (
                  cert.name && (
                    <div key={index} className="relative">
                      <div className="absolute -left-[26px] w-3 h-3 rounded-full bg-primary"></div>
                      <h3 className="font-bold text-foreground">{cert.name}</h3>
                      <p className="text-muted-foreground" style={{ fontSize: sizes.sm }}>{cert.organization}</p>
                      {(cert.issueDate || cert.expirationDate) && (
                        <p className="text-muted-foreground mt-1" style={{ fontSize: sizes.xs }}>
                          {cert.issueDate} {cert.expirationDate && `- ${cert.expirationDate}`}
                        </p>
                      )}
                      {cert.credentialId && (
                        <p className="text-muted-foreground" style={{ fontSize: sizes.xs }}>ID: {cert.credentialId}</p>
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
          </div>
        ) : null;

      case "skills":
        return skills.some(s => s.skill) ? (
          <div key="skills" className="mb-6">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-4 italic" style={{ fontSize: sizes.sectionHeading, fontWeight: headingBold ? '900' : 'bold', color: headingColor }}>{t('resume.sections.skills')}</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, index) => (
                  s.skill && (
                    <span key={index} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold shadow-md" style={{ fontSize: sizes.sm }}>
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
          <div key="languages" className="mb-6">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-4 italic" style={{ fontSize: sizes.sectionHeading, fontWeight: headingBold ? '900' : 'bold', color: headingColor }}>{t('resume.sections.languages')}</h2>
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang, index) => (
                  lang.language && (
                    <div key={index} className="bg-primary/5 p-3 rounded-lg">
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
          <div key="interests" className="mb-6">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="font-black mb-3 italic" style={{ fontSize: sizes.sectionHeading, fontWeight: headingBold ? '900' : 'bold', color: headingColor }}>{t('resume.sections.interests')}</h2>
              <p className="text-foreground" style={{ fontSize: sizes.sm, color: textColor }}>{personalInfo.interests.map(i => i.interest).filter(Boolean).join(", ")}</p>
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
      <div className="resume-page-container bg-gradient-to-br from-background to-primary/5 text-foreground p-8 max-w-4xl mx-auto font-creative" style={{ fontFamily: `"${fontFamily}", ui-sans-serif, system-ui, sans-serif` }}>
      {/* Bold creative header */}
      <div className="mb-8">
        <div className="flex items-start gap-6 mb-4">
          <div className="flex-1">
            <h1 className="font-black mb-2 italic tracking-tight" style={{ fontSize: '3rem', fontWeight: titleBold ? '900' : 'bold', color: titleColor }}>
              {personalInfo.firstName}
            </h1>
            <h1 className="font-black mb-2 italic tracking-tight" style={{ fontSize: '3rem', fontWeight: titleBold ? '900' : 'bold', color: headingColor }}>
              {personalInfo.lastName}
            </h1>
            {personalInfo.professionalTitle && personalInfo.professionalTitle.trim().length > 0 && (
              <p className="font-bold mb-4 italic" style={{ fontSize: '1.25rem', color: headingColor }}>{personalInfo.professionalTitle.trim()}</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-muted-foreground mt-4" style={{ fontSize: sizes.sm }}>
          {personalInfo.email && (
            <div className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full">
              <Mail className="h-4 w-4 text-primary" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full">
              <Phone className="h-4 w-4 text-primary" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full min-w-0 max-w-fit">
              <Linkedin className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate" style={{ fontSize: sizes.xs }}>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full min-w-0 max-w-fit">
              <Github className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate" style={{ fontSize: sizes.xs }}>{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full min-w-0 max-w-fit">
              <Globe className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate" style={{ fontSize: sizes.xs }}>{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
            </div>
          </div>
          
          {/* Profile image */}
          {personalInfo.profileImage ? (
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-lg border-4 border-primary shadow-lg overflow-hidden">
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
            <div className="flex-shrink-0 w-28 h-28 rounded-lg border-4 border-primary shadow-lg bg-muted flex items-center justify-center photo-placeholder">
              <span className="text-xs text-muted-foreground">Photo</span>
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
