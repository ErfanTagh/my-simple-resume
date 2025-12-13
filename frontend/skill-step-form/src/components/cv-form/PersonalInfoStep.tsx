import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { CVFormData } from "./types";
import { useState, useRef, useEffect, useCallback } from "react";
import { ResumeUpload } from "./ResumeUpload";
import { Separator } from "@/components/ui/separator";

interface PersonalInfoStepProps {
  form: UseFormReturn<CVFormData>;
}

export const PersonalInfoStep = ({ form }: PersonalInfoStepProps) => {
  const { fields: interestFields, append: appendInterest, remove: removeInterest } = useFieldArray({
    control: form.control,
    name: "personalInfo.interests",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parsedData, setParsedData] = useState<Partial<CVFormData> | null>(null);

  // Initialize image preview from form value (avoiding setState during render)
  useEffect(() => {
    const profileImage = form.getValues("personalInfo.profileImage");
    if (profileImage) {
      setImagePreview(profileImage);
    }
  }, []); // Only run once on mount

  // Update form when parsed data is available
  useEffect(() => {
    if (!parsedData) return;

    console.log("📥 Received parsed data:", parsedData);
    
    // Merge parsed data with current form values
    const currentValues = form.getValues();
    console.log("📋 Current form values:", currentValues);
    
    const mergedData = {
      ...currentValues,
      ...parsedData,
      // Ensure arrays are properly merged
      personalInfo: {
        ...currentValues.personalInfo,
        ...parsedData.personalInfo,
      },
      workExperience: parsedData.workExperience || currentValues.workExperience,
      education: parsedData.education || currentValues.education,
      skills: parsedData.skills || currentValues.skills,
    };
    
    console.log("🔄 Merged data to set:", mergedData);
    
    form.reset(mergedData);
    console.log("✅ Form reset completed");

    // Clear parsed data after updating form
    setParsedData(null);
  }, [parsedData, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        form.setValue("personalInfo.profileImage", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setValue("personalInfo.profileImage", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDataParsed = useCallback((data: Partial<CVFormData>) => {
    // Store parsed data in state, useEffect will handle the form update
    setParsedData(data);
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">Personal Information</h2>
        <p className="text-muted-foreground text-sm sm:text-base">Let's start with your basic details</p>
      </div>

      {/* Resume Upload Option */}
      <ResumeUpload onDataParsed={handleDataParsed} />
      <Separator />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            {...form.register("personalInfo.firstName")}
            placeholder="John"
          />
          {form.formState.errors.personalInfo?.firstName && (
            <p className="text-sm text-destructive">
              {form.formState.errors.personalInfo.firstName.message}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            {...form.register("personalInfo.lastName")}
            placeholder="Doe"
          />
          {form.formState.errors.personalInfo?.lastName && (
            <p className="text-sm text-destructive">
              {form.formState.errors.personalInfo.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="professionalTitle">Professional Title</Label>
        <Input
          id="professionalTitle"
          {...form.register("personalInfo.professionalTitle")}
          placeholder="e.g., Web Application Developer, Software Engineer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profileImage">Profile Image</Label>
        <div className="flex flex-col gap-4">
          {imagePreview && (
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-border">
              <img
                src={imagePreview}
                alt="Profile preview"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={handleRemoveImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              ref={fileInputRef}
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Upload className="mr-2 h-4 w-4" />
              {imagePreview ? "Change Image" : "Upload Image"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Upload a profile picture (JPG, PNG, max 2MB)
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          {...form.register("personalInfo.email")}
          placeholder="john.doe@example.com"
        />
        {form.formState.errors.personalInfo?.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.personalInfo.email.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            {...form.register("personalInfo.phone")}
            placeholder="+1 (555) 000-0000"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...form.register("personalInfo.location")}
            placeholder="New York, USA"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn Profile</Label>
        <Input
          id="linkedin"
          type="url"
          {...form.register("personalInfo.linkedin")}
          placeholder="https://linkedin.com/in/yourprofile"
        />
        {form.formState.errors.personalInfo?.linkedin && (
          <p className="text-sm text-destructive">
            {form.formState.errors.personalInfo.linkedin.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="github">GitHub Profile</Label>
          <Input
            id="github"
            type="url"
            {...form.register("personalInfo.github")}
            placeholder="https://github.com/yourusername"
          />
          {form.formState.errors.personalInfo?.github && (
            <p className="text-sm text-destructive">
              {form.formState.errors.personalInfo.github.message}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Personal Website</Label>
          <Input
            id="website"
            type="url"
            {...form.register("personalInfo.website")}
            placeholder="https://yourwebsite.com"
          />
          {form.formState.errors.personalInfo?.website && (
            <p className="text-sm text-destructive">
              {form.formState.errors.personalInfo.website.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          {...form.register("personalInfo.summary")}
          placeholder="A brief overview of your professional background and goals..."
          rows={4}
          className="resize-none"
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label>Interests & Hobbies</Label>
          <p className="text-xs text-muted-foreground mt-1">Add individual interests as keywords</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {interestFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Input
                  {...form.register(`personalInfo.interests.${index}.interest`)}
                  placeholder="e.g., Running, Cycling, Language Learning"
                />
              </div>
              {interestFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeInterest(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => appendInterest({ interest: "" })}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Interest
        </Button>
      </div>
    </div>
  );
};
