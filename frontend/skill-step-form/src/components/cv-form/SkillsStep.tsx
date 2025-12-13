import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";

interface SkillsStepProps {
  form: UseFormReturn<CVFormData>;
}

export const SkillsStep = ({ form }: SkillsStepProps) => {
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: form.control,
    name: "skills",
  });

  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control: form.control,
    name: "languages",
  });

  const proficiencyLevels = [
    "Native",
    "Fluent",
    "Advanced",
    "Intermediate",
    "Basic"
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Skills Section */}
      <div>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">Skills</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Add your professional skills and competencies</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          {skillFields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Input
                  {...form.register(`skills.${index}.skill`)}
                  placeholder="e.g., JavaScript, Project Management"
                />
              </div>
              {skillFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSkill(index)}
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
          onClick={() => appendSkill({ skill: "" })}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <Separator />

      {/* Languages Section */}
      <div>
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">Languages</h2>
          <p className="text-muted-foreground text-sm sm:text-base">What languages do you speak?</p>
        </div>

        {languageFields.map((field, index) => (
          <div key={field.id} className="p-4 sm:p-6 border rounded-lg bg-card space-y-3 sm:space-y-4 relative mb-4">
            {languageFields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeLanguage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor={`languages.${index}.language`}>Language *</Label>
                <Input
                  {...form.register(`languages.${index}.language`)}
                  placeholder="English"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`languages.${index}.proficiency`}>Proficiency *</Label>
                <Select
                  onValueChange={(value) => form.setValue(`languages.${index}.proficiency`, value)}
                  value={field.proficiency || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => appendLanguage({ language: "", proficiency: "" })}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Language
        </Button>
      </div>
    </div>
  );
};
