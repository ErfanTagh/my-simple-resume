import * as React from "react";
import { format, parse, isValid, startOfYear, setMonth } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MonthPickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function MonthPicker({
  value,
  onChange,
  placeholder = "Select month",
  disabled = false,
}: MonthPickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse the string value (YYYY-MM format) to a Date
  const dateValue = React.useMemo(() => {
    if (!value) return undefined;
    const parsed = parse(value, "yyyy-MM", new Date());
    return isValid(parsed) ? parsed : undefined;
  }, [value]);

  // Get current year from value or use current year
  const [displayYear, setDisplayYear] = React.useState(() => {
    if (dateValue) {
      return dateValue.getFullYear();
    }
    return new Date().getFullYear();
  });

  // Update display year when value changes
  React.useEffect(() => {
    if (dateValue) {
      setDisplayYear(dateValue.getFullYear());
    }
  }, [dateValue]);

  const handleMonthSelect = (monthIndex: number) => {
    const selectedDate = setMonth(startOfYear(new Date(displayYear, 0, 1)), monthIndex);
    onChange(format(selectedDate, "yyyy-MM"));
    setOpen(false);
  };

  const handleYearChange = (delta: number) => {
    setDisplayYear(prev => prev + delta);
  };

  const selectedMonth = dateValue ? dateValue.getMonth() : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateValue && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateValue ? format(dateValue, "MMMM yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          {/* Year Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleYearChange(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-4">{displayYear}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleYearChange(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month, index) => (
              <Button
                key={month}
                variant={selectedMonth === index && dateValue?.getFullYear() === displayYear ? "default" : "outline"}
                className={cn(
                  "h-9 text-sm",
                  selectedMonth === index && dateValue?.getFullYear() === displayYear && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleMonthSelect(index)}
              >
                {month.slice(0, 3)}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

