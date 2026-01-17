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
  actualDataForScoring?: CVFormData; // Use actual form data (without hints) for score calculation
  onTemplateChange?: (template: CVTemplate) => void;
  onSectionOrderChange?: (sectionOrder: string[]) => void;
  onStylingChange?: (styling: CVFormData['styling']) => void;
}

export const CVPreview = ({ data, actualDataForScoring, onTemplateChange, onSectionOrderChange, onStylingChange }: CVPreviewProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("design");
  const [pageCount, setPageCount] = useState(1);
  const [pageBreakPositions, setPageBreakPositions] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const template = data.template || "modern";
  const defaultSectionOrder = ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"];
  const sectionOrder = data.sectionOrder || defaultSectionOrder;

  // Calculate resume score using actual form data (without hints), not preview data
  const resumeScore = useMemo(() => {
    try {
      // Use actualDataForScoring if provided (form data without hints), otherwise use data
      const dataForScoring = actualDataForScoring || data;
      return calculateResumeScore(dataForScoring);
    } catch {
      return { overallScore: 0 };
    }
  }, [actualDataForScoring, data]);

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

  // Sync horizontal scroll between horizontal scrollbar and content for LaTeX
  useEffect(() => {
    if (template !== 'latex' || !horizontalScrollRef.current || !previewRef.current) return;

    const horizontalScrollEl = horizontalScrollRef.current;
    const contentEl = previewRef.current.querySelector('.resume-content-wrapper') as HTMLElement;
    
    if (!contentEl) return;

    // Set the scrollable width to match content width
    const updateScrollWidth = () => {
      const scrollWidth = contentEl.scrollWidth;
      const spacer = horizontalScrollEl.querySelector('div');
      if (spacer) {
        spacer.style.width = `${scrollWidth}px`;
      }
    };

    updateScrollWidth();
    
    // Update on resize
    const resizeObserver = new ResizeObserver(updateScrollWidth);
    resizeObserver.observe(contentEl);

    const handleHorizontalScroll = () => {
      contentEl.scrollLeft = horizontalScrollEl.scrollLeft;
    };

    const handleContentScroll = () => {
      horizontalScrollEl.scrollLeft = contentEl.scrollLeft;
    };

    horizontalScrollEl.addEventListener('scroll', handleHorizontalScroll);
    contentEl.addEventListener('scroll', handleContentScroll);

    return () => {
      resizeObserver.disconnect();
      horizontalScrollEl.removeEventListener('scroll', handleHorizontalScroll);
      contentEl.removeEventListener('scroll', handleContentScroll);
    };
  }, [template, data]);
  
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
          <div className="relative flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
            {/* Score indicator - sticky at top */}
            <div className="sticky top-0 flex-shrink-0 pb-2 mb-2 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">{t('resume.score.label') || 'Resume Score'}</span>
                </div>
                <span 
                  className={`text-sm font-bold transition-colors duration-300 ${
                    resumeScore.overallScore >= 8 
                      ? 'text-green-600 dark:text-green-400'
                      : resumeScore.overallScore >= 6 
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : resumeScore.overallScore >= 4
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {resumeScore.overallScore}/10
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
            
            {/* Horizontal scroll container - below page indicator for LaTeX */}
            {template === 'latex' && (
              <div 
                ref={horizontalScrollRef}
                className="overflow-x-auto flex-shrink-0 mb-2 pb-1" 
                id="latex-horizontal-scroll"
                style={{ scrollbarWidth: 'thin' }}
              >
                <div style={{ width: '210mm', height: '1px' }}></div>
              </div>
            )}
            
            {/* Scrollable resume content */}
            <div 
              className={`flex-1 min-h-0 ${
                template === 'latex' 
                  ? 'overflow-x-hidden overflow-y-auto' 
                  : 'overflow-y-auto bg-muted/30'
              }`} 
              ref={scrollContainerRef}
            >
              <Card className={`h-fit ${template === 'latex' ? 'overflow-x-hidden overflow-y-hidden bg-background' : 'overflow-hidden'}`} ref={previewRef}>
              <div className={`resume-content-wrapper relative ${template === 'latex' ? 'overflow-x-auto overflow-y-hidden' : ''}`} style={template === 'latex' ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}>
                <style>{`
                  .resume-content-wrapper {
                    position: relative;
                  }
                  .resume-content-wrapper::-webkit-scrollbar {
                    display: none;
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
                    z-index: 999;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                  }
                  /* Page number indicator at bottom right of each page */
                  .page-number-indicator {
                    position: absolute !important;
                    right: 8px !important;
                    font-size: 12px !important;
                    color: #374151 !important;
                    font-weight: 700 !important;
                    pointer-events: none;
                    z-index: 50 !important;
                    background: rgba(255, 255, 255, 0.98) !important;
                    padding: 6px 10px !important;
                    border-radius: 6px !important;
                    border: 2px solid rgba(59, 130, 246, 0.3) !important;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15) !important;
                    font-family: system-ui, -apple-system, sans-serif !important;
                  }
                  /* Add top padding to resume containers for proper spacing */
                  .resume-page-container {
                    padding-top: 32px !important;
                    padding-bottom: 32px !important;
                  }
                `}</style>
                {renderTemplate()}
                
                {/* Page numbers and break lines */}
                {/* First page number - at bottom of first page, before first break */}
                {pageCount > 0 && (
                  <div 
                    className="page-number-indicator"
                    style={{ 
                      position: 'absolute',
                      right: '8px',
                      top: pageBreakPositions.length > 0 
                        ? `${pageBreakPositions[0] - 25}px` 
                        : 'auto',
                      bottom: pageBreakPositions.length === 0 ? '8px' : 'auto',
                      zIndex: 999
                    }}
                  >
                    Page 1
                  </div>
                )}
                {/* Page break lines and subsequent page numbers */}
                {pageBreakPositions.map((position, index) => {
                  const pageNumber = index + 2;
                  // Position represents where page (index+1) ends, so we need next break for page (index+2)
                  // If this is the last page break and there's one more page, position that page number at the end
                  const isLastPage = pageNumber === pageCount;
                  // For page 2, 3, etc., position at bottom of that page (before its next break)
                  // pageBreakPositions[index] is where page (index+1) ends, so page (index+2) starts here
                  // We need the break that marks where page (index+2) ends
                  const pageBreakPosition = pageBreakPositions[index]; // Where this page starts
                  const nextPageBreakPosition = index + 1 < pageBreakPositions.length 
                    ? pageBreakPositions[index + 1] 
                    : null; // Where this page ends (if not last page)
                  
                  return (
                    <div key={`break-${index}`}>
                      {/* Page break line - marks end of previous page, start of this page */}
                      <div 
                        className="page-break-line"
                        style={{ top: `${position}px`, zIndex: 999 }}
                      />
                      {/* Page number at bottom of this page (before next break, or at end if last page) */}
                      <div 
                        className="page-number-indicator"
                        style={{ 
                          position: 'absolute',
                          right: '8px',
                          top: isLastPage 
                            ? 'auto'
                            : nextPageBreakPosition 
                            ? `${nextPageBreakPosition - 25}px` // Bottom of this page (before next break)
                            : 'auto',
                          bottom: isLastPage ? '8px' : 'auto',
                          zIndex: 999
                        }}
                      >
                        Page {pageNumber}
                      </div>
                    </div>
                  );
                })}
              </div>
              </Card>
              <div className="flex items-center gap-2 px-1 mt-2">
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground border-muted-foreground/30 bg-muted/30">
                  {t('resume.preview.notice') || 'Preview only - Page breaks are approximate. PDF export will have proper formatting.'}
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
          <CVRating data={actualDataForScoring || data} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

