import { CVFormData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { formatDateRange } from "@/lib/dateFormatter";
import { useLanguage } from "@/contexts/LanguageContext";

interface CreativeTemplateProps {
  data: CVFormData;
}

export const CreativeTemplate = ({ data }: CreativeTemplateProps) => {
  const { t } = useLanguage();
  const { personalInfo, workExperience, education, projects, certificates, languages, skills, sectionOrder } = data;
  
  const defaultOrder = ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"];
  const orderedSections = sectionOrder || defaultOrder;

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        return personalInfo.summary && personalInfo.summary.trim() ? (
          <div key="summary" className="mb-6">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="text-2xl font-black mb-3 text-primary italic">{t('resume.sections.aboutMe')}</h2>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{personalInfo.summary.trim()}</p>
            </div>
          </div>
        ) : null;

      case "workExperience":
        return workExperience.some(exp => exp.position || exp.company) ? (
          <div key="workExperience" className="mb-6">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="text-2xl font-black mb-4 text-primary italic">{t('resume.sections.experience')}</h2>
              <div className="space-y-5">
                {workExperience.map((exp, index) => (
                  (exp.position || exp.company) && (
                    <div key={index} className="relative">
                      <div className="absolute -left-[26px] w-3 h-3 rounded-full bg-primary"></div>
                      <h3 className="text-lg font-bold text-foreground">{exp.position}</h3>
                      <p className="text-base font-semibold text-primary">{exp.company}{exp.location && ` • ${exp.location}`}</p>
                      {(exp.startDate || exp.endDate) && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDateRange(exp.startDate, exp.endDate)}
                        </p>
                      )}
                      {((exp.responsibilities && exp.responsibilities.length > 0) || exp.description) && (
                        <ul className="text-sm text-muted-foreground space-y-1 mt-2">
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
                              <span key={i} className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">
                                {typeof tech === 'string' ? tech : tech.technology}
                              </span>
                            )
                          ))}
                        </div>
                      )}
                      {exp.competencies && exp.competencies.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Power Skills: {exp.competencies.map(c => typeof c === 'string' ? c : c.competency).filter(Boolean).join(", ")}
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
              <h2 className="text-2xl font-black mb-4 text-primary italic">{t('resume.sections.education')}</h2>
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
                          Key Courses: {edu.keyCourses.map(c => typeof c === 'string' ? c : c.course).filter(Boolean).join(", ")}
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
                        <h3 className="text-lg font-bold text-foreground">{proj.name}</h3>
                        {(proj.startDate || proj.endDate) && (
                          <span className="text-xs text-muted-foreground">
                            {formatDateRange(proj.startDate, proj.endDate)}
                          </span>
                        )}
                      </div>
                      {proj.description && (
                        <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                          {proj.description.split('\n').filter(line => line.trim()).map((line, i) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-primary font-bold">•</span>
                              <span className="flex-1">{line.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {proj.highlights && proj.highlights.length > 0 && (
                        <ul className="text-sm text-muted-foreground space-y-1 mt-1">
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
                              <span key={i} className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">
                                {tech.technology}
                              </span>
                            )
                          ))}
                        </div>
                      )}
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-2 block">
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
              <h2 className="text-2xl font-black mb-4 text-primary italic">{t('resume.sections.certifications')}</h2>
              <div className="space-y-3">
                {certificates.map((cert, index) => (
                  cert.name && (
                    <div key={index} className="relative">
                      <div className="absolute -left-[26px] w-3 h-3 rounded-full bg-primary"></div>
                      <h3 className="font-bold text-foreground">{cert.name}</h3>
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
          </div>
        ) : null;

      case "skills":
        return skills.some(s => s.skill) ? (
          <div key="skills" className="mb-6">
            <div className="relative pl-6 border-l-4 border-primary">
              <h2 className="text-2xl font-black mb-4 text-primary italic">{t('resume.sections.skills')}</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, index) => (
                  s.skill && (
                    <span key={index} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-md">
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
              <h2 className="text-2xl font-black mb-4 text-primary italic">{t('resume.sections.languages')}</h2>
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang, index) => (
                  lang.language && (
                    <div key={index} className="bg-primary/5 p-3 rounded-lg">
                      <p className="font-bold text-foreground">{lang.language}</p>
                      <p className="text-sm text-muted-foreground">{lang.proficiency}</p>
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
              <h2 className="text-2xl font-black mb-3 text-primary italic">{t('resume.sections.interests')}</h2>
              <p className="text-sm text-foreground">{personalInfo.interests.map(i => i.interest).filter(Boolean).join(", ")}</p>
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-background to-primary/5 text-foreground p-8 max-w-4xl mx-auto font-creative">
      {/* Bold creative header */}
      <div className="mb-8">
        <div className="flex items-start gap-6 mb-4">
          <div className="flex-1">
            <h1 className="text-5xl font-black text-foreground mb-2 italic tracking-tight">
              {personalInfo.firstName}
            </h1>
            <h1 className="text-5xl font-black text-primary mb-2 italic tracking-tight">
              {personalInfo.lastName}
            </h1>
            {personalInfo.professionalTitle && personalInfo.professionalTitle.trim().length > 0 && (
              <p className="text-xl text-primary font-bold mb-4 italic">{personalInfo.professionalTitle.trim()}</p>
            )}
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4">
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
              <span className="truncate text-xs">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full min-w-0 max-w-fit">
              <Github className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate text-xs">{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2 bg-background/50 px-3 py-1 rounded-full min-w-0 max-w-fit">
              <Globe className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate text-xs">{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
            </div>
          </div>
          
          {/* Profile image */}
          {personalInfo.profileImage && (
            <div className="flex-shrink-0">
              <div className="w-28 h-28">
                <img 
                  src={personalInfo.profileImage} 
                  alt={`Professional profile photo of ${personalInfo.firstName} ${personalInfo.lastName}${personalInfo.professionalTitle ? `, ${personalInfo.professionalTitle}` : ''}${personalInfo.location ? ` from ${personalInfo.location}` : ''}`}
                  className="w-full h-full object-cover rounded-lg border-4 border-primary shadow-lg"
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sections with creative timeline */}
      <div>
        {orderedSections.map(section => renderSection(section))}
      </div>
    </div>
  );
};
