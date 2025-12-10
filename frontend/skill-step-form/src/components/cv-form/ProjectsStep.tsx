import { UseFormReturn, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MonthPicker } from "@/components/ui/month-picker";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";

interface ProjectsStepProps {
  form: UseFormReturn<CVFormData>;
}

const ProjectItem = ({ form, index }: { form: UseFormReturn<CVFormData>; index: number }) => {
  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({
    control: form.control,
    name: `projects.${index}.technologies`,
  });

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`projects.${index}.name`}>Project Name</Label>
        <Input
          {...form.register(`projects.${index}.name`)}
          placeholder="E-commerce Platform"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`projects.${index}.description`}>Description</Label>
        <Textarea
          {...form.register(`projects.${index}.description`)}
          placeholder="Describe the project, your role, and key achievements..."
          rows={3}
          className="resize-none"
        />
      </div>

      <div className="space-y-3">
        <div>
          <Label>Technologies Used</Label>
          <p className="text-xs text-muted-foreground mt-1">Add technologies used in this project</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {techFields.map((field, techIndex) => (
            <div key={field.id} className="flex gap-1">
              <Input
                {...form.register(`projects.${index}.technologies.${techIndex}.technology`)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Controller
            control={form.control}
            name={`projects.${index}.startDate`}
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
            name={`projects.${index}.endDate`}
            render={({ field }) => (
              <MonthPicker
                value={field.value}
                onChange={field.onChange}
                placeholder="Present"
              />
            )}
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
        {form.formState.errors.projects?.[index]?.link && (
          <p className="text-sm text-destructive">
            {form.formState.errors.projects[index]?.link?.message}
          </p>
        )}
      </div>
    </>
  );
};

export const ProjectsStep = ({ form }: ProjectsStepProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Projects (Optional)</h2>
        <p className="text-muted-foreground">Showcase your notable projects and achievements - skip if not applicable</p>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No projects added yet</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ 
              name: "", 
              description: "", 
              technologies: [], 
              startDate: "", 
              endDate: "", 
              link: "" 
            })}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Project
          </Button>
        </div>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="p-6 border rounded-lg bg-card space-y-4 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => remove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <ProjectItem form={form} index={index} />
        </div>
      ))}

      {fields.length > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ 
            name: "", 
            description: "", 
            technologies: [], 
            startDate: "", 
            endDate: "", 
            link: "" 
          })}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Project
        </Button>
      )}
    </div>
  );
};
