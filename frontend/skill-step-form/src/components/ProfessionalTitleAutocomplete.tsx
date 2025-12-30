import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

// Professional titles in English
const PROFESSIONAL_TITLES_EN = [
  // Software Development & Engineering
  "Software Developer",
  "Software Engineer",
  "Senior Software Engineer",
  "Lead Software Engineer",
  "Principal Software Engineer",
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Mobile Developer",
  "iOS Developer",
  "Android Developer",
  "React Developer",
  "Vue.js Developer",
  "Angular Developer",
  "Python Developer",
  "Java Developer",
  ".NET Developer",
  "C# Developer",
  "C++ Developer",
  "Go Developer",
  "Rust Developer",
  "PHP Developer",
  "Ruby Developer",
  "Swift Developer",
  "Kotlin Developer",
  "JavaScript Developer",
  "TypeScript Developer",
  "Node.js Developer",
  "Web Developer",
  "Game Developer",
  "Embedded Systems Engineer",
  "Firmware Engineer",
  "Blockchain Developer",
  "Solidity Developer",
  "Security Engineer",
  "Cybersecurity Analyst",
  "Penetration Tester",
  "Information Security Specialist",
  
  // Design & UX
  "UI/UX Designer",
  "UX Designer",
  "UI Designer",
  "Product Designer",
  "Graphic Designer",
  "Visual Designer",
  "Interaction Designer",
  "Motion Graphics Designer",
  "Web Designer",
  "User Researcher",
  
  // Product & Project Management
  "Product Manager",
  "Senior Product Manager",
  "Product Owner",
  "Project Manager",
  "Program Manager",
  "Technical Program Manager",
  "Agile Coach",
  "Scrum Master",
  "Delivery Manager",
  "Release Manager",
  
  // Data & Analytics
  "Data Scientist",
  "Senior Data Scientist",
  "Data Analyst",
  "Data Engineer",
  "Machine Learning Engineer",
  "AI Engineer",
  "Deep Learning Engineer",
  "Business Intelligence Analyst",
  "Analytics Engineer",
  "Data Architect",
  "Statistician",
  "Quantitative Analyst",
  
  // Cloud & Infrastructure
  "Cloud Engineer",
  "Cloud Architect",
  "AWS Solutions Architect",
  "Azure Architect",
  "GCP Engineer",
  "Kubernetes Engineer",
  "Docker Engineer",
  "Infrastructure Engineer",
  "Network Engineer",
  "System Administrator",
  "System Engineer",
  "Database Administrator",
  "Database Developer",
  "SQL Developer",
  
  // QA & Testing
  "QA Engineer",
  "QA Automation Engineer",
  "Test Engineer",
  "Software Tester",
  "Test Automation Engineer",
  "Quality Assurance Manager",
  
  // Business & Consulting
  "Business Analyst",
  "Senior Business Analyst",
  "Business Consultant",
  "Management Consultant",
  "Strategy Consultant",
  "Financial Consultant",
  "IT Consultant",
  "Business Development Manager",
  "Operations Manager",
  "Operations Analyst",
  
  // Leadership & Executive
  "Technical Lead",
  "Tech Lead",
  "Engineering Manager",
  "Senior Engineering Manager",
  "Director of Engineering",
  "VP of Engineering",
  "CTO",
  "CEO",
  "CFO",
  "COO",
  "CMO",
  "Chief Product Officer",
  "Chief Data Officer",
  "VP of Product",
  "Director of Product",
  
  // Marketing & Sales
  "Marketing Manager",
  "Digital Marketing Manager",
  "Marketing Director",
  "Content Marketing Manager",
  "SEO Specialist",
  "SEM Specialist",
  "Social Media Manager",
  "Brand Manager",
  "Product Marketing Manager",
  "Growth Marketing Manager",
  "Email Marketing Specialist",
  "Marketing Analyst",
  "Sales Manager",
  "Sales Representative",
  "Sales Engineer",
  "Account Executive",
  "Business Development Representative",
  "Sales Director",
  "VP of Sales",
  
  // Customer Success & Support
  "Customer Success Manager",
  "Customer Support Specialist",
  "Technical Support Engineer",
  "Customer Service Representative",
  "Account Manager",
  
  // HR & People Operations
  "HR Manager",
  "HR Business Partner",
  "Talent Acquisition Specialist",
  "Recruiter",
  "HR Generalist",
  "People Operations Manager",
  "Chief People Officer",
  
  // Finance & Accounting
  "Financial Analyst",
  "Senior Financial Analyst",
  "Accountant",
  "Senior Accountant",
  "CPA",
  "Controller",
  "CFO",
  "Investment Analyst",
  "Financial Advisor",
  "Budget Analyst",
  "Tax Specialist",
  "Auditor",
  
  // Legal
  "Lawyer",
  "Attorney",
  "Legal Counsel",
  "Corporate Lawyer",
  "Patent Attorney",
  "Legal Advisor",
  "Paralegal",
  "Compliance Officer",
  
  // Healthcare & Medical
  "Physician",
  "Doctor",
  "Nurse",
  "Registered Nurse",
  "Nurse Practitioner",
  "Physician Assistant",
  "Medical Doctor",
  "Surgeon",
  "Dentist",
  "Pharmacist",
  "Physical Therapist",
  "Occupational Therapist",
  "Medical Researcher",
  "Biomedical Engineer",
  
  // Science & Research
  "Research Scientist",
  "Research Analyst",
  "Laboratory Technician",
  "Chemist",
  "Biologist",
  "Microbiologist",
  "Pharmacologist",
  "Research Engineer",
  
  // Education
  "Teacher",
  "Professor",
  "Assistant Professor",
  "Associate Professor",
  "Principal",
  "Education Administrator",
  "Curriculum Developer",
  "Instructional Designer",
  "Tutor",
  
  // Engineering (Non-Software)
  "Mechanical Engineer",
  "Electrical Engineer",
  "Civil Engineer",
  "Aerospace Engineer",
  "Chemical Engineer",
  "Industrial Engineer",
  "Structural Engineer",
  "Environmental Engineer",
  
  // Creative & Media
  "Content Writer",
  "Technical Writer",
  "Copywriter",
  "Content Creator",
  "Video Editor",
  "Photographer",
  "Videographer",
  "Journalist",
  "Editor",
  "Marketing Writer",
  "Blogger",
  "Social Media Specialist",
  
  // Logistics & Supply Chain
  "Supply Chain Manager",
  "Logistics Coordinator",
  "Procurement Manager",
  "Inventory Manager",
  "Warehouse Manager",
  
  // Real Estate
  "Real Estate Agent",
  "Real Estate Broker",
  "Property Manager",
  "Real Estate Developer",
  
  // Hospitality & Service
  "Hotel Manager",
  "Restaurant Manager",
  "Chef",
  "Event Planner",
  "Wedding Planner",
];

// Professional titles in German
const PROFESSIONAL_TITLES_DE = [
  // Softwareentwicklung & Engineering
  "Softwareentwickler",
  "Software-Ingenieur",
  "Senior Software-Ingenieur",
  "Lead Software-Ingenieur",
  "Principal Software-Ingenieur",
  "Full Stack Entwickler",
  "Frontend Entwickler",
  "Backend Entwickler",
  "DevOps Ingenieur",
  "Site Reliability Engineer",
  "Mobile Entwickler",
  "iOS Entwickler",
  "Android Entwickler",
  "React Entwickler",
  "Vue.js Entwickler",
  "Angular Entwickler",
  "Python Entwickler",
  "Java Entwickler",
  ".NET Entwickler",
  "C# Entwickler",
  "C++ Entwickler",
  "Go Entwickler",
  "Rust Entwickler",
  "PHP Entwickler",
  "Ruby Entwickler",
  "Swift Entwickler",
  "Kotlin Entwickler",
  "JavaScript Entwickler",
  "TypeScript Entwickler",
  "Node.js Entwickler",
  "Webentwickler",
  "Spieleentwickler",
  "Embedded Systems Ingenieur",
  "Firmware Ingenieur",
  "Blockchain Entwickler",
  "Solidity Entwickler",
  "Sicherheitsingenieur",
  "Cybersecurity Analyst",
  "Penetration Tester",
  "IT-Sicherheitsexperte",
  
  // Design & UX
  "UI/UX Designer",
  "UX Designer",
  "UI Designer",
  "Produktdesigner",
  "Grafikdesigner",
  "Visueller Gestalter",
  "Interaktionsdesigner",
  "Motion Graphics Designer",
  "Webdesigner",
  "User Researcher",
  
  // Produkt- & Projektmanagement
  "Produktmanager",
  "Senior Produktmanager",
  "Product Owner",
  "Projektmanager",
  "Program Manager",
  "Technischer Program Manager",
  "Agile Coach",
  "Scrum Master",
  "Delivery Manager",
  "Release Manager",
  
  // Daten & Analytik
  "Datenwissenschaftler",
  "Senior Datenwissenschaftler",
  "Datenanalyst",
  "Dateningenieur",
  "Maschinelles Lernen Ingenieur",
  "KI-Ingenieur",
  "Deep Learning Ingenieur",
  "Business Intelligence Analyst",
  "Analytics Ingenieur",
  "Datenarchitekt",
  "Statistiker",
  "Quantitativer Analyst",
  
  // Cloud & Infrastruktur
  "Cloud Ingenieur",
  "Cloud Architekt",
  "AWS Solutions Architekt",
  "Azure Architekt",
  "GCP Ingenieur",
  "Kubernetes Ingenieur",
  "Docker Ingenieur",
  "Infrastruktur Ingenieur",
  "Netzwerkingenieur",
  "Systemadministrator",
  "Systemingenieur",
  "Datenbankadministrator",
  "Datenbankentwickler",
  "SQL Entwickler",
  
  // QA & Testing
  "QA Ingenieur",
  "QA Automatisierungsingenieur",
  "Test Ingenieur",
  "Softwaretester",
  "Testautomatisierungsingenieur",
  "Qualitätssicherungsmanager",
  
  // Business & Beratung
  "Business Analyst",
  "Senior Business Analyst",
  "Unternehmensberater",
  "Managementberater",
  "Strategieberater",
  "Finanzberater",
  "IT-Berater",
  "Business Development Manager",
  "Operations Manager",
  "Operations Analyst",
  
  // Führung & Executive
  "Technischer Leiter",
  "Tech Lead",
  "Engineering Manager",
  "Senior Engineering Manager",
  "Director of Engineering",
  "VP of Engineering",
  "CTO",
  "CEO",
  "CFO",
  "COO",
  "CMO",
  "Chief Product Officer",
  "Chief Data Officer",
  "VP of Product",
  "Director of Product",
  
  // Marketing & Vertrieb
  "Marketing Manager",
  "Digital Marketing Manager",
  "Marketingdirektor",
  "Content Marketing Manager",
  "SEO Spezialist",
  "SEM Spezialist",
  "Social Media Manager",
  "Brand Manager",
  "Produktmarketingmanager",
  "Growth Marketing Manager",
  "E-Mail Marketing Spezialist",
  "Marketing Analyst",
  "Vertriebsmanager",
  "Verkaufsmitarbeiter",
  "Sales Engineer",
  "Account Executive",
  "Business Development Representative",
  "Vertriebsdirektor",
  "VP of Sales",
  
  // Customer Success & Support
  "Customer Success Manager",
  "Kundensupport Spezialist",
  "Technischer Support Ingenieur",
  "Kundenservice Mitarbeiter",
  "Account Manager",
  
  // HR & Personalwesen
  "HR Manager",
  "HR Business Partner",
  "Talent Acquisition Spezialist",
  "Recruiter",
  "HR Generalist",
  "People Operations Manager",
  "Chief People Officer",
  
  // Finanzen & Rechnungswesen
  "Finanzanalyst",
  "Senior Finanzanalyst",
  "Buchhalter",
  "Senior Buchhalter",
  "Steuerberater",
  "Controller",
  "CFO",
  "Investment Analyst",
  "Finanzberater",
  "Budgetanalyst",
  "Steuerspezialist",
  "Wirtschaftsprüfer",
  
  // Recht
  "Rechtsanwalt",
  "Anwalt",
  "Jurist",
  "Unternehmensanwalt",
  "Patentanwalt",
  "Rechtsberater",
  "Rechtsanwaltsfachangestellter",
  "Compliance Officer",
  
  // Gesundheitswesen & Medizin
  "Arzt",
  "Doktor",
  "Krankenschwester",
  "Pfleger",
  "Pflegekraft",
  "Arztassistent",
  "Mediziner",
  "Chirurg",
  "Zahnarzt",
  "Apotheker",
  "Physiotherapeut",
  "Ergotherapeut",
  "Medizinforscher",
  "Biomedizinischer Ingenieur",
  
  // Wissenschaft & Forschung
  "Wissenschaftler",
  "Forscher",
  "Laborant",
  "Chemiker",
  "Biologe",
  "Mikrobiologe",
  "Pharmakologe",
  "Forschungsingenieur",
  
  // Bildung & Erziehung
  "Lehrer",
  "Professor",
  "Assistenzprofessor",
  "Außerordentlicher Professor",
  "Schulleiter",
  "Bildungsadministrator",
  "Lehrplanentwickler",
  "Instructional Designer",
  "Nachhilfelehrer",
  
  // Ingenieurwesen (Nicht-Software)
  "Maschinenbauingenieur",
  "Elektroingenieur",
  "Bauingenieur",
  "Luft- und Raumfahrtingenieur",
  "Chemieingenieur",
  "Wirtschaftsingenieur",
  "Statiker",
  "Umweltingenieur",
  
  // Kreativ & Medien
  "Content Writer",
  "Technischer Redakteur",
  "Texter",
  "Content Creator",
  "Video Editor",
  "Fotograf",
  "Videograf",
  "Journalist",
  "Redakteur",
  "Marketing Texter",
  "Blogger",
  "Social Media Spezialist",
  
  // Logistik & Supply Chain
  "Supply Chain Manager",
  "Logistik Koordinator",
  "Einkaufsmanager",
  "Lagerleiter",
  "Lagerverwalter",
  
  // Immobilien
  "Immobilienmakler",
  "Immobilienverwalter",
  "Immobilienentwickler",
  
  // Gastronomie & Service
  "Hoteldirektor",
  "Restaurantleiter",
  "Koch",
  "Eventmanager",
  "Hochzeitsplaner",
];

interface ProfessionalTitleAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function ProfessionalTitleAutocomplete({
  value = "",
  onChange,
  placeholder = "Type a professional title...",
  id,
  className,
}: ProfessionalTitleAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter titles based on input value and language
  const filteredTitles = React.useMemo(() => {
    const currentTitles = language === 'de' ? PROFESSIONAL_TITLES_DE : PROFESSIONAL_TITLES_EN;
    if (!inputValue || inputValue.length < 1) return currentTitles.slice(0, 10); // Show first 10 when empty
    const lowerValue = inputValue.toLowerCase();
    return currentTitles.filter((title) =>
      title.toLowerCase().includes(lowerValue)
    ).slice(0, 20); // Limit to 20 results
  }, [inputValue, language]);

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

  const handleSelect = (title: string) => {
    setInputValue(title);
    onChange(title);
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
    if (inputValue.length >= 1 && filteredTitles.length > 0) {
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
      {open && filteredTitles.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-[300px] overflow-auto">
          <div className="p-1">
            {filteredTitles.map((title) => (
              <div
                key={title}
                onClick={() => handleSelect(title)}
                onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                className={cn(
                  "px-2 py-1.5 text-sm cursor-pointer rounded-sm",
                  "hover:bg-accent hover:text-accent-foreground",
                  "transition-colors"
                )}
              >
                {title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

