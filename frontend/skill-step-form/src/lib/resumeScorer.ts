import { CVFormData } from "@/components/cv-form/types";

interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
}

interface ResumeScore {
  overallScore: number;
  categories: ScoreCategory[];
  suggestions: string[];
}

export const calculateResumeScore = (data: CVFormData): ResumeScore => {
  const categories: ScoreCategory[] = [];
  const suggestions: string[] = [];

  // Personal Information Score (25 points)
  let personalScore = 0;
  const personalMax = 25;
  if (data.personalInfo.firstName && data.personalInfo.lastName) personalScore += 5;
  if (data.personalInfo.email) personalScore += 5;
  if (data.personalInfo.phone) personalScore += 3;
  if (data.personalInfo.location) personalScore += 3;
  if (data.personalInfo.professionalTitle) personalScore += 4;
  if (data.personalInfo.summary) personalScore += 5;
  
  if (personalScore < 20) {
    suggestions.push("Complete your personal information with professional title and summary");
  }
  
  categories.push({
    name: "Personal Information",
    score: personalScore,
    maxScore: personalMax,
    feedback: personalScore >= 20 ? "Complete" : "Add more personal details",
  });

  // Work Experience Score (30 points)
  let workScore = 0;
  const workMax = 30;
  const workExp = data.workExperience || [];
  
  if (workExp.length > 0) workScore += 10;
  if (workExp.length >= 2) workScore += 5;
  
  const completeWorkEntries = workExp.filter(
    exp => exp.position && exp.company && exp.description && (exp.startDate || exp.endDate)
  ).length;
  
  workScore += Math.min(completeWorkEntries * 5, 15);
  
  if (workScore < 20) {
    suggestions.push("Add more work experience with detailed descriptions");
  }
  
  categories.push({
    name: "Work Experience",
    score: workScore,
    maxScore: workMax,
    feedback: workScore >= 25 ? "Excellent" : workScore >= 15 ? "Good" : "Add more experience",
  });

  // Education Score (20 points)
  let eduScore = 0;
  const eduMax = 20;
  const education = data.education || [];
  
  if (education.length > 0) eduScore += 10;
  
  const completeEduEntries = education.filter(
    edu => edu.degree && edu.institution && (edu.startDate || edu.endDate)
  ).length;
  
  eduScore += Math.min(completeEduEntries * 5, 10);
  
  if (eduScore < 15) {
    suggestions.push("Complete your education details with dates and field of study");
  }
  
  categories.push({
    name: "Education",
    score: eduScore,
    maxScore: eduMax,
    feedback: eduScore >= 15 ? "Complete" : "Add more education details",
  });

  // Skills Score (10 points)
  let skillsScore = 0;
  const skillsMax = 10;
  const skills = data.skills || [];
  
  const validSkills = skills.filter(s => s.skill && s.skill.trim() !== "").length;
  
  if (validSkills >= 8) skillsScore = 10;
  else if (validSkills >= 5) skillsScore = 8;
  else if (validSkills >= 3) skillsScore = 6;
  else skillsScore = validSkills * 2;
  
  if (validSkills < 5) {
    suggestions.push(`Add ${5 - validSkills} more skills to showcase your expertise`);
  }
  
  categories.push({
    name: "Skills",
    score: skillsScore,
    maxScore: skillsMax,
    feedback: validSkills >= 5 ? "Good variety" : "Add more skills",
  });

  // Languages Score (5 points)
  let langScore = 0;
  const langMax = 5;
  const languages = data.languages || [];
  
  const validLangs = languages.filter(l => l.language && l.proficiency).length;
  langScore = Math.min(validLangs * 2.5, 5);
  
  if (validLangs < 2) {
    suggestions.push("Add language proficiencies to increase appeal");
  }
  
  categories.push({
    name: "Languages",
    score: langScore,
    maxScore: langMax,
    feedback: validLangs >= 2 ? "Good" : "Add more languages",
  });

  // Projects Score (5 points) - Bonus
  let projectScore = 0;
  const projectMax = 5;
  const projects = data.projects || [];
  
  const validProjects = projects.filter(p => p.name && p.description).length;
  projectScore = Math.min(validProjects * 2.5, 5);
  
  categories.push({
    name: "Projects",
    score: projectScore,
    maxScore: projectMax,
    feedback: validProjects >= 2 ? "Great!" : validProjects >= 1 ? "Add more" : "Optional but recommended",
  });

  // Certificates Score (5 points) - Bonus
  let certScore = 0;
  const certMax = 5;
  const certificates = data.certificates || [];
  
  const validCerts = certificates.filter(c => c.name && c.organization).length;
  certScore = Math.min(validCerts * 2.5, 5);
  
  categories.push({
    name: "Certificates",
    score: certScore,
    maxScore: certMax,
    feedback: validCerts >= 2 ? "Excellent" : validCerts >= 1 ? "Good" : "Optional",
  });

  // Calculate overall score
  const totalScore = categories.reduce((sum, cat) => sum + cat.score, 0);
  const totalMax = categories.reduce((sum, cat) => sum + cat.maxScore, 0);
  const overallScore = Math.round((totalScore / totalMax) * 100);

  // Add general suggestions
  if (overallScore < 60) {
    suggestions.unshift("Your CV needs more content. Focus on work experience and education first.");
  } else if (overallScore < 80) {
    suggestions.unshift("Good progress! Add more details to make your CV stand out.");
  }

  return {
    overallScore,
    categories,
    suggestions,
  };
};

