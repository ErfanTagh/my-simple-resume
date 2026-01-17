import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressIndicator } from "./ProgressIndicator";
import { LandingTemplatePreview } from "@/pages/LandingTemplatePreview";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { ExperienceStep } from "./ExperienceStep";
import { EducationStep } from "./EducationStep";
import { SkillsStep } from "./SkillsStep";
import { ReviewStep } from "./ReviewStep";
import { CVPreview } from "./CVPreview";
import { SignupOverlay } from "./SignupOverlay";
import { cvFormSchema, CVFormData } from "./types";
import { ChevronLeft, ChevronRight, FileCheck, Beaker, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getTestProfile, getTestProfileNames } from "@/lib/testData";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { calculateResumeScore } from "@/lib/resumeScorer";

interface CVFormContainerProps {
  initialData?: CVFormData;
  editId?: string;
}

export const CVFormContainer = ({ initialData, editId }: CVFormContainerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highestStepVisited, setHighestStepVisited] = useState(0); // Track the highest step number visited
  const [showSignupOverlay, setShowSignupOverlay] = useState(false);
  const [templateSelected, setTemplateSelected] = useState(!!initialData?.template);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Ensure overlay is ALWAYS hidden when navigating between steps - only show when explicitly clicking "Complete CV"
  // Also scroll to top when step changes
  useEffect(() => {
    setShowSignupOverlay(false);
    // Scroll to top of the form container when step changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);


  // Push history state when entering the form (templateSelected becomes true)
  useEffect(() => {
    if (templateSelected && !editId && !initialData) {
      // Push a state when entering the form so we can intercept back button
      window.history.pushState({ formStep: currentStep, templateSelected: true }, '', window.location.pathname);
    }
  }, [templateSelected, editId, initialData, currentStep]);

  // Handle browser back button - intercept and go back to template selection
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If we're in the form (templateSelected is true) and on step 0, go back to template selection
      if (templateSelected && currentStep === 0 && !editId && !initialData) {
        // We can't prevent popstate, but we can update state and push a new state
        setTemplateSelected(false);
        // Push a new state to keep us on the same page and prevent further navigation
        setTimeout(() => {
          window.history.pushState({ templateSelected: false }, '', window.location.pathname);
        }, 0);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentStep, templateSelected, editId, initialData]);

  // Ensure workExperience and education always have at least one entry
  const getDefaultValues = (): CVFormData => {
    const defaults = {
      personalInfo: {
        firstName: "",
        lastName: "",
        professionalTitle: "",
        profileImage: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
        summary: "",
        interests: [],
      },
      workExperience: [{
        position: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
        responsibilities: [],
        technologies: [],
        competencies: []
      }],
      education: [{
        degree: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        field: "",
        keyCourses: []
      }],
      projects: [],
      certificates: [],
      languages: [],
      skills: [],
      sectionOrder: ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"],
      template: "modern" as const,
    };

    if (!initialData) {
      return defaults;
    }

    // If initialData exists, use it but ensure workExperience and education have at least one entry
    return {
      ...initialData,
      workExperience: initialData.workExperience && initialData.workExperience.length > 0
        ? initialData.workExperience
        : defaults.workExperience,
      education: initialData.education && initialData.education.length > 0
        ? initialData.education
        : defaults.education,
    };
  };

  // Merge form data with hint data for preview (show hints only for current step)
  const getPreviewDataWithHints = (formData: CVFormData): CVFormData => {
    // Only show hints when creating a new resume (no initialData and no editId)
    if (initialData || editId) {
      return formData;
    }

    const hintData = getTestProfile("freshGraduate");
    if (!hintData) {
      return formData;
    }

    // Helper to use hint if field is empty (only for current step)
    const useHintIfEmpty = <T,>(value: T, hint: T, showHint: boolean): T => {
      if (!showHint) {
        // Don't show hint - return actual value (even if empty)
        return value || (typeof value === 'string' ? '' : typeof value === 'object' && Array.isArray(value) ? [] : value) as T;
      }
      if (typeof value === 'string') {
        return (value && value.trim() !== '') ? value : hint;
      }
      if (Array.isArray(value)) {
        return value.length > 0 ? value : hint;
      }
      return value || hint;
    };

    // Show hints for personalInfo if we haven't moved past step 0 yet
    const showPersonalInfoHints = highestStepVisited < 1;
    const mergedPersonalInfo = {
      firstName: useHintIfEmpty(formData.personalInfo?.firstName || "", hintData.personalInfo.firstName, showPersonalInfoHints),
      lastName: useHintIfEmpty(formData.personalInfo?.lastName || "", hintData.personalInfo.lastName, showPersonalInfoHints),
      professionalTitle: useHintIfEmpty(formData.personalInfo?.professionalTitle || "", hintData.personalInfo.professionalTitle || "", showPersonalInfoHints),
      profileImage: showPersonalInfoHints ? (formData.personalInfo?.profileImage || "/resume-sample-3.png") : (formData.personalInfo?.profileImage || ""),
      email: useHintIfEmpty(formData.personalInfo?.email || "", hintData.personalInfo.email, showPersonalInfoHints),
      phone: useHintIfEmpty(formData.personalInfo?.phone || "", hintData.personalInfo.phone || "", showPersonalInfoHints),
      location: useHintIfEmpty(formData.personalInfo?.location || "", hintData.personalInfo.location || "", showPersonalInfoHints),
      linkedin: useHintIfEmpty(formData.personalInfo?.linkedin || "", hintData.personalInfo.linkedin || "", showPersonalInfoHints),
      github: formData.personalInfo?.github || "", // Don't show hint for GitHub - many users don't have it
      website: formData.personalInfo?.website || "", // Don't show hint for website - many users don't have it
      summary: useHintIfEmpty(formData.personalInfo?.summary || "", hintData.personalInfo.summary || "", showPersonalInfoHints),
      interests: useHintIfEmpty(formData.personalInfo?.interests || [], hintData.personalInfo.interests || [], showPersonalInfoHints),
    };

    // Show hints for workExperience if we haven't moved past step 1 yet
    const showWorkExperienceHints = highestStepVisited < 2;
    const mergedWorkExperience = showWorkExperienceHints && (!formData.workExperience || formData.workExperience.length === 0 || 
      !formData.workExperience.some(exp => exp.position || exp.company))
      ? (hintData.workExperience || [])
      : (formData.workExperience || []);

    // Show hints for education if we haven't moved past step 2 yet
    const showEducationHints = highestStepVisited < 3;
    const mergedEducation = showEducationHints && (!formData.education || formData.education.length === 0 || 
      !formData.education.some(edu => edu.degree || edu.institution))
      ? (hintData.education || [])
      : (formData.education || []);

    // Show hints for projects if we haven't moved past step 1 yet
    const showProjectsHints = highestStepVisited < 2;
    const mergedProjects = showProjectsHints && (!formData.projects || formData.projects.length === 0 || 
      !formData.projects.some(proj => proj.name || proj.description))
      ? (hintData.projects ? hintData.projects.slice(0, 1) : [])
      : (formData.projects || []);

    // Show hints for languages if we haven't moved past step 3 yet
    const showLanguagesHints = highestStepVisited < 4;
    const mergedLanguages = showLanguagesHints && (!formData.languages || formData.languages.length === 0 || 
      !formData.languages.some(lang => lang.language))
      ? (hintData.languages || [])
      : (formData.languages || []);

    // Show hints for skills if we haven't moved past step 3 yet
    const showSkillsHints = highestStepVisited < 4;
    const mergedSkills = showSkillsHints && (!formData.skills || formData.skills.length === 0 || 
      !formData.skills.some(skill => skill.skill))
      ? (hintData.skills || [])
      : (formData.skills || []);

    return {
      ...formData,
      personalInfo: mergedPersonalInfo,
      workExperience: mergedWorkExperience,
      education: mergedEducation,
      projects: mergedProjects,
      languages: mergedLanguages,
      skills: mergedSkills,
      certificates: formData.certificates || [],
    };
  };

  const form = useForm<CVFormData>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: getDefaultValues(),
  });

  // When creating a new resume, prefill personal info from logged-in user
  useEffect(() => {
    if (editId || !user) return;

    form.reset((current) => ({
      ...current,
      personalInfo: {
        ...current.personalInfo,
        firstName: user.first_name || current.personalInfo.firstName,
        lastName: user.last_name || current.personalInfo.lastName,
        email: user.email || current.personalInfo.email,
      },
    }));
  }, [editId, user, form]);

  // Watch form data for live preview
  const formData = form.watch();

  // Set template as selected if initialData has a template
  useEffect(() => {
    if (initialData?.template) {
      setTemplateSelected(true);
    }
  }, [initialData]);

  const steps = [
    { component: PersonalInfoStep, label: t('resume.steps.personal') },
    { component: ExperienceStep, label: t('resume.steps.experience') },
    { component: EducationStep, label: t('resume.steps.education') },
    { component: SkillsStep, label: t('resume.steps.skills') },
    { component: ReviewStep, label: t('resume.steps.review') },
  ];

  const handleEditStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleStepClick = async (stepIndex: number) => {
    // Allow going back to previous steps without validation
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex);
      return;
    }
    
    // For future steps, validate required fields first (firstName, lastName, email)
    if (stepIndex > currentStep) {
      const isValid = await form.trigger("personalInfo");
      
      if (!isValid) {
        // Validation failed - prevent navigation silently
        return;
      }
    }
    
    setCurrentStep(stepIndex);
    setHighestStepVisited(prev => Math.max(prev, stepIndex));
  };

  // Test data loader (dev only)
  const handleLoadTestProfile = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const profileName = e.target.value;
    if (!profileName) return;

    const profile = getTestProfile(profileName);
    if (profile) {
      form.reset(profile);
      setCurrentStep(0);
      toast({
        title: "Test Profile Loaded! 🧪",
        description: `Loaded "${profileName}" profile with test data.`,
      });
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = async () => {
    let isValid = false;
    
    if (currentStep === 0) {
      isValid = await form.trigger("personalInfo");
    } else {
      isValid = true;
    }

    if (isValid) {
      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setHighestStepVisited(prev => Math.max(prev, nextStep));
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (data: CVFormData) => {
    setIsSaving(true);
    
    // Ensure overlay is hidden at start - only show after user clicks "Complete CV"
    setShowSignupOverlay(false);
    
    try {
      // Calculate resume score using frontend scorer
      const scoreResult = calculateResumeScore(data);
      
      // Map frontend score format to backend format
      // Frontend: categories with names, overallScore 0-100
      // Backend: completeness_score, clarity_score, formatting_score, impact_score, overall_score (all 0-10)
      const getCategoryScore = (name: string): number => {
        const category = scoreResult.categories.find(c => c.name === name);
        if (!category) return 0;
        return category.score; // Already in 0-maxScore format
      };
      
      const getCategoryMaxScore = (name: string): number => {
        const category = scoreResult.categories.find(c => c.name === name);
        if (!category) return 1; // Avoid division by zero
        return category.maxScore;
      };
      
      // Map categories to backend format (normalize each to 0-10 scale):
      // Completeness: Content Quality (3 max) + Education & Certifications (0.5 max) + Skills & Proficiency (1 max) = 4.5 max
      const contentQuality = getCategoryScore("Content Quality");
      const contentQualityMax = getCategoryMaxScore("Content Quality");
      const education = getCategoryScore("Education & Certifications");
      const educationMax = getCategoryMaxScore("Education & Certifications");
      const skills = getCategoryScore("Skills & Proficiency");
      const skillsMax = getCategoryMaxScore("Skills & Proficiency");
      
      // Normalize each to 0-10, then average (weighted by max scores)
      const totalCompletenessMax = contentQualityMax + educationMax + skillsMax;
      let completenessScore = totalCompletenessMax > 0
        ? Math.min(10, Math.round(((contentQuality + education + skills) / totalCompletenessMax) * 10 * 10) / 10)
        : 0;
      
      // Penalize for excessive text - cap completeness score at 7.2
      // Check for excessive text in work experience descriptions
      const workExp = data.workExperience || [];
      const workDescriptions = workExp.map(exp => exp.description || '').filter(Boolean);
      const avgLength = workDescriptions.length > 0 
        ? workDescriptions.reduce((sum, d) => sum + d.length, 0) / workDescriptions.length
        : 0;
      const summaryLength = (data.personalInfo.summary || '').length;
      const projects = data.projects || [];
      const projectDescriptions = projects.map(p => (p.description || '').length);
      const avgProjectLength = projectDescriptions.length > 0
        ? projectDescriptions.reduce((sum, len) => sum + len, 0) / projectDescriptions.length
        : 0;
      
      // Apply penalty if there's too much text in any area - cap at 7.2
      // More aggressive thresholds to catch excessive text
      // Check if any work description exceeds 400 chars, or average exceeds 350
      const hasLongWorkDesc = workDescriptions.some(d => d.length > 400) || avgLength > 350;
      const hasLongSummary = summaryLength > 250;
      const hasLongProjects = projectDescriptions.some(len => len > 400) || avgProjectLength > 350;
      const hasExcessiveText = hasLongWorkDesc || hasLongSummary || hasLongProjects;
      
      if (hasExcessiveText && completenessScore > 7.2) {
        completenessScore = 7.2; // Always cap at 7.2 when there's excessive text
      }
      
      // Clarity: Structure & Format (2 max) + Professional Summary (1 max) = 3 max
      const structure = getCategoryScore("Structure & Format");
      const structureMax = getCategoryMaxScore("Structure & Format");
      const summary = getCategoryScore("Professional Summary");
      const summaryMax = getCategoryMaxScore("Professional Summary");
      
      const totalClarityMax = structureMax + summaryMax;
      const clarityScore = totalClarityMax > 0
        ? Math.min(10, Math.round(((structure + summary) / totalClarityMax) * 10 * 10) / 10)
        : 0;
      
      // Formatting: ATS Optimization (0.5 max) -> normalize to 0-10
      const ats = getCategoryScore("ATS Optimization");
      const atsMax = getCategoryMaxScore("ATS Optimization");
      const formattingScore = atsMax > 0
        ? Math.min(10, Math.round((ats / atsMax) * 10 * 10) / 10)
        : 0;
      
      // Impact: Experience Section (2 max) -> normalize to 0-10
      const experience = getCategoryScore("Experience Section");
      const experienceMax = getCategoryMaxScore("Experience Section");
      const impactScore = experienceMax > 0
        ? Math.min(10, Math.round((experience / experienceMax) * 10 * 10) / 10)
        : 0;
      
      // Overall: Already in 0-10 format
      const overallScore = scoreResult.overallScore;
      
      // Add scores to resume data
      const resumeDataWithScores: CVFormData & {
        completenessScore: number;
        clarityScore: number;
        formattingScore: number;
        impactScore: number;
        overallScore: number;
      } = {
        ...data,
        completenessScore,
        clarityScore,
        formattingScore,
        impactScore,
        overallScore,
      };
      
      // Check if user is authenticated
      if (!user) {
        // User is not authenticated - save to localStorage and show signup overlay
        localStorage.setItem('pendingResume', JSON.stringify(resumeDataWithScores));
        setIsSaving(false);
        // Show full-page signup overlay with blurred resume ONLY when Complete CV is clicked
        setShowSignupOverlay(true);
        return;
      }

      const { resumeAPI } = await import('@/lib/api');
      
      if (editId) {
        const updatedResume = await resumeAPI.update(editId, resumeDataWithScores as any);

        toast({
          title: "CV Updated Successfully!",
          description: "Opening your resume in a new tab...",
        });

        setTimeout(() => {
          window.open(`/resume/${updatedResume.id}`, '_blank');
          navigate('/resumes');
        }, 800);
      } else {
        const savedResume = await resumeAPI.create(resumeDataWithScores as any);
        
        toast({
          title: "CV Saved Successfully!",
          description: "Opening your resume in a new tab...",
        });

        setTimeout(() => {
          window.open(`/resume/${savedResume.id}`, '_blank');
          navigate('/resumes');
        }, 1000);
      }
    } catch (error: any) {
      // Show detailed error message
      const errorMessage = error.message || error.toString() || "Failed to save your CV. Please try again.";
      
      toast({
        title: "Error Saving CV",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const onError = (errors: any) => {
    toast({
      title: "Validation Error",
      description: "Please check all required fields and fix any errors.",
      variant: "destructive",
    });
  };

  return (
    <>
      {showSignupOverlay && (
        <SignupOverlay
          resumeData={form.getValues()}
          onClose={() => setShowSignupOverlay(false)}
        />
      )}
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4 sm:px-6">
      <div className="max-w-full mx-6 sm:mx-8 lg:mx-12">
        {!templateSelected ? (
          // Template Selection Screen (before starting the form)
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t('resume.templateSelection.title')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t('resume.templateSelection.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { nameKey: 'templateModern', descKey: 'templateModernDesc', key: 'modern' as const },
                { nameKey: 'templateClassic', descKey: 'templateClassicDesc', key: 'classic' as const },
                { nameKey: 'templateCreative', descKey: 'templateCreativeDesc', key: 'creative' as const },
                { nameKey: 'templateMinimal', descKey: 'templateMinimalDesc', key: 'minimal' as const },
                { nameKey: 'templateLatex', descKey: 'templateLatexDesc', key: 'latex' as const },
                { nameKey: 'templateStarRover', descKey: 'templateStarRoverDesc', key: 'starRover' as const }
              ].map((template) => {
                const isSelected = form.watch("template") === template.key;
                return (
                  <div
                    key={template.key}
                    className={`bg-card rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-[0_8px_25px_-5px_hsl(var(--primary)/0.35)] hover:-translate-y-1.5 flex flex-col h-full ${
                      isSelected
                        ? "border-primary shadow-lg ring-2 ring-primary/20"
                        : "border-border hover:border-primary/30"
                    }`}
                    onClick={() => {
                      form.setValue("template", template.key);
                    }}
                    onDoubleClick={() => {
                      form.setValue("template", template.key);
                      setTemplateSelected(true);
                    }}
                  >
                    <div className="aspect-[3/4] bg-white rounded-t-2xl overflow-hidden border-b border-border shadow-inner relative max-h-[550px] sm:max-h-[650px] lg:max-h-[700px] flex-shrink-0">
                      <div className="absolute inset-0 w-full h-full">
                        <LandingTemplatePreview templateName={template.key} />
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col" style={{ height: '100px' }}>
                      <h3 className="font-bold text-base sm:text-lg mb-1 flex-shrink-0" style={{ color: 'hsl(215 25% 15%)' }}>
                        {t(`landing.${template.nameKey}`)} {t('landing.templateLabel')}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium flex-shrink-0 line-clamp-2" style={{ color: 'hsl(214 95% 45%)' }}>
                        {t(`landing.${template.descKey}`)}
                      </p>
                      {isSelected && (
                        <div className="flex items-center gap-2 text-primary text-sm font-semibold mt-auto flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>{t('common.selected') || 'Selected'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continue Button */}
            {form.watch("template") && (
              <div className="mt-10 flex justify-center">
                <Button
                  size="lg"
                  onClick={() => setTemplateSelected(true)}
                  className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-8 sm:px-10 py-6 sm:py-7 rounded-2xl shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 font-semibold"
                >
                  {t('resume.templateSelection.continue') || 'Continue with Template'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          // Main Form Flow
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {t('resume.form.title')}
              </h1>
              <p className="text-muted-foreground">
                {t('resume.form.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Form Section - Takes 4 columns */}
          <div className="lg:col-span-6">
            <Card className="p-8 shadow-elevated">
              <ProgressIndicator
                currentStep={currentStep}
                totalSteps={steps.length}
                stepLabels={steps.map((s) => s.label)}
                onStepClick={handleStepClick}
              />

              {/* Dev-only Test Data Loader */}
              {import.meta.env.DEV && (
                <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Beaker className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <label className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                      Development Mode: Test Data Loader
                    </label>
                  </div>
                  <select
                    onChange={handleLoadTestProfile}
                    className="w-full p-2 border border-amber-300 dark:border-amber-700 rounded-md text-sm bg-white dark:bg-amber-900 text-amber-900 dark:text-amber-100"
                    defaultValue=""
                  >
                    <option value="">Select a test profile...</option>
                    <option value="minimal">Minimal Data (Edge Case)</option>
                    <option value="maximal">Maximal Data (Stress Test)</option>
                    <option value="specialChars">Special Characters (José, 中文)</option>
                    <option value="longText">Long Text Overflow</option>
                    <option value="freshGraduate">Fresh Graduate</option>
                    <option value="seniorProfessional">Senior Professional (10+ years)</option>
                    <option value="withProfileImage">With Profile Image</option>
                    <option value="allOptionalEmpty">All Optional Fields Empty</option>
                  </select>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
                    💡 Instantly fill the form with test data to preview different resume layouts
                  </p>
                </div>
              )}

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  // Prevent any automatic form submission - only allow explicit button click
                }}
                onKeyDown={(e) => {
                  // Prevent form submission on Enter key
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              >
                  {currentStep === steps.length - 1 ? (
                    <ReviewStep form={form} onEditStep={handleEditStep} />
                  ) : (
                    <CurrentStepComponent form={form} />
                  )}

                  <div className="flex justify-between mt-8 pt-6 border-t">
                    {currentStep > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                    )}
                    {currentStep === 0 && <div />}

                    {currentStep === steps.length - 1 ? (
                      <Button 
                        type="button"
                        className="gap-2" 
                        disabled={isSaving}
                        onClick={(e) => {
                          e.preventDefault();
                          // Explicitly trigger form submission
                          form.handleSubmit(onSubmit, onError)();
                        }}
                      >
                        {isSaving ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <FileCheck className="h-4 w-4" />
                            Complete CV
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button type="button" onClick={handleNext}>
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </form>
            </Card>
          </div>

              {/* Right Sidebar - Always Visible Preview */}
              <div className="hidden lg:block lg:col-span-4">
                <CVPreview 
                  data={getPreviewDataWithHints(formData)}
                  actualDataForScoring={formData}
                  onTemplateChange={(template) => form.setValue("template", template)}
                  onSectionOrderChange={(sectionOrder) => form.setValue("sectionOrder", sectionOrder)}
                  onStylingChange={(styling) => form.setValue("styling", styling)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    </>
  );
};