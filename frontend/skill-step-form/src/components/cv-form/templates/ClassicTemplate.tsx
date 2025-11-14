import { CVFormData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar } from "lucide-react";
import { formatDateRange } from "@/lib/dateFormatter";

interface ClassicTemplateProps {
  data: CVFormData;
}

export const ClassicTemplate = ({ data }: ClassicTemplateProps) => {
  const { personalInfo, workExperience, education, projects, certificates, languages, skills, sectionOrder } = data;
  
  const defaultOrder = ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"];
  const orderedSections = sectionOrder || defaultOrder;

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        return personalInfo.summary ? (
          <div key="summary" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">Summary</h2>
            <p className="text-sm text-foreground leading-relaxed">{personalInfo.summary}</p>
          </div>
        ) : null;

      case "workExperience":
        return workExperience.some(exp => exp.position || exp.company) ? (
          <div key="workExperience" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">Work Experience</h2>
            <div className="space-y-3">
              {workExperience.map((exp, index) => (
                (exp.position || exp.company) && (
                  <div key={index}>
                    <h3 className="font-semibold text-foreground">{exp.position}</h3>
                    <div className="flex justify-between items-center text-sm">
                      <span className="italic text-muted-foreground">{exp.company}</span>
                      {(exp.startDate || exp.endDate) && (
                        <span className="text-xs text-muted-foreground">
                          {formatDateRange(exp.startDate, exp.endDate)}
                        </span>
                      )}
                    </div>
                    {exp.description && <p className="text-sm text-foreground mt-1">{exp.description}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        return education.some(edu => edu.degree || edu.institution) ? (
          <div key="education" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">Education</h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                (edu.degree || edu.institution) && (
                  <div key={index}>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <div className="flex justify-between items-center text-sm">
                      <span className="italic text-muted-foreground">{edu.institution}</span>
                      {(edu.startDate || edu.endDate) && (
                        <span className="text-xs text-muted-foreground">
                          {formatDateRange(edu.startDate, edu.endDate)}
                        </span>
                      )}
                    </div>
                    {edu.field && <p className="text-sm text-muted-foreground">{edu.field}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        return projects.some(proj => proj.name) ? (
          <div key="projects" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">Projects</h2>
            <div className="space-y-3">
              {projects.map((proj, index) => (
                proj.name && (
                  <div key={index}>
                    <h3 className="font-semibold text-foreground">{proj.name}</h3>
                    {proj.description && <p className="text-sm text-foreground">{proj.description}</p>}
                    {proj.technologies && <p className="text-xs text-muted-foreground mt-1">Technologies: {proj.technologies}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "certificates":
        return certificates.some(cert => cert.name) ? (
          <div key="certificates" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">Certifications</h2>
            <div className="space-y-2">
              {certificates.map((cert, index) => (
                cert.name && (
                  <div key={index}>
                    <h3 className="font-semibold text-foreground">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">{cert.organization}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "skills":
        return skills.some(s => s.skill) ? (
          <div key="skills" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">Skills</h2>
            <p className="text-sm text-foreground">
              {skills.filter(s => s.skill).map(s => s.skill).join(" • ")}
            </p>
          </div>
        ) : null;

      case "languages":
        return languages.some(lang => lang.language) ? (
          <div key="languages" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">Languages</h2>
            <div className="space-y-1">
              {languages.map((lang, index) => (
                lang.language && (
                  <p key={index} className="text-sm text-foreground">
                    <span className="font-semibold">{lang.language}</span> - {lang.proficiency}
                  </p>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "interests":
        return personalInfo.interests && personalInfo.interests.length > 0 && personalInfo.interests.some(i => i.interest) ? (
          <div key="interests" className="mb-5">
            <h2 className="text-base font-bold mb-2 text-foreground uppercase tracking-wide">Interests</h2>
            <p className="text-sm text-foreground">{personalInfo.interests.map(i => i.interest).filter(Boolean).join(", ")}</p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="bg-background text-foreground p-8 max-w-3xl mx-auto font-classic">
      {/* Header - centered and traditional */}
      <div className="text-center mb-6 pb-4 border-b-2 border-foreground">
        <h1 className="text-2xl font-bold text-foreground mb-3 uppercase tracking-wide">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        
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
    </div>
  );
};
