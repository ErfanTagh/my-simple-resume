import { useState } from "react";
import { CVFormData, CVTemplate } from "./types";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { LatexTemplate } from "./templates/LatexTemplate";
import { StarRoverTemplate } from "./templates/StarRoverTemplate";
import { CVRating } from "./CVRating";
import { TemplateSelector } from "./TemplateSelector";
import { SectionOrderManager } from "./SectionOrderManager";
import { FileText, TrendingUp, FileStack, Settings, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CVPreviewProps {
  data: CVFormData;
  onTemplateChange?: (template: CVTemplate) => void;
  onSectionOrderChange?: (sectionOrder: string[]) => void;
}

export const CVPreview = ({ data, onTemplateChange, onSectionOrderChange }: CVPreviewProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("design");
  const template = data.template || "modern";
  const defaultSectionOrder = ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"];
  const sectionOrder = data.sectionOrder || defaultSectionOrder;
  
  const handleTemplateSelect = (selectedTemplate: CVTemplate) => {
    if (onTemplateChange) {
      onTemplateChange(selectedTemplate);
    }
    // Switch to Design tab when template is selected
    setActiveTab("design");
  };
  
  const handleSectionOrderChange = (newOrder: string[]) => {
    if (onSectionOrderChange) {
      onSectionOrderChange(newOrder);
    }
  };
  
  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return <ClassicTemplate data={data} />;
      case "minimal":
        return <MinimalTemplate data={data} />;
      case "creative":
        return <CreativeTemplate data={data} />;
      case "latex":
        return <LatexTemplate data={data} />;
      case "starRover":
        return <StarRoverTemplate data={data} />;
      case "modern":
      default:
        return <ModernTemplate data={data} />;
    }
  };
  
  return (
    <div className="space-y-4 sticky top-4 w-full min-w-[400px]">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="design" className="flex items-center gap-2 text-xs">
            <FileText className="h-4 w-4" />
            {t('resume.tabs.design') || 'Design'}
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2 text-xs">
            <FileStack className="h-4 w-4" />
            {t('resume.tabs.templates') || 'Templates'}
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2 text-xs">
            <Settings className="h-4 w-4" />
            {t('resume.tabs.settings') || 'Settings'}
          </TabsTrigger>
          <TabsTrigger value="score" className="flex items-center gap-2 text-xs">
            <TrendingUp className="h-4 w-4" />
            {t('resume.tabs.score') || 'Score'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="design" className="mt-4">
          <div className="space-y-2">
            <Card className="overflow-hidden h-fit">
              {renderTemplate()}
            </Card>
            <div className="flex items-center gap-2 px-1">
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
              <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-muted-foreground/30 bg-muted/30">
                {t('resume.preview.notice') || 'Preview - Final export will have cleaner formatting'}
              </Badge>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="mt-4">
          <Card className="p-6">
            <TemplateSelector
              selected={template}
              onSelect={handleTemplateSelect}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-4">
          <SectionOrderManager
            sectionOrder={sectionOrder}
            onReorder={handleSectionOrderChange}
          />
        </TabsContent>
        
        <TabsContent value="score" className="mt-4">
          <CVRating data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

