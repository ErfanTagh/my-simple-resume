import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";

interface WorkExperienceStepProps {
  form: UseFormReturn<CVFormData>;
}

const WorkExperienceItem = ({ form, index }: { form: UseFormReturn<CVFormData>; index: number }) => {
  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({
    control: form.control,
    name: `workExperience.${index}.technologies`,
  });

  const { fields: compFields, append: appendComp, remove: removeComp } = useFieldArray({
    control: form.control,
    name: `workExperience.${index}.competencies`,
  });

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`workExperience.${index}.position`}>Position *</Label>
        <Input
          {...form.register(`workExperience.${index}.position`)}
          placeholder="Software Engineer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`workExperience.${index}.company`}>Company *</Label>
        <Input
          {...form.register(`workExperience.${index}.company`)}
          placeholder="Tech Corp"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`workExperience.${index}.location`}>Location</Label>
        <Input
          {...form.register(`workExperience.${index}.location`)}
          placeholder="San Francisco, USA"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`workExperience.${index}.startDate`}>Start Date</Label>
          <Input
            type="month"
            {...form.register(`workExperience.${index}.startDate`)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`workExperience.${index}.endDate`}>End Date</Label>
          <Input
            type="month"
            {...form.register(`workExperience.${index}.endDate`)}
            placeholder="Present"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`workExperience.${index}.description`}>Description</Label>
        <Textarea
          {...form.register(`workExperience.${index}.description`)}
          placeholder="Describe your responsibilities and achievements..."
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="space-y-3">
        <div>
          <Label>Technologies</Label>
          <p className="text-xs text-muted-foreground mt-1">Add technologies used in this role</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {techFields.map((field, techIndex) => (
            <div key={field.id} className="flex gap-1">
              <Input
                {...form.register(`workExperience.${index}.technologies.${techIndex}.technology`)}
                placeholder="e.g., React"
                className="text-sm"
              />
              {techFields.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => removeTech(techIndex)}
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
          onClick={() => appendTech({ technology: "" })}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Technology
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <Label>Key Competencies</Label>
          <p className="text-xs text-muted-foreground mt-1">Add key skills demonstrated in this role</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {compFields.map((field, compIndex) => (
            <div key={field.id} className="flex gap-1">
              <Input
                {...form.register(`workExperience.${index}.competencies.${compIndex}.competency`)}
                placeholder="e.g., Teamwork"
                className="text-sm"
              />
              {compFields.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => removeComp(compIndex)}
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
          onClick={() => appendComp({ competency: "" })}
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Competency
        </Button>
      </div>
    </>
  );
};

export const WorkExperienceStep = ({ form }: WorkExperienceStepProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "workExperience",
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Work Experience</h2>
        <p className="text-muted-foreground">Add your professional experience</p>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="p-6 border rounded-lg bg-card space-y-4 relative">
          {fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          
          <WorkExperienceItem form={form} index={index} />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ 
          position: "", 
          company: "", 
          location: "",
          startDate: "", 
          endDate: "", 
          description: "",
          technologies: [],
          competencies: []
        })}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Experience
      </Button>
    </div>
  );
};
