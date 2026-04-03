import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { resumeAPI, Resume } from "@/lib/api";
import { mergePublicProfileSections } from "@/lib/publicProfileSections";
import { resumeToCvFormData } from "@/lib/resumeToCvFormData";
import { HostedProfileTemplate } from "@/components/hosted-profile/HostedProfileTemplate";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

function HostedProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [resume, setResume] = useState<Resume | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError(t("pages.hostedProfile.invalidId"));
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await resumeAPI.getPublicById(id);
        if (!cancelled) setResume(data);
      } catch (e: unknown) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : t("pages.hostedProfile.notFound"));
          setResume(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, t]);

  if (loading) {
    return (
      <>
        <SEO title="123Resume" description="" noindex />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </>
    );
  }

  if (error || !resume) {
    return (
      <>
        <SEO title="123Resume" description="" noindex />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || t("pages.hostedProfile.notFound")}</AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  const formData = resumeToCvFormData(resume);
  const pi = resume.personalInfo;
  const name = [pi.firstName, pi.lastName].filter(Boolean).join(" ").trim() || "123Resume";
  const desc = pi.professionalTitle?.trim() || (pi.summary?.trim() ?? "").slice(0, 160);

  return (
    <>
      <SEO title={`${name} — 123Resume`} description={desc} noindex={false} />
      <HostedProfileTemplate
        data={formData}
        visibility={mergePublicProfileSections(resume.publicProfileSections)}
        resumeId={id}
        theme={resume.publicProfileTheme}
      />
    </>
  );
}

export default HostedProfilePage;
