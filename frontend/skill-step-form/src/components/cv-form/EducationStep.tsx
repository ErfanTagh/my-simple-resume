import { UseFormReturn, useFieldArray, Controller } from "react-hook-form";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MonthPicker } from "@/components/ui/month-picker";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";

interface EducationStepProps {
  form: UseFormReturn<CVFormData>;
}

const EducationItem = ({ form, index }: { form: UseFormReturn<CVFormData>; index: number }) => {
  const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({
    control: form.control,
    name: `education.${index}.keyCourses`,
  });

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`education.${index}.degree`}>Degree *</Label>
        <Input
          {...form.register(`education.${index}.degree`)}
          placeholder="Bachelor of Science"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`education.${index}.institution`}>Institution *</Label>
        <Input
          {...form.register(`education.${index}.institution`)}
          placeholder="University Name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`education.${index}.location`}>Location</Label>
        <Input
          {...form.register(`education.${index}.location`)}
          placeholder="Boston, USA"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Controller
            control={form.control}
            name={`education.${index}.startDate`}
            render={({ field }) => (
              <MonthPicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Select start date"
              />
            )}
          />
        </div>
        
        <div className="space-y-2">
          <Label>End Date</Label>
          <Controller
            control={form.control}
            name={`education.${index}.endDate`}
            render={({ field }) => (
              <MonthPicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Select end date"
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`education.${index}.field`}>Field of Study</Label>
        <Input
          {...form.register(`education.${index}.field`)}
          placeholder="Computer Science"
        />
      </div>

      <div className="space-y-3">
        <div>
          <Label>Key Courses</Label>
          <p className="text-xs text-muted-foreground mt-1">Add notable courses you completed</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {courseFields.map((field, courseIndex) => (
            <div key={field.id} className="flex gap-1">
              <Input
                {...form.register(`education.${index}.keyCourses.${courseIndex}.course`)}
                placeholder="e.g., Data Structures"
                className="text-sm"
              />
              {courseFields.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => removeCourse(courseIndex)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendCourse({ course: "" })}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Course
        </Button>
      </div>
    </>
  );
};

export const EducationStep = ({ form }: EducationStepProps) => {
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const { fields: certificateFields, append: appendCertificate, remove: removeCertificate } = useFieldArray({
    control: form.control,
    name: "certificates",
  });

  // Ensure at least one education entry is always present
  useEffect(() => {
    if (educationFields.length === 0) {
      appendEducation({ 
        degree: "", 
        institution: "", 
        location: "",
        startDate: "", 
        endDate: "", 
        field: "",
        keyCourses: []
      });
    }
  }, [educationFields.length, appendEducation]);

  const handleRemoveEducation = (index: number) => {
    removeEducation(index);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Education Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Education</h2>
          <p className="text-muted-foreground">Tell us about your educational background</p>
        </div>

        {educationFields.map((field, index) => (
          <div key={field.id} className="p-6 border rounded-lg bg-card space-y-4 relative mb-4">
            {educationFields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleRemoveEducation(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            
            <EducationItem form={form} index={index} />
          </div>
        ))}

        {educationFields.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => appendEducation({ 
              degree: "", 
              institution: "", 
              location: "",
              startDate: "", 
              endDate: "", 
              field: "",
              keyCourses: []
            })}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Education
          </Button>
        )}
      </div>

      <Separator />

      {/* Certificates Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Certificates & Licenses (Optional)</h2>
          <p className="text-muted-foreground">Add your professional certifications and licenses - skip if not applicable</p>
        </div>

        {certificateFields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg mb-4">
            <p className="text-muted-foreground mb-4">No certificates added yet</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => appendCertificate({ name: "", organization: "", issueDate: "", expirationDate: "", credentialId: "", url: "" })}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Certificate
            </Button>
          </div>
        )}

        {certificateFields.map((field, index) => (
          <div key={field.id} className="p-6 border rounded-lg bg-card space-y-4 relative mb-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeCertificate(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            <div className="space-y-2">
              <Label htmlFor={`certificates.${index}.name`}>Certificate Name</Label>
              <Input
                {...form.register(`certificates.${index}.name`)}
                placeholder="AWS Certified Solutions Architect"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`certificates.${index}.organization`}>Issuing Organization</Label>
              <Input
                {...form.register(`certificates.${index}.organization`)}
                placeholder="Amazon Web Services"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Issue Date</Label>
                <Controller
                  control={form.control}
                  name={`certificates.${index}.issueDate`}
                  render={({ field }) => (
                    <MonthPicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select issue date"
                    />
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Expiration Date</Label>
                <Controller
                  control={form.control}
                  name={`certificates.${index}.expirationDate`}
                  render={({ field }) => (
                    <MonthPicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="No expiration"
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`certificates.${index}.credentialId`}>Credential ID</Label>
              <Input
                {...form.register(`certificates.${index}.credentialId`)}
                placeholder="ABC123XYZ456"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`certificates.${index}.url`}>Credential URL</Label>
              <Input
                type="url"
                {...form.register(`certificates.${index}.url`)}
                placeholder="https://credentials.example.com/verify"
              />
              {form.formState.errors.certificates?.[index]?.url && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.certificates[index]?.url?.message}
                </p>
              )}
            </div>
          </div>
        ))}

        {certificateFields.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => appendCertificate({ name: "", organization: "", issueDate: "", expirationDate: "", credentialId: "", url: "" })}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Certificate
          </Button>
        )}
      </div>
    </div>
  );
};
