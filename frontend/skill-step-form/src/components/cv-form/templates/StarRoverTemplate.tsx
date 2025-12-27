import { CVFormData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { formatDateRange } from "@/lib/dateFormatter";
import { useLanguage } from "@/contexts/LanguageContext";

interface StarRoverTemplateProps {
  data: CVFormData;
}

const ACCENT_COLOR = "#141E61"; // Navy blue accent

export const StarRoverTemplate = ({ data }: StarRoverTemplateProps) => {
  const { t } = useLanguage();
  const { personalInfo, workExperience, education, projects, certificates, languages, skills, sectionOrder } = data;
  
  const defaultOrder = ["summary", "education", "workExperience", "projects", "certificates", "skills", "languages", "interests"];
  const orderedSections = sectionOrder || defaultOrder;

  // Helper to format date range for Star Rover style (MMM YYYY format)
  const formatDateRangeStar = (startDate: string | undefined, endDate: string | undefined): string => {
    if (!startDate && !endDate) return '';
    
    const formatDate = (dateStr: string | undefined): string => {
      if (!dateStr) return '';
      const match = dateStr.match(/^(\d{4})-(\d{2})$/);
      if (!match) return dateStr;
      const [, year, month] = match;
      const monthNum = parseInt(month, 10);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (monthNum < 1 || monthNum > 12) return dateStr;
      return `${monthNames[monthNum - 1]} ${year}`;
    };
    
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : t('resume.fields.present');
    
    if (!start && !end) return '';
    if (!start) return end;
    
    return `${start} -- ${end}`;
  };

  // Render contact info icon
  const renderContactIcon = (Icon: any, text: string | undefined, url?: string) => {
    if (!text) return null;
    
    const content = (
      <>
        <Icon className="h-3 w-3 text-muted-foreground inline mr-1.5" />
        {url && (url.startsWith('http') || url.startsWith('mailto')) ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:underline">
            {text.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}
          </a>
        ) : (
          <span className="text-muted-foreground">{text}</span>
        )}
      </>
    );
    
    return <span className="text-xs">{content}</span>;
  };

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        return personalInfo.summary && personalInfo.summary.trim() ? (
          <div key="summary" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
                <h2 className="text-sm font-bold uppercase tracking-wide px-2" style={{ color: ACCENT_COLOR }}>
                  {t('resume.sections.summary').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
              </div>
            </div>
            <p className="text-sm text-foreground leading-relaxed break-words whitespace-pre-wrap">{personalInfo.summary.trim()}</p>
          </div>
        ) : null;

      case "education":
        return education && education.length > 0 && education.some(edu => edu.degree || edu.institution) ? (
          <div key="education" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
                <h2 className="text-sm font-bold uppercase tracking-wide px-2" style={{ color: ACCENT_COLOR }}>
                  {t('resume.sections.education').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
              </div>
            </div>
            <div className="space-y-3">
              {education.map((edu, index) => {
                if (!edu.degree && !edu.institution) return null;
                
                const dateRange = formatDateRangeStar(edu.startDate, edu.endDate);
                const hasAux = edu.degree && edu.institution;
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
                        {edu.institution || edu.degree}
                        {hasAux && (
                          <span className="font-normal normal-case italic text-foreground">
                            {' | '}{edu.degree}
                          </span>
                        )}
                      </h3>
                      {dateRange && (
                        <span className="text-xs font-normal flex-shrink-0" style={{ color: ACCENT_COLOR }}>
                          {dateRange}
                        </span>
                      )}
                    </div>
                    {edu.field && (
                      <ul className="text-sm text-foreground space-y-0.5 mt-1 list-none pl-0">
                        <li className="break-words">{edu.field}</li>
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;

      case "workExperience":
        return workExperience && workExperience.length > 0 && workExperience.some(exp => exp.position || exp.company) ? (
          <div key="workExperience" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
                <h2 className="text-sm font-bold uppercase tracking-wide px-2" style={{ color: ACCENT_COLOR }}>
                  {t('resume.sections.experience').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
              </div>
            </div>
            <div className="space-y-3">
              {workExperience.map((exp, index) => {
                if (!exp.position && !exp.company) return null;
                
                const dateRange = formatDateRangeStar(exp.startDate, exp.endDate);
                const responsibilities = exp.responsibilities 
                  ? exp.responsibilities.filter(r => r.responsibility).map(r => r.responsibility!)
                  : exp.description 
                  ? exp.description.split('\n').filter(line => line.trim())
                  : [];
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
                        {exp.company || exp.position}
                      </h3>
                      {exp.location && (
                        <span className="text-xs font-normal flex-shrink-0" style={{ color: ACCENT_COLOR }}>
                          {exp.location}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h4 className="text-sm font-bold text-foreground">{exp.position || exp.company}</h4>
                      {dateRange && (
                        <span className="text-xs font-normal flex-shrink-0" style={{ color: ACCENT_COLOR }}>
                          {dateRange}
                        </span>
                      )}
                    </div>
                    {responsibilities.length > 0 && (
                      <ul className="text-sm text-foreground space-y-0.5 mt-1 list-none pl-0">
                        {responsibilities.map((resp, i) => (
                          <li key={i} className="break-words">• {resp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;

      case "projects":
        return projects && projects.length > 0 && projects.some(proj => proj.name) ? (
          <div key="projects" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
                <h2 className="text-sm font-bold uppercase tracking-wide px-2" style={{ color: ACCENT_COLOR }}>
                  {t('resume.sections.projects').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
              </div>
            </div>
            <div className="space-y-3">
              {projects.map((proj, index) => {
                if (!proj.name) return null;
                
                const dateRange = formatDateRangeStar(proj.startDate, proj.endDate);
                const technologies = proj.technologies 
                  ? proj.technologies
                      .map(t => typeof t === 'string' ? t : t.technology)
                      .filter(Boolean)
                      .join(', ')
                  : '';
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
                        {proj.name}
                        {proj.link && (
                          <span className="font-normal normal-case text-xs ml-2">
                            <a 
                              href={proj.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:underline"
                            >
                              {proj.link.replace(/^https?:\/\//, '').split('/')[0]}
                            </a>
                          </span>
                        )}
                      </h3>
                      {dateRange && (
                        <span className="text-xs font-normal flex-shrink-0" style={{ color: ACCENT_COLOR }}>
                          {dateRange}
                        </span>
                      )}
                    </div>
                    {proj.description && (
                      <ul className="text-sm text-foreground space-y-0.5 mt-1 list-none pl-0">
                        <li className="break-words">{proj.description}</li>
                      </ul>
                    )}
                    {technologies && (
                      <p className="text-xs text-muted-foreground mt-1 break-words">{technologies}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;

      case "certificates":
        return certificates && certificates.length > 0 && certificates.some(cert => cert.name) ? (
          <div key="certificates" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
                <h2 className="text-sm font-bold uppercase tracking-wide px-2" style={{ color: ACCENT_COLOR }}>
                  {t('resume.sections.certifications').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
              </div>
            </div>
            <div className="space-y-1">
              {certificates.map((cert, index) => {
                if (!cert.name) return null;
                
                const dateRange = formatDateRangeStar(cert.issueDate, cert.expirationDate);
                
                return (
                  <div key={index} className="flex justify-between items-start gap-2">
                    <span className="text-sm text-foreground break-words">{cert.name}, {cert.organization || ''}</span>
                    {dateRange && (
                      <span className="text-xs font-normal flex-shrink-0" style={{ color: ACCENT_COLOR }}>
                        {dateRange || cert.issueDate || ''}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null;

      case "skills":
        return skills && skills.length > 0 && skills.some(s => s.skill) ? (
          <div key="skills" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
                <h2 className="text-sm font-bold uppercase tracking-wide px-2" style={{ color: ACCENT_COLOR }}>
                  {t('resume.sections.skills').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
              </div>
            </div>
            <div className="text-sm text-foreground break-words">
              <span className="font-semibold">Technical: </span>
              {skills.filter(s => s.skill).map(s => s.skill).join(', ')}
            </div>
          </div>
        ) : null;

      case "languages":
        return languages && languages.length > 0 && languages.some(lang => lang.language) ? (
          <div key="languages" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
                <h2 className="text-sm font-bold uppercase tracking-wide px-2" style={{ color: ACCENT_COLOR }}>
                  {t('resume.sections.languages').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
              </div>
            </div>
            <div className="text-sm text-foreground break-words">
              <span className="font-semibold">Language: </span>
              {languages
                .filter(lang => lang.language)
                .map((lang, index, arr) => (
                  <span key={index}>
                    {lang.language}{lang.proficiency ? ` - ${lang.proficiency}` : ''}
                    {index < arr.length - 1 && ', '}
                  </span>
                ))}
            </div>
          </div>
        ) : null;

      case "interests":
        return personalInfo.interests && personalInfo.interests.length > 0 && personalInfo.interests.some(i => i.interest) ? (
          <div key="interests" className="mb-6">
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
                <h2 className="text-sm font-bold uppercase tracking-wide px-2" style={{ color: ACCENT_COLOR }}>
                  {t('resume.sections.interests').toUpperCase()}
                </h2>
                <div className="flex-1" style={{ borderTop: `1px solid ${ACCENT_COLOR}` }}></div>
              </div>
            </div>
            <div className="text-sm text-foreground break-words">
              <span className="font-semibold">Interests: </span>
              {personalInfo.interests.filter(i => i.interest).map(i => i.interest).join(', ')}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const fullName = `${personalInfo.firstName || ''} ${personalInfo.lastName || ''}`.trim().toUpperCase();

  return (
    <div className="bg-background text-foreground p-8 max-w-4xl mx-auto text-sm" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header: Large name in navy with optional photo */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-black mb-2" style={{ color: ACCENT_COLOR, letterSpacing: '0.02em' }}>
          {fullName || 'YOUR NAME'}
        </h1>
        {personalInfo.professionalTitle && personalInfo.professionalTitle.trim().length > 0 && (
          <p className="text-lg font-semibold mb-3" style={{ color: ACCENT_COLOR }}>
            {personalInfo.professionalTitle.trim().toUpperCase()}
          </p>
        )}
        
        {/* Profile photo centered beneath the name if provided */}
        {personalInfo.profileImage && (
          <div className="flex justify-center mb-3">
            <div className="w-24 h-24 md:w-28 md:h-28">
              <img 
                src={personalInfo.profileImage} 
                alt={`${fullName} profile picture`}
                className="w-full h-full object-cover rounded-md border-2"
                style={{ borderColor: ACCENT_COLOR }}
                loading="lazy"
              />
            </div>
          </div>
        )}
        
        {/* Contact info centered with icons */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          {personalInfo.phone && renderContactIcon(Phone, personalInfo.phone, `tel:${personalInfo.phone}`)}
          {personalInfo.email && renderContactIcon(Mail, personalInfo.email, `mailto:${personalInfo.email}`)}
          {personalInfo.github && renderContactIcon(Github, personalInfo.github, personalInfo.github)}
          {personalInfo.linkedin && renderContactIcon(Linkedin, personalInfo.linkedin, personalInfo.linkedin)}
          {personalInfo.website && renderContactIcon(Globe, personalInfo.website, personalInfo.website)}
          {personalInfo.location && renderContactIcon(MapPin, personalInfo.location)}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-1">
        {orderedSections.map(section => renderSection(section))}
      </div>
    </div>
  );
};

