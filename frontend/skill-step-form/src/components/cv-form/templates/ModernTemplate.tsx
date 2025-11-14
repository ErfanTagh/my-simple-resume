import { CVFormData } from "../types";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar } from "lucide-react";
import { formatDateRange } from "@/lib/dateFormatter";

interface ModernTemplateProps {
  data: CVFormData;
}

export const ModernTemplate = ({ data }: ModernTemplateProps) => {
  const { personalInfo, workExperience, education, projects, certificates, languages, skills, sectionOrder } = data;
  
  const defaultOrder = ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"];
  const orderedSections = sectionOrder || defaultOrder;

  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case "summary":
        return personalInfo.summary ? (
          <div key="summary" className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-primary border-b-2 border-primary pb-1">PROFESSIONAL SUMMARY</h2>
            <p className="text-sm text-foreground leading-relaxed">{personalInfo.summary}</p>
          </div>
        ) : null;

      case "workExperience":
        return workExperience.some(exp => exp.position || exp.company) ? (
          <div key="workExperience" className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-primary border-b-2 border-primary pb-1">EXPERIENCE</h2>
            <div className="space-y-4">
              {workExperience.map((exp, index) => (
                (exp.position || exp.company) && (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-bold text-foreground">{exp.position}</h3>
                        <p className="text-sm font-semibold text-primary">{exp.company}</p>
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDateRange(exp.startDate, exp.endDate)}</span>
                        </div>
                      )}
                    </div>
                    {exp.description && <p className="text-sm text-muted-foreground">{exp.description}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        return education.some(edu => edu.degree || edu.institution) ? (
          <div key="education" className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-primary border-b-2 border-primary pb-1">EDUCATION</h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                (edu.degree || edu.institution) && (
                  <div key={index}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-foreground">{edu.degree}</h3>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        {edu.field && <p className="text-sm text-muted-foreground italic">{edu.field}</p>}
                      </div>
                      {(edu.startDate || edu.endDate) && (
                        <span className="text-xs text-muted-foreground">{formatDateRange(edu.startDate, edu.endDate)}</span>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        return projects.some(proj => proj.name) ? (
          <div key="projects" className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-primary border-b-2 border-primary pb-1">PROJECTS</h2>
            <div className="space-y-3">
              {projects.map((proj, index) => (
                proj.name && (
                  <div key={index}>
                    <h3 className="font-bold text-foreground">{proj.name}</h3>
                    {proj.description && <p className="text-sm text-muted-foreground">{proj.description}</p>}
                    {proj.technologies && <p className="text-xs text-primary mt-1">Tech: {proj.technologies}</p>}
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "certificates":
        return certificates.some(cert => cert.name) ? (
          <div key="certificates" className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-primary border-b-2 border-primary pb-1">CERTIFICATIONS</h2>
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
          <div key="skills" className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-primary border-b-2 border-primary pb-1">SKILLS</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, index) => (
                s.skill && (
                  <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {s.skill}
                  </span>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "languages":
        return languages.some(lang => lang.language) ? (
          <div key="languages" className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-primary border-b-2 border-primary pb-1">LANGUAGES</h2>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang, index) => (
                lang.language && (
                  <div key={index} className="text-sm">
                    <span className="font-semibold text-foreground">{lang.language}</span>
                    <span className="text-muted-foreground"> - {lang.proficiency}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        ) : null;

      case "interests":
        return personalInfo.interests && personalInfo.interests.length > 0 && personalInfo.interests.some(i => i.interest) ? (
          <div key="interests" className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-primary border-b-2 border-primary pb-1">INTERESTS</h2>
            <p className="text-sm text-muted-foreground">{personalInfo.interests.map(i => i.interest).filter(Boolean).join(", ")}</p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="bg-background text-foreground p-8 max-w-4xl mx-auto">
      {/* Header with colored background */}
      <div className="bg-primary/5 -mx-8 -mt-8 px-8 py-6 mb-6 border-l-4 border-primary">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mt-3">
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2 min-w-0">
              <Linkedin className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate text-xs">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2 min-w-0">
              <Github className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate text-xs">{personalInfo.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="truncate text-xs">{personalInfo.website.replace(/^https?:\/\/(www\.)?/, '')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {orderedSections.map(section => renderSection(section))}
      </div>
    </div>
  );
};
