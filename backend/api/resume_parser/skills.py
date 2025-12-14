"""
Skills extraction from resume text
"""
import re
from typing import Dict, List, Any


def extract_skills_with_fallback(text: str, sections: Dict[str, str] = None) -> List[Dict]:
    """
    Extract skills with fallback: if Skills section exists, use it;
    otherwise extract from Experience + Projects sections
    Returns List[Dict] with {"skill": "..."} structure for frontend compatibility
    """
    skills_list = []
    
    print("\n" + "-" * 80)
    print("🛠️ SKILLS EXTRACTION (With Fallback)")
    print("-" * 80)
    
    # Step 1: Try Skills section first
    if sections and "skills" in sections:
        skills_text = sections["skills"]
        print(f"  ✓ Skills section found: {len(skills_text)} chars")
        
        # Extract skills from section (comma-separated, bullet points, or line-separated)
        lines = skills_text.split('\n')
        for line in lines:
            line = line.strip()
            if not line or line.startswith(('•', '-', '*')):
                continue
            
            # Split by comma, semicolon, or pipe
            skill_items = re.split(r'[,;|]', line)
            for item in skill_items:
                skill = item.strip()
                if skill and len(skill) > 1:
                    skills_list.append(skill)
        
        print(f"  📊 Extracted {len(skills_list)} skills from Skills section")
        # Convert to List[Dict] format for frontend
        return [{"skill": s} for s in skills_list] if skills_list else []
    
    # Step 2: Fallback - extract from Experience + Projects
    print(f"  ⚠️ No Skills section found, extracting from Experience + Projects")
    
    # Known skill vocabulary (common tech skills)
    skill_keywords = [
        'python', 'java', 'javascript', 'typescript', 'react', 'vue', 'angular',
        'node', 'express', 'django', 'flask', 'spring', 'sql', 'mongodb', 'postgresql',
        'aws', 'docker', 'kubernetes', 'git', 'linux', 'html', 'css', 'sass',
        'redux', 'graphql', 'rest', 'api', 'microservices', 'ci/cd', 'jenkins',
        'agile', 'scrum', 'tensorflow', 'pytorch', 'machine learning', 'ai',
        'c++', 'c#', '.net', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin'
    ]
    
    # Combine experience and projects text
    combined_text = ""
    if sections and "experience" in sections:
        combined_text += sections["experience"] + "\n"
    if sections and "projects" in sections:
        combined_text += sections["projects"] + "\n"
    
    if combined_text:
        # Extract skills mentioned in text
        text_lower = combined_text.lower()
        found_skills = set()
        
        for keyword in skill_keywords:
            # Look for keyword as whole word
            pattern = re.compile(r'\b' + re.escape(keyword) + r'\b', re.IGNORECASE)
            if pattern.search(combined_text):
                found_skills.add(keyword.title())
        
        skills_list = list(found_skills)
        print(f"  📊 Extracted {len(skills_list)} skills from Experience + Projects")
    
    # Convert to List[Dict] format for frontend
    return [{"skill": s} for s in skills_list] if skills_list else []

