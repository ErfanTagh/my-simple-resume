import { UseFormReturn, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MonthPicker } from "@/components/ui/month-picker";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";
import { TechnologyAutocomplete } from "@/components/TechnologyAutocomplete";
import { CityAutocomplete } from "@/components/ui/city-autocomplete";
import { PowerSkillsAutocomplete } from "@/components/PowerSkillsAutocomplete";

interface ExperienceStepProps {
  form: UseFormReturn<CVFormData>;
}

const WorkExperienceItem = ({ form, index }: { form: UseFormReturn<CVFormData>; index: number }) => {
  const { t } = useLanguage();
  const { fields: respFields, append: appendResp, remove: removeResp } = useFieldArray({
    control: form.control,
    name: `workExperience.${index}.responsibilities`,
  });

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
        <Label htmlFor={`workExperience.${index}.location`}>{t('resume.fields.location')}</Label>
        <Controller
          control={form.control}
          name={`workExperience.${index}.location`}
          render={({ field }) => (
            <CityAutocomplete
              id={`workExperience.${index}.location`}
              value={field.value || ""}
              onChange={field.onChange}
              placeholder={t('resume.placeholders.jobLocation')}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Controller
            control={form.control}
            name={`workExperience.${index}.startDate`}
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
            name={`workExperience.${index}.endDate`}
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

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Key Responsibilities & Achievements</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendResp({ responsibility: "" })}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {respFields.map((field, respIndex) => (
            <div key={field.id} className="flex gap-2">
              <Input
                {...form.register(`workExperience.${index}.responsibilities.${respIndex}.responsibility`)}
                placeholder="e.g., Led development of microservices architecture"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeResp(respIndex)}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label>Technologies</Label>
          <p className="text-xs text-muted-foreground mt-1">Add technologies used in this role</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {techFields.map((field, techIndex) => (
            <div key={field.id} className="flex gap-1">
              <Controller
                control={form.control}
                name={`workExperience.${index}.technologies.${techIndex}.technology`}
                render={({ field: techField }) => (
                  <TechnologyAutocomplete
                    value={techField.value || ""}
                    onChange={techField.onChange}
                    placeholder="e.g., React"
                    className="text-sm"
                  />
                )}
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
          <Label>{t('resume.labels.keyCompetencies')}</Label>
          <p className="text-xs text-muted-foreground mt-1">{t('resume.labels.competenciesHint')}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {compFields.map((field, compIndex) => (
            <div key={field.id} className="flex gap-1">
              <Controller
                control={form.control}
                name={`workExperience.${index}.competencies.${compIndex}.competency`}
                render={({ field: compField }) => (
                  <PowerSkillsAutocomplete
                    value={compField.value || ""}
                    onChange={compField.onChange}
                    placeholder={t('resume.placeholders.competency')}
                    className="text-sm"
                  />
                )}
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
          {t('resume.labels.addCompetency')}
        </Button>
      </div>
    </>
  );
};

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
              <Controller
                control={form.control}
                name={`projects.${index}.technologies.${techIndex}.technology`}
                render={({ field: techField }) => (
                  <TechnologyAutocomplete
                    value={techField.value || ""}
                    onChange={techField.onChange}
                    placeholder="e.g., React"
                    className="text-sm"
                  />
                )}
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

export const ExperienceStep = ({ form }: ExperienceStepProps) => {
  const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({
    control: form.control,
    name: "workExperience",
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Work Experience Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Work Experience</h2>
          <p className="text-muted-foreground">Add your professional experience</p>
        </div>

        {workFields.map((field, index) => (
          <div key={field.id} className="p-6 border rounded-lg bg-card space-y-4 relative mb-4">
            {workFields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeWork(index)}
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
          onClick={() => appendWork({ 
            position: "", 
            company: "", 
            location: "",
            startDate: "", 
            endDate: "", 
            description: "",
            responsibilities: [],
            technologies: [],
            competencies: []
          })}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      <Separator />

      {/* Projects Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Projects (Optional)</h2>
          <p className="text-muted-foreground">Showcase your notable projects and achievements - skip if not applicable</p>
        </div>

        {projectFields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg mb-4">
            <p className="text-muted-foreground mb-4">No projects added yet</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => appendProject({ 
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

        {projectFields.map((field, index) => (
          <div key={field.id} className="p-6 border rounded-lg bg-card space-y-4 relative mb-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeProject(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            
            <ProjectItem form={form} index={index} />
          </div>
        ))}

        {projectFields.length > 0 && (
          <Button
            type="button"
            variant="outline"
            onClick={() => appendProject({ 
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
    </div>
  );
};

