import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CVFormContainer } from "@/components/cv-form/CVFormContainer";
import type { CVFormData } from "@/components/cv-form/types";
import { resumeAPI, type Resume } from "@/lib/api";
import { SEO } from "@/components/SEO";

const DEFAULT_SECTION_ORDER = [
  "summary",
  "workExperience",
  "education",
  "projects",
  "certificates",
  "skills",
  "languages",
  "interests",
];

const createEmptyCVFormData = (): CVFormData => ({
  personalInfo: {
    firstName: "",
    lastName: "",
    professionalTitle: "",
    profileImage: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
    summary: "",
    interests: [{ interest: "" }],
  },
  workExperience: [
    {
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      technologies: [],
      competencies: [],
    },
  ],
  education: [
    {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      field: "",
      keyCourses: [],
    },
  ],
  projects: [],
  certificates: [],
  languages: [{ language: "", proficiency: "" }],
  skills: [{ skill: "" }],
  sectionOrder: DEFAULT_SECTION_ORDER,
  template: "modern",
});

const mapResumeToCVFormData = (resume: Resume): CVFormData => {
  const base = createEmptyCVFormData();
  const anyResume = resume as any;

  return {
    ...base,
    personalInfo: {
      ...base.personalInfo,
      ...(resume.personalInfo || (anyResume.personalInfo ?? {})),
    },
    workExperience:
      resume.workExperience && resume.workExperience.length > 0
        ? resume.workExperience
        : base.workExperience,
    education:
      resume.education && resume.education.length > 0
        ? resume.education
        : base.education,
    projects:
      resume.projects && resume.projects.length > 0
        ? resume.projects
        : base.projects,
    certificates:
      resume.certificates && resume.certificates.length > 0
        ? resume.certificates
        : base.certificates,
    languages:
      resume.languages && resume.languages.length > 0
        ? resume.languages
        : base.languages,
    skills:
      resume.skills && resume.skills.length > 0 ? resume.skills : base.skills,
    sectionOrder:
      anyResume.sectionOrder && anyResume.sectionOrder.length > 0
        ? anyResume.sectionOrder
        : base.sectionOrder,
    template: anyResume.template || base.template,
    styling: anyResume.styling || undefined,
  };
};

const CreateResume = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit") || undefined;
  const templateParam = searchParams.get("template") || undefined;

  const [initialData, setInitialData] = useState<CVFormData | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState<boolean>(!!editId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editId) {
      // Creating a new resume - clear any stale pending resume data to ensure fresh template selection
      // Only restore pendingResume if explicitly needed (e.g., after signup flow)
      // For now, always start fresh to show the new template selection UI
      localStorage.removeItem('pendingResume');
      
      // If template param is provided, set initialData with that template
      if (templateParam) {
        const validTemplates = ['modern', 'classic', 'creative', 'minimal', 'latex', 'starRover'];
        const template = validTemplates.includes(templateParam) ? templateParam : 'modern';
        const dataWithTemplate = createEmptyCVFormData();
        dataWithTemplate.template = template as CVFormData['template'];
        setInitialData(dataWithTemplate);
      } else {
        setInitialData(undefined);
      }
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    (async () => {
      try {
        setIsLoading(true);
        setError(null);
        const resume = await resumeAPI.getById(editId);
        if (!isMounted) return;
        const mapped = mapResumeToCVFormData(resume);
        setInitialData(mapped);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.message || "Failed to load resume data.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [editId, templateParam]);

  if (editId && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          Loading your resume...
        </p>
      </div>
    );
  }

  if (editId && error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Unable to load resume</h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <p className="text-xs text-muted-foreground">
            You can try again from the{" "}
            <a href="/resumes" className="underline">
              My Resumes
            </a>{" "}
            page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Create Resume - 123Resume"
        description="Build your professional resume with our easy-to-use form. Multiple templates available."
        noindex={true}
      />
      <CVFormContainer initialData={initialData} editId={editId} />
    </>
  );
};

export default CreateResume;

