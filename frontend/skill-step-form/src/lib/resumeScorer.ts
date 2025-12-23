import { CVFormData } from "@/components/cv-form/types";

interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
}

interface ResumeScore {
  overallScore: number; // 0-100 for display
  categories: ScoreCategory[];
  suggestions: string[];
}

/**
 * Strong action verbs that indicate impact (English)
 */
const STRONG_ACTION_VERBS_EN = [
  'led', 'managed', 'developed', 'implemented', 'optimized', 'designed',
  'created', 'built', 'launched', 'achieved', 'improved', 'increased',
  'reduced', 'established', 'delivered', 'transformed', 'streamlined',
  'executed', 'initiated', 'spearheaded', 'accelerated', 'enhanced',
  'pioneered', 'orchestrated', 'maximized', 'minimized', 'solved',
  'architected', 'scaled', 'modernized', 'revolutionized'
];

/**
 * Strong action verbs (German)
 */
const STRONG_ACTION_VERBS_DE = [
  'geleitet', 'gemanagt', 'entwickelt', 'implementiert', 'optimiert', 'designt',
  'erstellt', 'gebaut', 'gestartet', 'erreicht', 'verbessert', 'erhöht',
  'reduziert', 'etabliert', 'geliefert', 'transformiert', 'optimiert',
  'durchgeführt', 'initiiert', 'angeführt', 'beschleunigt', 'verbessert',
  'vorangetrieben', 'koordiniert', 'maximiert', 'minimiert', 'gelöst',
  'architekturiert', 'skaliert', 'modernisiert', 'revolutioniert',
  'umgesetzt', 'realisiert', 'gesteuert', 'überwacht', 'organisiert',
  'verwaltet', 'betreut', 'beraten', 'erfolgreich', 'verantwortlich'
];

/**
 * Weak verbs that should be avoided
 */
const WEAK_VERBS = [
  'responsible for', 'worked on', 'assisted with', 'helped with',
  'was involved in', 'participated in', 'took part in'
];

/**
 * Professional email patterns (to detect unprofessional emails)
 */
const UNPROFESSIONAL_EMAIL_PATTERNS = [
  /party/i, /drunk/i, /lazy/i, /cool/i, /sexy/i, /hot/i,
  /gamer/i, /ninja/i, /rockstar/i, /hacker/i, /\d{4,}/, // 4+ consecutive numbers
  /(.)\1{3,}/ // repeated characters like aaa@gmail.com
];

/**
 * Calculate comprehensive resume score (0-10 scale, converted to 0-100 for display)
 */
export const calculateResumeScore = (data: CVFormData): ResumeScore => {
  const categories: ScoreCategory[] = [];
  const suggestions: string[] = [];
  let totalScore = 0;
  let deductions = 0;
  let bonuses = 0;

  // Language-agnostic metrics patterns (defined once, used throughout)
  const metricsPattern = /\b(\d+[%]|\$\d+[KM]?|€\d+[KM]?|\d+\s*[%]|\d+\s*(years?|months?|people|users|customers|clients|team members?|Jahre?|Monate?|Personen?|Mitarbeiter?|Kunden?|Menschen?))\b/i;
  const universalMetricsPattern = /\b\d+\s*(%|€|\$|Mio|Mio\.|Million|Millionen|Tausend|K|M|BN|Billion|Milliarden|Jahre|Monate|Personen|Mitarbeiter|Kunden|Menschen|users|people|years|months|customers|clients|team)\b/i;

  // ============================================
  // 1. CONTENT QUALITY (3 points)
  // ============================================
  let contentScore = 0;
  
  // Strong action verbs (0.5 pts) - language-agnostic detection
  const allText = getAllTextContent(data);
  const hasStrongVerbsEN = STRONG_ACTION_VERBS_EN.some(verb => 
    new RegExp(`\\b${verb}\\w*\\b`, 'i').test(allText)
  );
  const hasStrongVerbsDE = STRONG_ACTION_VERBS_DE.some(verb => 
    new RegExp(`\\b${verb}\\w*\\b`, 'i').test(allText)
  );
  const hasStrongVerbs = hasStrongVerbsEN || hasStrongVerbsDE;
  if (hasStrongVerbs) contentScore += 0.5;
  else suggestions.push("Use strong action verbs like 'Led', 'Developed', 'Implemented' instead of 'Responsible for' or 'Worked on'");
  
  // Quantifiable achievements (1 pt) - language-agnostic (numbers/percentages work in all languages)
  const hasMetrics = metricsPattern.test(allText) || universalMetricsPattern.test(allText) || /\d+[%]/.test(allText);
  if (hasMetrics) contentScore += 1;
  else suggestions.push("Add quantifiable achievements with numbers, percentages, or metrics (e.g., 'Increased revenue by 40%', 'Managed team of 5')");
  
  // Relevance (0.5 pts) - check if skills match experience
  const skills = (data.skills || []).map(s => s.skill?.toLowerCase() || '').filter(Boolean);
  const workExpTextForRelevance = (data.workExperience || []).map(exp => 
    `${exp.position || ''} ${exp.description || ''}`.toLowerCase()
  ).join(' ');
  // Check if skills are mentioned in work experience or if there are enough skills
  const hasRelevance = skills.length > 0 && (
    skills.some(skill => workExpTextForRelevance.includes(skill)) || 
    skills.length >= 3
  );
  if (hasRelevance) contentScore += 0.5;
  else suggestions.push("Ensure your skills are relevant and match your work experience");
  
  // Impact-focused (1 pt) - descriptions focus on outcomes (language-agnostic)
  const workExp = data.workExperience || [];
  const impactFocusedCount = workExp.filter(exp => {
    const desc = exp.description || '';
    // Check for outcome indicators in both languages
    const outcomeEN = /\b(improved|increased|reduced|achieved|delivered|optimized|enhanced)\b/i.test(desc);
    const outcomeDE = /\b(verbessert|erhöht|reduziert|erreicht|geliefert|optimiert|gesteigert|verstärkt)\b/i.test(desc);
    const hasOutcome = outcomeEN || outcomeDE;
    const hasResult = metricsPattern.test(desc) || universalMetricsPattern.test(desc) || /\d+[%]/.test(desc);
    const hasActionEN = STRONG_ACTION_VERBS_EN.some(verb => new RegExp(`\\b${verb}\\w*\\b`, 'i').test(desc));
    const hasActionDE = STRONG_ACTION_VERBS_DE.some(verb => new RegExp(`\\b${verb}\\w*\\b`, 'i').test(desc));
    const hasAction = hasActionEN || hasActionDE;
    return (hasOutcome || hasResult) && hasAction;
  }).length;
  
  if (impactFocusedCount >= Math.min(workExp.length, 2)) contentScore += 1;
  else if (workExp.length > 0) suggestions.push("Focus on outcomes and impact in your experience descriptions, not just responsibilities");
  
  categories.push({
    name: "Content Quality",
    score: Math.round(contentScore * 10) / 10,
    maxScore: 3,
    feedback: contentScore >= 2.5 ? "Excellent use of action verbs and metrics" : 
              contentScore >= 2 ? "Good content, add more quantifiable achievements" :
              "Needs stronger action verbs and measurable results"
  });
  totalScore += contentScore;

  // ============================================
  // 2. STRUCTURE & FORMAT (2 points)
  // ============================================
  let structureScore = 0;
  
  // Clear hierarchy (0.5 pts) - template selected and sections organized
  if (data.template && data.sectionOrder && data.sectionOrder.length >= 4) {
    structureScore += 0.5;
  } else {
    suggestions.push("Organize your resume sections in a clear, logical order");
  }
  
  // Concise (0.5 pts) - check if descriptions are reasonable length
  const workDescriptions = workExp.map(exp => exp.description || '').filter(Boolean);
  const avgLength = workDescriptions.length > 0 
    ? workDescriptions.reduce((sum, d) => sum + d.length, 0) / workDescriptions.length
    : 0;
  const maxLength = workDescriptions.length > 0
    ? Math.max(...workDescriptions.map(d => d.length))
    : 0;
  const isConcise = avgLength > 0 && avgLength < 800 && maxLength < 1200; // Average less than 800 chars, max less than 1200 chars per description
  // Only give credit if there are actual descriptions that are concise - empty should not get bonus
  if (isConcise) structureScore += 0.5;
  else if (workDescriptions.length > 0) suggestions.push("Keep bullet points concise - aim for 1-2 lines maximum");
  
  // Appropriate length (0.5 pts) - estimate pages based on content
  const estimatedLength = estimateResumeLength(data);
  const yearsOfExperience = calculateYearsOfExperience(data);
  const isAppropriateLength = (yearsOfExperience < 5 && estimatedLength <= 1.2) || 
                              (yearsOfExperience >= 5 && estimatedLength <= 2.5);
  if (isAppropriateLength) structureScore += 0.5;
  else if (estimatedLength > 2.5) suggestions.push("Resume may be too long - aim for 1 page (under 5 years experience) or 2 pages (senior roles)");
  
  // Reduced penalties for excessive text - only penalize truly excessive lengths
  let lengthDeductions = 0;
  
  // Work experience descriptions - only penalize extreme cases
  if (avgLength > 2000) {
    lengthDeductions += 1.0; // Penalty for extremely long descriptions (avg > 2000 chars)
  } else if (avgLength > 1500) {
    lengthDeductions += 0.5; // Small penalty for very long descriptions (avg > 1500 chars)
  }
  // Don't penalize descriptions under 1500 chars average
  
  // Check for individual extremely long descriptions
  const veryLongDescriptions = workDescriptions.filter(d => d.length > 2000).length;
  if (veryLongDescriptions > 2) {
    lengthDeductions += Math.min((veryLongDescriptions - 2) * 0.2, 0.5); // Only penalize if 3+ extremely long entries
  }
  
  // Check summary length - only penalize extreme cases
  const summaryLength = (data.personalInfo.summary || '').length;
  if (summaryLength > 700) {
    lengthDeductions += 0.5; // Penalty for very long summary (> 700 chars)
  }
  // Don't penalize summaries under 700 chars
  
  // Check project descriptions - only penalize extreme cases
  const projects = data.projects || [];
  const projectDescriptions = projects.map(p => (p.description || '').length);
  const avgProjectLength = projectDescriptions.length > 0
    ? projectDescriptions.reduce((sum, len) => sum + len, 0) / projectDescriptions.length
    : 0;
  const maxProjectLength = projectDescriptions.length > 0 ? Math.max(...projectDescriptions) : 0;
  if (avgProjectLength > 800) {
    lengthDeductions += 0.3; // Penalty for very long project descriptions
  }
  if (maxProjectLength > 1000) {
    lengthDeductions += 0.2; // Penalty for individual extremely long project descriptions
  }
  
  // Don't penalize education field length - it's usually short
  
  // Deduct from structure score (can't go below 0)
  structureScore = Math.max(0, structureScore - lengthDeductions);
  
  // Easy to scan (0.5 pts) - good use of bullet points and structure
  const hasBulletPoints = workDescriptions.some(desc => desc.includes('\n') || desc.includes('•'));
  const hasStructure = workExp.every(exp => exp.position && exp.company);
  // Only give credit if there are actual descriptions with good structure - empty should not get bonus
  if (hasBulletPoints && hasStructure && workDescriptions.length > 0) structureScore += 0.5;
  else if (workExp.length > 0) suggestions.push("Use bullet points and clear structure to make your resume easy to scan");
  
  categories.push({
    name: "Structure & Format",
    score: Math.round(structureScore * 10) / 10,
    maxScore: 2,
    feedback: structureScore >= 1.8 ? "Well-structured and easy to scan" :
              structureScore >= 1.5 ? "Good structure, could improve formatting" :
              "Needs better organization and formatting"
  });
  totalScore += structureScore;

  // ============================================
  // 3. PROFESSIONAL SUMMARY (1 point)
  // ============================================
  let summaryScore = 0;
  const summary = data.personalInfo.summary || '';
  
  // Compelling (0.5 pts) - not generic, has value proposition
  const genericPhrases = ['hard worker', 'team player', 'detail oriented', 'good communicator'];
  const isGeneric = genericPhrases.some(phrase => summary.toLowerCase().includes(phrase));
  const hasValueProp = summary.length >= 50 && !isGeneric && 
                      (summary.includes(data.personalInfo.professionalTitle || '') || 
                       summary.split(' ').length >= 15);
  if (hasValueProp) summaryScore += 0.5;
  else if (summary.length > 0) suggestions.push("Make your professional summary more specific and compelling - avoid generic phrases");
  else suggestions.push("Add a professional summary that highlights your value proposition");
  
  // Specific (0.5 pts) - mentions experience, skills, achievements
  const mentionsExperience = /\d+\s*(years?|months?)\s*(of\s*)?(experience|expertise)/i.test(summary);
  const mentionsSkills = skills.some(skill => summary.toLowerCase().includes(skill.toLowerCase()));
  const mentionsAchievement = metricsPattern.test(summary);
  const isSpecific = (mentionsExperience || mentionsSkills || mentionsAchievement) && summary.length >= 50;
  
  if (isSpecific) summaryScore += 0.5;
  else if (summary.length > 0) suggestions.push("Make your summary more specific - mention years of experience, key technologies, or achievements");
  
  categories.push({
    name: "Professional Summary",
    score: Math.round(summaryScore * 10) / 10,
    maxScore: 1,
    feedback: summaryScore >= 0.9 ? "Compelling and specific summary" :
              summaryScore >= 0.5 ? "Good summary, add more specifics" :
              "Add or improve your professional summary"
  });
  totalScore += summaryScore;

  // ============================================
  // 4. EXPERIENCE SECTION (2 points)
  // ============================================
  let experienceScore = 0;
  
  // Recent and relevant (0.5 pts) - most recent roles are detailed
  const recentWork = workExp.slice(0, 2);
  const recentWorkDetailed = recentWork.filter(exp => 
    exp.position && exp.company && exp.description && exp.description.length >= 50
  ).length;
  
  if (recentWorkDetailed >= Math.min(recentWork.length, 1)) {
    experienceScore += 0.5;
  } else if (workExp.length > 0) {
    // Give base points for having work experience entries, even if minimal
    const hasBasicWorkInfo = workExp.some(exp => exp.position && exp.company);
    if (hasBasicWorkInfo) experienceScore += 0.2; // Base points for having work experience structure
    suggestions.push("Provide detailed descriptions for your most recent roles");
  }
  
  // Achievement-oriented (1 pt) - focuses on accomplishments (language-agnostic)
  const achievementOrientedCount = workExp.filter(exp => {
    const desc = exp.description || '';
    const hasMetrics = metricsPattern.test(desc) || universalMetricsPattern.test(desc) || /\d+[%]/.test(desc);
    const hasActionEN = STRONG_ACTION_VERBS_EN.some(verb => 
      new RegExp(`\\b${verb}\\w*\\b`, 'i').test(desc)
    );
    const hasActionDE = STRONG_ACTION_VERBS_DE.some(verb => 
      new RegExp(`\\b${verb}\\w*\\b`, 'i').test(desc)
    );
    const hasAchievement = hasMetrics || hasActionEN || hasActionDE;
    return hasAchievement && desc.length >= 50;
  }).length;
  
  if (achievementOrientedCount >= Math.min(workExp.length, 2)) {
    experienceScore += 1;
  } else if (workExp.length > 0) {
    // Give base points for having work experience with descriptions, even if not achievement-focused yet
    const hasDescriptions = workExp.some(exp => exp.description && exp.description.length > 0);
    if (hasDescriptions) experienceScore += 0.3; // Base points for having descriptions
    suggestions.push("Focus on achievements and outcomes in your work experience, not just responsibilities");
  }
  // Don't suggest adding experience if it doesn't exist - that's optional
  
  // Context provided (0.5 pts) - company info, industry/role context mentioned
  const hasContext = workExp.some(exp => {
    const desc = (exp.description || '').toLowerCase();
    const hasCompanyInfo = exp.company && exp.company.length > 2;
    const hasLocation = exp.location && exp.location.length > 2;
    const hasDetailedDescription = desc.length >= 100;
    const mentionsIndustry = /\b(industry|sector|field|domain|area)\b/i.test(desc);
    return hasCompanyInfo && (hasLocation || mentionsIndustry || hasDetailedDescription);
  });
  
  if (hasContext) {
    experienceScore += 0.5;
  } else if (workExp.length > 0) {
    // Give base points for having company info, even if context is minimal
    const hasCompanyInfo = workExp.some(exp => exp.company && exp.company.length > 2);
    if (hasCompanyInfo) experienceScore += 0.2; // Base points for having company information
    suggestions.push("Add context like company size, industry, or technologies used in your experience");
  }
  // Don't penalize if no work experience - that's optional
  
  categories.push({
    name: "Experience Section",
    score: Math.round(experienceScore * 10) / 10,
    maxScore: 2,
    feedback: experienceScore >= 1.8 ? "Excellent achievement-focused experience" :
              experienceScore >= 1.5 ? "Good experience section, highlight more achievements" :
              "Add more detailed, achievement-oriented experience"
  });
  totalScore += experienceScore;

  // ============================================
  // 5. SKILLS & TECHNICAL PROFICIENCY (1 point)
  // ============================================
  let skillsScore = 0;
  const validSkills = skills.length;
  
  // Organized (0.3 pts) - skills are present and not excessive
  if (validSkills >= 3 && validSkills <= 20) {
    skillsScore += 0.3;
  } else if (validSkills > 20) {
    suggestions.push("Consider reducing your skills list - focus on the most relevant ones");
  } else if (validSkills > 0) {
    // Give base points for having skills, even if minimal
    skillsScore += 0.1; // Base points for having at least some skills
    suggestions.push("Add more skills to showcase your expertise");
  }
  
  // Relevant (0.4 pts) - skills match industry standards and experience
  const workExpTextForSkills = (data.workExperience || []).map(exp => 
    `${exp.position || ''} ${exp.description || ''}`.toLowerCase()
  ).join(' ');
  const skillsMatchExperience = skills.some(skill => workExpTextForSkills.includes(skill));
  const hasRelevantSkills = validSkills >= 5 && (
    skillsMatchExperience || 
    validSkills >= 8
  );
  if (hasRelevantSkills) {
    skillsScore += 0.4;
  } else if (validSkills >= 3) {
    // Give base points for having 3+ skills, even if not fully relevant
    skillsScore += 0.2;
    suggestions.push("Add more relevant skills that match industry standards and your experience");
  } else if (validSkills > 0) {
    // Already got 0.1 from organized section, just suggest adding more
    suggestions.push("Add more relevant skills that match industry standards and your experience");
  }
  // Don't suggest if no skills - that's optional
  
  // Not oversaturated (0.3 pts) - focused list
  if (validSkills >= 5 && validSkills <= 15) skillsScore += 0.3;
  else if (validSkills > 15) suggestions.push("Your skills list may be too long - focus on the most relevant and important skills");
  
  categories.push({
    name: "Skills & Proficiency",
    score: Math.round(skillsScore * 10) / 10,
    maxScore: 1,
    feedback: skillsScore >= 0.9 ? "Well-organized and relevant skills" :
              skillsScore >= 0.6 ? "Good skills, ensure they're relevant" :
              "Add more relevant, organized skills"
  });
  totalScore += skillsScore;

  // ============================================
  // 6. EDUCATION & CERTIFICATIONS (0.5 points)
  // ============================================
  let educationScore = 0;
  const education = data.education || [];
  
  // Complete (0.25 pts) - degree, institution, dates included
  const completeEdu = education.filter(edu => 
    edu.degree && edu.institution && (edu.startDate || edu.endDate)
  ).length;
  
  if (completeEdu >= 1) {
    educationScore += 0.25;
  } else if (education.length > 0) {
    // Give base points for having education entries, even if incomplete
    const hasBasicEduInfo = education.some(edu => edu.degree && edu.institution);
    if (hasBasicEduInfo) educationScore += 0.15; // Base points for having education structure
    suggestions.push("Complete your education entries with degree, institution, and dates");
  }
  
  // Relevant certs (0.25 pts) - industry-recognized certifications
  const certs = data.certificates || [];
  const validCerts = certs.filter(cert => cert.name && cert.organization).length;
  
  if (validCerts >= 1) educationScore += 0.25;
  else suggestions.push("Consider adding industry-recognized certifications to strengthen your resume");
  
  categories.push({
    name: "Education & Certifications",
    score: Math.round(educationScore * 10) / 10,
    maxScore: 0.5,
    feedback: educationScore >= 0.45 ? "Complete education and certifications" :
              educationScore >= 0.25 ? "Add more education or certification details" :
              "Add education and certification information"
  });
  totalScore += educationScore;

  // ============================================
  // 7. ATS OPTIMIZATION (0.5 points)
  // ============================================
  let atsScore = 0;
  
  // Keyword-rich (0.25 pts) - contains relevant industry keywords
  const hasKeywords = validSkills >= 5 || summary.length >= 50 || workExp.length > 0;
  if (hasKeywords) atsScore += 0.25;
  else suggestions.push("Add more industry keywords and relevant terms to improve ATS compatibility");
  
  // Standard formatting (0.25 pts) - template-based (assumes templates are ATS-friendly)
  if (data.template) atsScore += 0.25;
  else suggestions.push("Select a template - our templates are ATS-optimized");
  
  categories.push({
    name: "ATS Optimization",
    score: Math.round(atsScore * 10) / 10,
    maxScore: 0.5,
    feedback: atsScore >= 0.45 ? "Well-optimized for ATS systems" :
              "Add more keywords and ensure standard formatting"
  });
  totalScore += atsScore;

  // ============================================
  // RED FLAGS (Deductions)
  // ============================================
  
  // Typos or grammar errors - basic check for common issues
  const hasTypoIndicators = checkForCommonTypos(allText);
  if (hasTypoIndicators > 0) {
    deductions += Math.min(hasTypoIndicators * 0.5, 1.5);
    suggestions.push("Review your resume for typos and grammar errors - consider using a spell checker");
  }
  
  // Unprofessional email
  const email = data.personalInfo.email || '';
  const isUnprofessionalEmail = UNPROFESSIONAL_EMAIL_PATTERNS.some(pattern => pattern.test(email));
  if (isUnprofessionalEmail) {
    deductions += 0.3;
    suggestions.push("Use a professional email address (e.g., firstname.lastname@email.com)");
  }
  
  // Vague or generic descriptions - only penalize if descriptions are actually generic, not just short
  // Short descriptions are okay - they're better than no descriptions at all
  const vagueDescriptions = workDescriptions.filter(desc => {
    // Don't penalize short descriptions - that's fine
    const hasGeneric = genericPhrases.some(phrase => desc.toLowerCase().includes(phrase));
    // Only penalize if it's generic AND has enough length to be meaningful
    return hasGeneric && desc.length >= 30;
  }).length;
  
  if (vagueDescriptions > 0 && workDescriptions.length > 0) {
    deductions += Math.min(vagueDescriptions * 0.15, 0.3); // Reduced penalty - having generic is better than nothing
    if (vagueDescriptions > 0) suggestions.push("Replace vague or generic descriptions with specific, achievement-focused statements");
  }
  
  // Excessive length - reduced penalties (only penalize truly excessive length)
  if (estimatedLength > 4.0) {
    deductions += 1.5; // Penalty for extremely long resume (> 4 pages)
    suggestions.push("Your resume is far too long - focus on quality over quantity, aim for 1-2 pages");
  } else if (estimatedLength > 3.5) {
    deductions += 1.0; // Penalty for very long resume (> 3.5 pages)
    suggestions.push("Your resume is too long - focus on quality over quantity, aim for 1-2 pages");
  } else if (estimatedLength > 3.0) {
    deductions += 0.5; // Small penalty for long resume (> 3 pages)
    suggestions.push("Your resume is long but lacks substance - focus on quality over quantity");
  }
  // Don't penalize resumes between 2-3 pages - that's acceptable
  
  // Missing contact information - only penalize if email is missing (required field)
  // Phone and LinkedIn are optional, so missing them shouldn't be penalized
  const hasEmail = data.personalInfo.email && data.personalInfo.email.length > 0;
  if (!hasEmail) {
    deductions += 0.5;
    suggestions.push("Ensure you have complete contact information (email is required)");
  }
  
  // Unexplained gaps (check for large gaps in employment)
  const hasGaps = checkForEmploymentGaps(workExp);
  if (hasGaps) {
    deductions += 0.3;
    suggestions.push("Consider addressing employment gaps or ensure dates are accurate");
  }
  
  // Irrelevant information - excessive interests or personal info
  const interests = data.personalInfo.interests || [];
  if (interests.length > 5) {
    deductions += 0.3;
    suggestions.push("Limit interests to 3-5 most relevant ones");
  }

  // ============================================
  // BONUS POINTS (Max +1)
  // ============================================
  
  // Professional links/portfolio (website, LinkedIn, portfolio) - bonus only, no penalty
  if (data.personalInfo.website || data.personalInfo.linkedin) {
    bonuses += 0.3;
  }
  // Don't suggest adding these - they're optional
  
  // Additional credentials (projects, publications, volunteer work)
  const userProjects = data.projects || [];
  const hasProjects = userProjects.filter(p => p.name && p.description).length > 0;
  const mentionsProjects = /\b(project|portfolio|publication|published|article|blog|volunteer)\b/i.test(allText);
  if (hasProjects || mentionsProjects) bonuses += 0.3;
  
  // Professional achievements (awards, certifications, speaking engagements)
  const userCertificates = data.certificates || [];
  const hasCertificates = userCertificates.length > 0;
  const mentionsAchievements = /\b(award|certification|certified|speaking|conference|presentation|recognition)\b/i.test(allText);
  if (hasCertificates || mentionsAchievements) bonuses += 0.2;
  
  // Leadership/Mentoring/Management experience (universal for all professions)
  const mentionsLeadership = /\b(led|lead|managed|mentor|mentoring|team|supervised|directed|coordinated|organized)\b/i.test(allText);
  if (mentionsLeadership && workExp.length > 0) bonuses += 0.2;

  // ============================================
  // FINAL CALCULATION
  // ============================================
  
  // Apply deductions and bonuses
  totalScore = Math.max(0, Math.min(10, totalScore - deductions + bonuses));
  
  // Convert to 0-100 scale for display
  const overallScore = Math.round(totalScore * 10);
  
  // Add overall suggestions based on score
  if (overallScore < 60) {
    suggestions.unshift("Your resume needs significant improvement. Focus on adding quantifiable achievements and strong action verbs.");
  } else if (overallScore < 80) {
    suggestions.unshift("Your resume is good but can be improved. Focus on adding more metrics and impact-focused descriptions.");
  } else if (overallScore >= 90) {
    suggestions.unshift("Excellent resume! You're well-positioned for job applications.");
  }

  return {
    overallScore,
    categories,
    suggestions: [...new Set(suggestions)].slice(0, 10) // Remove duplicates and limit to 10
  };
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all text content from resume for analysis
 */
function getAllTextContent(data: CVFormData): string {
  const parts: string[] = [];
  
  // Personal info
  parts.push(data.personalInfo.summary || '');
  parts.push(data.personalInfo.professionalTitle || '');
  
  // Work experience
  (data.workExperience || []).forEach(exp => {
    parts.push(exp.description || '');
    (exp.responsibilities || []).forEach(r => parts.push(r.responsibility || ''));
  });
  
  // Projects
  (data.projects || []).forEach(proj => {
    parts.push(proj.description || '');
    (proj.highlights || []).forEach(h => parts.push(h.highlight || ''));
  });
  
  return parts.join(' ').toLowerCase();
}

/**
 * Estimate resume length in pages (rough approximation)
 */
function estimateResumeLength(data: CVFormData): number {
  let wordCount = 0;
  
  // Personal info
  wordCount += (data.personalInfo.summary || '').split(/\s+/).length;
  wordCount += (data.personalInfo.professionalTitle || '').split(/\s+/).length;
  
  // Work experience (largest section)
  (data.workExperience || []).forEach(exp => {
    wordCount += (exp.description || '').split(/\s+/).length;
    wordCount += (exp.position || '').split(/\s+/).length;
    wordCount += (exp.company || '').split(/\s+/).length;
  });
  
  // Education
  (data.education || []).forEach(edu => {
    wordCount += (edu.degree || '').split(/\s+/).length;
    wordCount += (edu.field || '').split(/\s+/).length;
  });
  
  // Projects
  (data.projects || []).forEach(proj => {
    wordCount += (proj.description || '').split(/\s+/).length;
  });
  
  // Skills and other sections add minimal space
  wordCount += (data.skills || []).length * 0.5;
  
  // Rough estimate: ~250 words per page for resume format
  return wordCount / 250;
}

/**
 * Calculate years of experience from work history
 */
function calculateYearsOfExperience(data: CVFormData): number {
  const workExp = data.workExperience || [];
  if (workExp.length === 0) return 0;
  
  // Try to extract dates and calculate total
  let totalMonths = 0;
  workExp.forEach(exp => {
    if (exp.startDate) {
      const start = parseDate(exp.startDate);
      const end = exp.endDate ? parseDate(exp.endDate) : new Date(); // Current if no end date
      if (start && end) {
        const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                      (end.getMonth() - start.getMonth());
        totalMonths += Math.max(0, months);
      }
    }
  });
  
  return Math.round(totalMonths / 12);
}

/**
 * Parse date string (YYYY-MM format)
 */
function parseDate(dateStr: string): Date | null {
  try {
    const parts = dateStr.split('-');
    if (parts.length >= 2) {
      const year = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1; // Month is 0-indexed
      if (!isNaN(year) && !isNaN(month)) {
        return new Date(year, month, 1);
      }
    }
  } catch (e) {
    // Ignore parsing errors
  }
  return null;
}

/**
 * Check for common typo indicators
 */
function checkForCommonTypos(text: string): number {
  let typoCount = 0;
  
  // Check for common misspellings
  const commonTypos = [
    /\bteh\b/i, // "the"
    /\badn\b/i, // "and"
    /\byoru\b/i, // "your"
    /\byrou\b/i, // "your"
    /\baccross\b/i, // "across"
    /\bseperate\b/i, // "separate"
  ];
  
  typoCount += commonTypos.filter(pattern => pattern.test(text)).length;
  
  // Check for repeated words (common typo)
  const repeatedWordPattern = /\b(\w+)\s+\1\b/gi;
  const repeatedMatches = text.match(repeatedWordPattern);
  if (repeatedMatches) typoCount += repeatedMatches.length;
  
  return Math.min(typoCount, 3); // Cap at 3 for scoring
}

/**
 * Check for employment gaps
 */
function checkForEmploymentGaps(workExp: Array<{ startDate?: string; endDate?: string }>): boolean {
  if (workExp.length < 2) return false;
  
  // Sort by start date (most recent first, assuming they're already ordered)
  const sorted = [...workExp].filter(exp => exp.startDate && exp.endDate);
  if (sorted.length < 2) return false;
  
  // Check for gaps larger than 6 months
  for (let i = 0; i < sorted.length - 1; i++) {
    const currentEnd = parseDate(sorted[i].endDate!);
    const nextStart = parseDate(sorted[i + 1].startDate!);
    
    if (currentEnd && nextStart) {
      const months = (currentEnd.getFullYear() - nextStart.getFullYear()) * 12 + 
                    (currentEnd.getMonth() - nextStart.getMonth());
      if (months > 6) {
        return true; // Gap larger than 6 months
      }
    }
  }
  
  return false;
}
