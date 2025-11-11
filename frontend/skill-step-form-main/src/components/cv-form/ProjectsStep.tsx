import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";

interface ProjectsStepProps {
  form: UseFormReturn<CVFormData>;
}

export const ProjectsStep = ({ form }: ProjectsStepProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Projects</h2>
        <p className="text-muted-foreground">Showcase your notable projects and achievements</p>
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
            <Label htmlFor={`projects.${index}.name`}>Project Name *</Label>
            <Input
              {...form.register(`projects.${index}.name`)}
              placeholder="E-commerce Platform"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`projects.${index}.description`}>Description *</Label>
            <Textarea
              {...form.register(`projects.${index}.description`)}
              placeholder="Describe the project, your role, and key achievements..."
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`projects.${index}.technologies`}>Technologies Used</Label>
            <Input
              {...form.register(`projects.${index}.technologies`)}
              placeholder="React, Node.js, MongoDB, AWS"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`projects.${index}.startDate`}>Start Date</Label>
              <Input
                type="month"
                {...form.register(`projects.${index}.startDate`)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`projects.${index}.endDate`}>End Date</Label>
              <Input
                type="month"
                {...form.register(`projects.${index}.endDate`)}
                placeholder="Present"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`projects.${index}.link`}>Project Link</Label>
            <Input
              type="url"
              {...form.register(`projects.${index}.link`)}
              placeholder="https://github.com/username/project"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ name: "", description: "", technologies: "", startDate: "", endDate: "", link: "" })}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Project
      </Button>
    </div>
  );
};
