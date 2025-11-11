import { z } from "zod";

export const cvFormSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    website: z.string().optional(),
    summary: z.string().optional(),
    interests: z.string().optional(),
  }),
  workExperience: z.array(
    z.object({
      position: z.string().min(1, "Position is required"),
      company: z.string().min(1, "Company is required"),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string().min(1, "Degree is required"),
      institution: z.string().min(1, "Institution is required"),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      field: z.string().optional(),
    })
  ),
  projects: z.array(
    z.object({
      name: z.string().min(1, "Project name is required"),
      description: z.string().min(1, "Project description is required"),
      technologies: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      link: z.string().optional(),
    })
  ),
  certificates: z.array(
    z.object({
      name: z.string().min(1, "Certificate name is required"),
      organization: z.string().min(1, "Organization is required"),
      issueDate: z.string().optional(),
      expirationDate: z.string().optional(),
      credentialId: z.string().optional(),
      url: z.string().optional(),
    })
  ),
  languages: z.array(
    z.object({
      language: z.string().min(1, "Language is required"),
      proficiency: z.string().min(1, "Proficiency is required"),
    })
  ),
  skills: z.array(
    z.object({
      skill: z.string().min(1, "Skill is required"),
    })
  ),
});

export type CVFormData = z.infer<typeof cvFormSchema>;
