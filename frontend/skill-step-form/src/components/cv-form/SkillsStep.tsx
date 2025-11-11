import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";

interface SkillsStepProps {
  form: UseFormReturn<CVFormData>;
}

export const SkillsStep = ({ form }: SkillsStepProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Skills</h2>
        <p className="text-muted-foreground">Add your professional skills and competencies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Input
                {...form.register(`skills.${index}.skill`)}
                placeholder="e.g., JavaScript, Project Management"
              />
            </div>
            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
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
        onClick={() => append({ skill: "" })}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Skill
      </Button>
    </div>
  );
};
