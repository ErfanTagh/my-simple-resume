import { CVFormData } from "@/components/cv-form/types";
import { ModernTemplate } from "@/components/cv-form/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/cv-form/templates/ClassicTemplate";
import { CreativeTemplate } from "@/components/cv-form/templates/CreativeTemplate";

// Sample data for preview - realistic resume data
const sampleData: CVFormData = {
  template: "modern",
  personalInfo: {
    firstName: "Alex",
    lastName: "Martinez",
    professionalTitle: "Senior Software Engineer",
    email: "alex.martinez@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexmartinez",
    github: "github.com/alexmartinez",
    summary: "Experienced software engineer with 8+ years building scalable web applications. Expertise in React, Node.js, and cloud architecture.",
    profileImage: "",
    website: "",
    interests: [],
  },
  workExperience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "2020-01",
      endDate: "Present",
      description: "Led development of scalable web applications serving millions of users. Reduced API response time by 50%.",
      technologies: [
        { technology: "React" },
        { technology: "Node.js" },
        { technology: "AWS" },
        { technology: "PostgreSQL" },
      ],
      competencies: [
        { competency: "Team Leadership" },
        { competency: "System Design" },
      ],
    },
    {
      position: "Software Engineer",
      company: "StartupXYZ",
      location: "Remote",
      startDate: "2018-06",
      endDate: "2019-12",
      description: "Built and maintained web applications using modern technologies. Improved performance by 40%.",
      technologies: [
        { technology: "JavaScript" },
        { technology: "Python" },
        { technology: "Django" },
      ],
      competencies: [],
    },
  ],
  education: [
    {
      degree: "Bachelor of Science in Computer Science",
      institution: "University of California",
      location: "Berkeley, CA",
      startDate: "2014",
      endDate: "2018",
      field: "Computer Science",
      keyCourses: [
        { course: "Data Structures" },
        { course: "Algorithms" },
        { course: "Database Systems" },
      ],
    },
  ],
  projects: [
    {
      name: "E-Commerce Platform",
      description: "Built scalable e-commerce platform with payment integration. Handles 10K+ daily transactions.",
      technologies: [
        { technology: "React" },
        { technology: "Node.js" },
        { technology: "MongoDB" },
      ],
      startDate: "2023-01",
      endDate: "2023-06",
      link: "",
    },
  ],
  certificates: [
    {
      name: "AWS Certified Developer",
      organization: "Amazon Web Services",
      issueDate: "2022-05",
      expirationDate: "",
      credentialId: "",
      url: "",
    },
  ],
  languages: [
    { language: "English", proficiency: "Native" },
    { language: "Spanish", proficiency: "Fluent" },
  ],
  skills: [
    { skill: "JavaScript" },
    { skill: "React" },
    { skill: "Node.js" },
    { skill: "Python" },
    { skill: "AWS" },
    { skill: "Docker" },
  ],
};

interface LandingTemplatePreviewProps {
  templateName: "modern" | "classic" | "creative";
}

export const LandingTemplatePreview = ({ templateName }: LandingTemplatePreviewProps) => {
  const data: CVFormData = {
    ...sampleData,
    template: templateName,
  };

  // Scale factor to fit in the preview card (aspect ratio 3:4)
  // Templates are typically A4 size, so we scale down significantly
  const scale = 0.32;

  return (
    <div className="w-full h-full overflow-hidden bg-white relative" style={{ imageRendering: 'crisp-edges', backfaceVisibility: 'hidden' }}>
      <div 
        className="origin-top-left"
        style={{ 
          transform: `scale(${scale})`,
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
          transformOrigin: 'top left',
          willChange: 'transform',
        }}
      >
        {templateName === "modern" && <ModernTemplate data={data} />}
        {templateName === "classic" && <ClassicTemplate data={data} />}
        {templateName === "creative" && <CreativeTemplate data={data} />}
      </div>
    </div>
  );
};

