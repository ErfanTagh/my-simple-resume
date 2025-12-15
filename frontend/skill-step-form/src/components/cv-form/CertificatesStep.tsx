import { UseFormReturn, useFieldArray, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MonthPicker } from "@/components/ui/month-picker";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";
import { useLanguage } from "@/contexts/LanguageContext";

interface CertificatesStepProps {
  form: UseFormReturn<CVFormData>;
}

export const CertificatesStep = ({ form }: CertificatesStepProps) => {
  const { t } = useLanguage();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "certificates",
  });

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">{t('resume.labels.certificatesTitle')}</h2>
        <p className="text-muted-foreground text-sm sm:text-base">{t('resume.labels.certificatesDesc')}</p>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">{t('resume.labels.noCertificates')}</p>
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: "", organization: "", issueDate: "", expirationDate: "", credentialId: "", url: "" })}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('resume.labels.addFirstCertificate')}
          </Button>
        </div>
      )}

      {fields.map((field, index) => (
        <div key={field.id} className="p-4 sm:p-6 border rounded-lg bg-card space-y-3 sm:space-y-4 relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => remove(index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <div className="space-y-2">
            <Label htmlFor={`certificates.${index}.name`}>{t('resume.fields.certificateName')}</Label>
            <Input
              {...form.register(`certificates.${index}.name`)}
              placeholder={t('resume.placeholders.certificateName')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`certificates.${index}.organization`}>{t('resume.labels.issuingOrganization')}</Label>
            <Input
              {...form.register(`certificates.${index}.organization`)}
              placeholder={t('resume.placeholders.certOrg')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label>{t('resume.fields.issueDate')}</Label>
              <Controller
                control={form.control}
                name={`certificates.${index}.issueDate`}
                render={({ field }) => (
                  <MonthPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('resume.placeholders.selectIssueDate')}
                  />
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label>{t('resume.labels.expirationDate')}</Label>
              <Controller
                control={form.control}
                name={`certificates.${index}.expirationDate`}
                render={({ field }) => (
                  <MonthPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t('resume.placeholders.noExpiration')}
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`certificates.${index}.credentialId`}>{t('resume.labels.credentialId')}</Label>
            <Input
              {...form.register(`certificates.${index}.credentialId`)}
              placeholder="ABC123XYZ456"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`certificates.${index}.url`}>{t('resume.labels.credentialUrl')}</Label>
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

      {fields.length > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ name: "", organization: "", issueDate: "", expirationDate: "", credentialId: "", url: "" })}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('resume.actions.addAnotherCertificate')}
        </Button>
      )}
    </div>
  );
};
