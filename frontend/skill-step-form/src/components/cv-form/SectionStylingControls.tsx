import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Type, RotateCcw } from "lucide-react";
import { CVFormData } from "./types";
import { UseFormReturn } from "react-hook-form";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface SectionStylingControlsProps {
  form: UseFormReturn<CVFormData>;
  sectionName: string;
  sectionLabel: string;
}

const SIZE_MAP = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

export const SectionStylingControls = ({ form, sectionName, sectionLabel }: SectionStylingControlsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const styling = form.watch("styling") || {};
  const sectionStyling = styling.sectionStyling?.[sectionName] || {};

  const updateSectionStyling = (updates: { titleColor?: string; titleSize?: "small" | "medium" | "large"; bodyColor?: string; bodySize?: "small" | "medium" | "large" }) => {
    const currentStyling = form.getValues("styling") || {};
    const currentSectionStyling = currentStyling.sectionStyling || {};
    
    form.setValue("styling", {
      ...currentStyling,
      sectionStyling: {
        ...currentSectionStyling,
        [sectionName]: {
          ...currentSectionStyling[sectionName],
          ...updates,
        },
      },
    });
  };

  const resetSectionStyling = () => {
    const currentStyling = form.getValues("styling") || {};
    const currentSectionStyling = currentStyling.sectionStyling || {};
    const { [sectionName]: _, ...restSectionStyling } = currentSectionStyling;
    
    form.setValue("styling", {
      ...currentStyling,
      sectionStyling: Object.keys(restSectionStyling).length > 0 ? restSectionStyling : undefined,
    });
  };

  const hasCustomStyling = sectionStyling.titleColor || sectionStyling.titleSize || sectionStyling.bodyColor || sectionStyling.bodySize;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg bg-muted/30">
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-between h-auto py-3 px-4 hover:bg-muted/50"
        >
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{sectionLabel} Styling</span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4 space-y-4">
        {/* Title/Heading Color */}
        <div className="space-y-2">
          <Label htmlFor={`${sectionName}-titleColor`} className="flex items-center gap-2 text-sm">
            <Type className="h-3 w-3" />
            Title/Heading Color
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={`${sectionName}-titleColor`}
              type="color"
              value={sectionStyling.titleColor || styling.headingColor || "#1f2937"}
              onChange={(e) => updateSectionStyling({ titleColor: e.target.value })}
              className="w-12 h-9 cursor-pointer"
            />
            <Input
              type="text"
              value={sectionStyling.titleColor || styling.headingColor || "#1f2937"}
              onChange={(e) => updateSectionStyling({ titleColor: e.target.value })}
              placeholder="#1f2937"
              className="flex-1 text-sm"
            />
          </div>
        </div>

        {/* Title/Heading Size */}
        <div className="space-y-2">
          <Label htmlFor={`${sectionName}-titleSize`} className="text-sm">Title/Heading Size</Label>
          <Select
            value={sectionStyling.titleSize || "medium"}
            onValueChange={(value: "small" | "medium" | "large") => {
              if (value === "small" || value === "medium" || value === "large") {
                updateSectionStyling({ titleSize: value });
              }
            }}
          >
            <SelectTrigger id={`${sectionName}-titleSize`} className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">{SIZE_MAP.small}</SelectItem>
              <SelectItem value="medium">{SIZE_MAP.medium}</SelectItem>
              <SelectItem value="large">{SIZE_MAP.large}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Body Text Color */}
        <div className="space-y-2">
          <Label htmlFor={`${sectionName}-bodyColor`} className="flex items-center gap-2 text-sm">
            <Palette className="h-3 w-3" />
            Body Text Color
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={`${sectionName}-bodyColor`}
              type="color"
              value={sectionStyling.bodyColor || styling.textColor || "#1f2937"}
              onChange={(e) => updateSectionStyling({ bodyColor: e.target.value })}
              className="w-12 h-9 cursor-pointer"
            />
            <Input
              type="text"
              value={sectionStyling.bodyColor || styling.textColor || "#1f2937"}
              onChange={(e) => updateSectionStyling({ bodyColor: e.target.value })}
              placeholder="#1f2937"
              className="flex-1 text-sm"
            />
          </div>
        </div>

        {/* Body Text Size */}
        <div className="space-y-2">
          <Label htmlFor={`${sectionName}-bodySize`} className="text-sm">Body Text Size</Label>
          <Select
            value={sectionStyling.bodySize || "medium"}
            onValueChange={(value: "small" | "medium" | "large") => {
              if (value === "small" || value === "medium" || value === "large") {
                updateSectionStyling({ bodySize: value });
              }
            }}
          >
            <SelectTrigger id={`${sectionName}-bodySize`} className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">{SIZE_MAP.small}</SelectItem>
              <SelectItem value="medium">{SIZE_MAP.medium}</SelectItem>
              <SelectItem value="large">{SIZE_MAP.large}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <div className="pt-2 border-t flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="default"
            onClick={resetSectionStyling}
            disabled={!hasCustomStyling}
            className="gap-2 text-sm text-muted-foreground hover:text-blue-600"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

