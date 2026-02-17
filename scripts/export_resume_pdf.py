#!/usr/bin/env python3
"""
Export a user's resume from MongoDB to PDF. Run on server inside backend container.
Usage: python export_resume_pdf.py <user_id> [output_path]
Example: python export_resume_pdf.py 33 /tmp/sina_resume.pdf
"""
import os
import sys
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime


def get_db():
    host = os.getenv('MONGODB_HOST', 'resume_mongodb')
    port = int(os.getenv('MONGODB_PORT', 27017))
    dbname = os.getenv('MONGODB_NAME', 'resume_db')
    user = os.getenv('MONGODB_USERNAME', '')
    pw = os.getenv('MONGODB_PASSWORD', '')
    if user and pw:
        client = MongoClient(host, port, username=user, password=pw, authSource='admin', authMechanism='SCRAM-SHA-1')
    else:
        client = MongoClient(host, port)
    return client[dbname]


def resume_to_html(doc):
    """Build minimal resume HTML from MongoDB document."""
    pi = doc.get('personal_info') or {}
    name = f"{pi.get('first_name', '')} {pi.get('last_name', '')}".strip() or 'Resume'
    title = pi.get('professional_title', '')
    email = pi.get('email', '')
    phone = pi.get('phone', '')
    location = pi.get('location', '')
    summary = pi.get('summary', '')
    we = doc.get('work_experience') or []
    edu = doc.get('education') or []
    skills = doc.get('skills') or []
    langs = doc.get('languages') or []
    projects = doc.get('projects') or []

    def esc(s):
        return (s or '').replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')

    lines = []
    lines.append('<!DOCTYPE html><html><head><meta charset="UTF-8"><style>')
    lines.append('''
      * { box-sizing: border-box; }
      body { font-family: "Helvetica Neue", Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #222; max-width: 210mm; margin: 0 auto; padding: 12mm; }
      h1 { font-size: 22pt; margin: 0 0 4px 0; font-weight: 600; }
      .subtitle { font-size: 12pt; color: #444; margin-bottom: 8px; }
      .contact { font-size: 10pt; color: #555; margin-bottom: 12px; }
      .section { margin-top: 14px; }
      .section-title { font-size: 12pt; font-weight: 600; border-bottom: 1px solid #333; padding-bottom: 2px; margin-bottom: 6px; }
      .job, .edu-item, .project { margin-bottom: 10px; }
      .job-title, .edu-degree { font-weight: 600; }
      .company, .institution { color: #444; font-size: 10pt; }
      .date { float: right; color: #666; font-size: 10pt; }
      ul { margin: 4px 0; padding-left: 18px; }
      .skills-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
      .skill-tag { background: #f0f0f0; padding: 2px 8px; border-radius: 4px; font-size: 10pt; }
      @media print { body { padding: 10mm; } }
    ''')
    lines.append('</style></head><body>')
    lines.append(f'<h1>{esc(name)}</h1>')
    if title:
        lines.append(f'<div class="subtitle">{esc(title)}</div>')
    contact_parts = [email, phone, location]
    contact_parts = [c for c in contact_parts if c]
    if contact_parts:
        lines.append(f'<div class="contact">{esc(" | ".join(contact_parts))}</div>')
    if summary:
        lines.append(f'<div class="section"><div class="section-title">Summary</div><p>{esc(summary)}</p></div>')
    if we:
        lines.append('<div class="section"><div class="section-title">Work Experience</div>')
        for j in we:
            pos = j.get('position', '')
            company = j.get('company', '')
            loc = j.get('location', '')
            start = j.get('start_date', '')
            end = j.get('end_date', '') or 'Present'
            date_str = f"{start} – {end}" if start else end
            lines.append(f'<div class="job"><span class="job-title">{esc(pos)}</span> <span class="date">{esc(date_str)}</span><br><span class="company">{esc(company)}' + (f', {esc(loc)}' if loc else '') + '</span>')
            resp = j.get('responsibilities') or []
            if resp:
                lines.append('<ul>')
                for r in resp:
                    lines.append(f'<li>{esc(r.get("responsibility", ""))}</li>')
                lines.append('</ul>')
            lines.append('</div>')
        lines.append('</div>')
    if edu:
        lines.append('<div class="section"><div class="section-title">Education</div>')
        for e in edu:
            degree = e.get('degree', '')
            inst = e.get('institution', '')
            start = e.get('start_date', '')
            end = e.get('end_date', '')
            date_str = f"{start} – {end}" if (start or end) else ''
            lines.append(f'<div class="edu-item"><span class="edu-degree">{esc(degree)}</span>' + (f' <span class="date">{esc(date_str)}</span>' if date_str else '') + f'<br><span class="institution">{esc(inst)}</span></div>')
        lines.append('</div>')
    if projects:
        lines.append('<div class="section"><div class="section-title">Projects</div>')
        for p in projects:
            name_p = p.get('name', '')
            desc = p.get('description', '')
            if name_p or desc:
                lines.append(f'<div class="project"><span class="job-title">{esc(name_p)}</span><br><p>{esc(desc)}</p></div>')
        lines.append('</div>')
    if skills:
        line = '<div class="section"><div class="section-title">Skills</div><div class="skills-list">'
        for s in skills:
            line += f'<span class="skill-tag">{esc(s.get("skill", ""))}</span>'
        line += '</div></div>'
        lines.append(line)
    if langs:
        lines.append('<div class="section"><div class="section-title">Languages</div><p>')
        lines.append(', '.join(f"{esc(l.get('language', ''))} ({esc(l.get('proficiency', ''))})" for l in langs))
        lines.append('</p></div>')
    lines.append('</body></html>')
    return '\n'.join(lines)


def generate_pdf_from_html(html_content: str) -> bytes:
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_content(html_content, wait_until='networkidle')
        pdf_bytes = page.pdf(
            format='A4',
            margin={'top': '10mm', 'right': '10mm', 'bottom': '10mm', 'left': '10mm'},
            print_background=True,
        )
        browser.close()
    return pdf_bytes


def main():
    if len(sys.argv) < 2:
        print('Usage: python export_resume_pdf.py <user_id> [output_path]', file=sys.stderr)
        sys.exit(1)
    user_id = int(sys.argv[1])
    output_path = sys.argv[2] if len(sys.argv) > 2 else '/tmp/resume_export.pdf'
    db = get_db()
    doc = db.resumes.find_one({'user_id': user_id})
    if not doc:
        print(f'No resume found for user_id={user_id}', file=sys.stderr)
        sys.exit(1)
    html = resume_to_html(doc)
    pdf_bytes = generate_pdf_from_html(html)
    with open(output_path, 'wb') as f:
        f.write(pdf_bytes)
    print(f'Written: {output_path}')


if __name__ == '__main__':
    main()
