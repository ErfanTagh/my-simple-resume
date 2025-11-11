import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { CVFormData } from "./types";

interface CertificatesStepProps {
  form: UseFormReturn<CVFormData>;
}

export const CertificatesStep = ({ form }: CertificatesStepProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "certificates",
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Certificates & Licenses</h2>
        <p className="text-muted-foreground">Add your professional certifications and licenses</p>
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
            <Label htmlFor={`certificates.${index}.name`}>Certificate Name *</Label>
            <Input
              {...form.register(`certificates.${index}.name`)}
              placeholder="AWS Certified Solutions Architect"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`certificates.${index}.organization`}>Issuing Organization *</Label>
            <Input
              {...form.register(`certificates.${index}.organization`)}
              placeholder="Amazon Web Services"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`certificates.${index}.issueDate`}>Issue Date</Label>
              <Input
                type="month"
                {...form.register(`certificates.${index}.issueDate`)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`certificates.${index}.expirationDate`}>Expiration Date</Label>
              <Input
                type="month"
                {...form.register(`certificates.${index}.expirationDate`)}
                placeholder="No expiration"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`certificates.${index}.credentialId`}>Credential ID</Label>
            <Input
              {...form.register(`certificates.${index}.credentialId`)}
              placeholder="ABC123XYZ456"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`certificates.${index}.url`}>Credential URL</Label>
            <Input
              type="url"
              {...form.register(`certificates.${index}.url`)}
              placeholder="https://credentials.example.com/verify"
            />
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ name: "", organization: "", issueDate: "", expirationDate: "", credentialId: "", url: "" })}
        className="w-full"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Certificate
      </Button>
    </div>
  );
};
