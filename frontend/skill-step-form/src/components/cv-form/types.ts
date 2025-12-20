import { z } from "zod";

export const cvFormSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    professionalTitle: z.string().optional(),
    profileImage: z.string().optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().url("Please enter a valid URL (e.g., https://linkedin.com/in/yourprofile)").optional().or(z.literal("")),
    github: z.string().url("Please enter a valid URL (e.g., https://github.com/yourusername)").optional().or(z.literal("")),
    website: z.string().url("Please enter a valid URL (e.g., https://yourwebsite.com)").optional().or(z.literal("")),
    summary: z.string().optional(),
    interests: z.array(
      z.object({
        interest: z.string().optional(),
      })
    ).optional(),
  }),
  workExperience: z.array(
    z.object({
      position: z.string().optional(),
      company: z.string().optional(),
      location: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
      responsibilities: z.array(
        z.object({
          responsibility: z.string().optional(),
        })
      ).optional(),
      technologies: z.array(
        z.object({
          technology: z.string().optional(),
        })
      ).optional(),
      competencies: z.array(
        z.object({
          competency: z.string().optional(),
        })
      ).optional(),
    })
  ).optional(),
  education: z.array(
    z.object({
      degree: z.string().optional(),
      institution: z.string().optional(),
      location: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      field: z.string().optional(),
      keyCourses: z.array(
        z.object({
          course: z.string().optional(),
        })
      ).optional(),
    })
  ).optional(),
  projects: z.array(
    z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      highlights: z.array(
        z.object({
          highlight: z.string().optional(),
        })
      ).optional(),
      technologies: z.array(
        z.object({
          technology: z.string().optional(),  // 🔧 Changed to optional
        })
      ).optional(),  // 🔧 Made array optional
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    })
  ).optional(),
  certificates: z.array(
    z.object({
      name: z.string().optional(),
      organization: z.string().optional(),
      issueDate: z.string().optional(),
      expirationDate: z.string().optional(),
      credentialId: z.string().optional(),
      url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    })
  ).optional(),
  languages: z.array(
    z.object({
      language: z.string().optional(),  // 🔧 Changed to optional
      proficiency: z.string().optional(),  // 🔧 Changed to optional
    })
  ).optional(),  // 🔧 Made array optional
  skills: z.array(
    z.object({
      skill: z.string().optional(),  // 🔧 Changed to optional
    })
  ).optional(),  // 🔧 Made array optional
  sectionOrder: z.array(z.string()).optional(),
  template: z.enum(["modern", "classic", "minimal", "creative", "latex", "starRover"]).default("modern"),
});
export type CVFormData = z.infer<typeof cvFormSchema>;

export type CVTemplate = "modern" | "classic" | "minimal" | "creative" | "latex" | "starRover";
