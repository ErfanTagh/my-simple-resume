import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

// Fields of Study in English
const FIELDS_OF_STUDY_EN = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Data Science",
  "Artificial Intelligence",
  "Machine Learning",
  "Cybersecurity",
  "Information Systems",
  "Business Administration",
  "Business Management",
  "Finance",
  "Accounting",
  "Marketing",
  "Economics",
  "International Business",
  "Entrepreneurship",
  "Management",
  "Human Resources",
  "Operations Management",
  "Supply Chain Management",
  "Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Biomedical Engineering",
  "Aerospace Engineering",
  "Industrial Engineering",
  "Environmental Engineering",
  "Medicine",
  "Nursing",
  "Pharmacy",
  "Dentistry",
  "Veterinary Medicine",
  "Public Health",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Statistics",
  "Psychology",
  "Sociology",
  "Political Science",
  "International Relations",
  "Law",
  "Criminal Justice",
  "Education",
  "Early Childhood Education",
  "Elementary Education",
  "Secondary Education",
  "Special Education",
  "English Literature",
  "History",
  "Philosophy",
  "Linguistics",
  "Communications",
  "Journalism",
  "Media Studies",
  "Film Studies",
  "Theater",
  "Music",
  "Fine Arts",
  "Graphic Design",
  "Architecture",
  "Urban Planning",
  "Social Work",
  "Anthropology",
  "Geography",
  "Environmental Science",
  "Agriculture",
  "Food Science",
  "Hospitality Management",
  "Tourism",
  "Sports Science",
  "Kinesiology",
  "Physical Therapy",
  "Occupational Therapy",
];

// Fields of Study in German
const FIELDS_OF_STUDY_DE = [
  "Informatik",
  "Softwaretechnik",
  "Informationstechnologie",
  "Datenwissenschaft",
  "Künstliche Intelligenz",
  "Maschinelles Lernen",
  "Cybersicherheit",
  "Informationssysteme",
  "Betriebswirtschaftslehre",
  "Wirtschaftsmanagement",
  "Finanzwesen",
  "Rechnungswesen",
  "Marketing",
  "Volkswirtschaftslehre",
  "Internationale Betriebswirtschaft",
  "Unternehmertum",
  "Management",
  "Personalwesen",
  "Operations Management",
  "Supply Chain Management",
  "Ingenieurwesen",
  "Maschinenbau",
  "Elektrotechnik",
  "Bauingenieurwesen",
  "Chemieingenieurwesen",
  "Biomedizintechnik",
  "Luft- und Raumfahrttechnik",
  "Wirtschaftsingenieurwesen",
  "Umweltingenieurwesen",
  "Medizin",
  "Pflegewissenschaft",
  "Pharmazie",
  "Zahnmedizin",
  "Veterinärmedizin",
  "Gesundheitswissenschaften",
  "Biologie",
  "Chemie",
  "Physik",
  "Mathematik",
  "Statistik",
  "Psychologie",
  "Soziologie",
  "Politikwissenschaft",
  "Internationale Beziehungen",
  "Rechtswissenschaft",
  "Kriminalistik",
  "Erziehungswissenschaft",
  "Frühpädagogik",
  "Grundschulpädagogik",
  "Sekundarschulpädagogik",
  "Sonderpädagogik",
  "Anglistik",
  "Geschichte",
  "Philosophie",
  "Sprachwissenschaft",
  "Kommunikationswissenschaft",
  "Journalismus",
  "Medienwissenschaft",
  "Filmwissenschaft",
  "Theaterwissenschaft",
  "Musik",
  "Bildende Kunst",
  "Grafikdesign",
  "Architektur",
  "Stadtplanung",
  "Sozialarbeit",
  "Anthropologie",
  "Geographie",
  "Umweltwissenschaft",
  "Agrarwissenschaft",
  "Lebensmittelwissenschaft",
  "Hotellerie",
  "Tourismus",
  "Sportwissenschaft",
  "Bewegungswissenschaft",
  "Physiotherapie",
  "Ergotherapie",
];

interface FieldOfStudyAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function FieldOfStudyAutocomplete({
  value = "",
  onChange,
  placeholder = "Type a field of study...",
  id,
  className,
}: FieldOfStudyAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter fields based on input value and language
  const filteredFields = React.useMemo(() => {
    const currentFields = language === 'de' ? FIELDS_OF_STUDY_DE : FIELDS_OF_STUDY_EN;
    if (!inputValue || inputValue.length < 1) return currentFields.slice(0, 10); // Show first 10 when empty
    const lowerValue = inputValue.toLowerCase();
    return currentFields.filter((field) =>
      field.toLowerCase().includes(lowerValue)
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

  const handleSelect = (field: string) => {
    setInputValue(field);
    onChange(field);
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
    if (inputValue.length >= 1 && filteredFields.length > 0) {
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
      {open && filteredFields.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-[300px] overflow-auto">
          <div className="p-1">
            {filteredFields.map((field) => (
              <div
                key={field}
                onClick={() => handleSelect(field)}
                onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                className={cn(
                  "px-2 py-1.5 text-sm cursor-pointer rounded-sm",
                  "hover:bg-accent hover:text-accent-foreground",
                  "transition-colors"
                )}
              >
                {field}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

