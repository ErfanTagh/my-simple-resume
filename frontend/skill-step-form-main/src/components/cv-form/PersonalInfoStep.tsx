import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CVFormData } from "./types";

interface PersonalInfoStepProps {
  form: UseFormReturn<CVFormData>;
}

export const PersonalInfoStep = ({ form }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Personal Information</h2>
        <p className="text-muted-foreground">Let's start with your basic details</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="github">GitHub Profile</Label>
          <Input
            id="github"
            type="url"
            {...form.register("personalInfo.github")}
            placeholder="https://github.com/yourusername"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Personal Website</Label>
          <Input
            id="website"
            type="url"
            {...form.register("personalInfo.website")}
            placeholder="https://yourwebsite.com"
          />
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

      <div className="space-y-2">
        <Label htmlFor="interests">Interests & Hobbies</Label>
        <Textarea
          id="interests"
          {...form.register("personalInfo.interests")}
          placeholder="e.g., Photography, Open Source Contributions, Hiking, Reading..."
          rows={3}
          className="resize-none"
        />
      </div>
    </div>
  );
};
