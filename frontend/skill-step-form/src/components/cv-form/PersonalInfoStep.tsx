import { UseFormReturn, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { CVFormData } from "./types";
import { useState, useRef, useEffect, useCallback } from "react";
import { ResumeUpload } from "./ResumeUpload";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";

interface PersonalInfoStepProps {
  form: UseFormReturn<CVFormData>;
}

export const PersonalInfoStep = ({ form }: PersonalInfoStepProps) => {
  const { t } = useLanguage();
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
    
    // Merge parsed data with current form values
    const currentValues = form.getValues();
    
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
    
    form.reset(mergedData);

    // Clear parsed data after updating form
    setParsedData(null);
  }, [parsedData, form]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert(t('resume.alerts.imageSizeError'));
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert(t('resume.alerts.imageTypeError'));
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
        <h2 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">{t('resume.steps.personalInfo')}</h2>
        <p className="text-muted-foreground text-sm sm:text-base">{t('resume.steps.personalInfoDesc')}</p>
      </div>

      {/* Resume Upload Option */}
      <ResumeUpload onDataParsed={handleDataParsed} />
      <Separator />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t('resume.fields.firstName')} *</Label>
          <Input
            id="firstName"
            {...form.register("personalInfo.firstName")}
            placeholder={t('resume.placeholders.firstName')}
          />
          {form.formState.errors.personalInfo?.firstName && (
            <p className="text-sm text-destructive">
              {form.formState.errors.personalInfo.firstName.message}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">{t('resume.fields.lastName')} *</Label>
          <Input
            id="lastName"
            {...form.register("personalInfo.lastName")}
            placeholder={t('resume.placeholders.lastName')}
          />
          {form.formState.errors.personalInfo?.lastName && (
            <p className="text-sm text-destructive">
              {form.formState.errors.personalInfo.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="professionalTitle">{t('resume.fields.professionalTitle')}</Label>
        <Input
          id="professionalTitle"
          {...form.register("personalInfo.professionalTitle")}
          placeholder={t('resume.placeholders.professionalTitle')}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profileImage">{t('resume.labels.profileImage')}</Label>
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
              {imagePreview ? t('resume.placeholders.changeImage') : t('resume.placeholders.uploadImage')}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            {t('resume.placeholders.imageHint')}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t('resume.fields.email')} *</Label>
        <Input
          id="email"
          type="email"
          {...form.register("personalInfo.email")}
          placeholder={t('resume.placeholders.email')}
        />
        {form.formState.errors.personalInfo?.email && (
          <p className="text-sm text-destructive">
            {form.formState.errors.personalInfo.email.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">{t('resume.fields.phone')}</Label>
          <Input
            id="phone"
            {...form.register("personalInfo.phone")}
            placeholder={t('resume.placeholders.phone')}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">{t('resume.fields.location')}</Label>
          <Controller
            control={form.control}
            name="personalInfo.location"
            render={({ field }) => (
              <CityAutocomplete
                id="location"
                value={field.value || ""}
                onChange={field.onChange}
                placeholder={t('resume.placeholders.location')}
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">{t('resume.fields.linkedin')}</Label>
        <Input
          id="linkedin"
          type="url"
          {...form.register("personalInfo.linkedin")}
          placeholder={t('resume.placeholders.linkedin')}
        />
        {form.formState.errors.personalInfo?.linkedin && (
          <p className="text-sm text-destructive">
            {form.formState.errors.personalInfo.linkedin.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="github">{t('resume.fields.github')}</Label>
          <Input
            id="github"
            type="url"
            {...form.register("personalInfo.github")}
            placeholder={t('resume.placeholders.github')}
          />
          {form.formState.errors.personalInfo?.github && (
            <p className="text-sm text-destructive">
              {form.formState.errors.personalInfo.github.message}
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">{t('resume.labels.personalWebsite')}</Label>
          <Input
            id="website"
            type="url"
            {...form.register("personalInfo.website")}
            placeholder={t('resume.placeholders.website')}
          />
          {form.formState.errors.personalInfo?.website && (
            <p className="text-sm text-destructive">
              {form.formState.errors.personalInfo.website.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">{t('resume.sections.professionalSummary')}</Label>
        <Textarea
          id="summary"
          {...form.register("personalInfo.summary")}
          placeholder={t('resume.placeholders.summary')}
          rows={4}
          className="resize-none"
        />
      </div>

      <div className="space-y-4">
        <div>
          <Label>{t('resume.labels.interestsHobbies')}</Label>
          <p className="text-xs text-muted-foreground mt-1">{t('resume.labels.interestsHint')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {interestFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Input
                  {...form.register(`personalInfo.interests.${index}.interest`)}
                  placeholder={t('resume.placeholders.interests')}
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
          {t('resume.actions.addInterest')}
        </Button>
      </div>
    </div>
  );
};
