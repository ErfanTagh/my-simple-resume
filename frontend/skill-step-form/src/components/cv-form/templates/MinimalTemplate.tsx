import { CVFormData } from "../types";
import { formatDateRange } from "@/lib/dateFormatter";
import { useLanguage } from "@/contexts/LanguageContext";

interface MinimalTemplateProps {
  data: CVFormData;
}

export const MinimalTemplate = ({ data }: MinimalTemplateProps) => {
  const { t } = useLanguage();
  const { personalInfo, workExperience, education, projects, certificates, languages, skills, sectionOrder } = data;
  
  const defaultOrder = ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"];
  const orderedSections = sectionOrder || defaultOrder;

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        return personalInfo.summary && personalInfo.summary.trim() ? (
          <div key="summary" className="mb-8">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{personalInfo.summary.trim()}</p>
          </div>
        ) : null;

      case "workExperience":
        return workExperience.some(exp => exp.position || exp.company) ? (
          <div key="workExperience" className="mb-8">
            <h2 className="text-xs font-bold mb-4 text-foreground uppercase tracking-widest">{t('resume.sections.experience').toUpperCase()}</h2>
            <div className="space-y-5">
              {workExperience.map((exp, index) => (
                (exp.position || exp.company) && (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-semibold text-foreground">{exp.position}</h3>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-xs text-muted-foreground">
                          {formatDateRange(exp.startDate, exp.endDate)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{exp.company}</p>
                    {((exp.responsibilities && exp.responsibilities.length > 0) || exp.description) && (
                      <ul className="text-xs text-foreground space-y-1 mt-2">
                        {exp.responsibilities && exp.responsibilities.length > 0 
                          ? exp.responsibilities.map((resp, i) => (
                              resp.responsibility && (
                                <li key={i} className="flex gap-2">
                                  <span className="text-muted-foreground">•</span>
                                  <span className="flex-1">{resp.responsibility}</span>
                                </li>
                              )
                            ))
                          : exp.description?.split('\n').filter(line => line.trim()).map((line, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-muted-foreground">•</span>
                                <span className="flex-1">{line.trim()}</span>
                              </li>
                            ))
                        }
                      </ul>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        return education.some(edu => edu.degree || edu.institution) ? (
          <div key="education" className="mb-8">
            <h2 className="text-xs font-bold mb-4 text-foreground uppercase tracking-widest">{t('resume.sections.education').toUpperCase()}</h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                (edu.degree || edu.institution) && (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-semibold text-foreground">{edu.degree}</h3>
                      {(edu.startDate || edu.endDate) && (
                        <span className="text-xs text-muted-foreground">
                          {formatDateRange(edu.startDate, edu.endDate)}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{edu.institution}</p>
                    {edu.field && <p className="text-xs text-muted-foreground">{edu.field}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        return projects.some(proj => proj.name) ? (
          <div key="projects" className="mb-8">
            <h2 className="text-xs font-bold mb-4 text-foreground uppercase tracking-widest">{t('resume.sections.projects').toUpperCase()}</h2>
            <div className="space-y-4">
              {projects.map((proj, index) => (
                proj.name && (
                  <div key={index} className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">{proj.name}</h3>
                    {proj.description && (
                      <ul className="text-xs text-foreground space-y-1 mt-1">
                        {proj.description.split('\n').filter(line => line.trim()).map((line, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span className="flex-1">{line.trim()}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('resume.sections.technologies')}: {proj.technologies.map(techItem => techItem.technology).filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "certificates":
        return certificates.some(cert => cert.name) ? (
          <div key="certificates" className="mb-8">
            <h2 className="text-xs font-bold mb-4 text-foreground uppercase tracking-widest">{t('resume.sections.certifications').toUpperCase()}</h2>
            <div className="space-y-3">
              {certificates.map((cert, index) => (
                cert.name && (
                  <div key={index}>
                    <h3 className="text-sm font-semibold text-foreground">{cert.name}</h3>
                    <p className="text-xs text-muted-foreground">{cert.organization}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        return skills.some(s => s.skill) ? (
          <div key="skills" className="mb-8">
            <h2 className="text-xs font-bold mb-4 text-foreground uppercase tracking-widest">{t('resume.sections.skills').toUpperCase()}</h2>
            <p className="text-xs text-foreground leading-relaxed">
              {skills.filter(s => s.skill).map(s => s.skill).join(", ")}
            </p>
          </div>
        ) : null;

      case "languages":
        return languages.some(lang => lang.language) ? (
          <div key="languages" className="mb-8">
            <h2 className="text-xs font-bold mb-4 text-foreground uppercase tracking-widest">{t('resume.sections.languages').toUpperCase()}</h2>
            <div className="space-y-1">
              {languages.map((lang, index) => (
                lang.language && (
                  <div key={index} className="text-xs text-foreground flex justify-between items-center gap-4 pr-2">
                    <span>{lang.language}</span>
                    <span className="text-muted-foreground whitespace-nowrap flex-shrink-0">— {lang.proficiency}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "interests":
        return personalInfo.interests && personalInfo.interests.length > 0 && personalInfo.interests.some(i => i.interest) ? (
          <div key="interests" className="mb-8">
            <h2 className="text-xs font-bold mb-4 text-foreground uppercase tracking-widest">{t('resume.sections.interests').toUpperCase()}</h2>
            <p className="text-xs text-foreground leading-relaxed">{personalInfo.interests.map(i => i.interest).filter(Boolean).join(", ")}</p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="bg-background text-foreground p-12 max-w-3xl mx-auto font-minimal">
      {/* Ultra-minimal header */}
      <div className="mb-10">
        <div className="flex items-start gap-6 mb-4">
          <div className="flex-1">
        <h1 className="text-xl font-bold text-foreground mb-1 tracking-tight">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-3">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span className="truncate max-w-[200px]">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
          {personalInfo.github && <span className="truncate max-w-[200px]">{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>}
          {personalInfo.website && <span className="truncate max-w-[200px]">{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>}
            </div>
          </div>
          
          {/* Profile image */}
          {personalInfo.profileImage && (
            <div className="flex-shrink-0">
              <div className="w-20 h-20">
                <img 
                  src={personalInfo.profileImage} 
                  alt={`${personalInfo.firstName} ${personalInfo.lastName} profile`}
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sections with maximum whitespace */}
      <div>
        {orderedSections.map(section => renderSection(section))}
      </div>
    </div>
  );
};
