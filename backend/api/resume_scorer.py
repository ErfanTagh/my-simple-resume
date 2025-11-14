"""
Resume Quality Scoring Utility
Calculates quality scores for: Completeness, Clarity, Formatting, and Impact
"""
import re


def calculate_resume_quality(resume_data):
    """
    Calculate comprehensive resume quality scores
    Returns dict with: completeness, clarity, formatting, impact, overall_score
    """
    completeness = calculate_completeness(resume_data)
    clarity = calculate_clarity(resume_data)
    formatting = calculate_formatting(resume_data)
    impact = calculate_impact(resume_data)
    
    overall_score = round((completeness + clarity + formatting + impact) / 4, 1)
    
    return {
        'completeness_score': completeness,
        'clarity_score': clarity,
        'formatting_score': formatting,
        'impact_score': impact,
        'overall_score': overall_score,
    }


def calculate_completeness(data):
    """
    COMPLETENESS: Measures how complete the resume is
    - Are all sections filled?
    - Is there enough content in each section?
    """
    score = 0.0
    max_score = 10.0
    
    personal_info = data.get('personal_info', {}) or data.get('personalInfo', {})
    
    # Personal Info (2 points)
    has_basic_info = all([
        personal_info.get('first_name') or personal_info.get('firstName'),
        personal_info.get('last_name') or personal_info.get('lastName'),
        personal_info.get('email'),
        personal_info.get('phone')
    ])
    has_extended_info = all([
        personal_info.get('professional_title') or personal_info.get('professionalTitle'),
        personal_info.get('summary'),
        personal_info.get('location')
    ])
    
    if has_basic_info:
        score += 1
    if has_extended_info:
        score += 1
    
    # Work Experience (3 points)
    work_exp = data.get('work_experience', []) or data.get('workExperience', []) or []
    if len(work_exp) >= 1:
        score += 1
    if len(work_exp) >= 2:
        score += 1
    
    has_detailed_work = any(
        w.get('position') and w.get('company') and 
        w.get('description') and len(w.get('description', '')) > 50
        for w in work_exp
    )
    if has_detailed_work:
        score += 1
    
    # Education (2 points)
    education = data.get('education', []) or []
    if len(education) >= 1:
        score += 1
    
    has_detailed_edu = any(
        e.get('degree') and e.get('institution') and 
        (e.get('field_of_study') or e.get('fieldOfStudy'))
        for e in education
    )
    if has_detailed_edu:
        score += 1
    
    # Skills (1 point)
    skills = data.get('skills', []) or []
    valid_skills = [s for s in skills if s.get('skill') and s.get('skill').strip()]
    if len(valid_skills) >= 5:
        score += 1
    
    # Languages (0.5 points)
    languages = data.get('languages', []) or []
    valid_langs = [l for l in languages if l.get('language') and l.get('proficiency')]
    if len(valid_langs) >= 1:
        score += 0.5
    
    # Projects/Certificates (1.5 points bonus)
    projects = data.get('projects', []) or []
    certificates = data.get('certificates', []) or []
    if len(projects) >= 1:
        score += 0.75
    if len(certificates) >= 1:
        score += 0.75
    
    return min(round(score, 1), max_score)


def calculate_clarity(data):
    """
    CLARITY: Measures how clear and readable the content is
    - Is the information well-organized?
    - Are descriptions concise and clear?
    """
    score = 0.0
    max_score = 10.0
    
    personal_info = data.get('personal_info', {}) or data.get('personalInfo', {})
    
    # Clear professional identity (2 points)
    prof_title = personal_info.get('professional_title') or personal_info.get('professionalTitle') or ''
    if len(prof_title) > 3:
        score += 1
    
    summary = personal_info.get('summary', '')
    if 50 <= len(summary) <= 300:
        score += 1
    
    # Work experience clarity (3 points)
    work_exp = data.get('work_experience', []) or data.get('workExperience', []) or []
    clear_work_entries = 0
    
    for w in work_exp:
        has_title = w.get('position') and len(w.get('position', '')) >= 3
        has_company = w.get('company') and len(w.get('company', '')) >= 2
        desc = w.get('description', '')
        has_description = 30 <= len(desc) <= 500
        has_dates = w.get('start_date') or w.get('startDate')
        
        if has_title and has_company and has_description and has_dates:
            clear_work_entries += 1
    
    if clear_work_entries >= 1:
        score += 1.5
    if clear_work_entries >= 2:
        score += 1.5
    
    # Education clarity (2 points)
    education = data.get('education', []) or []
    clear_edu_entries = sum(
        1 for e in education
        if e.get('degree') and e.get('institution') and 
        (e.get('field_of_study') or e.get('fieldOfStudy'))
    )
    
    if clear_edu_entries >= 1:
        score += 2
    
    # Skills organization (1.5 points)
    skills = data.get('skills', []) or []
    valid_skills = [
        s for s in skills
        if s.get('skill') and 2 <= len(s.get('skill', '').strip()) <= 50
    ]
    
    if len(valid_skills) >= 3:
        score += 0.75
    if len(valid_skills) >= 6:
        score += 0.75
    
    # Section order defined (1.5 points)
    section_order = data.get('section_order') or data.get('sectionOrder')
    if section_order and len(section_order) > 0:
        score += 1.5
    
    return min(round(score, 1), max_score)


def calculate_formatting(data):
    """
    FORMATTING: Measures the visual appeal and structure
    - Is a template selected?
    - Are sections properly ordered?
    """
    score = 5.0  # Base score
    max_score = 10.0
    
    # Template selection (2 points)
    template = data.get('template', 'modern')
    if template in ['modern', 'classic', 'minimal', 'creative']:
        score += 2
    
    # Section ordering (2 points)
    section_order = data.get('section_order') or data.get('sectionOrder')
    if section_order and len(section_order) >= 4:
        score += 2
    
    # Consistent date formatting in work experience (1 point)
    work_exp = data.get('work_experience', []) or data.get('workExperience', []) or []
    if work_exp:
        has_consistent_dates = all(
            (w.get('start_date') or w.get('startDate')) or 
            w.get('currently_working') or w.get('currentlyWorking')
            for w in work_exp
        )
        if has_consistent_dates:
            score += 1
    
    return min(round(score, 1), max_score)


def calculate_impact(data):
    """
    IMPACT: Measures how impressive and effective the resume is
    - Does it showcase achievements?
    - Are there quantifiable results?
    """
    score = 0.0
    max_score = 10.0
    
    personal_info = data.get('personal_info', {}) or data.get('personalInfo', {})
    
    # Strong professional summary (2 points)
    summary = personal_info.get('summary', '')
    if len(summary) >= 100:
        score += 1
    if len(summary) >= 150:
        score += 1
    
    # Impactful work descriptions (4 points)
    work_exp = data.get('work_experience', []) or data.get('workExperience', []) or []
    impactful_work = 0
    
    action_words_pattern = re.compile(
        r'\b(led|managed|developed|created|improved|increased|reduced|achieved|'
        r'implemented|designed|built|launched)\b',
        re.IGNORECASE
    )
    
    for w in work_exp:
        desc = w.get('description', '')
        has_action_words = bool(action_words_pattern.search(desc))
        has_numbers = bool(re.search(r'\d+', desc))
        has_detail = len(desc) >= 80
        
        if sum([has_action_words, has_numbers, has_detail]) >= 2:
            impactful_work += 1
    
    if impactful_work >= 1:
        score += 2
    if impactful_work >= 2:
        score += 2
    
    # Skills showcase (2 points)
    skills = data.get('skills', []) or []
    if len(skills) >= 5:
        score += 1
    if len(skills) >= 8:
        score += 1
    
    # Additional credentials (2 points)
    projects = data.get('projects', []) or []
    certificates = data.get('certificates', []) or []
    languages = data.get('languages', []) or []
    
    has_projects = len([p for p in projects if p.get('name') and p.get('description')]) >= 1
    has_certs = len([c for c in certificates if c.get('name') and c.get('organization')]) >= 1
    has_langs = len([l for l in languages if l.get('language') and l.get('proficiency')]) >= 2
    
    if has_projects:
        score += 0.75
    if has_certs:
        score += 0.75
    if has_langs:
        score += 0.5
    
    return min(round(score, 1), max_score)

