import { CVFormData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
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

  // Render icon with text - more compact version
  const renderIconText = (Icon: any, text: string | undefined, url?: string) => {
    if (!text) return null;
    
    const content = (
      <div className="flex items-center gap-1 mb-0.5">
        <Icon className="h-2.5 w-2.5 text-foreground flex-shrink-0" />
        <span className="text-[10px] text-foreground truncate" style={{ lineHeight: '1.3' }}>
          {text}
        </span>
      </div>
    );
    
    if (url && (url.startsWith('http') || url.startsWith('mailto'))) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 block">
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
              <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.projects').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
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
                  <div key={index} className="flex gap-2 text-[10px]">
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground text-[9px]">
                      {dateRange}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground text-[10px]">{proj.name}</h3>
                        {proj.link && (
                          <a 
                            href={proj.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:underline flex-shrink-0 text-[8px] truncate max-w-[120px]"
                          >
                            {proj.link.replace(/^https?:\/\//, '').substring(0, 25)}
                          </a>
                        )}
                      </div>
                      {proj.description && (
                        <p className="text-foreground mb-0.5 leading-snug break-words text-[10px]">
                          {proj.description}
                        </p>
                      )}
                      {technologies && (
                        <p className="text-muted-foreground text-[8px] font-mono">
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
              <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.education').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <div className="space-y-1.5">
              {education.map((edu, index) => {
                if (!edu.degree && !edu.institution) return null;
                
                const dateRange = formatDateRangeLatex(edu.startDate, edu.endDate);
                
                return (
                  <div key={index} className="flex gap-2 text-[10px]">
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground text-[9px]">
                      {dateRange}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground text-[10px]">{edu.degree || ''}</h3>
                        <span className="text-[10px] font-bold text-foreground flex-shrink-0">
                          {edu.institution || ''}
                        </span>
                      </div>
                      {edu.field && (
                        <p className="text-foreground leading-snug break-words text-[10px]">{edu.field}</p>
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
              <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.experience').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
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
                  <div key={index} className="flex gap-2 text-[10px]">
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground text-[9px]">
                      {dateRange}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground text-[10px]">{exp.position || ''}</h3>
                        <span className="text-[10px] font-bold text-foreground flex-shrink-0">
                          {exp.company || ''}
                        </span>
                      </div>
                      {responsibilities.length > 0 && (
                        <ul className="text-foreground space-y-0.5 mt-0.5 mb-0.5 list-none pl-0">
                          {responsibilities.map((resp, i) => (
                            <li key={i} className="flex gap-1">
                              <span className="text-foreground flex-shrink-0 text-[10px]">•</span>
                              <span className="flex-1 break-words text-[10px] leading-snug">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {technologies.length > 0 && (
                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                          {technologies.map((tech, i) => (
                            <span key={i} className="text-[8px] font-mono text-muted-foreground bg-muted/50 px-1 py-0.5 rounded">
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
          <div key="certificates" className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.certifications').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <div className="space-y-1.5">
              {certificates.map((cert, index) => {
                if (!cert.name) return null;
                
                const dateRange = formatDateRangeLatex(cert.issueDate, cert.expirationDate);
                
                return (
                  <div key={index} className="flex gap-2 text-[10px]">
                    <div className="w-[13%] flex-shrink-0 text-muted-foreground text-[9px]">
                      {dateRange || cert.issueDate || ''}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground text-[10px]">{cert.name}</h3>
                        <span className="text-[10px] font-bold text-foreground flex-shrink-0">
                          {cert.organization || ''}
                        </span>
                      </div>
                      {cert.credentialId && (
                        <p className="text-muted-foreground text-[8px]">ID: {cert.credentialId}</p>
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
              <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.languages').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <div className="pl-[15%] text-[10px]">
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
          <div key="interests" className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                {t('resume.sections.interests').toUpperCase()}
              </h2>
              <div className="flex-1 border-t border-foreground"></div>
            </div>
            <p className="text-[10px] text-foreground pl-[15%]">
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
    <div className="bg-background text-foreground p-4 max-w-[1280px] mx-auto" style={{ fontFamily: 'sans-serif' }}>
      {/* Header: More compact layout */}
      <div className="flex items-start mb-2 gap-3">
        <div className="flex items-start gap-2 flex-shrink-0">
          {/* Profile image - smaller */}
          {personalInfo.profileImage && (
            <div className="flex-shrink-0">
              <div className="w-16 h-16 overflow-hidden rounded-sm border border-foreground">
                <img 
                  src={personalInfo.profileImage} 
                  alt={`${fullName} profile picture`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          )}
          
          <div className="flex-shrink-0">
            {fullName && (
              <h1 className="text-lg font-bold text-foreground uppercase mb-0 leading-tight">
                {fullName}
              </h1>
            )}
            {professionalTitle && (
              <p className="text-sm text-foreground mt-0.5 leading-tight">{professionalTitle}</p>
            )}
          </div>
        </div>
        
        {/* Contact info - more compact, stacked layout */}
        <div className="flex gap-2 flex-1 ml-auto justify-end">
          <div className="flex-shrink-0 min-w-[110px]">
            {personalInfo.website && renderIconText(Globe, personalInfo.website, personalInfo.website)}
            {personalInfo.phone && renderIconText(Phone, personalInfo.phone)}
            {personalInfo.location && renderIconText(MapPin, personalInfo.location)}
          </div>
          
          <div className="flex-shrink-0 min-w-[150px]">
            {personalInfo.email && renderIconText(Mail, personalInfo.email, `mailto:${personalInfo.email}`)}
            {personalInfo.github && renderIconText(Github, personalInfo.github, personalInfo.github)}
            {personalInfo.linkedin && renderIconText(Linkedin, personalInfo.linkedin, personalInfo.linkedin)}
          </div>
        </div>
      </div>

      {/* Summary and Skills - better responsive layout */}
      {(personalInfo.summary || (skills && skills.length > 0 && skills.some(s => s.skill))) && (
        <div className="mb-2">
          {/* Summary - full width if both exist, otherwise keep as is */}
          {personalInfo.summary && personalInfo.summary.trim() && (
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                  {t('resume.sections.summary').toUpperCase()}
                </h2>
                <div className="flex-1 border-t border-foreground"></div>
              </div>
              <p className="text-[10px] text-foreground leading-relaxed break-words whitespace-pre-wrap" style={{ lineHeight: '1.4' }}>
                {personalInfo.summary.trim()}
              </p>
            </div>
          )}
          
          {/* Skills - full width */}
          {skills && skills.length > 0 && skills.some(s => s.skill) && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-[11px] font-bold text-foreground uppercase tracking-wide flex-shrink-0">
                  {t('resume.sections.skills').toUpperCase()}
                </h2>
                <div className="flex-1 border-t border-foreground"></div>
              </div>
              <div className="text-[10px]">
                <div className="flex gap-2">
                  <span className="font-bold text-foreground flex-shrink-0" style={{ minWidth: '50px' }}>Skills:</span>
                  <span className="text-foreground flex-1 break-words" style={{ lineHeight: '1.4' }}>
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
    </div>
  );
};