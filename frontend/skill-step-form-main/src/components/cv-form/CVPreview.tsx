import { CVFormData } from "./types";
import { Card } from "@/components/ui/card";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Calendar } from "lucide-react";

interface CVPreviewProps {
  data: CVFormData;
}

export const CVPreview = ({ data }: CVPreviewProps) => {
  const { personalInfo, workExperience, education, projects, certificates, languages, skills } = data;

  return (
    <Card className="p-8 bg-background shadow-lg h-fit sticky top-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold text-foreground">
            {personalInfo.firstName || "First"} {personalInfo.lastName || "Last"}
          </h1>
          
          <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
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
          </div>

          <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
            {personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="h-3 w-3" />
                <span className="truncate max-w-[200px]">{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-1">
                <Github className="h-3 w-3" />
                <span className="truncate max-w-[200px]">{personalInfo.github}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                <span className="truncate max-w-[200px]">{personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {personalInfo.summary && (
          <div>
            <h2 className="text-lg font-semibold mb-2 text-foreground">Professional Summary</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {workExperience.some(exp => exp.position || exp.company) && (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-foreground">Work Experience</h2>
            <div className="space-y-4">
              {workExperience.map((exp, index) => (
                (exp.position || exp.company) && (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-foreground">{exp.position || "Position"}</h3>
                        <p className="text-sm text-muted-foreground">{exp.company || "Company"}</p>
                      </div>
                      {(exp.startDate || exp.endDate) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{exp.startDate} - {exp.endDate || "Present"}</span>
                        </div>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.some(edu => edu.degree || edu.institution) && (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-foreground">Education</h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                (edu.degree || edu.institution) && (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-foreground">{edu.degree || "Degree"}</h3>
                        <p className="text-sm text-muted-foreground">{edu.institution || "Institution"}</p>
                        {edu.field && <p className="text-sm text-muted-foreground italic">{edu.field}</p>}
                      </div>
                      {(edu.startDate || edu.endDate) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{edu.startDate} - {edu.endDate || "Present"}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.some(proj => proj.name) && (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-foreground">Projects</h2>
            <div className="space-y-4">
              {projects.map((proj, index) => (
                proj.name && (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-foreground">{proj.name}</h3>
                      {(proj.startDate || proj.endDate) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{proj.startDate} - {proj.endDate || "Present"}</span>
                        </div>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-sm text-muted-foreground">{proj.description}</p>
                    )}
                    {proj.technologies && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Technologies:</span> {proj.technologies}
                      </p>
                    )}
                    {proj.link && (
                      <a href={proj.link} className="text-xs text-primary hover:underline flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        View Project
                      </a>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {certificates.some(cert => cert.name) && (
          <div>
            <h2 className="text-lg font-semibold mb-3 text-foreground">Certificates</h2>
            <div className="space-y-3">
              {certificates.map((cert, index) => (
                cert.name && (
                  <div key={index} className="space-y-1">
                    <h3 className="font-semibold text-foreground">{cert.name}</h3>
                    {cert.organization && (
                      <p className="text-sm text-muted-foreground">{cert.organization}</p>
                    )}
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      {cert.issueDate && <span>Issued: {cert.issueDate}</span>}
                      {cert.expirationDate && <span>Expires: {cert.expirationDate}</span>}
                    </div>
                    {cert.credentialId && (
                      <p className="text-xs text-muted-foreground">ID: {cert.credentialId}</p>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.some(s => s.skill) && (
          <div>
            <h2 className="text-lg font-semibold mb-2 text-foreground">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, index) => (
                s.skill && (
                  <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                    {s.skill}
                  </span>
                )
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.some(lang => lang.language) && (
          <div>
            <h2 className="text-lg font-semibold mb-2 text-foreground">Languages</h2>
            <div className="flex flex-wrap gap-3 text-sm">
              {languages.map((lang, index) => (
                lang.language && (
                  <div key={index}>
                    <span className="font-medium text-foreground">{lang.language}</span>
                    {lang.proficiency && <span className="text-muted-foreground"> - {lang.proficiency}</span>}
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {personalInfo.interests && (
          <div>
            <h2 className="text-lg font-semibold mb-2 text-foreground">Interests & Hobbies</h2>
            <p className="text-sm text-muted-foreground">{personalInfo.interests}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
