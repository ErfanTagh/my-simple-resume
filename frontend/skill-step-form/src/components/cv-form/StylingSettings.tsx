import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, Type, Bold, Text } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { CVFormData } from "./types";
import { Separator } from "@/components/ui/separator";

interface StylingSettingsProps {
  data: CVFormData;
  currentStep?: number;
  onStylingChange: (styling: CVFormData['styling']) => void;
}

const FONT_FAMILIES = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
  { value: "Raleway", label: "Raleway" },
  { value: "Source Sans Pro", label: "Source Sans Pro" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Playfair Display", label: "Playfair Display" },
];

// Map step to relevant sections
const getSectionsForStep = (step: number | undefined): Array<{ name: string; label: string }> => {
  if (step === undefined) return [];
  
  switch (step) {
    case 0: // PersonalInfo
      return [{ name: "personalInfo", label: "Personal Info" }];
    case 1: // Experience
      return [
        { name: "workExperience", label: "Work Experience" },
        { name: "projects", label: "Projects" }
      ];
    case 2: // Education
      return [
        { name: "education", label: "Education" },
        { name: "certificates", label: "Certificates" }
      ];
    case 3: // Skills
      return [
        { name: "skills", label: "Skills" },
        { name: "languages", label: "Languages" }
      ];
    case 4: // Review - show all
      return [
        { name: "personalInfo", label: "Personal Info" },
        { name: "workExperience", label: "Work Experience" },
        { name: "projects", label: "Projects" },
        { name: "education", label: "Education" },
        { name: "certificates", label: "Certificates" },
        { name: "skills", label: "Skills" },
        { name: "languages", label: "Languages" }
      ];
    default:
      return [];
  }
};

const SIZE_MAP = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

export const StylingSettings = ({ data, currentStep, onStylingChange }: StylingSettingsProps) => {
  const { t } = useLanguage();
  const styling = data.styling || {};
  const sectionsForStep = getSectionsForStep(currentStep);

  const updateStyling = (updates: Partial<CVFormData['styling']>) => {
    onStylingChange({ ...styling, ...updates });
  };

  const updateSectionStyling = (sectionName: string, updates: Partial<NonNullable<CVFormData['styling']>['sectionStyling']>[string]) => {
    const currentSectionStyling = styling.sectionStyling || {};
    updateStyling({
      sectionStyling: {
        ...currentSectionStyling,
        [sectionName]: {
          ...currentSectionStyling[sectionName],
          ...updates,
        },
      },
    });
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1 text-foreground flex items-center gap-2">
          <Palette className="h-5 w-5" />
          {t('resume.settings.stylingTitle') || 'Styling & Typography'}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t('resume.settings.stylingDesc') || 'Customize fonts, colors, and text styles'}
        </p>
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <Label htmlFor="fontFamily" className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          {t('resume.settings.fontFamily') || 'Font Family'}
        </Label>
        <Select
          value={styling.fontFamily || "Inter"}
          onValueChange={(value) => updateStyling({ fontFamily: value })}
        >
          <SelectTrigger id="fontFamily">
            <SelectValue placeholder={t('resume.settings.selectFont') || 'Select font'} />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <Label htmlFor="fontSize" className="flex items-center gap-2">
          <Text className="h-4 w-4" />
          {t('resume.settings.fontSize') || 'Font Size'}
        </Label>
        <Select
          value={styling.fontSize || "medium"}
          onValueChange={(value) => {
            // Ensure only valid font size values are set
            if (value === "small" || value === "medium" || value === "large") {
              updateStyling({ fontSize: value });
            }
          }}
        >
          <SelectTrigger id="fontSize">
            <SelectValue placeholder={t('resume.settings.selectFontSize') || 'Select font size'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">
              {t('resume.settings.fontSizeSmall') || 'Small'} ({t('resume.settings.fontSizeSmallDesc') || 'More content per page'})
            </SelectItem>
            <SelectItem value="medium">
              {t('resume.settings.fontSizeMedium') || 'Medium'} ({t('resume.settings.fontSizeMediumDesc') || 'Standard'})
            </SelectItem>
            <SelectItem value="large">
              {t('resume.settings.fontSizeLarge') || 'Large'} ({t('resume.settings.fontSizeLargeDesc') || 'Easier to read'})
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {t('resume.settings.fontSizeHint') || 'Smaller font sizes allow more content to fit on fewer pages'}
        </p>
      </div>

      {/* Title Color */}
      <div className="space-y-2">
        <Label htmlFor="titleColor" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          {t('resume.settings.titleColor') || 'Title Color'}
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="titleColor"
            type="color"
            value={styling.titleColor || "#2563eb"}
            onChange={(e) => updateStyling({ titleColor: e.target.value })}
            className="w-16 h-10 cursor-pointer"
          />
          <Input
            type="text"
            value={styling.titleColor || "#2563eb"}
            onChange={(e) => updateStyling({ titleColor: e.target.value })}
            placeholder="#2563eb"
            className="flex-1"
          />
        </div>
      </div>

      {/* Title Bold */}
      <div className="flex items-center justify-between">
        <Label htmlFor="titleBold" className="flex items-center gap-2 cursor-pointer">
          <Bold className="h-4 w-4" />
          {t('resume.settings.titleBold') || 'Bold Title'}
        </Label>
        <Switch
          id="titleBold"
          checked={styling.titleBold ?? false}
          onCheckedChange={(checked) => updateStyling({ titleBold: checked })}
        />
      </div>

      {/* Heading Color */}
      <div className="space-y-2">
        <Label htmlFor="headingColor" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          {t('resume.settings.headingColor') || 'Section Heading Color'}
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="headingColor"
            type="color"
            value={styling.headingColor || "#2563eb"}
            onChange={(e) => updateStyling({ headingColor: e.target.value })}
            className="w-16 h-10 cursor-pointer"
          />
          <Input
            type="text"
            value={styling.headingColor || "#2563eb"}
            onChange={(e) => updateStyling({ headingColor: e.target.value })}
            placeholder="#2563eb"
            className="flex-1"
          />
        </div>
      </div>

      {/* Heading Bold */}
      <div className="flex items-center justify-between">
        <Label htmlFor="headingBold" className="flex items-center gap-2 cursor-pointer">
          <Bold className="h-4 w-4" />
          {t('resume.settings.headingBold') || 'Bold Headings'}
        </Label>
        <Switch
          id="headingBold"
          checked={styling.headingBold ?? false}
          onCheckedChange={(checked) => updateStyling({ headingBold: checked })}
        />
      </div>

      {/* Text Color */}
      <div className="space-y-2">
        <Label htmlFor="textColor" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          {t('resume.settings.textColor') || 'Text Color'}
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="textColor"
            type="color"
            value={styling.textColor || "#1f2937"}
            onChange={(e) => updateStyling({ textColor: e.target.value })}
            className="w-16 h-10 cursor-pointer"
          />
          <Input
            type="text"
            value={styling.textColor || "#1f2937"}
            onChange={(e) => updateStyling({ textColor: e.target.value })}
            placeholder="#1f2937"
            className="flex-1"
          />
        </div>
      </div>

      {/* Link Color */}
      <div className="space-y-2">
        <Label htmlFor="linkColor" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          {t('resume.settings.linkColor') || 'Link Color'}
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="linkColor"
            type="color"
            value={styling.linkColor || "#2563eb"}
            onChange={(e) => updateStyling({ linkColor: e.target.value })}
            className="w-16 h-10 cursor-pointer"
          />
          <Input
            type="text"
            value={styling.linkColor || "#2563eb"}
            onChange={(e) => updateStyling({ linkColor: e.target.value })}
            placeholder="#2563eb"
            className="flex-1"
          />
        </div>
      </div>

      {/* Section-Specific Styling */}
      {sectionsForStep.length > 0 && (
        <>
          <Separator className="my-6" />
          <div>
            <h4 className="text-base font-semibold mb-3 text-foreground flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Section-Specific Styling
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Customize styling for sections in the current step
            </p>
          </div>

          <div className="space-y-4">
            {sectionsForStep.map((section) => {
              const sectionStyling = styling.sectionStyling?.[section.name] || {};
              
              return (
                <Card key={section.name} className="p-4 border-2">
                  <div className="mb-4">
                    <h5 className="font-semibold text-sm text-foreground mb-1">{section.label}</h5>
                    <p className="text-xs text-muted-foreground">Customize title and body styling for this section</p>
                  </div>

                  <div className="space-y-4">
                    {/* Title/Heading Color */}
                    <div className="space-y-2">
                      <Label htmlFor={`${section.name}-titleColor`} className="text-sm">Title/Heading Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`${section.name}-titleColor`}
                          type="color"
                          value={sectionStyling.titleColor || styling.headingColor || "#1f2937"}
                          onChange={(e) => updateSectionStyling(section.name, { titleColor: e.target.value })}
                          className="w-12 h-9 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={sectionStyling.titleColor || styling.headingColor || "#1f2937"}
                          onChange={(e) => updateSectionStyling(section.name, { titleColor: e.target.value })}
                          placeholder="#1f2937"
                          className="flex-1 text-sm"
                        />
                      </div>
                    </div>

                    {/* Title/Heading Size */}
                    <div className="space-y-2">
                      <Label htmlFor={`${section.name}-titleSize`} className="text-sm">Title/Heading Size</Label>
                      <Select
                        value={sectionStyling.titleSize || "medium"}
                        onValueChange={(value) => {
                          if (value === "small" || value === "medium" || value === "large") {
                            updateSectionStyling(section.name, { titleSize: value });
                          }
                        }}
                      >
                        <SelectTrigger id={`${section.name}-titleSize`} className="h-9 text-sm">
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
                      <Label htmlFor={`${section.name}-bodyColor`} className="text-sm">Body Text Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id={`${section.name}-bodyColor`}
                          type="color"
                          value={sectionStyling.bodyColor || styling.textColor || "#1f2937"}
                          onChange={(e) => updateSectionStyling(section.name, { bodyColor: e.target.value })}
                          className="w-12 h-9 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={sectionStyling.bodyColor || styling.textColor || "#1f2937"}
                          onChange={(e) => updateSectionStyling(section.name, { bodyColor: e.target.value })}
                          placeholder="#1f2937"
                          className="flex-1 text-sm"
                        />
                      </div>
                    </div>

                    {/* Body Text Size */}
                    <div className="space-y-2">
                      <Label htmlFor={`${section.name}-bodySize`} className="text-sm">Body Text Size</Label>
                      <Select
                        value={sectionStyling.bodySize || "medium"}
                        onValueChange={(value) => {
                          if (value === "small" || value === "medium" || value === "large") {
                            updateSectionStyling(section.name, { bodySize: value });
                          }
                        }}
                      >
                        <SelectTrigger id={`${section.name}-bodySize`} className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">{SIZE_MAP.small}</SelectItem>
                          <SelectItem value="medium">{SIZE_MAP.medium}</SelectItem>
                          <SelectItem value="large">{SIZE_MAP.large}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </Card>
  );
};

