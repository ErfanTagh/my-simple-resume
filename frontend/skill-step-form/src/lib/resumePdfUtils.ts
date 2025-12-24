import { resumeAPI, Resume } from './api';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { CVFormData } from '@/components/cv-form/types';
import { ModernTemplate } from '@/components/cv-form/templates/ModernTemplate';
import { ClassicTemplate } from '@/components/cv-form/templates/ClassicTemplate';
import { MinimalTemplate } from '@/components/cv-form/templates/MinimalTemplate';
import { CreativeTemplate } from '@/components/cv-form/templates/CreativeTemplate';
import { LatexTemplate } from '@/components/cv-form/templates/LatexTemplate';
import { StarRoverTemplate } from '@/components/cv-form/templates/StarRoverTemplate';
import { LanguageProvider } from '@/contexts/LanguageContext';

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
    /* Remove page margins for PDF - no white space around the document */
    @page {
      margin: 0 !important;
      padding: 0 !important;
      size: A4;
    }
    /* Ensure proper rendering */
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0 !important;
      padding: 8mm !important;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      background: white;
      width: 100%;
    }
    /* Aggressively remove all margins and constraints from template root */
    /* Templates use mx-auto and max-w-* which create side margins - force remove for PDF */
    body > div:first-child {
      margin: 0 !important;
      padding: 0 !important;
      max-width: none !important;
      width: 100% !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }
    /* Remove padding from resume-container class only if it's the root element */
    /* This prevents the container's 40px padding from affecting the PDF */
    /* Template's internal padding (p-8, p-12, etc.) should be preserved */
    body > .resume-container {
      padding: 0 !important;
      margin: 0 !important;
    }
    /* Override ALL possible Tailwind classes that could add margins/width constraints */
    body > div[class*="mx-auto"],
    body > div[class*="mx-"],
    body > div[class*="max-w"],
    body > div[class*="w-"],
    body > div.bg-background,
    body > div.bg-gradient {
      margin: 0 !important;
      margin-left: 0 !important;
      margin-right: 0 !important;
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      max-width: none !important;
      width: 100% !important;
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
 * Convert Resume to CVFormData format for template rendering
 */
function convertResumeToFormData(resume: Resume): CVFormData {
  return {
    template: resume.template || 'modern',
    personalInfo: resume.personalInfo,
    workExperience: resume.workExperience || [],
    education: resume.education || [],
    projects: resume.projects || [],
    certificates: resume.certificates || [],
    skills: resume.skills || [],
    languages: resume.languages || [],
    sectionOrder: resume.sectionOrder || []
  };
}

/**
 * Render React template component to HTML string
 */
function renderTemplateToHTML(resume: Resume): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const formData = convertResumeToFormData(resume);
      const template = resume.template || 'modern';
      
      // Create a temporary container with proper styling context
      const container = document.createElement('div');
      container.className = 'resume-container';
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.width = '210mm';
      container.style.padding = '40px';
      container.style.backgroundColor = 'white';
      container.style.visibility = 'hidden';
      container.style.opacity = '0';
      // Ensure container has proper styling context by adding it to body
      document.body.appendChild(container);
      
      // Create a root for React rendering
      const root = ReactDOM.createRoot(container);
      
      // Render the appropriate template wrapped with LanguageProvider
      let templateComponent: React.ReactElement;
      switch (template) {
        case 'classic':
          templateComponent = React.createElement(ClassicTemplate, { data: formData });
          break;
        case 'minimal':
          templateComponent = React.createElement(MinimalTemplate, { data: formData });
          break;
        case 'creative':
          templateComponent = React.createElement(CreativeTemplate, { data: formData });
          break;
        case 'latex':
          templateComponent = React.createElement(LatexTemplate, { data: formData });
          break;
        case 'starRover':
          templateComponent = React.createElement(StarRoverTemplate, { data: formData });
          break;
        case 'modern':
        default:
          templateComponent = React.createElement(ModernTemplate, { data: formData });
          break;
      }
      
      // Wrap template with LanguageProvider to provide context
      const wrappedComponent = React.createElement(
        LanguageProvider,
        { children: templateComponent }
      );
      
      root.render(wrappedComponent);
      
      // Wait for React to render using both requestAnimationFrame and timeout
      // This ensures we wait long enough for React to fully render
      let frameCount = 0;
      const maxFrames = 30; // Increased to 30 frames (~500ms at 60fps)
      const maxWaitTime = 2000; // Maximum 2 seconds wait time
      const startTime = Date.now();
      let resolved = false;
      
      const checkRender = () => {
        if (resolved) return;
        
        frameCount++;
        const elapsed = Date.now() - startTime;
        const html = container.innerHTML;
        
        // Check if we have substantial content (more than just container/div tags)
        // Look for actual content like text nodes, not just empty divs
        const hasSubstantialContent = html.trim().length > 500 && 
          (html.includes('<h1') || html.includes('<h2') || html.includes('<h3') || 
           html.includes('class="name') || html.includes('class="title') ||
           html.includes('resume-header') || html.includes('resume-main'));
        
        const shouldResolve = hasSubstantialContent || frameCount >= maxFrames || elapsed >= maxWaitTime;
        
        if (shouldResolve) {
          try {
            const templateHtml = container.innerHTML;
            // More lenient check - just ensure we have some HTML content
            if (templateHtml.trim().length > 100) {
              resolved = true;
              // Cleanup
              root.unmount();
              document.body.removeChild(container);
              // Wrap the template HTML in a container div matching ResumeView structure
              // This ensures the same padding and styling as the individual resume page
              const finalHtml = `<div class="resume-container" style="max-width: 210mm; margin: 0 auto; background-color: white; padding: 40px; box-sizing: border-box;">${templateHtml}</div>`;
              resolve(finalHtml);
            } else if (elapsed >= maxWaitTime) {
              // If we've waited the max time and still no content, reject
              resolved = true;
              root.unmount();
              document.body.removeChild(container);
              reject(new Error('Template rendering failed - no content generated after waiting'));
            } else {
              // Continue waiting
              requestAnimationFrame(checkRender);
            }
          } catch (error) {
            // Cleanup on error
            resolved = true;
            try {
              root.unmount();
              document.body.removeChild(container);
            } catch {}
            reject(error);
          }
        } else {
          requestAnimationFrame(checkRender);
        }
      };
      
      // Start checking after a short delay to allow React to start rendering
      setTimeout(() => {
        requestAnimationFrame(checkRender);
      }, 50);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Download PDF from resume data
 * Uses the same approach as downloadResumePDFFromElement by temporarily rendering
 * the resume on the page to get identical HTML structure
 */
export async function downloadResumePDF(
  resume: Resume,
  filename?: string
): Promise<void> {
  // Create structure that matches ResumeView exactly:
  // Outer container (hidden, no padding) -> Inner wrapper (where template renders)
  // This matches: <div class="resume-container" style="padding: 40px"><template/></div>
  // But we extract innerHTML from the inner wrapper, not the outer container
  const outerContainer = document.createElement('div');
  outerContainer.style.position = 'fixed';
  outerContainer.style.left = '-9999px';
  outerContainer.style.top = '0';
  outerContainer.style.width = '210mm';
  outerContainer.style.margin = '0';
  outerContainer.style.padding = '0';
  outerContainer.style.backgroundColor = 'transparent';
  outerContainer.style.visibility = 'hidden';
  outerContainer.style.opacity = '0';
  outerContainer.style.zIndex = '-9999';
  document.body.appendChild(outerContainer);

  // Create inner wrapper div where template will render (matches ResumeView structure)
  const innerWrapper = document.createElement('div');
  innerWrapper.style.width = '100%';
  innerWrapper.style.height = '100%';
  innerWrapper.style.padding = '0';
  innerWrapper.style.margin = '0';
  outerContainer.appendChild(innerWrapper);

  // Create a root for React rendering on the inner wrapper (declare outside try for cleanup)
  const root = ReactDOM.createRoot(innerWrapper);

  try {
    const formData = convertResumeToFormData(resume);
    const template = resume.template || 'modern';
    
    // Render the appropriate template wrapped with LanguageProvider
    let templateComponent: React.ReactElement;
    switch (template) {
      case 'classic':
        templateComponent = React.createElement(ClassicTemplate, { data: formData });
        break;
      case 'minimal':
        templateComponent = React.createElement(MinimalTemplate, { data: formData });
        break;
      case 'creative':
        templateComponent = React.createElement(CreativeTemplate, { data: formData });
        break;
      case 'latex':
        templateComponent = React.createElement(LatexTemplate, { data: formData });
        break;
      case 'starRover':
        templateComponent = React.createElement(StarRoverTemplate, { data: formData });
        break;
      case 'modern':
      default:
        templateComponent = React.createElement(ModernTemplate, { data: formData });
        break;
    }
    
    // Wrap template with LanguageProvider to provide context
    const wrappedComponent = React.createElement(
      LanguageProvider,
      { children: templateComponent }
    );
    
    root.render(wrappedComponent);
    
    // Wait for React to render - use a more reliable approach
    await new Promise<void>((resolve) => {
      let frameCount = 0;
      const maxFrames = 30;
      const maxWaitTime = 2000;
      const startTime = Date.now();
      
      const checkRender = () => {
        frameCount++;
        const elapsed = Date.now() - startTime;
        const html = innerWrapper.innerHTML;
        
        // Check if we have substantial content
        const hasSubstantialContent = html.trim().length > 500 && 
          (html.includes('<h1') || html.includes('<h2') || html.includes('<h3') || 
           html.includes('class="name') || html.includes('class="title') ||
           html.includes('resume-header') || html.includes('resume-main'));
        
        if (hasSubstantialContent || frameCount >= maxFrames || elapsed >= maxWaitTime) {
          resolve();
        } else {
          requestAnimationFrame(checkRender);
        }
      };
      
      setTimeout(() => {
        requestAnimationFrame(checkRender);
      }, 50);
    });
    
    // Get the innerHTML exactly like downloadResumePDFFromElement does
    // This is the working method - just get innerHTML and pass to downloadPDFFromHTML
    let resumeHTML = innerWrapper.innerHTML;
    
    // Strip margin classes that create side margins (mx-auto, max-w-*, etc.)
    // Replace them to remove the margin/width constraints
    resumeHTML = resumeHTML.replace(/\s*mx-auto\s*/g, ' ');
    resumeHTML = resumeHTML.replace(/\s*max-w-[^\s"]+\s*/g, ' ');
    resumeHTML = resumeHTML.replace(/\s*mx-\d+\s*/g, ' ');
    resumeHTML = resumeHTML.replace(/\s*ml-auto\s*/g, ' ');
    resumeHTML = resumeHTML.replace(/\s*mr-auto\s*/g, ' ');
    
    // Generate filename
    const finalFilename = filename || `${resume.personalInfo.firstName || 'resume'}_${resume.personalInfo.lastName || 'download'}.pdf`;
    
    // Call downloadPDFFromHTML directly - same as downloadResumePDFFromElement does
    await downloadPDFFromHTML(resume.id, resumeHTML, finalFilename);
  } finally {
    // Cleanup - ensure everything is always removed
    try {
      root.unmount();
    } catch (e) {
      // Ignore unmount errors
    }
    try {
      if (outerContainer.parentNode) {
        document.body.removeChild(outerContainer);
      }
    } catch (e) {
      // Ignore removal errors
    }
  }
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
  // Get the innerHTML (template content)
  // The templates already have their own padding built in (p-8, p-12, etc.)
  // We use the template HTML as-is without adding container padding
  // This gives clean PDFs without extra padding on the sides
  // Extract innerHTML to get just the template content, excluding the container's padding
  let resumeHTML = htmlElement.innerHTML;
  
  // Strip any margin classes that could create side margins (mx-auto, max-w-*, etc.)
  // This ensures the PDF doesn't have unwanted margins like the container padding
  resumeHTML = resumeHTML.replace(/\s*mx-auto\s*/g, ' ');
  resumeHTML = resumeHTML.replace(/\s*max-w-[^\s"]+\s*/g, ' ');
  resumeHTML = resumeHTML.replace(/\s*mx-\d+\s*/g, ' ');
  resumeHTML = resumeHTML.replace(/\s*ml-auto\s*/g, ' ');
  resumeHTML = resumeHTML.replace(/\s*mr-auto\s*/g, ' ');
  
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

