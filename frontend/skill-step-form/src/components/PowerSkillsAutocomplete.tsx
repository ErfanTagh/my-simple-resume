import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

// Power Skills in English
const POWER_SKILLS_EN = [
  "Leadership",
  "Teamwork",
  "Communication",
  "Problem Solving",
  "Critical Thinking",
  "Adaptability",
  "Time Management",
  "Project Management",
  "Collaboration",
  "Conflict Resolution",
  "Negotiation",
  "Presentation Skills",
  "Public Speaking",
  "Active Listening",
  "Emotional Intelligence",
  "Empathy",
  "Interpersonal Skills",
  "Networking",
  "Mentoring",
  "Coaching",
  "Decision Making",
  "Strategic Thinking",
  "Innovation",
  "Creativity",
  "Analytical Thinking",
  "Attention to Detail",
  "Organization",
  "Planning",
  "Prioritization",
  "Multitasking",
  "Stress Management",
  "Resilience",
  "Flexibility",
  "Cultural Awareness",
  "Diversity & Inclusion",
  "Customer Service",
  "Client Relations",
  "Stakeholder Management",
  "Change Management",
  "Process Improvement",
  "Quality Assurance",
  "Risk Management",
  "Budget Management",
  "Vendor Management",
  "Team Building",
  "Motivation",
  "Influence",
  "Persuasion",
  "Storytelling",
  "Writing",
  "Editing",
  "Research",
  "Data Analysis",
  "Business Acumen",
  "Financial Literacy",
  "Sales",
  "Marketing",
  "Brand Management",
  "Product Development",
  "Agile Methodology",
  "Scrum",
  "Lean Thinking",
  "Continuous Improvement",
  "Training & Development",
  "Learning Agility",
  "Self-Motivation",
  "Work Ethic",
  "Reliability",
  "Accountability",
  "Integrity",
  "Professionalism",
  "Ethics",
  "Initiative",
  "Proactive",
  "Resourcefulness",
  "Troubleshooting",
  "Technical Writing",
  "Documentation",
  "Requirements Analysis",
  "Stakeholder Engagement",
];

// Power Skills in German
const POWER_SKILLS_DE = [
  "Führung",
  "Teamarbeit",
  "Kommunikation",
  "Problemlösung",
  "Kritisches Denken",
  "Anpassungsfähigkeit",
  "Zeitmanagement",
  "Projektmanagement",
  "Zusammenarbeit",
  "Konfliktlösung",
  "Verhandlung",
  "Präsentationsfähigkeiten",
  "Öffentliches Sprechen",
  "Aktives Zuhören",
  "Emotionale Intelligenz",
  "Empathie",
  "Zwischenmenschliche Fähigkeiten",
  "Netzwerken",
  "Mentoring",
  "Coaching",
  "Entscheidungsfindung",
  "Strategisches Denken",
  "Innovation",
  "Kreativität",
  "Analytisches Denken",
  "Sorgfalt",
  "Organisation",
  "Planung",
  "Priorisierung",
  "Multitasking",
  "Stressmanagement",
  "Resilienz",
  "Flexibilität",
  "Kulturbewusstsein",
  "Vielfalt & Inklusion",
  "Kundenservice",
  "Kundenbeziehungen",
  "Stakeholder-Management",
  "Change Management",
  "Prozessverbesserung",
  "Qualitätssicherung",
  "Risikomanagement",
  "Budgetmanagement",
  "Lieferantenmanagement",
  "Teambuilding",
  "Motivation",
  "Einfluss",
  "Überzeugung",
  "Storytelling",
  "Schreiben",
  "Redaktion",
  "Forschung",
  "Datenanalyse",
  "Geschäftsverständnis",
  "Finanzkompetenz",
  "Vertrieb",
  "Marketing",
  "Markenmanagement",
  "Produktentwicklung",
  "Agile Methodik",
  "Scrum",
  "Lean Thinking",
  "Kontinuierliche Verbesserung",
  "Ausbildung & Entwicklung",
  "Lernfähigkeit",
  "Selbstmotivation",
  "Arbeitsmoral",
  "Zuverlässigkeit",
  "Verantwortung",
  "Integrität",
  "Professionalität",
  "Ethik",
  "Initiative",
  "Proaktiv",
  "Einfallsreichtum",
  "Fehlerbehebung",
  "Technisches Schreiben",
  "Dokumentation",
  "Anforderungsanalyse",
  "Stakeholder-Engagement",
];

interface PowerSkillsAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function PowerSkillsAutocomplete({
  value = "",
  onChange,
  placeholder = "Type a power skill...",
  id,
  className,
}: PowerSkillsAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter skills based on input value and language
  const filteredSkills = React.useMemo(() => {
    const currentSkills = language === 'de' ? POWER_SKILLS_DE : POWER_SKILLS_EN;
    if (!inputValue || inputValue.length < 1) return currentSkills.slice(0, 10); // Show first 10 when empty
    const lowerValue = inputValue.toLowerCase();
    return currentSkills.filter((skill) =>
      skill.toLowerCase().includes(lowerValue)
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

  const handleSelect = (skill: string) => {
    setInputValue(skill);
    onChange(skill);
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
    if (inputValue.length >= 1 && filteredSkills.length > 0) {
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
      {open && filteredSkills.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-[300px] overflow-auto">
          <div className="p-1">
            {filteredSkills.map((skill) => (
              <div
                key={skill}
                onClick={() => handleSelect(skill)}
                onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                className={cn(
                  "px-2 py-1.5 text-sm cursor-pointer rounded-sm",
                  "hover:bg-accent hover:text-accent-foreground",
                  "transition-colors"
                )}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

