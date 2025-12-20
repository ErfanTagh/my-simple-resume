import { CVFormData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { formatDateRange } from "@/lib/dateFormatter";
import { useLanguage } from "@/contexts/LanguageContext";

interface LatexTemplateProps {
  data: CVFormData;
}

export const LatexTemplate = ({ data }: LatexTemplateProps) => {
  const { t } = useLanguage();
  const { personalInfo, workExperience, education, projects, certificates, languages, skills, sectionOrder } = data;
  
  const defaultOrder = ["summary", "skills", "projects", "education", "workExperience", "certificates", "languages", "interests"];
  const orderedSections = sectionOrder || defaultOrder;

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

  // Render icon with text
  const renderIconText = (Icon: any, text: string | undefined, url?: string) => {
    if (!text) return null;
    
    const content = (
      <div className="flex items-start gap-1.5 mb-1">
        <Icon className="h-3 w-3 text-foreground flex-shrink-0 mt-0.5" />
        <span className="text-xs text-foreground break-all flex-1 min-w-0" style={{ wordBreak: 'break-all', lineHeight: '1.4' }}>
          {text}
        </span>
      </div>
    );
    
    if (url && (url.startsWith('http') || url.startsWith('mailto'))) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80">
          {content}
        </a>
      );
    }
    
    return content;
  };

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        // Summary is rendered in a combined section with skills
        return null;

      case "skills":
        // Skills is rendered in a combined section with summary
        return null;

      case "projects":
        return projects && projects.length > 0 && projects.some(proj => proj.name) ? (
          <div key="projects" className="mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.projects').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <div className="space-y-2">
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
                  <div key={index} className="flex gap-3 text-xs">
                    <div className="w-[15%] flex-shrink-0 text-muted-foreground">
                      {dateRange}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{proj.name}</h3>
                        {proj.link && (
                          <a 
                            href={proj.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:underline flex-shrink-0 text-[10px]"
                          >
                            {proj.link.replace(/^https?:\/\//, '').substring(0, 30)}
                          </a>
                        )}
                      </div>
                      {proj.description && (
                        <p className="text-foreground mb-1 leading-relaxed break-words">
                          {proj.description}
                        </p>
                      )}
                      {technologies && (
                        <p className="text-muted-foreground text-[10px] font-mono">
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
          <div key="education" className="mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.education').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <div className="space-y-2">
              {education.map((edu, index) => {
                if (!edu.degree && !edu.institution) return null;
                
                const dateRange = formatDateRangeLatex(edu.startDate, edu.endDate);
                
                return (
                  <div key={index} className="flex gap-3 text-xs">
                    <div className="w-[15%] flex-shrink-0 text-muted-foreground">
                      {dateRange}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{edu.degree || ''}</h3>
                        <span className="text-xs font-bold text-foreground flex-shrink-0">
                          {edu.institution || ''}
                        </span>
                      </div>
                      {edu.field && (
                        <p className="text-foreground leading-relaxed break-words">{edu.field}</p>
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
          <div key="workExperience" className="mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.experience').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <div className="space-y-3">
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
                  <div key={index} className="flex gap-3 text-xs">
                    <div className="w-[15%] flex-shrink-0 text-muted-foreground">
                      {dateRange}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{exp.position || ''}</h3>
                        <span className="text-xs font-bold text-foreground flex-shrink-0">
                          {exp.company || ''}
                        </span>
                      </div>
                      {responsibilities.length > 0 && (
                        <ul className="text-foreground space-y-0.5 mt-1 mb-1 list-none pl-0">
                          {responsibilities.map((resp, i) => (
                            <li key={i} className="flex gap-1.5">
                              <span className="text-foreground flex-shrink-0">•</span>
                              <span className="flex-1 break-words">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {technologies.map((tech, i) => (
                            <span key={i} className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
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
          <div key="certificates" className="mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.certifications').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <div className="space-y-2">
              {certificates.map((cert, index) => {
                if (!cert.name) return null;
                
                const dateRange = formatDateRangeLatex(cert.issueDate, cert.expirationDate);
                
                return (
                  <div key={index} className="flex gap-3 text-xs">
                    <div className="w-[15%] flex-shrink-0 text-muted-foreground">
                      {dateRange || cert.issueDate || ''}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-bold text-foreground">{cert.name}</h3>
                        <span className="text-xs font-bold text-foreground flex-shrink-0">
                          {cert.organization || ''}
                        </span>
                      </div>
                      {cert.credentialId && (
                        <p className="text-muted-foreground text-[10px]">ID: {cert.credentialId}</p>
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
          <div key="languages" className="mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.languages').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <div className="pl-[18%] text-xs">
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
          <div key="interests" className="mb-4">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.interests').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <p className="text-xs text-foreground pl-[18%]">
              {personalInfo.interests.filter(i => i.interest).map(i => i.interest).join(', ')}
            </p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim();
  const professionalTitle = personalInfo.professionalTitle || '';

  return (
    <div className="bg-background text-foreground p-5 max-w-4xl mx-auto" style={{ fontFamily: 'sans-serif', fontSize: '0.875rem' }}>
      {/* Header: Name/Title on left, Contact info on right */}
      <div className="flex items-start mb-3 gap-4">
        <div className="flex items-start gap-3 flex-shrink-0">
          {/* Profile image */}
          {personalInfo.profileImage && (
            <div className="flex-shrink-0">
              <div className="w-20 h-20 overflow-hidden rounded-sm border border-foreground">
                <img 
                  src={personalInfo.profileImage} 
                  alt={`${fullName} profile`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
          
          <div className="flex-shrink-0">
            {fullName && (
              <h1 className="text-xl font-bold text-foreground uppercase mb-0.5 leading-tight">
                {fullName}
              </h1>
            )}
            {professionalTitle && (
              <p className="text-base text-foreground mt-0.5 leading-tight">{professionalTitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex gap-3 flex-shrink-0 ml-auto">
          {/* First column of contact info */}
          <div className="flex-shrink-0" style={{ minWidth: '140px' }}>
            {personalInfo.website && renderIconText(Globe, personalInfo.website, personalInfo.website)}
            {personalInfo.phone && renderIconText(Phone, personalInfo.phone)}
            {personalInfo.location && renderIconText(MapPin, personalInfo.location)}
          </div>
          
          {/* Second column of contact info */}
          <div className="flex-shrink-0" style={{ minWidth: '200px' }}>
            {personalInfo.email && renderIconText(Mail, personalInfo.email, `mailto:${personalInfo.email}`)}
            {personalInfo.github && renderIconText(Github, personalInfo.github, personalInfo.github)}
            {personalInfo.linkedin && renderIconText(Linkedin, personalInfo.linkedin, personalInfo.linkedin)}
          </div>
        </div>
      </div>

      {/* Summary and Skills in two columns */}
      {(personalInfo.summary || (skills && skills.length > 0 && skills.some(s => s.skill))) && (
        <div className="flex gap-4 mb-3">
          {/* Summary column */}
          {personalInfo.summary && (
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <h2 className="text-xs font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                  {t('resume.sections.summary').toUpperCase()}
                </h2>
                <div className="flex-1 border-t border-foreground"></div>
              </div>
              <p className="text-xs text-foreground leading-relaxed break-words" style={{ lineHeight: '1.5' }}>
                {personalInfo.summary}
              </p>
            </div>
          )}
          
          {/* Skills column */}
          {skills && skills.length > 0 && skills.some(s => s.skill) && (
            <div className={`${personalInfo.summary ? 'flex-1' : 'w-full'}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <h2 className="text-xs font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                  {t('resume.sections.skills').toUpperCase()}
                </h2>
                <div className="flex-1 border-t border-foreground"></div>
              </div>
              <div className="text-xs">
                <div className="flex gap-2">
                  <span className="font-bold text-foreground flex-shrink-0" style={{ minWidth: '60px' }}>Skills:</span>
                  <span className="text-foreground flex-1 break-words" style={{ lineHeight: '1.5' }}>
                    {skills.filter(s => s.skill).map(s => s.skill).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Other sections */}
      <div className="space-y-1">
        {orderedSections
          .filter(section => section !== 'summary' && section !== 'skills')
          .map(section => renderSection(section))}
      </div>
    </div>
  );
};

