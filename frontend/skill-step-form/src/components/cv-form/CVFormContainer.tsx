import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressIndicator } from "./ProgressIndicator";
import { TemplateSelector } from "./TemplateSelector";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { ExperienceStep } from "./ExperienceStep";
import { EducationStep } from "./EducationStep";
import { SkillsStep } from "./SkillsStep";
import { ReviewStep } from "./ReviewStep";
import { CVPreview } from "./CVPreview";
import { SignupOverlay } from "./SignupOverlay";
import { cvFormSchema, CVFormData } from "./types";
import { ChevronLeft, ChevronRight, FileCheck, Beaker } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getTestProfile, getTestProfileNames } from "@/lib/testData";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface CVFormContainerProps {
  initialData?: CVFormData;
  editId?: string;
}

export const CVFormContainer = ({ initialData, editId }: CVFormContainerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
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
      // Check if user is authenticated
      if (!user) {
        // User is not authenticated - save to localStorage and show signup overlay
        localStorage.setItem('pendingResume', JSON.stringify(data));
        setIsSaving(false);
        // Show full-page signup overlay with blurred resume ONLY when Complete CV is clicked
        setShowSignupOverlay(true);
        return;
      }

      const { resumeAPI } = await import('@/lib/api');
      
      if (editId) {
        const updatedResume = await resumeAPI.update(editId, data as any);

        toast({
          title: "CV Updated Successfully!",
          description: "Opening your resume in a new tab...",
        });

        setTimeout(() => {
          window.open(`/resume/${updatedResume.id}`, '_blank');
          navigate('/resumes');
        }, 800);
      } else {
        const savedResume = await resumeAPI.create(data as any);
        
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
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {!templateSelected ? (
          // Template Selection Screen (before starting the form)
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            <div className="lg:col-span-4">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {t('resume.templateSelection.title')}
                </h1>
                <p className="text-muted-foreground">
                  {t('resume.templateSelection.subtitle')}
                </p>
              </div>

              <Card className="p-8 shadow-elevated">
                <TemplateSelector
                  selected={form.watch("template") || "modern"}
                  onSelect={(template) => {
                    form.setValue("template", template);
                    setTemplateSelected(true);
                  }}
                />
              </Card>
            </div>

            {/* Preview on template selection screen */}
            <div className="hidden lg:block lg:col-span-3">
              <CVPreview 
                data={formData}
                onTemplateChange={(template) => form.setValue("template", template)}
                onSectionOrderChange={(sectionOrder) => form.setValue("sectionOrder", sectionOrder)}
              />
            </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Form Section - Takes 4 columns */}
          <div className="lg:col-span-4">
            <Card className="p-8 shadow-elevated">
              <ProgressIndicator
                currentStep={currentStep}
                totalSteps={steps.length}
                stepLabels={steps.map((s) => s.label)}
                onStepClick={(stepIndex) => setCurrentStep(stepIndex)}
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>

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
              <div className="hidden lg:block lg:col-span-3">
                <CVPreview 
                  data={formData} 
                  onTemplateChange={(template) => form.setValue("template", template)}
                  onSectionOrderChange={(sectionOrder) => form.setValue("sectionOrder", sectionOrder)}
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