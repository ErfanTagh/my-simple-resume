import { CVFormData } from "./types";
import { Card } from "@/components/ui/card";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";

interface CVPreviewProps {
  data: CVFormData;
}

export const CVPreview = ({ data }: CVPreviewProps) => {
  const template = data.template || "modern";
  
  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return <ClassicTemplate data={data} />;
      case "minimal":
        return <MinimalTemplate data={data} />;
      case "creative":
        return <CreativeTemplate data={data} />;
      case "modern":
      default:
        return <ModernTemplate data={data} />;
    }
  };
  
  return (
    <Card className="overflow-hidden h-fit sticky top-4">
      {renderTemplate()}
    </Card>
  );
};

