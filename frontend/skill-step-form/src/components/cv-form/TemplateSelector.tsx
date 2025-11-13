import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CVTemplate } from "./types";
import { FileText, Sparkles, Minimize2, Palette } from "lucide-react";

interface TemplateSelectorProps {
  selected: CVTemplate;
  onSelect: (template: CVTemplate) => void;
}

const templates = [
  {
    id: "modern" as CVTemplate,
    name: "Modern",
    description: "Clean and professional with bold sections",
    icon: Sparkles,
    preview: "Two-column layout with accent colors",
  },
  {
    id: "classic" as CVTemplate,
    name: "Classic",
    description: "Traditional single-column format",
    icon: FileText,
    preview: "Simple and elegant professional style",
  },
  {
    id: "minimal" as CVTemplate,
    name: "Minimal",
    description: "Sleek and minimalist design",
    icon: Minimize2,
    preview: "Ultra-clean with maximum whitespace",
  },
  {
    id: "creative" as CVTemplate,
    name: "Creative",
    description: "Stand out with bold typography",
    icon: Palette,
    preview: "Eye-catching design for creative roles",
  },
];

export const TemplateSelector = ({ selected, onSelect }: TemplateSelectorProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-lg font-semibold">Choose CV Template</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Select a template that best fits your style and industry
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selected === template.id;
          
          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected
                  ? "ring-2 ring-primary shadow-md"
                  : "hover:ring-1 hover:ring-muted-foreground/20"
              }`}
              onClick={() => onSelect(template.id)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground">{template.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {template.description}
                  </p>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground italic">
                    {template.preview}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
