import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

// Common technologies for autocomplete
const TECHNOLOGIES = [
  // Frontend Frameworks & Libraries
  "React",
  "Vue.js",
  "Angular",
  "Next.js",
  "Nuxt.js",
  "Svelte",
  "Gatsby",
  "Remix",
  
  // JavaScript/TypeScript
  "JavaScript",
  "TypeScript",
  "Node.js",
  "Express",
  "NestJS",
  
  // CSS & Styling
  "CSS3",
  "SASS",
  "SCSS",
  "Less",
  "Tailwind CSS",
  "Bootstrap",
  "Material-UI",
  "Styled Components",
  "Emotion",
  
  // Backend Languages
  "Python",
  "Java",
  "C#",
  ".NET",
  "ASP.NET",
  "PHP",
  "Ruby",
  "Ruby on Rails",
  "Go",
  "Rust",
  "C++",
  "C",
  
  // Databases
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "SQLite",
  "Oracle",
  "SQL Server",
  "DynamoDB",
  "Cassandra",
  "Elasticsearch",
  
  // Cloud & DevOps
  "AWS",
  "Azure",
  "Google Cloud Platform",
  "Docker",
  "Kubernetes",
  "Terraform",
  "Jenkins",
  "GitLab CI",
  "GitHub Actions",
  "Ansible",
  "Chef",
  "Puppet",
  
  // Mobile Development
  "React Native",
  "Flutter",
  "Swift",
  "Kotlin",
  "iOS",
  "Android",
  "Xamarin",
  "Ionic",
  
  // Testing
  "Jest",
  "Mocha",
  "Cypress",
  "Selenium",
  "Playwright",
  "Pytest",
  "JUnit",
  "Vitest",
  "Testing Library",
  
  // Tools & Version Control
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "SVN",
  
  // APIs & Web Services
  "REST API",
  "GraphQL",
  "gRPC",
  "REST",
  "SOAP",
  "WebSocket",
  
  // State Management
  "Redux",
  "MobX",
  "Zustand",
  "Recoil",
  "Vuex",
  "Pinia",
  
  // Build Tools
  "Webpack",
  "Vite",
  "Parcel",
  "Rollup",
  "Babel",
  "ESLint",
  "Prettier",
  
  // Data Science & ML
  "Python",
  "R",
  "TensorFlow",
  "PyTorch",
  "Scikit-learn",
  "Pandas",
  "NumPy",
  "Jupyter",
  
  // Other Technologies
  "Linux",
  "Unix",
  "Windows",
  "macOS",
  "Nginx",
  "Apache",
  "RabbitMQ",
  "Kafka",
  "Microservices",
  "Serverless",
  "Lambda",
  "Firebase",
  "Supabase",
  "Vercel",
  "Netlify",
  
  // Design & Creative Tools
  "Figma",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe InDesign",
  "Adobe XD",
  "Sketch",
  "Canva",
  "InVision",
  "Adobe Premiere Pro",
  "Adobe After Effects",
  "Final Cut Pro",
  "Blender",
  "Cinema 4D",
  "Maya",
  "3ds Max",
  "AutoCAD",
  "SolidWorks",
  "Fusion 360",
  "SketchUp",
  "Adobe Creative Suite",
  
  // Marketing & Analytics
  "Google Analytics",
  "Google Tag Manager",
  "Google Ads",
  "Facebook Ads",
  "HubSpot",
  "Salesforce",
  "Marketo",
  "Mailchimp",
  "Constant Contact",
  "Hootsuite",
  "Buffer",
  "Sprout Social",
  "SEMrush",
  "Ahrefs",
  "Moz",
  "Google Search Console",
  "Google Ads",
  "Bing Ads",
  "LinkedIn Ads",
  "Twitter Ads",
  
  // Office & Productivity
  "Microsoft Office",
  "Microsoft Excel",
  "Microsoft Word",
  "Microsoft PowerPoint",
  "Microsoft Outlook",
  "Microsoft Access",
  "Microsoft Project",
  "Google Workspace",
  "Google Sheets",
  "Google Docs",
  "Google Slides",
  "Slack",
  "Microsoft Teams",
  "Zoom",
  "Asana",
  "Trello",
  "Jira",
  "Confluence",
  "Notion",
  "Airtable",
  "Monday.com",
  "Basecamp",
  "ClickUp",
  
  // Finance & Accounting
  "QuickBooks",
  "SAP",
  "Oracle Financials",
  "Sage",
  "Xero",
  "FreshBooks",
  "NetSuite",
  "Workday",
  "ADP",
  "Paychex",
  "Bloomberg Terminal",
  "Reuters",
  "FactSet",
  "Morningstar",
  "Tableau",
  "Power BI",
  "QlikView",
  "Alteryx",
  "SAS",
  "Stata",
  "SPSS",
  
  // Engineering & CAD
  "MATLAB",
  "Simulink",
  "LabVIEW",
  "ANSYS",
  "SolidWorks",
  "AutoCAD",
  "Revit",
  "CATIA",
  "Creo",
  "Inventor",
  "NX",
  "Altium Designer",
  "KiCad",
  "Eagle",
  
  // Healthcare & Medical
  "EPIC",
  "Cerner",
  "Allscripts",
  "Athenahealth",
  "eClinicalWorks",
  "NextGen",
  "MEDITECH",
  "Practice Fusion",
  "HL7",
  "FHIR",
  "DICOM",
  
  // Education & LMS
  "Blackboard",
  "Canvas",
  "Moodle",
  "Google Classroom",
  "Schoology",
  "Brightspace",
  "Sakai",
  
  // Legal & Compliance
  "Westlaw",
  "LexisNexis",
  "LegalZoom",
  "Clio",
  "MyCase",
  "Relativity",
  "Concordance",
  
  // Construction & Architecture
  "AutoCAD",
  "Revit",
  "BIM",
  "Bluebeam",
  "Procore",
  "PlanGrid",
  "Autodesk",
  
  // Manufacturing & Supply Chain
  "SAP ERP",
  "Oracle ERP",
  "Microsoft Dynamics",
  "Infor",
  "Salesforce CRM",
  "Oracle CRM",
  "Zoho CRM",
  
  // Data Visualization & BI
  "Tableau",
  "Power BI",
  "Qlik Sense",
  "Looker",
  "Metabase",
  "Grafana",
  "Kibana",
  "Plotly",
  "D3.js",
  "Chart.js",
  
  // E-commerce & CMS
  "Shopify",
  "WooCommerce",
  "Magento",
  "BigCommerce",
  "Salesforce Commerce Cloud",
  "WordPress",
  "Drupal",
  "Joomla",
  "Squarespace",
  "Wix",
  "Contentful",
  "Strapi",
  "Sanity",
  
  // Version Control & Collaboration
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "SVN",
  "Mercurial",
  "Perforce",
  
  // Communication & Video
  "Zoom",
  "Microsoft Teams",
  "Slack",
  "Discord",
  "WebRTC",
  "Twilio",
  "SendGrid",
  
  // Security
  "Wireshark",
  "Nmap",
  "Burp Suite",
  "Metasploit",
  "Nessus",
  "Qualys",
  "Splunk",
  "SIEM",
  "OWASP",
  
  // Game Development
  "Unity",
  "Unreal Engine",
  "Godot",
  "GameMaker Studio",
  "Cocos2d",
  
  // Low-code/No-code
  "Salesforce Lightning",
  "OutSystems",
  "Mendix",
  "Appian",
  "PowerApps",
  "Bubble",
  "Zapier",
  "IFTTT",
  
  // Scientific Computing
  "MATLAB",
  "R",
  "Python",
  "Julia",
  "Wolfram Mathematica",
  "Origin",
  "LabVIEW",
];

interface TechnologyAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function TechnologyAutocomplete({
  value = "",
  onChange,
  placeholder = "Type a technology...",
  id,
  className,
}: TechnologyAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter technologies based on input value
  const filteredTechnologies = React.useMemo(() => {
    if (!inputValue || inputValue.length < 1) return TECHNOLOGIES.slice(0, 10); // Show first 10 when empty
    const lowerValue = inputValue.toLowerCase();
    return TECHNOLOGIES.filter((tech) =>
      tech.toLowerCase().includes(lowerValue)
    ).slice(0, 20); // Limit to 20 results
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    
    // Show dropdown if input has at least 1 character
    if (newValue.length >= 1) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSelect = (tech: string) => {
    setInputValue(tech);
    onChange(tech);
    setOpen(false);
    inputRef.current?.blur();
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Close dropdown after a short delay to allow click events to fire
    setTimeout(() => {
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (relatedTarget && containerRef.current?.contains(relatedTarget)) {
        return;
      }
      setOpen(false);
    }, 200);
  };

  const handleFocus = () => {
    if (inputValue.length >= 1 && filteredTechnologies.length > 0) {
      setOpen(true);
    }
  };

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <Input
        ref={inputRef}
        id={id}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="w-full"
      />
      {open && filteredTechnologies.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-[300px] overflow-auto">
          <div className="p-1">
            {filteredTechnologies.map((tech) => (
              <div
                key={tech}
                onClick={() => handleSelect(tech)}
                onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                className={cn(
                  "px-2 py-1.5 text-sm cursor-pointer rounded-sm",
                  "hover:bg-accent hover:text-accent-foreground",
                  "transition-colors"
                )}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

