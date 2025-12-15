import { Link } from "react-router-dom";
import { FileText, Sparkles, Palette, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { LandingTemplatePreview } from "./LandingTemplatePreview";

const Templates = () => {
  const templates = [
    { name: 'Modern', key: 'modern' as const, description: 'Clean & Contemporary Design', icon: Sparkles },
    { name: 'Classic', key: 'classic' as const, description: 'Traditional & Professional', icon: FileText },
    { name: 'Creative', key: 'creative' as const, description: 'Bold & Eye-Catching', icon: Palette },
    { name: 'Minimal', key: 'minimal' as const, description: 'Minimalist & Elegant', icon: Minus },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Resume Templates</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our professionally designed templates. All templates are ATS-friendly and optimized for success.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {templates.map((template) => (
            <div
              key={template.key}
              className="bg-card rounded-2xl border border-border p-6 shadow-lg hover:shadow-[0_8px_25px_-5px_hsl(var(--primary)/0.35)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className="aspect-[3/4] bg-white rounded-lg mb-4 overflow-hidden border border-border shadow-inner relative max-h-[320px]">
                <div className="absolute inset-0">
                  <LandingTemplatePreview templateName={template.key} />
                </div>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <template.icon className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-bold text-xl text-foreground mb-1">{template.name} Template</h3>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>ATS-optimized formatting</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Professional design</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span>Print-ready PDF export</span>
                </li>
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/create">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Building Your Resume
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Templates;

