import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";

interface LanguagesStepProps {
  form: UseFormReturn<CVFormData>;
}

export const LanguagesStep = ({ form }: LanguagesStepProps) => {
  const { fields, append, remove } = useFieldArray({
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
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Languages</h2>
        <p className="text-muted-foreground">What languages do you speak?</p>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        onClick={() => append({ language: "", proficiency: "" })}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Language
      </Button>
    </div>
  );
};
