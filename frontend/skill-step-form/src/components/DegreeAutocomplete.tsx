import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

// Degrees in English
const DEGREES_EN = [
  "Bachelor's Degree",
  "Master's Degree",
  "PhD",
  "Doctor of Philosophy",
  "Associate Degree",
  "Diploma",
  "Certificate",
  "High School Diploma",
  "GED",
  "Bachelor of Science",
  "Bachelor of Arts",
  "Bachelor of Engineering",
  "Bachelor of Business Administration",
  "Bachelor of Computer Science",
  "Master of Science",
  "Master of Arts",
  "Master of Engineering",
  "Master of Business Administration",
  "Master of Computer Science",
  "Doctor of Medicine",
  "Doctor of Law",
  "Juris Doctor",
  "Doctor of Dental Surgery",
  "Doctor of Veterinary Medicine",
  "Bachelor of Fine Arts",
  "Master of Fine Arts",
  "Bachelor of Architecture",
  "Master of Architecture",
  "Bachelor of Education",
  "Master of Education",
  "Bachelor of Nursing",
  "Master of Nursing",
  "Bachelor of Pharmacy",
  "Master of Pharmacy",
  "Bachelor of Psychology",
  "Master of Psychology",
  "Bachelor of Social Work",
  "Master of Social Work",
  "Bachelor of Public Health",
  "Master of Public Health",
  "Postgraduate Diploma",
  "Postgraduate Certificate",
  "Executive MBA",
  "Online Degree",
  "Distance Learning Degree",
];

// Degrees in German
const DEGREES_DE = [
  "Bachelor",
  "Master",
  "Promotion",
  "Doktor",
  "Associate Degree",
  "Diplom",
  "Zertifikat",
  "Abitur",
  "Fachabitur",
  "Bachelor of Science",
  "Bachelor of Arts",
  "Bachelor of Engineering",
  "Bachelor of Business Administration",
  "Bachelor of Computer Science",
  "Master of Science",
  "Master of Arts",
  "Master of Engineering",
  "Master of Business Administration",
  "Master of Computer Science",
  "Doktor der Medizin",
  "Doktor der Rechtswissenschaften",
  "Juris Doctor",
  "Doktor der Zahnmedizin",
  "Doktor der Veterinärmedizin",
  "Bachelor of Fine Arts",
  "Master of Fine Arts",
  "Bachelor of Architecture",
  "Master of Architecture",
  "Bachelor of Education",
  "Master of Education",
  "Bachelor of Nursing",
  "Master of Nursing",
  "Bachelor of Pharmacy",
  "Master of Pharmacy",
  "Bachelor of Psychology",
  "Master of Psychology",
  "Bachelor of Social Work",
  "Master of Social Work",
  "Bachelor of Public Health",
  "Master of Public Health",
  "Postgraduales Diplom",
  "Postgraduales Zertifikat",
  "Executive MBA",
  "Online-Abschluss",
  "Fernstudium",
];

interface DegreeAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function DegreeAutocomplete({
  value = "",
  onChange,
  placeholder = "Type a degree...",
  id,
  className,
}: DegreeAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter degrees based on input value and language
  const filteredDegrees = React.useMemo(() => {
    const currentDegrees = language === 'de' ? DEGREES_DE : DEGREES_EN;
    if (!inputValue || inputValue.length < 1) return currentDegrees.slice(0, 10); // Show first 10 when empty
    const lowerValue = inputValue.toLowerCase();
    return currentDegrees.filter((degree) =>
      degree.toLowerCase().includes(lowerValue)
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

  const handleSelect = (degree: string) => {
    setInputValue(degree);
    onChange(degree);
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
    if (inputValue.length >= 1 && filteredDegrees.length > 0) {
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
      {open && filteredDegrees.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-[300px] overflow-auto">
          <div className="p-1">
            {filteredDegrees.map((degree) => (
              <div
                key={degree}
                onClick={() => handleSelect(degree)}
                onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                className={cn(
                  "px-2 py-1.5 text-sm cursor-pointer rounded-sm",
                  "hover:bg-accent hover:text-accent-foreground",
                  "transition-colors"
                )}
              >
                {degree}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

