import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

// Languages in English
const LANGUAGES_EN = [
  "English",
  "German",
  "Spanish",
  "French",
  "Italian",
  "Portuguese",
  "Dutch",
  "Russian",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Hindi",
  "Turkish",
  "Polish",
  "Swedish",
  "Norwegian",
  "Danish",
  "Finnish",
  "Greek",
  "Czech",
  "Hungarian",
  "Romanian",
  "Bulgarian",
  "Croatian",
  "Serbian",
  "Slovak",
  "Slovenian",
  "Lithuanian",
  "Latvian",
  "Estonian",
  "Ukrainian",
  "Hebrew",
  "Persian",
  "Urdu",
  "Bengali",
  "Thai",
  "Vietnamese",
  "Indonesian",
  "Malay",
  "Tagalog",
  "Swahili",
  "Afrikaans",
  "Icelandic",
  "Irish",
  "Welsh",
  "Catalan",
  "Basque",
  "Galician",
  "Maltese",
  "Luxembourgish",
];

// Languages in German
const LANGUAGES_DE = [
  "Englisch",
  "Deutsch",
  "Spanisch",
  "Französisch",
  "Italienisch",
  "Portugiesisch",
  "Niederländisch",
  "Russisch",
  "Chinesisch",
  "Japanisch",
  "Koreanisch",
  "Arabisch",
  "Hindi",
  "Türkisch",
  "Polnisch",
  "Schwedisch",
  "Norwegisch",
  "Dänisch",
  "Finnisch",
  "Griechisch",
  "Tschechisch",
  "Ungarisch",
  "Rumänisch",
  "Bulgarisch",
  "Kroatisch",
  "Serbisch",
  "Slowakisch",
  "Slowenisch",
  "Litauisch",
  "Lettisch",
  "Estnisch",
  "Ukrainisch",
  "Hebräisch",
  "Persisch",
  "Urdu",
  "Bengalisch",
  "Thailändisch",
  "Vietnamesisch",
  "Indonesisch",
  "Malaiisch",
  "Tagalog",
  "Suaheli",
  "Afrikaans",
  "Isländisch",
  "Irisch",
  "Walisisch",
  "Katalanisch",
  "Baskisch",
  "Galizisch",
  "Maltesisch",
  "Luxemburgisch",
];

interface LanguageAutocompleteProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function LanguageAutocomplete({
  value = "",
  onChange,
  placeholder = "Type a language...",
  id,
  className,
}: LanguageAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const { language } = useLanguage();
  
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter languages based on input value and language
  const filteredLanguages = React.useMemo(() => {
    const currentLanguages = language === 'de' ? LANGUAGES_DE : LANGUAGES_EN;
    if (!inputValue || inputValue.length < 1) return currentLanguages.slice(0, 10); // Show first 10 when empty
    const lowerValue = inputValue.toLowerCase();
    return currentLanguages.filter((lang) =>
      lang.toLowerCase().includes(lowerValue)
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

  const handleSelect = (lang: string) => {
    setInputValue(lang);
    onChange(lang);
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
    if (inputValue.length >= 1 && filteredLanguages.length > 0) {
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
      {open && filteredLanguages.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-md max-h-[300px] overflow-auto">
          <div className="p-1">
            {filteredLanguages.map((lang) => (
              <div
                key={lang}
                onClick={() => handleSelect(lang)}
                onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                className={cn(
                  "px-2 py-1.5 text-sm cursor-pointer rounded-sm",
                  "hover:bg-accent hover:text-accent-foreground",
                  "transition-colors"
                )}
              >
                {lang}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

