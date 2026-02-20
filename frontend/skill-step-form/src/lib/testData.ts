  import { CVFormData } from "@/components/cv-form/types";

/**
 * Test Data Profiles for Resume Builder
 * 
 * These profiles help you quickly test different scenarios without manually filling forms.
 * Perfect for testing UI rendering, edge cases, and responsive design.
 * 
 * Usage: Select a profile from the dev dropdown in the CV form (only visible in development mode)
 */

export const testProfiles: Record<string, CVFormData> = {
  // ============================================
  // Profile 1: Minimal Data (Edge Case Testing)
  // ============================================ 
  minimal: {
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      professionalTitle: "",
      profileImage: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
      summary: "",
      interests: [],
    },
    workExperience: [],
    education: [],
    projects: [],
    certificates: [],
    languages: [{ language: "English", proficiency: "Native" }],
    skills: [{ skill: "JavaScript" }],
  },

  // ============================================
  // Profile 2: Maximal Data (Stress Test)
  // ============================================
  maximal: {
    personalInfo: {
      firstName: "Seyed Erfan",
      lastName: "Taghvaei",
      professionalTitle: "Senior Full-Stack Engineer & Cloud Architect",
      profileImage: "",
      email: "erfan.taghvaei@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA, USA",
      linkedin: "https://linkedin.com/in/erfantaghvaei",
      github: "https://github.com/erfantaghvaei",
      website: "https://erfantaghvaei.dev",
      summary: "Passionate software engineer with 10+ years of experience building scalable web applications and distributed systems. Expertise in React, Node.js, Python, Django, and cloud infrastructure (AWS, Docker, Kubernetes). Led cross-functional teams of 5-10 developers and successfully delivered 20+ production applications serving millions of users. Strong advocate for clean code, test-driven development, and continuous learning.",
      interests: [
        { interest: "Open Source Contributions" },
        { interest: "Machine Learning & AI" },
        { interest: "Technical Writing & Blogging" },
        { interest: "Rock Climbing" },
        { interest: "Photography" },
      ],
    },
    workExperience: [
      {
        position: "Senior Full-Stack Engineer",
        company: "TechGiant Inc.",
        location: "San Francisco, CA",
        startDate: "2020-01",
        endDate: "Present",
        description: "Led development of microservices architecture serving 5M+ daily active users. Reduced API response time by 60% through optimization and caching strategies. Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes. Mentored 5 junior developers and conducted code reviews. Designed and implemented real-time notification system using WebSockets and Redis.",
        technologies: [
          { technology: "React" },
          { technology: "TypeScript" },
          { technology: "Node.js" },
          { technology: "PostgreSQL" },
          { technology: "Redis" },
          { technology: "Docker" },
          { technology: "Kubernetes" },
          { technology: "AWS" },
        ],
        competencies: [
          { competency: "Team Leadership" },
          { competency: "System Architecture" },
          { competency: "Performance Optimization" },
        ],
      },
      {
        position: "Full-Stack Developer",
        company: "StartupXYZ",
        location: "Remote",
        startDate: "2018-03",
        endDate: "2019-12",
        description: "Built and scaled SaaS platform from 0 to 10,000 users. Implemented authentication, payment processing (Stripe), and analytics dashboard. Collaborated with design team to create responsive UI/UX. Reduced server costs by 40% through optimization.",
        technologies: [
          { technology: "React" },
          { technology: "Django" },
          { technology: "MongoDB" },
          { technology: "Stripe API" },
        ],
        competencies: [
          { competency: "Full-Stack Development" },
          { competency: "API Design" },
        ],
      },
      {
        position: "Backend Developer",
        company: "Enterprise Solutions Ltd.",
        location: "New York, NY",
        startDate: "2016-06",
        endDate: "2018-02",
        description: "Developed RESTful APIs for enterprise resource planning system. Integrated third-party services (payment gateways, CRM systems). Wrote comprehensive unit and integration tests achieving 90% code coverage. Participated in Agile/Scrum ceremonies.",
        technologies: [
          { technology: "Python" },
          { technology: "Django REST Framework" },
          { technology: "MySQL" },
          { technology: "Celery" },
        ],
        competencies: [
          { competency: "API Development" },
          { competency: "Test-Driven Development" },
        ],
      },
      {
        position: "Junior Software Engineer",
        company: "WebDev Agency",
        location: "Boston, MA",
        startDate: "2014-09",
        endDate: "2016-05",
        description: "Developed client websites using modern web technologies. Fixed bugs, added features, and improved performance. Learned best practices in version control (Git) and code collaboration.",
        technologies: [
          { technology: "JavaScript" },
          { technology: "jQuery" },
          { technology: "PHP" },
          { technology: "MySQL" },
        ],
        competencies: [
          { competency: "Web Development" },
          { competency: "Client Communication" },
        ],
      },
    ],
    education: [
      {
        degree: "Master of Science in Computer Science",
        institution: "Stanford University",
        location: "Stanford, CA",
        startDate: "2012",
        endDate: "2014",
        field: "Artificial Intelligence & Machine Learning",
        keyCourses: [
          { course: "Machine Learning" },
          { course: "Deep Learning" },
          { course: "Computer Vision" },
          { course: "Natural Language Processing" },
          { course: "Distributed Systems" },
        ],
      },
      {
        degree: "Bachelor of Science in Software Engineering",
        institution: "University of Tehran",
        location: "Tehran, Iran",
        startDate: "2008",
        endDate: "2012",
        field: "Software Engineering",
        keyCourses: [
          { course: "Data Structures & Algorithms" },
          { course: "Database Systems" },
          { course: "Operating Systems" },
          { course: "Software Architecture" },
        ],
      },
    ],
    projects: [
      {
        name: "Resume Builder Platform",
        description: "Full-stack web application for creating professional resumes. Features multi-step form, live preview, authentication, and PDF export. Built with React, Django, MongoDB, and Docker.",
        technologies: [
          { technology: "React" },
          { technology: "TypeScript" },
          { technology: "Django" },
          { technology: "MongoDB" },
          { technology: "Docker" },
        ],
        startDate: "2024-10",
        endDate: "Present",
        link: "https://github.com/erfantaghvaei/resume-builder",
      },
      {
        name: "E-Commerce Microservices",
        description: "Scalable microservices architecture for e-commerce platform. Implemented product catalog, shopping cart, payment processing, and order management services. Used event-driven architecture with Kafka.",
        technologies: [
          { technology: "Node.js" },
          { technology: "Kafka" },
          { technology: "PostgreSQL" },
          { technology: "Redis" },
          { technology: "Kubernetes" },
        ],
        startDate: "2023-01",
        endDate: "2023-08",
        link: "https://github.com/erfantaghvaei/ecommerce-microservices",
      },
      {
        name: "Real-Time Chat Application",
        description: "WebSocket-based chat application with rooms, private messages, and file sharing. Supports 1000+ concurrent users with minimal latency.",
        technologies: [
          { technology: "Socket.io" },
          { technology: "React" },
          { technology: "Node.js" },
          { technology: "MongoDB" },
        ],
        startDate: "2022-06",
        endDate: "2022-09",
        link: "https://github.com/erfantaghvaei/realtime-chat",
      },
    ],
    certificates: [
      {
        name: "AWS Certified Solutions Architect - Professional",
        organization: "Amazon Web Services",
        issueDate: "2023-06",
        expirationDate: "2026-06",
        credentialId: "AWS-PSA-12345",
        url: "https://www.credly.com/badges/example",
      },
      {
        name: "Certified Kubernetes Administrator (CKA)",
        organization: "Cloud Native Computing Foundation",
        issueDate: "2022-11",
        expirationDate: "2025-11",
        credentialId: "CKA-67890",
        url: "https://www.credly.com/badges/example-cka",
      },
      {
        name: "MongoDB Certified Developer",
        organization: "MongoDB University",
        issueDate: "2021-03",
        expirationDate: "",
        credentialId: "MONGO-DEV-54321",
        url: "https://university.mongodb.com/certification",
      },
      {
        name: "React Advanced Certification",
        organization: "Meta",
        issueDate: "2020-08",
        expirationDate: "",
        credentialId: "META-REACT-99999",
        url: "",
      },
    ],
    languages: [
      { language: "English", proficiency: "Fluent" },
      { language: "Persian (Farsi)", proficiency: "Native" },
      { language: "Spanish", proficiency: "Intermediate" },
      { language: "German", proficiency: "Basic" },
    ],
    skills: [
      { skill: "JavaScript" },
      { skill: "TypeScript" },
      { skill: "React" },
      { skill: "Vue.js" },
      { skill: "Node.js" },
      { skill: "Python" },
      { skill: "Django" },
      { skill: "PostgreSQL" },
      { skill: "MongoDB" },
      { skill: "Redis" },
      { skill: "Docker" },
      { skill: "Kubernetes" },
      { skill: "AWS" },
      { skill: "Git" },
      { skill: "CI/CD" },
      { skill: "REST APIs" },
      { skill: "GraphQL" },
      { skill: "Microservices" },
      { skill: "Agile/Scrum" },
      { skill: "System Design" },
    ],
  },

  // ============================================
  // Profile 3: Special Characters (i18n Testing)
  // ============================================
  specialChars: {
    personalInfo: {
      firstName: "José María",
      lastName: "García-Martínez",
      professionalTitle: "Développeur Full-Stack",
      profileImage: "",
      email: "jose.garcia@example.com",
      phone: "+34 612 345 678",
      location: "Barcelona, España",
      linkedin: "https://linkedin.com/in/jose-garcia",
      github: "https://github.com/josegarcia",
      website: "https://josé-garcía.es",
      summary: "Développeur passionné avec expertise en développement web moderne. 熟练掌握前端和后端技术. Специалист по веб-разработке. خبير في تطوير الويب.",
      interests: [
        { interest: "Café & Código" },
        { interest: "Montañismo" },
      ],
    },
    workExperience: [
      {
        position: "Ingénieur Logiciel",
        company: "Société Française Tech",
        location: "Paris, France",
        startDate: "2020-01",
        endDate: "Present",
        description: "Développement d'applications web avec React et Node.js. Travail avec équipes internationales. Gestion de projets complexes.",
        technologies: [
          { technology: "React" },
          { technology: "Node.js" },
          { technology: "MongoDB" },
        ],
        competencies: [],
      },
    ],
    education: [
      {
        degree: "Máster en Ingeniería Informática",
        institution: "Universidad Politécnica de Madrid",
        location: "Madrid, España",
        startDate: "2016",
        endDate: "2018",
        field: "Desarrollo de Software",
        keyCourses: [],
      },
    ],
    projects: [],
    certificates: [],
    languages: [
      { language: "Español", proficiency: "Nativo" },
      { language: "Français", proficiency: "Fluide" },
      { language: "English", proficiency: "Avancé" },
      { language: "中文", proficiency: "Básico" },
    ],
    skills: [
      { skill: "JavaScript" },
      { skill: "React" },
      { skill: "Node.js" },
    ],
  },

  // ============================================
  // Profile 4: Long Text Overflow (UI Testing)
  // ============================================
  longText: {
    personalInfo: {
      firstName: "Alexander",
      lastName: "Montgomery-Wellington",
      professionalTitle: "Senior Distinguished Principal Staff Software Engineering Architect Lead",
      profileImage: "",
      email: "alexander.montgomery.wellington.iii@verylongdomainname.example.com",
      phone: "+1 (555) 123-4567 ext. 9999",
      location: "San Francisco Bay Area, California, United States of America",
      linkedin: "https://linkedin.com/in/alexander-montgomery-wellington-iii-senior-software-engineer",
      github: "https://github.com/alexander-montgomery-wellington",
      website: "https://www.alexander-montgomery-wellington-portfolio.example.com",
      summary: "Highly motivated and results-driven software engineering professional with extensive experience in full-stack development, cloud architecture, distributed systems, microservices, and enterprise-level application development. Proven track record of leading cross-functional teams, mentoring junior developers, implementing best practices, optimizing performance, reducing costs, and delivering high-quality software solutions that exceed client expectations. Passionate about continuous learning, innovation, and staying up-to-date with the latest technologies and industry trends. Excellent communication skills, strong problem-solving abilities, and a collaborative team player who thrives in fast-paced, agile environments.",
      interests: [
        { interest: "Building Scalable Distributed Systems with High Availability" },
        { interest: "Contributing to Open Source Projects and Community Initiatives" },
        { interest: "Learning New Programming Languages and Frameworks" },
      ],
    },
    workExperience: [
      {
        position: "Senior Distinguished Principal Staff Software Engineering Architect",
        company: "Extremely Long Corporation Name Technologies International Ltd.",
        location: "San Francisco Bay Area, California",
        startDate: "2020-01",
        endDate: "Present",
        description: "Led the architecture and development of a highly scalable, fault-tolerant, distributed microservices platform that processes billions of transactions daily with 99.99% uptime. Implemented advanced caching strategies using Redis and Memcached, reducing database load by 80% and improving response times from 2 seconds to 200 milliseconds. Designed and deployed containerized applications using Docker and Kubernetes across multiple AWS regions with automatic failover and disaster recovery. Collaborated with product managers, designers, and stakeholders to define requirements, create technical specifications, and deliver features on time and within budget. Mentored 15+ junior and mid-level engineers, conducted code reviews, and established coding standards and best practices. Implemented comprehensive monitoring and alerting systems using Prometheus, Grafana, and ELK stack. Reduced infrastructure costs by 40% through optimization and resource management.",
        technologies: [
          { technology: "JavaScript" },
          { technology: "TypeScript" },
          { technology: "React" },
          { technology: "Node.js" },
          { technology: "Python" },
          { technology: "Django" },
          { technology: "PostgreSQL" },
          { technology: "MongoDB" },
          { technology: "Redis" },
          { technology: "RabbitMQ" },
          { technology: "Docker" },
          { technology: "Kubernetes" },
          { technology: "AWS" },
          { technology: "Terraform" },
        ],
        competencies: [
          { competency: "Enterprise Architecture" },
          { competency: "Team Leadership" },
          { competency: "Mentoring" },
        ],
      },
    ],
    education: [
      {
        degree: "Doctor of Philosophy (Ph.D.) in Computer Science and Engineering",
        institution: "Massachusetts Institute of Technology - Cambridge Campus",
        location: "Cambridge, Massachusetts, United States",
        startDate: "2015",
        endDate: "2020",
        field: "Distributed Systems, Artificial Intelligence, and Machine Learning",
        keyCourses: [
          { course: "Advanced Algorithms and Data Structures" },
          { course: "Distributed Systems and Cloud Computing" },
          { course: "Machine Learning and Deep Neural Networks" },
        ],
      },
    ],
    projects: [
      {
        name: "Enterprise-Grade Microservices Platform with Service Mesh Architecture",
        description: "Designed and implemented a comprehensive microservices platform serving over 10 million users worldwide with advanced features including service discovery, load balancing, circuit breakers, distributed tracing, centralized logging, metrics collection, and automated deployment pipelines. The system handles peak loads of 100,000 requests per second with sub-100ms latency and maintains 99.99% uptime through sophisticated monitoring and auto-scaling mechanisms.",
        technologies: [
          { technology: "Kubernetes" },
          { technology: "Istio" },
          { technology: "Envoy" },
          { technology: "Prometheus" },
          { technology: "Grafana" },
        ],
        startDate: "2023-01",
        endDate: "Present",
        link: "https://github.com/username/extremely-long-microservices-platform-repository-name",
      },
    ],
    certificates: [
      {
        name: "AWS Certified Solutions Architect - Professional Level Certification",
        organization: "Amazon Web Services Training and Certification Program",
        issueDate: "2023-06",
        expirationDate: "2026-06",
        credentialId: "AWS-CSAP-VERY-LONG-CREDENTIAL-ID-12345-ABCDE-67890",
        url: "https://www.credly.com/badges/very-long-url-path-to-certification-badge",
      },
    ],
    languages: [
      { language: "English", proficiency: "Native Speaker" },
      { language: "Spanish", proficiency: "Professional Working Proficiency" },
    ],
    skills: [
      { skill: "JavaScript/TypeScript/ECMAScript" },
      { skill: "React/Redux/Context API" },
      { skill: "Node.js/Express/Nest.js" },
      { skill: "Python/Django/Flask" },
      { skill: "PostgreSQL/MongoDB/Redis" },
    ],
  },

  // ============================================
  // Profile 5: Fresh Graduate (Early Career)
  // ============================================
  freshGraduate: {
    personalInfo: {
      firstName: "Emily",
      lastName: "Chen",
      professionalTitle: "Junior Software Developer",
      profileImage: "",
      email: "emily.chen@example.com",
      phone: "+1 (555) 987-6543",
      location: "Seattle, WA",
      linkedin: "https://linkedin.com/in/emilychen",
      github: "https://github.com/emilychen",
      website: "https://emilychen.dev",
      summary: "Recent Computer Science graduate with strong foundation in JavaScript, React, and Python. Quick learner with excellent problem-solving skills.",
      interests: [
        { interest: "Web Development" },
        { interest: "UI/UX Design" },
        { interest: "Gaming" },
      ],
    },
    workExperience: [
      {
        position: "Software Engineering Intern",
        company: "Tech Startup Inc.",
        location: "Seattle, WA",
        startDate: "2024-06",
        endDate: "2024-08",
        description: "Developed features using React and Node.js. Fixed bugs and improved performance. Collaborated with senior developers.",
        technologies: [
          { technology: "React" },
          { technology: "Node.js" },
          { technology: "Git" },
        ],
        competencies: [],
      },
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Washington",
        location: "Seattle, WA",
        startDate: "2020",
        endDate: "2024",
        field: "Computer Science",
        keyCourses: [
          { course: "Data Structures & Algorithms" },
          { course: "Web Development" },
          { course: "Database Systems" },
        ],
      },
    ],
    projects: [
      {
        name: "Personal Portfolio Website",
        description: "Built responsive portfolio website showcasing projects and skills. Implemented dark mode, animations, and contact form.",
        technologies: [
          { technology: "React" },
          { technology: "Tailwind CSS" },
          { technology: "Vercel" },
        ],
        startDate: "2024-03",
        endDate: "2024-05",
        link: "https://emilychen.dev",
      },
      {
        name: "Todo App with Authentication",
        description: "Full-stack todo application with user authentication, CRUD operations, and responsive design.",
        technologies: [
          { technology: "React" },
          { technology: "Express" },
          { technology: "MongoDB" },
        ],
        startDate: "2024-01",
        endDate: "2024-02",
        link: "https://github.com/emilychen/todo-app",
      },
    ],
    certificates: [],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Mandarin Chinese", proficiency: "Fluent" },
    ],
    skills: [
      { skill: "JavaScript" },
      { skill: "React" },
      { skill: "Python" },
      { skill: "Git" },
      { skill: "HTML/CSS" },
    ],
  },

  // ============================================
  // Profile 6: Senior Professional (10+ years)
  // ============================================
  seniorProfessional: {
    personalInfo: {
      firstName: "Michael",
      lastName: "Rodriguez",
      professionalTitle: "VP of Engineering & Technical Lead",
      profileImage: "",
      email: "michael.rodriguez@example.com",
      phone: "+1 (555) 234-5678",
      location: "Austin, TX",
      linkedin: "https://linkedin.com/in/michaelrodriguez",
      github: "https://github.com/mrodriguez",
      website: "https://michaelrodriguez.tech",
      summary: "Seasoned engineering leader with 15+ years building and scaling engineering teams. Expert in system architecture, cloud infrastructure, and agile methodologies. Successfully led teams of 50+ engineers across multiple time zones. Track record of delivering complex projects on time and driving technical excellence.",
      interests: [
        { interest: "Engineering Leadership" },
        { interest: "Mentorship Programs" },
        { interest: "Conference Speaking" },
      ],
    },
    workExperience: [
      {
        position: "VP of Engineering",
        company: "FinTech Unicorn",
        location: "Austin, TX",
        startDate: "2022-01",
        endDate: "Present",
        description: "Lead engineering organization of 80+ engineers across 6 teams. Define technical strategy and roadmap. Scaled infrastructure to handle $1B+ in transactions. Reduced system downtime by 95%. Built high-performing engineering culture with focus on innovation and quality.",
        technologies: [
          { technology: "Microservices" },
          { technology: "AWS" },
          { technology: "Kubernetes" },
          { technology: "Python" },
          { technology: "Go" },
        ],
        competencies: [
          { competency: "Executive Leadership" },
          { competency: "Strategic Planning" },
          { competency: "Team Building" },
        ],
      },
      {
        position: "Director of Engineering",
        company: "E-Commerce Giant",
        location: "San Francisco, CA",
        startDate: "2019-03",
        endDate: "2021-12",
        description: "Managed 5 engineering teams totaling 35 engineers. Led migration from monolith to microservices. Implemented DevOps practices reducing deployment time from weeks to hours. Established engineering best practices and mentorship programs.",
        technologies: [
          { technology: "React" },
          { technology: "Node.js" },
          { technology: "PostgreSQL" },
          { technology: "Docker" },
        ],
        competencies: [
          { competency: "Engineering Management" },
          { competency: "Architecture" },
        ],
      },
      {
        position: "Senior Software Engineer",
        company: "Cloud Services Provider",
        location: "Seattle, WA",
        startDate: "2015-06",
        endDate: "2019-02",
        description: "Led development of core platform features. Architected scalable solutions handling millions of requests daily. Mentored junior engineers and conducted technical interviews.",
        technologies: [
          { technology: "Java" },
          { technology: "Spring Boot" },
          { technology: "MySQL" },
          { technology: "Redis" },
        ],
        competencies: [
          { competency: "Technical Leadership" },
        ],
      },
      {
        position: "Software Engineer",
        company: "Tech Consulting Firm",
        location: "New York, NY",
        startDate: "2012-08",
        endDate: "2015-05",
        description: "Built custom software solutions for enterprise clients. Full-stack development using various technologies. Client communication and requirement gathering.",
        technologies: [
          { technology: "JavaScript" },
          { technology: "Python" },
          { technology: "PHP" },
        ],
        competencies: [],
      },
      {
        position: "Junior Developer",
        company: "Software Company",
        location: "Chicago, IL",
        startDate: "2009-06",
        endDate: "2012-07",
        description: "Developed web applications and fixed bugs. Learned software development best practices. Participated in code reviews.",
        technologies: [
          { technology: "JavaScript" },
          { technology: "jQuery" },
          { technology: "MySQL" },
        ],
        competencies: [],
      },
    ],
    education: [
      {
        degree: "Master of Business Administration (MBA)",
        institution: "Harvard Business School",
        location: "Boston, MA",
        startDate: "2017",
        endDate: "2019",
        field: "Technology Management",
        keyCourses: [],
      },
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "MIT",
        location: "Cambridge, MA",
        startDate: "2005",
        endDate: "2009",
        field: "Computer Science",
        keyCourses: [],
      },
    ],
    projects: [
      {
        name: "Open Source Framework",
        description: "Created popular open-source framework with 10K+ GitHub stars. Used by Fortune 500 companies.",
        technologies: [
          { technology: "TypeScript" },
          { technology: "Node.js" },
        ],
        startDate: "2020-01",
        endDate: "Present",
        link: "https://github.com/mrodriguez/framework",
      },
    ],
    certificates: [
      {
        name: "AWS Certified Solutions Architect - Professional",
        organization: "Amazon Web Services",
        issueDate: "2021-05",
        expirationDate: "2024-05",
        credentialId: "AWS-PRO-98765",
        url: "",
      },
      {
        name: "Certified Scrum Master",
        organization: "Scrum Alliance",
        issueDate: "2018-03",
        expirationDate: "",
        credentialId: "CSM-54321",
        url: "",
      },
    ],
    languages: [
      { language: "English", proficiency: "Native" },
      { language: "Spanish", proficiency: "Fluent" },
    ],
    skills: [
      { skill: "Engineering Leadership" },
      { skill: "System Architecture" },
      { skill: "Cloud Infrastructure" },
      { skill: "Microservices" },
      { skill: "Agile/Scrum" },
      { skill: "Team Building" },
      { skill: "Strategic Planning" },
      { skill: "Python" },
      { skill: "JavaScript" },
      { skill: "AWS" },
    ],
  },

  // ============================================
  // Profile 7: With Profile Image (Base64 Test)
  // ============================================
  withProfileImage: {
    personalInfo: {
      firstName: "Sarah",
      lastName: "Johnson",
      professionalTitle: "UX/UI Designer & Front-End Developer",
      // Small placeholder image in base64 (1x1 pixel transparent PNG)
      profileImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      email: "sarah.johnson@example.com",
      phone: "+1 (555) 345-6789",
      location: "Portland, OR",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      github: "https://github.com/sarahjohnson",
      website: "https://sarahjohnson.design",
      summary: "Creative designer and developer with passion for crafting beautiful, user-friendly interfaces. Expertise in React, Figma, and design systems.",
      interests: [
        { interest: "UI/UX Design" },
        { interest: "Illustration" },
      ],
    },
    workExperience: [
      {
        position: "Senior UX/UI Designer",
        company: "Design Agency",
        location: "Portland, OR",
        startDate: "2021-01",
        endDate: "Present",
        description: "Design and develop user interfaces for web applications. Create design systems and component libraries. Collaborate with developers to implement designs.",
        technologies: [
          { technology: "React" },
          { technology: "Figma" },
          { technology: "Tailwind CSS" },
        ],
        competencies: [],
      },
    ],
    education: [
      {
        degree: "Bachelor of Fine Arts in Graphic Design",
        institution: "Rhode Island School of Design",
        location: "Providence, RI",
        startDate: "2015",
        endDate: "2019",
        field: "Graphic Design",
        keyCourses: [],
      },
    ],
    projects: [
      {
        name: "Design System Library",
        description: "Built comprehensive design system with 100+ components used across company products.",
        technologies: [
          { technology: "React" },
          { technology: "Storybook" },
        ],
        startDate: "2023-01",
        endDate: "2023-06",
        link: "https://github.com/sarahjohnson/design-system",
      },
    ],
    certificates: [],
    languages: [
      { language: "English", proficiency: "Native" },
    ],
    skills: [
      { skill: "UI/UX Design" },
      { skill: "Figma" },
      { skill: "React" },
      { skill: "Tailwind CSS" },
      { skill: "Design Systems" },
    ],
  },

  // ============================================
  // Profile 8: All Optional Fields Empty
  // ============================================
  allOptionalEmpty: {
    personalInfo: {
      firstName: "David",
      lastName: "Kim",
      professionalTitle: "",
      profileImage: "",
      email: "david.kim@example.com",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
      summary: "",
      interests: [],
    },
    workExperience: [
      {
        position: "Software Developer",
        company: "Tech Company",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        technologies: [],
        competencies: [],
      },
    ],
    education: [
      {
        degree: "Computer Science Degree",
        institution: "University",
        location: "",
        startDate: "",
        endDate: "",
        field: "",
        keyCourses: [],
      },
    ],
    projects: [],
    certificates: [],
    languages: [
      { language: "English", proficiency: "Fluent" },
    ],
    skills: [
      { skill: "Programming" },
    ],
  },

  // ============================================
  // Profile 9: Erfan Taghvaei (Real Resume Data)
  // ============================================
  erfanTaghvaei: {
    personalInfo: {
      firstName: "Erfan",
      lastName: "Taghvaei",
      professionalTitle: "Full-Stack Entwickler",
      profileImage: "",
      email: "etaghvaei0098@gmail.com",
      phone: "+4915735338285",
      location: "Kaiserslautern",
      linkedin: "linkedin.com/in/erfan-taghvaei-2b9313255/",
      github: "github.com/ErfanTagh",
      website: "erfantagh.github.io",
      summary: "Ich bin Full-Stack-Entwickler mit fünf Jahren Erfahrung. Ich habe zwei websites die schon live sind: 123resume.de und recallcards.net. Diesen Lebenslauf habe ich mit meinem eigenen Projekt 123resume.de erstellt.",
      interests: [],
    },
    workExperience: [
      {
        position: "Projekt leiter",
        company: "Treffpunkt Kaiserslautern",
        location: "Kaiserslautern, DE",
        startDate: "2026-09",
        endDate: "Present",
        description: "Als Hiwi-Projektleiter an der Universität unterstütze ich die Organisation von Messen, darunter Aufbau, Catering, Fotoshootings und weitere organisatorische Aufgaben. Zusätzlich betreute ich Firmenkontakte und organisierte die zugehörigen Verträge.",
        technologies: [],
        competencies: [
          { competency: "Projektmanagement" },
          { competency: "Teamarbeit" },
          { competency: "Kommunikation" },
          { competency: "Deutsch" },
        ],
      },
      {
        position: "React Native Entwickler (Werkstudent)",
        company: "Neocosmo GmbH",
        location: "Saarbrücken, DE",
        startDate: "2023-02",
        endDate: "2025-02",
        description: "Ich entwickelte eine Funktion zur Token-Generierung für Benutzer und behob ein kritisches Login-Problem in der Kundenanwendung des Unternehmens. Einen Monat lang war ich der einzige Mobile-App-Entwickler und habe ein großes Ticket erfolgreich abgeschlossen. Ich habe React Native Apps entwickelt, Build-Fehler behoben und Tests geschrieben. Ich habe 80 Prozent der gesamten JavaScript-Codebasis zu TypeScript-Code konvertiert.",
        technologies: [
          { technology: "React Native" },
          { technology: "JavaScript" },
          { technology: "Linux" },
          { technology: "Git" },
          { technology: "Android" },
          { technology: "Detox" },
          { technology: "Storybook" },
        ],
        competencies: [],
      },
      {
        position: "Android Entwickler",
        company: "MagiaVAS",
        location: "Tehran, IR",
        startDate: "2020-09",
        endDate: "2022-09",
        description: "Arbeit an bundesweiter Telekommunikations-App mit über 1 Million Nutzern. Entwicklung an PayGear (Finanz-App, 300.000 Nutzer): Implementierung eines Chat-Systems für Geldtransfers zwischen Nutzern.",
        technologies: [
          { technology: "Kotlin" },
          { technology: "Java" },
          { technology: "Jetpack" },
          { technology: "Gradle" },
          { technology: "Firebase" },
        ],
        competencies: [],
      },
      {
        position: ".Net Entwickler (Werkstudent)",
        company: "Sanjesh Afzar Asia",
        location: "Tehran, IR",
        startDate: "2017-09",
        endDate: "2020-01",
        description: "Entwicklung und Wartung von APIs mit .NET zur Erfassung von Stromverbrauchsdaten über Sensoren aus der Ferne für Irans größtes Energieunternehmen. Implementierung und Verwaltung von CRUD-Operationen für die Datenverarbeitung und -speicherung. Sicherstellung einer zuverlässigen Datenerfassung und -übertragung zwischen Sensoren und Backend-Systemen.",
        technologies: [
          { technology: ".NET" },
          { technology: "C#" },
          { technology: "Entity Framework" },
          { technology: "SQL Server" },
        ],
        competencies: [],
      },
    ],
    education: [
      {
        degree: "Master of Science",
        institution: "",
        location: "Kaiserslautern, DE",
        startDate: "2022-10",
        endDate: "Present",
        field: "Informatik",
        keyCourses: [
          { course: "Generative KI" },
          { course: "Anforderungsanalyse" },
          { course: "Social Web Mining" },
          { course: "Quantom Computing" },
        ],
      },
      {
        degree: "Bachelor of Science",
        institution: "Tehran Azad Universität",
        location: "Tehran, IR",
        startDate: "2017-03",
        endDate: "2020-09",
        field: "Softwaretechnik",
        keyCourses: [],
      },
    ],
    projects: [
      {
        name: "123resume.de",
        description: "Entwicklung eines Full-Stack-Lebenslauf-Builders (React/TypeScript, Django REST) mit serverseitiger PDF-Generierung (Playwright), 6 Templates, Mehrsprachigkeit und KI-basierter semantischer Suche (Transformer-Embeddings) für Profil-Job-Matching.",
        technologies: [
          { technology: "React" },
          { technology: "MongoDB" },
          { technology: "Python" },
          { technology: "Django" },
          { technology: "GitHub Actions" },
          { technology: "Tailwind CSS" },
          { technology: "NLP" },
          { technology: "Docker" },
        ],
        startDate: "2026-08",
        endDate: "Present",
        link: "123resume.de",
      },
      {
        name: "Recallcards",
        description: "Full-Stack-Lernplattform für Karteikarten (React, Flask, MongoDB) mit Sammlungen, Quizmodus und Fortschrittsverfolgung. RESTful API mit JWT-Authentifizierung, Docker-Containerisierung und CI/CD über GitHub Actions. Responsives UI mit Tailwind CSS, 3D-Animationen und Auth0-Integration.",
        technologies: [
          { technology: "React" },
          { technology: "Flask" },
          { technology: "MongoDB" },
          { technology: "GitHub Actions" },
          { technology: "Linux" },
          { technology: "Docker" },
        ],
        startDate: "2022-11",
        endDate: "Present",
        link: "recallcards.net",
      },
      {
        name: "Universitätsprojekt am Deutschen Zentrum für Künstliche Intelligenz (DFKI)",
        description: "Flask REST API und responsives Frontend mit interaktiver Validierung und Echtzeit-Diff-Visualisierung. Performance-Optimierung um das 15-30 fache durch parallele Verarbeitung und optimierte JSON-Diff-Algorithmen.",
        technologies: [
          { technology: "Python" },
          { technology: "Bootstrap" },
          { technology: "Docker" },
        ],
        startDate: "2025-02",
        endDate: "2025-10",
        link: "",
      },
    ],
    certificates: [
      {
        name: "MongoDB Accociate Developer",
        organization: "MongoDB",
        issueDate: "2023-01",
        expirationDate: "",
        credentialId: "",
        url: "credly.com/go/2TuPKJMq",
      },
    ],
    languages: [
      { language: "English", proficiency: "Advanced" },
      { language: "Deutsch", proficiency: "Native" },
    ],
    skills: [
      { skill: "JavaScript" },
      { skill: "MongoDB" },
      { skill: "React" },
      { skill: "Firebase" },
      { skill: "Software Testing" },
      { skill: "Linux" },
      { skill: "Playwright" },
      { skill: "C#" },
      { skill: ".Net" },
      { skill: "Python" },
      { skill: "Android" },
      { skill: "Microsoft Azure" },
      { skill: "React Native" },
      { skill: "Docker" },
      { skill: "Jetpack" },
    ],
  },

  // ============================================
  // Profile: Frontend Developer (Sample Resume)
  // ============================================
  frontendDeveloper: {
    personalInfo: {
      firstName: "Alex",
      lastName: "Martinez",
      professionalTitle: "Senior Frontend Developer",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      email: "alex.martinez@example.com",
      phone: "+1 (555) 234-5678",
      location: "New York, NY, USA",
      linkedin: "https://linkedin.com/in/alexmartinez",
      github: "https://github.com/alexmartinez",
      website: "https://alexmartinez.dev",
      summary: "Passionate frontend developer with 5+ years of experience building modern, responsive web applications.",
      interests: [
        { interest: "Web Performance" },
        { interest: "UI/UX Design" },
        { interest: "Open Source" },
        { interest: "Photography" },
      ],
    },
    workExperience: [
      {
        position: "Senior Frontend Developer",
        company: "TechCorp Solutions",
        location: "New York, NY",
        startDate: "2021-03",
        endDate: "Present",
        description: "Lead frontend development for enterprise SaaS platform serving 50,000+ users. Architected component library used across 10+ products. Reduced bundle size by 40% through code splitting and optimization. Implemented design system with Storybook, improving development velocity by 30%.",
        technologies: [
          { technology: "React" },
          { technology: "TypeScript" },
          { technology: "Next.js" },
          { technology: "Tailwind CSS" },
          { technology: "Storybook" },
          { technology: "Jest" },
          { technology: "Cypress" },
        ],
        competencies: [
          { competency: "Frontend Architecture" },
          { competency: "Performance Optimization" },
          { competency: "Team Leadership" },
        ],
      },
      {
        position: "Frontend Developer",
        company: "StartupHub",
        location: "Remote",
        startDate: "2019-06",
        endDate: "2021-02",
        description: "Built responsive web applications from scratch using React and Redux. Collaborated with designers to implement pixel-perfect UI components. Improved page load times by 50% through lazy loading and code optimization. Participated in code reviews and mentored 2 junior developers.",
        technologies: [
          { technology: "React" },
          { technology: "Redux" },
          { technology: "JavaScript" },
          { technology: "SCSS" },
          { technology: "Webpack" },
        ],
        competencies: [
          { competency: "Component Development" },
          { competency: "State Management" },
        ],
      },
      {
        position: "Junior Frontend Developer",
        company: "Digital Agency",
        location: "Boston, MA",
        startDate: "2018-08",
        endDate: "2019-05",
        description: "Developed client websites using HTML, CSS, and JavaScript. Converted design mockups into responsive web pages. Maintained and updated existing websites. Collaborated with backend developers to integrate APIs.",
        technologies: [
          { technology: "HTML5" },
          { technology: "CSS3" },
          { technology: "JavaScript" },
          { technology: "jQuery" },
          { technology: "Bootstrap" },
        ],
        competencies: [
          { competency: "Responsive Design" },
          { competency: "Cross-browser Compatibility" },
        ],
      },
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "New York University",
        location: "New York, NY",
        startDate: "2014",
        endDate: "2018",
        field: "Computer Science",
        keyCourses: [
          { course: "Web Development" },
          { course: "User Interface Design" },
          { course: "Data Structures" },
          { course: "Software Engineering" },
        ],
      },
    ],
    projects: [
      {
        name: "Component Library & Design System",
        description: "Built comprehensive React component library with 50+ reusable components. Created documentation site with interactive examples. Used by 5+ teams across the organization.",
        technologies: [
          { technology: "React" },
          { technology: "TypeScript" },
          { technology: "Storybook" },
          { technology: "Tailwind CSS" },
        ],
        startDate: "2022-01",
        endDate: "2022-06",
        link: "https://github.com/alexmartinez/component-library",
      },
      {
        name: "E-commerce Dashboard",
        description: "Developed admin dashboard for e-commerce platform with real-time analytics, order management, and inventory tracking. Implemented data visualization using D3.js and Chart.js.",
        technologies: [
          { technology: "React" },
          { technology: "TypeScript" },
          { technology: "D3.js" },
          { technology: "Chart.js" },
          { technology: "Material-UI" },
        ],
        startDate: "2020-09",
        endDate: "2021-02",
        link: "https://github.com/alexmartinez/ecommerce-dashboard",
      },
      {
        name: "Personal Portfolio Website",
        description: "Designed and developed responsive portfolio website with dark mode, animations, and blog functionality. Built with Next.js and deployed on Vercel.",
        technologies: [
          { technology: "Next.js" },
          { technology: "React" },
          { technology: "Tailwind CSS" },
          { technology: "Framer Motion" },
        ],
        startDate: "2023-03",
        endDate: "2023-05",
        link: "https://alexmartinez.dev",
      },
    ],
    certificates: [
      {
        name: "Advanced React and Redux",
        organization: "Udemy",
        issueDate: "2020-05",
        expirationDate: "",
        credentialId: "",
        url: "",
      },
      {
        name: "TypeScript Fundamentals",
        organization: "Pluralsight",
        issueDate: "2021-08",
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
      { skill: "React" },
      { skill: "TypeScript" },
      { skill: "JavaScript" },
      { skill: "Next.js" },
      { skill: "Tailwind CSS" },
      { skill: "Git" },
      { skill: "Jest" },
      { skill: "Figma" },
    ],
  },
};

/**
 * Get list of profile names for dropdown
 */
export const getTestProfileNames = () => Object.keys(testProfiles);

/**
 * Get profile by name
 */
export const getTestProfile = (name: string): CVFormData | undefined => {
  return testProfiles[name];
};

