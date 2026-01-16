import { CVFormData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar } from "lucide-react";
import { formatDateRange } from "@/lib/dateFormatter";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClassicTemplateProps {
  data: CVFormData;
}

export const ClassicTemplate = ({ data }: ClassicTemplateProps) => {
  const { t } = useLanguage();
  const { personalInfo, workExperience, education, projects, certificates, languages, skills, sectionOrder } = data;
  
  const defaultOrder = ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"];
  const orderedSections = sectionOrder || defaultOrder;

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        return personalInfo.summary && personalInfo.summary.trim() ? (
          <div key="summary" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">{t('resume.sections.summary').toUpperCase()}</h2>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{personalInfo.summary.trim()}</p>
          </div>
        ) : null;

      case "workExperience":
        return workExperience.some(exp => exp.position || exp.company) ? (
          <div key="workExperience" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">{t('resume.sections.workExperience').toUpperCase()}</h2>
            <div className="space-y-3">
              {workExperience.map((exp, index) => (
                (exp.position || exp.company) && (
                  <div key={index}>
                    <h3 className="font-semibold text-foreground">{exp.position}</h3>
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="italic text-muted-foreground">{exp.company}</span>
                        {exp.location && <span className="text-xs text-muted-foreground ml-2">• {exp.location}</span>}
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-xs text-muted-foreground">
                          {formatDateRange(exp.startDate, exp.endDate, t('resume.fields.present'))}
                        </span>
                      )}
                    </div>
                    {((exp.responsibilities && exp.responsibilities.length > 0) || exp.description) && (
                      <ul className="text-sm text-foreground space-y-1 mt-2">
                        {exp.responsibilities && exp.responsibilities.length > 0 
                          ? exp.responsibilities.map((resp, i) => (
                              resp.responsibility && (
                                <li key={i} className="flex gap-2">
                                  <span className="text-primary">•</span>
                                  <span className="flex-1">{resp.responsibility}</span>
                                </li>
                              )
                            ))
                          : exp.description?.split('\n').filter(line => line.trim()).map((line, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-primary">•</span>
                                <span className="flex-1">{line.trim()}</span>
                              </li>
                            ))
                        }
                      </ul>
                    )}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
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
          <div key="education" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">{t('resume.sections.education').toUpperCase()}</h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                (edu.degree || edu.institution) && (
                  <div key={index}>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="italic text-muted-foreground">{edu.institution}</span>
                        {edu.location && <span className="text-xs text-muted-foreground ml-2">• {edu.location}</span>}
                      </div>
                      {(edu.startDate || edu.endDate) && (
                        <span className="text-xs text-muted-foreground">
                          {formatDateRange(edu.startDate, edu.endDate, t('resume.fields.present'))}
                        </span>
                      )}
                    </div>
                    {edu.field && <p className="text-sm text-muted-foreground">{edu.field}</p>}
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
        ) : null;

      case "projects":
        return projects.some(proj => proj.name) ? (
          <div key="projects" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">{t('resume.sections.projects').toUpperCase()}</h2>
            <div className="space-y-3">
              {projects.map((proj, index) => (
                proj.name && (
                  <div key={index}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-foreground">{proj.name}</h3>
                      {(proj.startDate || proj.endDate) && (
                        <span className="text-xs text-muted-foreground">
                          {formatDateRange(proj.startDate, proj.endDate, t('resume.fields.present'))}
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-sm text-foreground mt-1">{proj.description}</p>
                    )}
                    {proj.highlights && proj.highlights.length > 0 && (
                      <ul className="text-sm text-foreground space-y-1 mt-1">
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
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('resume.sections.technologies')}: {proj.technologies.map(techItem => techItem.technology).filter(Boolean).join(", ")}
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
          <div key="certificates" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">{t('resume.sections.certifications').toUpperCase()}</h2>
            <div className="space-y-2">
              {certificates.map((cert, index) => (
                cert.name && (
                  <div key={index}>
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
                )
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        return skills.some(s => s.skill) ? (
          <div key="skills" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">{t('resume.sections.skills').toUpperCase()}</h2>
            <p className="text-sm text-foreground">
              {skills.filter(s => s.skill).map(s => s.skill).join(" • ")}
            </p>
          </div>
        ) : null;

      case "languages":
        return languages.some(lang => lang.language) ? (
          <div key="languages" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">{t('resume.sections.languages').toUpperCase()}</h2>
            <div className="space-y-1">
              {languages.map((lang, index) => (
                lang.language && (
                  <div key={index} className="text-sm text-foreground flex justify-between items-center gap-4 pr-2">
                    <span className="font-semibold">{lang.language}</span>
                    <span className="text-muted-foreground whitespace-nowrap flex-shrink-0">- {lang.proficiency}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "interests":
        return personalInfo.interests && personalInfo.interests.length > 0 && personalInfo.interests.some(i => i.interest) ? (
          <div key="interests" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">{t('resume.sections.interests').toUpperCase()}</h2>
            <p className="text-sm text-foreground">{personalInfo.interests.map(i => i.interest).filter(Boolean).join(", ")}</p>
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
      <div className="resume-page-container bg-background text-foreground p-8 max-w-3xl mx-auto font-classic">
      {/* Header - centered and traditional */}
      <div className="text-center mb-6 pb-4 border-b-2 border-foreground">
        {/* Profile image */}
        {personalInfo.profileImage && (
          <div className="flex justify-center mb-4">
            <div className="w-28 h-28 rounded-full border-2 border-foreground overflow-hidden flex-shrink-0">
                <img 
                  src={personalInfo.profileImage} 
                  alt={`Professional profile photo of ${personalInfo.firstName} ${personalInfo.lastName}${personalInfo.professionalTitle ? `, ${personalInfo.professionalTitle}` : ''}${personalInfo.location ? ` from ${personalInfo.location}` : ''}`}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: '50% 40%' }}
                  loading="lazy"
                />
            </div>
          </div>
        )}
        
        <h1 className="text-2xl font-bold text-foreground mb-2 uppercase tracking-wide">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.professionalTitle && personalInfo.professionalTitle.trim().length > 0 && (
          <p className="text-base text-muted-foreground font-normal mb-3 italic">{personalInfo.professionalTitle.trim()}</p>
        )}
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1 min-w-0">
              <Linkedin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate text-xs">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1 min-w-0">
              <Github className="h-3 w-3 flex-shrink-0" />
              <span className="truncate text-xs">{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1 min-w-0">
              <Globe className="h-3 w-3 flex-shrink-0" />
              <span className="truncate text-xs">{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sections - traditional single column */}
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
