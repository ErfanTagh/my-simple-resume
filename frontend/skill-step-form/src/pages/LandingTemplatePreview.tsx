import { CVFormData } from "@/components/cv-form/types";
import { ModernTemplate } from "@/components/cv-form/templates/ModernTemplate";
import { ClassicTemplate } from "@/components/cv-form/templates/ClassicTemplate";
import { CreativeTemplate } from "@/components/cv-form/templates/CreativeTemplate";
import { MinimalTemplate } from "@/components/cv-form/templates/MinimalTemplate";
import { LatexTemplate } from "@/components/cv-form/templates/LatexTemplate";
import { StarRoverTemplate } from "@/components/cv-form/templates/StarRoverTemplate";

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
    summary:
      "Experienced software engineer with 8+ years building scalable web applications. Expertise in React, Node.js, and cloud architecture. Passionate about creating efficient, maintainable code and leading high-performing development teams. Strong background in full-stack development, system design, and DevOps practices.",
    profileImage: "",
    website: "alexmartinez.dev",
    interests: [
      { interest: "Open Source Contribution" },
      { interest: "Tech Blogging" },
      { interest: "Hiking" },
      { interest: "Photography" },
      { interest: "Reading" },
    ],
  },
  workExperience: [
    {
      position: "Senior Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      startDate: "2020-01",
      endDate: "Present",
      description:
        "Led development of scalable web applications serving millions of users. Reduced API response time by 50%. Architected microservices infrastructure handling 10M+ daily requests. Mentored team of 5 junior developers and established coding standards.",
      technologies: [
        { technology: "React" },
        { technology: "Node.js" },
        { technology: "AWS" },
        { technology: "PostgreSQL" },
        { technology: "Docker" },
        { technology: "Kubernetes" },
      ],
      competencies: [
        { competency: "Team Leadership" },
        { competency: "System Design" },
        { competency: "Agile Methodology" },
      ],
    },
    {
      position: "Software Engineer",
      company: "StartupXYZ",
      location: "Remote",
      startDate: "2018-06",
      endDate: "2019-12",
      description:
        "Built and maintained web applications using modern technologies. Improved performance by 40%. Implemented CI/CD pipelines reducing deployment time by 60%. Collaborated with cross-functional teams to deliver features on time.",
      technologies: [
        { technology: "JavaScript" },
        { technology: "Python" },
        { technology: "Django" },
        { technology: "Redis" },
        { technology: "Git" },
      ],
      competencies: [
        { competency: "Full-Stack Development" },
      ],
    },
    {
      position: "Junior Developer",
      company: "WebSolutions Inc",
      location: "New York, NY",
      startDate: "2016-07",
      endDate: "2018-05",
      description:
        "Developed responsive web applications using React and Node.js. Fixed critical bugs improving system stability. Participated in code reviews and agile development processes.",
      technologies: [
        { technology: "React" },
        { technology: "Node.js" },
        { technology: "MongoDB" },
        { technology: "Express" },
      ],
      competencies: [],
    },
    {
      position: "Intern Software Developer",
      company: "LocalTech Solutions",
      location: "Berkeley, CA",
      startDate: "2015-06",
      endDate: "2016-05",
      description:
        "Assisted in developing web features and maintaining codebase. Learned best practices in software development and contributed to team projects.",
      technologies: [
        { technology: "HTML" },
        { technology: "CSS" },
        { technology: "JavaScript" },
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
        { course: "Operating Systems" },
        { course: "Software Engineering" },
        { course: "Machine Learning" },
      ],
    },
  ],
  projects: [
    {
      name: "E-Commerce Platform",
      description:
        "Built scalable e-commerce platform with payment integration. Handles 10K+ daily transactions. Implemented real-time inventory management and automated order processing system.",
      technologies: [
        { technology: "React" },
        { technology: "Node.js" },
        { technology: "MongoDB" },
        { technology: "Stripe API" },
        { technology: "Redis" },
      ],
      startDate: "2023-01",
      endDate: "2023-06",
      link: "",
    },
    {
      name: "Task Management API",
      description:
        "Developed RESTful API for task management system. Supports real-time collaboration features and integrates with third-party services.",
      technologies: [
        { technology: "Python" },
        { technology: "FastAPI" },
        { technology: "PostgreSQL" },
        { technology: "WebSockets" },
      ],
      startDate: "2022-03",
      endDate: "2022-08",
      link: "",
    },
    {
      name: "Mobile Fitness App",
      description:
        "Created cross-platform mobile application for fitness tracking with social features. Integrated with health APIs and implemented push notifications.",
      technologies: [
        { technology: "React Native" },
        { technology: "Firebase" },
        { technology: "Redux" },
      ],
      startDate: "2021-09",
      endDate: "2022-02",
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
    {
      name: "Google Cloud Professional",
      organization: "Google Cloud",
      issueDate: "2021-11",
      expirationDate: "",
      credentialId: "",
      url: "",
    },
    {
      name: "Certified Kubernetes Administrator",
      organization: "Cloud Native Computing Foundation",
      issueDate: "2021-08",
      expirationDate: "",
      credentialId: "",
      url: "",
    },
    {
      name: "MongoDB Certified Developer",
      organization: "MongoDB University",
      issueDate: "2020-12",
      expirationDate: "",
      credentialId: "",
      url: "",
    },
  ],
  languages: [
    { language: "English", proficiency: "Native" },
    { language: "Spanish", proficiency: "Fluent" },
    { language: "French", proficiency: "Conversational" },
  ],
  skills: [
    { skill: "JavaScript" },
    { skill: "TypeScript" },
    { skill: "React" },
    { skill: "Node.js" },
    { skill: "Python" },
    { skill: "Java" },
    { skill: "AWS" },
    { skill: "Docker" },
    { skill: "Kubernetes" },
    { skill: "PostgreSQL" },
    { skill: "MongoDB" },
    { skill: "Git" },
    { skill: "CI/CD" },
    { skill: "Microservices" },
  ],
  sectionOrder: ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"],
};

interface LandingTemplatePreviewProps {
  templateName: "modern" | "classic" | "creative" | "minimal" | "latex" | "starRover";
}

export const LandingTemplatePreview = ({
  templateName,
}: LandingTemplatePreviewProps) => {
  const data: CVFormData = {
    ...sampleData,
    template: templateName,
  };

  // Scale factor to fit in the preview card (aspect ratio 3:4)
  // Templates are typically A4 size, so we scale down significantly
  const scale = 0.24;

  return (
    <div
      className="w-full h-full overflow-hidden bg-white relative"
      style={{ imageRendering: "crisp-edges", backfaceVisibility: "hidden" }}
    >
      <div
        className="origin-top-left absolute top-0 left-0"
        style={{
          transform: `scale(${scale})`,
          width: `${100 / scale}%`,
          height: `${100 / scale}%`,
          minHeight: `${100 / scale}%`,
          transformOrigin: "top left",
          willChange: "transform",
        }}
      >
        <div style={{ minHeight: '1400px', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: '100%' }}>
            {templateName === "modern" && <ModernTemplate data={data} />}
            {templateName === "classic" && <ClassicTemplate data={data} />}
            {templateName === "creative" && <CreativeTemplate data={data} />}
            {templateName === "minimal" && <MinimalTemplate data={data} />}
            {templateName === "latex" && <LatexTemplate data={data} />}
            {templateName === "starRover" && <StarRoverTemplate data={data} />}
          </div>
        </div>
      </div>
    </div>
  );
};
