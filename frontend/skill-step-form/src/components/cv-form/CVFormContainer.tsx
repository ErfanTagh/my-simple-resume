import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressIndicator } from "./ProgressIndicator";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { WorkExperienceStep } from "./WorkExperienceStep";
import { EducationStep } from "./EducationStep";
import { ProjectsStep } from "./ProjectsStep";
import { CertificatesStep } from "./CertificatesStep";
import { LanguagesStep } from "./LanguagesStep";
import { SkillsStep } from "./SkillsStep";
import { ReviewStep } from "./ReviewStep";
import { CVPreview } from "./CVPreview";
import { CVRating } from "./CVRating";
import { TemplateSelector } from "./TemplateSelector";
import { SectionOrderManager } from "./SectionOrderManager";
import { cvFormSchema, CVFormData, CVTemplate } from "./types";
import { ChevronLeft, ChevronRight, FileCheck, Beaker, Sparkles, Palette, ListOrdered } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getTestProfile, getTestProfileNames } from "@/lib/testData";
import { useAuth } from "@/contexts/AuthContext";

interface CVFormContainerProps {
  initialData?: CVFormData;
  editId?: string;
}

export const CVFormContainer = ({ initialData, editId }: CVFormContainerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<CVFormData>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: initialData ?? {
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
        interests: [{ interest: "" }],
      },
      workExperience: [{ 
        position: "", 
        company: "", 
        location: "",
        startDate: "", 
        endDate: "", 
        description: "",
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
      languages: [{ language: "", proficiency: "" }],
      skills: [{ skill: "" }],
      sectionOrder: ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"],
      template: "modern",
    },
  });

  // Log form state changes
  useEffect(() => {
    console.log("📊 Form State Update:", {
      isValid: form.formState.isValid,
      isSubmitting: form.formState.isSubmitting,
      isValidating: form.formState.isValidating,
      errors: form.formState.errors,
      dirtyFields: form.formState.dirtyFields,
      touchedFields: form.formState.touchedFields,
    });
  }, [form.formState]);

  // When creating a new resume, prefill personal info from logged-in user
  useEffect(() => {
    if (editId || !user) return;

    console.log("👤 Prefilling user data:", user);
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

  const steps = [
    { component: PersonalInfoStep, label: "Personal" },
    { component: WorkExperienceStep, label: "Experience" },
    { component: EducationStep, label: "Education" },
    { component: ProjectsStep, label: "Projects" },
    { component: CertificatesStep, label: "Certificates" },
    { component: LanguagesStep, label: "Languages" },
    { component: SkillsStep, label: "Skills" },
    { component: ReviewStep, label: "Review" },
  ];

  const handleEditStep = (step: number) => {
    console.log(`📝 Editing step: ${step} (${steps[step].label})`);
    setCurrentStep(step);
  };

  // Test data loader (dev only)
  const handleLoadTestProfile = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const profileName = e.target.value;
    if (!profileName) return;

    console.log(`🧪 Loading test profile: ${profileName}`);
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
    console.log(`⏭️ Next button clicked from step ${currentStep} (${steps[currentStep].label})`);
    
    let isValid = false;
    
    if (currentStep === 0) {
      console.log("🔍 Validating personalInfo...");
      isValid = await form.trigger("personalInfo");
      console.log("✅ personalInfo validation result:", isValid);
      
      if (!isValid) {
        console.log("❌ Validation errors:", form.formState.errors.personalInfo);
      }
    } else {
      console.log("⏩ Skipping validation for step", currentStep);
      isValid = true;
    }

    if (isValid) {
      if (currentStep < steps.length - 1) {
        const nextStep = currentStep + 1;
        console.log(`✨ Moving to step ${nextStep} (${steps[nextStep].label})`);
        setCurrentStep(nextStep);
      }
    } else {
      console.log("🛑 Cannot proceed - validation failed");
    }
  };

  const handlePrevious = () => {
    console.log(`⏮️ Previous button clicked from step ${currentStep}`);
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      console.log(`⬅️ Moving to step ${prevStep} (${steps[prevStep].label})`);
      setCurrentStep(prevStep);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (data: CVFormData) => {
    console.log("=== 🚀 Starting CV submission ===");
    console.log("📋 Form data:", JSON.stringify(data, null, 2));
    console.log("📊 Form state:", {
      isValid: form.formState.isValid,
      errors: form.formState.errors,
    });
    
    setIsSaving(true);
    try {
      console.log("📦 Importing API service...");
      const { resumeAPI } = await import('@/lib/api');
      console.log("✅ API service imported successfully");
      
      if (editId) {
        console.log(`🔄 Updating existing resume: ${editId}`);
        const updatedResume = await resumeAPI.update(editId, data as any);
        console.log("✅ Resume updated successfully:", updatedResume);

        toast({
          title: "CV Updated Successfully!",
          description: "Opening your resume in a new tab...",
        });

        setTimeout(() => {
          console.log(`🔗 Opening resume in new tab: /resume/${updatedResume.id}`);
          window.open(`/resume/${updatedResume.id}`, '_blank');
          console.log("↪️ Redirecting to /resumes");
          navigate('/resumes');
        }, 800);
      } else {
        console.log("🆕 Creating new resume...");
        const savedResume = await resumeAPI.create(data as any);
        console.log("✅ Resume created successfully:", savedResume);
        
        toast({
          title: "CV Saved Successfully!",
          description: "Opening your resume in a new tab...",
        });

        setTimeout(() => {
          console.log(`🔗 Opening resume in new tab: /resume/${savedResume.id}`);
          window.open(`/resume/${savedResume.id}`, '_blank');
          console.log("↪️ Redirecting to /resumes");
          navigate('/resumes');
        }, 1000);
      }
    } catch (error: any) {
      console.error("=== ❌ Error saving CV ===");
      console.error("💥 Error object:", error);
      console.error("📝 Error message:", error.message);
      console.error("🔍 Error response:", error.response);
      console.error("📚 Error stack:", error.stack);
      
      toast({
        title: "Error Saving CV",
        description: error.message || "Failed to save your CV. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log("🏁 Submission complete, resetting isSaving flag");
      setIsSaving(false);
    }
  };

  const onError = (errors: any) => {
    console.error("=== ❌ Form Validation Failed ===");
    console.error("🚫 All errors:", JSON.stringify(errors, null, 2));
    console.error("📊 Error count:", Object.keys(errors).length);
    
    // Log specific error paths
    Object.keys(errors).forEach(key => {
      console.error(`  ❌ ${key}:`, errors[key]);
    });
    
    toast({
      title: "Validation Error",
      description: "Please check all required fields and fix any errors.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Build Your CV
          </h1>
          <p className="text-muted-foreground">
            Fill in your information step by step to create your professional CV
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-elevated">
              <ProgressIndicator
                currentStep={currentStep}
                totalSteps={steps.length}
                stepLabels={steps.map((s) => s.label)}
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

              <form onSubmit={form.handleSubmit(onSubmit, onError)}>
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
                        type="submit" 
                        className="gap-2" 
                        disabled={isSaving}
                        onClick={() => {
                          console.log("🔘 Complete CV button clicked");
                          console.log("📊 Current form state:", {
                            isValid: form.formState.isValid,
                            errors: form.formState.errors,
                            values: form.getValues(),
                          });
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

          {/* Right Sidebar - Tabbed Preview, Rating & Customization */}
          <div className="hidden lg:block space-y-6">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="preview" className="text-xs">
                  <FileCheck className="h-4 w-4 mr-1" />
                  Preview
                </TabsTrigger>
                <TabsTrigger value="rating" className="text-xs">
                  <Sparkles className="h-4 w-4 mr-1" />
                  Score
                </TabsTrigger>
                <TabsTrigger value="template" className="text-xs">
                  <Palette className="h-4 w-4 mr-1" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="order" className="text-xs">
                  <ListOrdered className="h-4 w-4 mr-1" />
                  Order
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="mt-4">
                <CVPreview data={formData} />
              </TabsContent>
              
              <TabsContent value="rating" className="mt-4">
                <CVRating data={formData} />
              </TabsContent>
              
              <TabsContent value="template" className="mt-4">
                <Card className="p-6">
                  <TemplateSelector
                    selected={formData.template || "modern"}
                    onSelect={(template) => form.setValue("template", template)}
                  />
                </Card>
              </TabsContent>
              
              <TabsContent value="order" className="mt-4">
                <SectionOrderManager
                  sectionOrder={formData.sectionOrder || ["summary", "workExperience", "education", "projects", "certificates", "skills", "languages", "interests"]}
                  onReorder={(newOrder) => form.setValue("sectionOrder", newOrder)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};