import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
          <Label htmlFor={`education.${index}.startDate`}>Start Date</Label>
          <Input
            type="month"
            {...form.register(`education.${index}.startDate`)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`education.${index}.endDate`}>End Date</Label>
          <Input
            type="month"
            {...form.register(`education.${index}.endDate`)}
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
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "education",
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Education</h2>
        <p className="text-muted-foreground">Tell us about your educational background</p>
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
          
          <EducationItem form={form} index={index} />
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ 
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
        Add Education
      </Button>
    </div>
  );
};
