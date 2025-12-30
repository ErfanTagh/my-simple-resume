import { useState, useMemo, useEffect, useRef } from "react";
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
import { StylingSettings } from "./StylingSettings";
import { FileText, TrendingUp, FileStack, Settings, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { calculateResumeScore } from "@/lib/resumeScorer";

interface CVPreviewProps {
  data: CVFormData;
  onTemplateChange?: (template: CVTemplate) => void;
  onSectionOrderChange?: (sectionOrder: string[]) => void;
  onStylingChange?: (styling: CVFormData['styling']) => void;
}

export const CVPreview = ({ data, onTemplateChange, onSectionOrderChange, onStylingChange }: CVPreviewProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("design");
  const [pageCount, setPageCount] = useState(1);
  const [pageBreakPositions, setPageBreakPositions] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const template = data.template || "modern";
  const defaultSectionOrder = ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"];
  const sectionOrder = data.sectionOrder || defaultSectionOrder;

  // Calculate resume score
  const resumeScore = useMemo(() => {
    try {
      return calculateResumeScore(data);
    } catch {
      return { overallScore: 0 };
    }
  }, [data]);

  // Calculate page count based on content height
  useEffect(() => {
    if (previewRef.current && activeTab === "design") {
      const calculatePages = () => {
        const card = previewRef.current;
        if (!card) {
          setPageCount(1);
          return;
        }
        
        // Find the wrapper div that contains the template
        const wrapper = card.querySelector('.resume-content-wrapper');
        if (!wrapper) {
          setPageCount(1);
          return;
        }
        
        // Find the template's root element - it's the first direct child of wrapper
        // Templates render a div with classes like "bg-background", "p-8", etc.
        let templateRoot = wrapper.firstElementChild as HTMLElement;
        
        // Fallback: if first child is not found, look for divs with template-like classes
        if (!templateRoot || templateRoot.scrollHeight === 0) {
          // Try to find the template root by looking for divs with common template classes
          const possibleRoots = wrapper.querySelectorAll('div.bg-background, div.p-8, div.max-w-4xl');
          if (possibleRoots.length > 0) {
            templateRoot = possibleRoots[0] as HTMLElement;
          }
        }
        
        // Last fallback: find the largest div in the wrapper
        if (!templateRoot || templateRoot.scrollHeight === 0) {
          const allDivs = Array.from(wrapper.querySelectorAll('div')) as HTMLElement[];
          if (allDivs.length > 0) {
            templateRoot = allDivs.reduce((largest, current) => {
              return (current.scrollHeight > largest.scrollHeight) ? current : largest;
            }, allDivs[0]);
          }
        }
        
        if (!templateRoot || templateRoot.scrollHeight === 0) {
          setPageCount(1);
          return;
        }
        
        // Get the actual rendered height of the content
        // Use scrollHeight for accurate measurement including all content
        const contentHeight = templateRoot.scrollHeight;
        
        // A4 page dimensions: 210mm x 297mm
        // At 96dpi: 794px x 1123px
        // Account for PDF padding: 15mm top + 15mm bottom = 30mm = ~113px
        // Actual content area per page: ~1010px
        // But in preview, templates have their own padding (p-8 = 32px = 64px total)
        // So effective page height in preview: ~1010px
        const pageHeight = 1010;
        
        // Calculate pages - use a smaller buffer (50px) since we're measuring scrollHeight
        // which should be accurate. The buffer accounts for minor spacing differences.
        const pages = contentHeight > pageHeight + 50 
          ? Math.ceil(contentHeight / pageHeight)
          : 1;
        
        setPageCount(Math.max(1, pages));
        
        // Calculate page break positions (where each page ends)
        const breaks: number[] = [];
        if (pages > 1) {
          for (let i = 1; i < pages; i++) {
            breaks.push(pageHeight * i);
          }
        }
        setPageBreakPositions(breaks);
      };
      
      // Use ResizeObserver to watch for content size changes
      const wrapperElement = previewRef.current?.querySelector('.resume-content-wrapper');
      let resizeObserver: ResizeObserver | null = null;
      
      if (wrapperElement) {
        resizeObserver = new ResizeObserver(() => {
          calculatePages();
        });
        resizeObserver.observe(wrapperElement);
      }
      
      // Calculate immediately and after delays
      calculatePages();
      const timeout1 = setTimeout(calculatePages, 100);
      const timeout2 = setTimeout(calculatePages, 300);
      const timeout3 = setTimeout(calculatePages, 600);
      
      // Also recalculate on window resize
      const handleResize = () => {
        calculatePages();
      };
      window.addEventListener('resize', handleResize);
      
      return () => {
        if (resizeObserver) {
          resizeObserver.disconnect();
        }
        clearTimeout(timeout1);
        clearTimeout(timeout2);
        clearTimeout(timeout3);
        window.removeEventListener('resize', handleResize);
      };
    } else {
      // Reset to 1 page when not on design tab
      setPageCount(1);
      setPageBreakPositions([]);
      setCurrentPage(1);
    }
  }, [data, activeTab, template]);

  // Track scroll position to update current page indicator
  useEffect(() => {
    if (scrollContainerRef.current && activeTab === "design" && pageCount > 1) {
      const scrollContainer = scrollContainerRef.current;
      const pageHeight = 1010;
      
      const handleScroll = () => {
        const scrollTop = scrollContainer.scrollTop;
        // Calculate which page we're currently viewing
        // Add a buffer (100px) to account for scrolling into the next page
        const currentPageNum = Math.min(
          Math.max(1, Math.floor(scrollTop / pageHeight) + 1),
          pageCount
        );
        setCurrentPage(currentPageNum);
      };
      
      scrollContainer.addEventListener('scroll', handleScroll);
      // Calculate initial page
      handleScroll();
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    } else {
      setCurrentPage(1);
    }
  }, [pageCount, activeTab, pageBreakPositions]);
  
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
          <div className="relative flex flex-col" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {/* Score indicator - sticky at top */}
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2 mb-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">{t('resume.score.label') || 'Resume Score'}</span>
                </div>
                <span 
                  className={`text-sm font-bold transition-colors duration-300 ${
                    (resumeScore.overallScore > 10 ? resumeScore.overallScore / 10 : resumeScore.overallScore) >= 8 
                      ? 'text-green-600 dark:text-green-400'
                      : (resumeScore.overallScore > 10 ? resumeScore.overallScore / 10 : resumeScore.overallScore) >= 6 
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : (resumeScore.overallScore > 10 ? resumeScore.overallScore / 10 : resumeScore.overallScore) >= 4
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {Math.round(resumeScore.overallScore > 10 ? resumeScore.overallScore / 10 : resumeScore.overallScore)}/10
                </span>
              </div>

              {/* Page indicator - sticky at top */}
              <div className="flex items-center justify-between px-2 py-1.5 bg-muted/30 rounded-md border border-border/50">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {pageCount === 1 
                      ? `${t('resume.preview.page') || 'Page'} 1`
                      : `${t('resume.preview.page') || 'Page'} ${currentPage} / ${pageCount}`
                    }
                  </span>
                </div>
                {pageCount > 1 && (
                  <div className="flex gap-1">
                    {Array.from({ length: pageCount }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-4 rounded transition-colors ${
                          i + 1 === currentPage ? 'bg-primary' : 'bg-muted-foreground/40'
                        }`}
                        title={`${t('resume.preview.page') || 'Page'} ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Scrollable resume content */}
            <div className="overflow-y-auto flex-1" ref={scrollContainerRef}>
              <Card className="overflow-hidden h-fit" ref={previewRef}>
              <div className="resume-content-wrapper relative">
                <style>{`
                  .resume-content-wrapper {
                    position: relative;
                  }
                  /* Visual page break indicator at calculated page boundaries */
                  .page-break-line {
                    position: absolute;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: repeating-linear-gradient(
                      to right,
                      #9ca3af 0px,
                      #9ca3af 8px,
                      transparent 8px,
                      transparent 16px
                    );
                    pointer-events: none;
                    z-index: 10;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                  }
                  /* Page number indicator at bottom right of each page */
                  .page-number-indicator {
                    position: absolute;
                    right: 0;
                    font-size: 10px;
                    color: #6b7280;
                    font-weight: 500;
                    pointer-events: none;
                    z-index: 10;
                    background: rgba(255, 255, 255, 0.9);
                    padding: 2px 6px;
                    border-radius: 3px;
                  }
                `}</style>
                {renderTemplate()}
                {/* Render page break lines and page numbers at calculated positions */}
                {pageBreakPositions.map((position, index) => (
                  <div key={`break-${index}`}>
                    <div 
                      className="page-break-line"
                      style={{ top: `${position}px` }}
                    />
                    {/* Show page number at the bottom of each page (just before the break) */}
                    <div 
                      className="page-number-indicator"
                      style={{ top: `${position - 16}px` }}
                    >
                      {t('resume.preview.page') || 'Page'} {index + 1}
                    </div>
                  </div>
                ))}
                {/* Show page number for the last page at the bottom */}
                {pageCount > 0 && (
                  <div 
                    className="page-number-indicator"
                    style={{ bottom: '4px' }}
                  >
                    {t('resume.preview.page') || 'Page'} {pageCount}
                  </div>
                )}
              </div>
              </Card>
              <div className="flex items-center gap-2 px-1 mt-2">
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-muted-foreground/30 bg-muted/30">
                  {t('resume.preview.notice') || 'Preview - Final export will have cleaner formatting'}
                </Badge>
              </div>
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
        
        <TabsContent value="settings" className="mt-4 space-y-4">
          <StylingSettings
            data={data}
            onStylingChange={(styling) => {
              if (onStylingChange) {
                onStylingChange(styling);
              }
            }}
          />
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

