import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Type, RotateCcw } from "lucide-react";
import { CVFormData } from "./types";
import { UseFormReturn, useWatch } from "react-hook-form";
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

  // Use useWatch with fallback to form.getValues() to ensure we always have styling
  const watchedStyling = useWatch({ control: form.control, name: "styling" });
  const getValuesStyling = form.getValues("styling");
  const styling = watchedStyling || getValuesStyling || {};

  // Get template to determine template-specific defaults
  const template = useWatch({ control: form.control, name: "template" }) || form.getValues("template") || "modern";

  // Get template-specific default for personalInfo section heading color
  const getTemplateDefaultPersonalInfoTitleColor = (templateName: string): string => {
    const templateDefaults: Record<string, string> = {
      modern: "#2563eb",    // Blue - ModernTemplate uses blue headings
      creative: "#2563eb",  // Blue - CreativeTemplate uses blue headings
      minimal: "#2563eb",   // Blue - MinimalTemplate uses blue headings
      classic: "#2563eb",   // Blue - ClassicTemplate uses blue headings
      latex: "#1f2937",     // Black - LatexTemplate uses black headings
      starRover: "#141E61", // Dark blue - StarRoverTemplate uses dark blue headings
    };
    return templateDefaults[templateName] || "#2563eb"; // Default to blue if unknown
  };

  const sectionStyling = styling.sectionStyling?.[sectionName] || {};

  // For personalInfo section, use template-specific default. For other sections, use headingColor.
  // Note: The "Title/Heading Color" in settings controls section headings, not the header name
  const defaultTitleColor = sectionName === "personalInfo"
    ? getTemplateDefaultPersonalInfoTitleColor(template)  // Use template-specific default
    : (styling.headingColor || "#1f2937"); // Other sections use headingColor

  // Body color always uses textColor as default
  const defaultBodyColor = styling.textColor || "#1f2937";

  // Use template fontSize as default, fallback to "medium"
  const defaultFontSize = (styling.fontSize || "medium") as "small" | "medium" | "large";

  // Essential logging only
  const titleColorInputValue = sectionStyling.titleColor || defaultTitleColor;
  const bodyColorInputValue = sectionStyling.bodyColor || defaultBodyColor;

  // Check if styling is actually custom (different from template defaults)
  // Only consider it custom if the value exists AND is different from the default
  // Use explicit boolean conversion to ensure we always get true/false, not undefined
  const hasCustomTitleColor = Boolean(sectionStyling.titleColor && sectionStyling.titleColor !== defaultTitleColor);
  const hasCustomBodyColor = Boolean(sectionStyling.bodyColor && sectionStyling.bodyColor !== defaultBodyColor);
  const hasCustomTitleSize = Boolean(sectionStyling.titleSize && sectionStyling.titleSize !== defaultFontSize);
  const hasCustomBodySize = Boolean(sectionStyling.bodySize && sectionStyling.bodySize !== defaultFontSize);
  const hasCustomStyling = hasCustomTitleColor || hasCustomBodyColor || hasCustomTitleSize || hasCustomBodySize;

  if (sectionName === "personalInfo") {
    console.log(`[${sectionName}] Colors:`, {
      titleColor: titleColorInputValue,
      bodyColor: bodyColorInputValue,
      hasCustom: hasCustomStyling,
      sectionTitleColor: sectionStyling.titleColor,
      defaultTitleColor: defaultTitleColor,
      templateHeadingColor: styling.headingColor,
      templateTextColor: styling.textColor,
      template: template,
    });
  }

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

  // Use the same hasCustomStyling logic we computed above
  // (hasCustomStyling is already defined above, so we don't need to redefine it)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg bg-muted/30 mb-6">
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
            {!sectionStyling.titleColor && (
              <span className="text-xs text-muted-foreground ml-1">(Template default)</span>
            )}
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={`${sectionName}-titleColor`}
              type="color"
              value={sectionStyling.titleColor || defaultTitleColor}
              onChange={(e) => updateSectionStyling({ titleColor: e.target.value })}
              className="w-12 h-9 cursor-pointer"
            />
            <Input
              type="text"
              value={sectionStyling.titleColor || defaultTitleColor}
              onChange={(e) => updateSectionStyling({ titleColor: e.target.value })}
              placeholder={defaultTitleColor}
              className="flex-1 text-sm"
            />
          </div>
        </div>

        {/* Title/Heading Size */}
        <div className="space-y-2">
          <Label htmlFor={`${sectionName}-titleSize`} className="text-sm">Title/Heading Size</Label>
          <Select
            value={sectionStyling.titleSize || defaultFontSize}
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
            {!sectionStyling.bodyColor && (
              <span className="text-xs text-muted-foreground ml-1">(Template default)</span>
            )}
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={`${sectionName}-bodyColor`}
              type="color"
              value={sectionStyling.bodyColor || defaultBodyColor}
              onChange={(e) => updateSectionStyling({ bodyColor: e.target.value })}
              className="w-12 h-9 cursor-pointer"
            />
            <Input
              type="text"
              value={sectionStyling.bodyColor || defaultBodyColor}
              onChange={(e) => updateSectionStyling({ bodyColor: e.target.value })}
              placeholder={defaultBodyColor}
              className="flex-1 text-sm"
            />
          </div>
        </div>

        {/* Body Text Size */}
        <div className="space-y-2">
          <Label htmlFor={`${sectionName}-bodySize`} className="text-sm">Body Text Size</Label>
          <Select
            value={sectionStyling.bodySize || defaultFontSize}
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
            className="gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

