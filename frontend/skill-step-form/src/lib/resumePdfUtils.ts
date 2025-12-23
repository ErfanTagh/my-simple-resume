import { resumeAPI, Resume } from './api';

/**
 * CSS files needed for resume rendering
 */
const CSS_FILES = [
  '/resume-base.css',
  '/resume-header.css',
  '/resume-sections.css',
  '/resume-education.css',
  '/resume-experience.css',
  '/resume-projects.css',
  '/resume-skills.css',
  '/resume-languages.css',
  '/resume-certifications.css',
  '/resume-interests.css',
  '/resume-responsive.css',
  '/resume-print.css',
];

/**
 * Get all stylesheets from the current page (including Tailwind CSS)
 * This extracts CSS from all stylesheets available in the document
 */
function getAllStylesheets(): string {
  const stylesheets: string[] = [];
  
  // Get all stylesheet links from the head
  const styleLinks = Array.from(document.querySelectorAll('head > link[rel="stylesheet"]'));
  styleLinks.forEach((link) => {
    const href = (link as HTMLLinkElement).href;
    if (href && !href.includes('font')) {
      stylesheets.push(`<link rel="stylesheet" href="${href}">`);
    }
  });
  
  // Get all inline styles from style tags
  const styleTags = Array.from(document.querySelectorAll('head > style'));
  styleTags.forEach((style) => {
    const cssText = style.textContent || style.innerHTML;
    if (cssText) {
      stylesheets.push(`<style>${cssText}</style>`);
    }
  });
  
  // Also try to extract CSS rules from document.styleSheets (for dynamically loaded styles)
  try {
    Array.from(document.styleSheets).forEach((stylesheet) => {
      try {
        // Skip stylesheets that are already included as link tags
        if (stylesheet.href && styleLinks.some(link => (link as HTMLLinkElement).href === stylesheet.href)) {
          return;
        }
        
        // Try to get the CSS rules
        if (stylesheet.cssRules) {
          let cssText = '';
          for (let i = 0; i < stylesheet.cssRules.length; i++) {
            cssText += stylesheet.cssRules[i].cssText + '\n';
          }
          if (cssText && cssText.length > 100) { // Only include substantial stylesheets
            stylesheets.push(`<style>${cssText}</style>`);
          }
        }
      } catch (e) {
        // Cross-origin stylesheets will throw an error, skip them
        // Or try to use href instead
        if (stylesheet.href && !stylesheet.href.includes('font')) {
          stylesheets.push(`<link rel="stylesheet" href="${stylesheet.href}">`);
        }
      }
    });
  } catch (e) {
    // If there's an error accessing styleSheets, continue with what we have
    console.warn('Could not access all stylesheets:', e);
  }
  
  return stylesheets.join('\n');
}

/**
 * Fetch and inline all CSS files
 */
async function fetchCSSFiles(): Promise<string[]> {
  return Promise.all(
    CSS_FILES.map(async (href) => {
      try {
        const response = await fetch(href);
        const css = await response.text();
        return `<style>${css}</style>`;
      } catch {
        return `<link rel="stylesheet" href="${href}">`;
      }
    })
  );
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Generate resume HTML from resume data
 */
function generateResumeHTML(resume: Resume): string {
  const personalInfo = resume.personalInfo;

  const renderWorkExperience = () => {
    if (!resume.workExperience?.length) return '';
    const validExps = resume.workExperience.filter((exp: any) => exp.position || exp.company);
    if (!validExps.length) return '';
    
    return `
      <section class="resume-section">
        <h3 class="section-title">Work Experience</h3>
        ${validExps.map((exp: any) => `
          <div class="experience-item">
            <div class="experience-header">
              <h4><strong>${escapeHtml(exp.position || '')}</strong></h4>
            </div>
            <div class="experience-place">
              <span class="company"><strong>${escapeHtml(exp.company || '')}</strong></span>
              ${exp.startDate || exp.endDate ? `
                <span class="period">
                  ${escapeHtml(exp.startDate || '')} - ${escapeHtml(exp.endDate || 'Present')}
                </span>
              ` : ''}
            </div>
            ${exp.location ? `<div class="experience-location"><span>${escapeHtml(exp.location)}</span></div>` : ''}
            ${exp.description ? `
              <ul class="experience-details">
                ${exp.description.split('\n').filter((line: string) => line.trim()).map((line: string) => `
                  <li>${escapeHtml(line.trim())}</li>
                `).join('')}
              </ul>
            ` : ''}
            ${exp.technologies?.length && exp.technologies.some((tech: any) => tech.technology?.trim()) ? `
              <div class="job-tech">
                ${exp.technologies.filter((tech: any) => tech.technology?.trim()).map((tech: any) => `
                  <span class="tech-tag">${escapeHtml(tech.technology)}</span>
                `).join('')}
              </div>
            ` : ''}
            ${exp.competencies?.length && exp.competencies.some((comp: any) => comp.competency?.trim()) ? `
              <div class="job-competencies">
                ${exp.competencies.filter((comp: any) => comp.competency?.trim()).map((comp: any) => `
                  <span class="competency-bubble">${escapeHtml(comp.competency)}</span>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </section>
    `;
  };

  const renderEducation = () => {
    if (!resume.education?.length) return '';
    const validEdu = resume.education.filter((edu: any) => edu.degree || edu.institution);
    if (!validEdu.length) return '';
    
    return `
      <section class="resume-section">
        <h3 class="section-title">Education</h3>
        ${validEdu.map((edu: any) => `
          <div class="education-item">
            <h4><strong>${escapeHtml(edu.degree || '')}</strong></h4>
            <div class="education-header">
              <p class="institution"><strong>${escapeHtml(edu.institution || '')}</strong></p>
              ${edu.startDate || edu.endDate ? `
                <p class="period">
                  ${escapeHtml(edu.startDate || '')} - ${escapeHtml(edu.endDate || 'Present')}
                </p>
              ` : ''}
            </div>
            ${edu.location ? `<p class="location">${escapeHtml(edu.location)}</p>` : ''}
            ${edu.keyCourses?.length && edu.keyCourses.some((course: any) => course.course?.trim()) ? `
              <div class="key-courses">
                ${edu.keyCourses.filter((course: any) => course.course?.trim()).map((course: any) => `
                  <span class="course-tag">${escapeHtml(course.course)}</span>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </section>
    `;
  };

  const renderProjects = () => {
    if (!resume.projects?.length) return '';
    const validProjects = resume.projects.filter((project: any) => project.name?.trim());
    if (!validProjects.length) return '';
    
    return `
      <section class="resume-section">
        <h3 class="section-title">Projects</h3>
        ${validProjects.map((project: any) => `
          <div class="project-item">
            <div class="project-header">
              <h4><strong>${escapeHtml(project.name)}</strong></h4>
              ${project.link ? `
                <a href="${escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer" class="project-link">
                  View Project
                </a>
              ` : ''}
            </div>
            ${project.description ? `<p class="project-description">${escapeHtml(project.description)}</p>` : ''}
            ${project.technologies?.length && project.technologies.some((tech: any) => tech.technology?.trim()) ? `
              <div class="project-tech">
                ${project.technologies.filter((tech: any) => tech.technology?.trim()).map((tech: any) => `
                  <span class="tech-tag">${escapeHtml(tech.technology)}</span>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </section>
    `;
  };

  const renderCertificates = () => {
    if (!resume.certificates?.length) return '';
    const validCerts = resume.certificates.filter((cert: any) => cert.name?.trim());
    if (!validCerts.length) return '';
    
    return `
      <section class="resume-section">
        <h3 class="section-title">Certifications</h3>
        ${validCerts.map((cert: any) => `
          <div class="certification-item">
            <div class="certification-header">
              <h4><strong>${escapeHtml(cert.name)}</strong></h4>
              ${cert.organization ? `<span class="certification-issuer">${escapeHtml(cert.organization)}</span>` : ''}
            </div>
            ${cert.issueDate ? `<p class="certification-date">${escapeHtml(cert.issueDate)}</p>` : ''}
            ${cert.url ? `
              <a href="${escapeHtml(cert.url)}" target="_blank" rel="noopener noreferrer" class="certification-link">
                View Certificate
              </a>
            ` : ''}
          </div>
        `).join('')}
      </section>
    `;
  };

  const renderSkills = () => {
    if (!resume.skills?.length) return '';
    const validSkills = resume.skills.filter((skillObj: any) => skillObj.skill?.trim());
    if (!validSkills.length) return '';
    
    return `
      <section class="resume-section">
        <h3 class="section-title">Skills</h3>
        <div class="skill-tags">
          ${validSkills.map((skillObj: any) => `
            <span class="skill-tag">${escapeHtml(skillObj.skill)}</span>
          `).join('')}
        </div>
      </section>
    `;
  };

  const renderLanguages = () => {
    if (!resume.languages?.length) return '';
    const validLangs = resume.languages.filter((lang: any) => lang.language?.trim());
    if (!validLangs.length) return '';
    
    return `
      <section class="resume-section">
        <h3 class="section-title">Languages</h3>
        <div class="languages-list" style="width: 100%; overflow: visible; box-sizing: border-box;">
          ${validLangs.map((lang: any) => `
            <div class="language-item" style="display: flex; justify-content: space-between; align-items: center; gap: 12px; padding-right: 16px; width: 100%; box-sizing: border-box; overflow: visible;">
              <span class="language-name" style="flex: 1 1 auto; min-width: 0; overflow: visible;">${escapeHtml(lang.language)}</span>
              ${lang.proficiency ? `<span class="language-level" style="flex-shrink: 0; white-space: nowrap; overflow: visible; min-width: fit-content; text-align: right; padding-left: 8px;">${escapeHtml(lang.proficiency)}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </section>
    `;
  };

  const renderInterests = () => {
    if (!personalInfo.interests?.length) return '';
    const validInterests = personalInfo.interests.filter((interest: any) => interest.interest?.trim());
    if (!validInterests.length) return '';
    
    return `
      <section class="resume-section">
        <h3 class="section-title">Interests</h3>
        <div class="interests-list">
          ${validInterests.map((interest: any) => `
            <span class="interest-tag">${escapeHtml(interest.interest)}</span>
          `).join('')}
        </div>
      </section>
    `;
  };

  return `
    <div class="resume-container" style="width: 100%; max-width: 100%; box-sizing: border-box; overflow: visible;">
      <header class="resume-header">
        <div class="header-content">
          <div class="profile-info">
            <h1 class="name"><strong>${escapeHtml(personalInfo.firstName || '')} ${escapeHtml(personalInfo.lastName || '')}</strong></h1>
            ${personalInfo.professionalTitle ? `<h2 class="title">${escapeHtml(personalInfo.professionalTitle)}</h2>` : ''}
          </div>
          ${personalInfo.profileImage ? `<img src="${escapeHtml(personalInfo.profileImage)}" alt="${escapeHtml(personalInfo.firstName)} ${escapeHtml(personalInfo.lastName)}" class="profile-image" />` : ''}
        </div>
      </header>
      <main class="resume-main" style="width: 100%; max-width: 100%; box-sizing: border-box; overflow: visible;">
        ${personalInfo.summary?.trim() ? `
          <section class="resume-section">
            <h3 class="section-title">Professional Summary</h3>
            <p style="font-size: 0.9em; line-height: 1.5; color: #495057;">${escapeHtml(personalInfo.summary)}</p>
          </section>
        ` : ''}
        <section class="resume-section">
          <h3 class="section-title">Contact</h3>
          <div class="contact-info" style="display: flex; flex-direction: column; gap: 8px; align-items: flex-start; text-align: left; width: 100%;">
            ${personalInfo.phone ? `<div class="contact-item" style="display: flex; align-items: center; gap: 8px; justify-content: flex-start; text-align: left; width: 100%;"><span>Phone: ${escapeHtml(personalInfo.phone)}</span></div>` : ''}
            <div class="contact-item" style="display: flex; align-items: center; gap: 8px; justify-content: flex-start; text-align: left; width: 100%;"><span>Email: ${escapeHtml(personalInfo.email || '')}</span></div>
            ${personalInfo.location ? `<div class="contact-item" style="display: flex; align-items: center; gap: 8px; justify-content: flex-start; text-align: left; width: 100%;"><span>Location: ${escapeHtml(personalInfo.location)}</span></div>` : ''}
            ${personalInfo.github ? `<div class="contact-item" style="display: flex; align-items: center; gap: 8px; justify-content: flex-start; text-align: left; width: 100%;"><span>GitHub: <a href="${escapeHtml(personalInfo.github)}" target="_blank" rel="noopener noreferrer" class="contact-link">${escapeHtml(personalInfo.github)}</a></span></div>` : ''}
            ${personalInfo.linkedin ? `<div class="contact-item" style="display: flex; align-items: center; gap: 8px; justify-content: flex-start; text-align: left; width: 100%;"><span>LinkedIn: <a href="${escapeHtml(personalInfo.linkedin)}" target="_blank" rel="noopener noreferrer" class="contact-link">${escapeHtml(personalInfo.linkedin)}</a></span></div>` : ''}
            ${personalInfo.website ? `<div class="contact-item" style="display: flex; align-items: center; gap: 8px; justify-content: flex-start; text-align: left; width: 100%;"><span>Website: <a href="${escapeHtml(personalInfo.website)}" target="_blank" rel="noopener noreferrer" class="contact-link">${escapeHtml(personalInfo.website)}</a></span></div>` : ''}
          </div>
        </section>
        ${renderEducation()}
        ${renderWorkExperience()}
        ${renderProjects()}
        ${renderCertificates()}
        ${renderSkills()}
        ${renderLanguages()}
        ${renderInterests()}
      </main>
    </div>
  `;
}

/**
 * Download PDF from resume HTML (from DOM element)
 */
async function downloadPDFFromHTML(
  resumeId: string,
  resumeHTML: string,
  filename?: string
): Promise<void> {
  // Get all stylesheets from the current page (includes Tailwind CSS)
  const pageStylesheets = getAllStylesheets();
  
  // Get font links
  const fontLinks = Array.from(document.querySelectorAll('head > link[rel*="font"], head > link[href*="font"], head > link[href*="fonts.googleapis"]'))
    .map(link => `<link rel="stylesheet" href="${(link as HTMLLinkElement).href}">`)
    .join('\n');
  
  // Also fetch old CSS files for backward compatibility
  const cssContents = await fetchCSSFiles();
  
  // Get computed styles for the resume container to ensure proper styling
  const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  ${fontLinks}
  ${pageStylesheets}
  ${cssContents.join('\n')}
  <style>
    /* Ensure proper rendering */
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      background: white;
    }
    /* Ensure images load correctly */
    img {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  ${resumeHTML}
</body>
</html>`;

  const pdfBlob = await resumeAPI.generatePDF(resumeId, fullHTML);
  
  const url = window.URL.createObjectURL(pdfBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `resume_${resumeId}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * Download PDF from resume data
 */
export async function downloadResumePDF(
  resume: Resume,
  filename?: string
): Promise<void> {
  const resumeHTML = generateResumeHTML(resume);
  await downloadPDFFromHTML(resume.id, resumeHTML, filename || `${resume.personalInfo.firstName || 'resume'}_${resume.personalInfo.lastName || 'download'}.pdf`);
}

/**
 * Download PDF from HTML element (for ResumeView page)
 * If resume is provided, filename will be auto-generated from personalInfo
 */
export async function downloadResumePDFFromElement(
  resumeId: string,
  htmlElement: HTMLElement,
  resumeOrFilename?: Resume | string,
  filename?: string
): Promise<void> {
  const resumeHTML = htmlElement.innerHTML;
  
  // Determine if third param is Resume or filename
  let finalFilename = filename;
  let resume: Resume | undefined;
  
  if (resumeOrFilename) {
    if (typeof resumeOrFilename === 'string') {
      // It's a filename string (backward compatibility)
      finalFilename = resumeOrFilename;
    } else {
      // It's a Resume object
      resume = resumeOrFilename;
    }
  }
  
  // Generate filename from resume if provided, otherwise use provided filename or default
  if (!finalFilename && resume) {
    finalFilename = `${resume.personalInfo.firstName || 'resume'}_${resume.personalInfo.lastName || 'download'}.pdf`;
  }
  if (!finalFilename) {
    finalFilename = `resume_${resumeId}.pdf`;
  }
  
  await downloadPDFFromHTML(resumeId, resumeHTML, finalFilename);
}

