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
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ position: "", company: "", startDate: "", endDate: "", description: "" })}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Experience
      </Button>
    </div>
  );
};
