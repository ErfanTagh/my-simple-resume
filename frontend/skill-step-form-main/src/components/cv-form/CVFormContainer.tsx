import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { cvFormSchema, CVFormData } from "./types";
import { ChevronLeft, ChevronRight, FileCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const CVFormContainer = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<CVFormData>({
    resolver: zodResolver(cvFormSchema),
    defaultValues: {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        website: "",
        summary: "",
        interests: "",
      },
      workExperience: [{ position: "", company: "", startDate: "", endDate: "", description: "" }],
      education: [{ degree: "", institution: "", startDate: "", endDate: "", field: "" }],
      projects: [{ name: "", description: "", technologies: "", startDate: "", endDate: "", link: "" }],
      certificates: [{ name: "", organization: "", issueDate: "", expirationDate: "", credentialId: "", url: "" }],
      languages: [{ language: "", proficiency: "" }],
      skills: [{ skill: "" }],
    },
  });

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
    setCurrentStep(step);
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
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: CVFormData) => {
    console.log("Form submitted:", data);
    toast({
      title: "CV Information Saved!",
      description: "Your CV information has been successfully saved.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Build Your CV
          </h1>
          <p className="text-muted-foreground">
            Fill in your information step by step to create your professional CV
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <Card className="p-8 shadow-elevated">
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={steps.length}
              stepLabels={steps.map((s) => s.label)}
            />

            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  <Button type="submit" className="gap-2">
                    <FileCheck className="h-4 w-4" />
                    Complete CV
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

          {/* Preview Section */}
          <div className="hidden lg:block">
            <CVPreview data={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};
