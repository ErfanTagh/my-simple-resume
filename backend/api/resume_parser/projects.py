"""
Projects extraction from resume text
"""
import re
from typing import Dict, List, Any


def extract_projects(text: str = "", sections: Dict[str, str] = None) -> List[Dict]:
    """Extract projects from text"""
    projects = []
    
    print("\n" + "-" * 80)
    print("📁 PROJECTS EXTRACTION")
    print("-" * 80)
    
    projects_text = ""
    if sections and "projects" in sections:
        projects_text = sections["projects"]
        print(f"  Section found: {len(projects_text)} chars")
    else:
        print(f"  ⚠️ No PROJECTS section found")
        return []
    
    # Simple extraction: look for project names (capitalized words, often followed by descriptions)
    if projects_text:
        # Look for lines that look like project titles (2-5 capitalized words)
        lines = projects_text.split('\n')
        current_project = None
        
        for line in lines:
            line = line.strip()
            if not line or len(line) < 5:
                continue
            
            # Check if line looks like a project title (2-5 capitalized words, not too long)
            title_match = re.match(r'^([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+){1,4})(?:\s|$)', line)
            if title_match and len(line) < 100:
                # Save previous project if exists
                if current_project:
                    projects.append(current_project)
                # Start new project
                current_project = {
                    "name": title_match.group(1).strip(),
                    "description": "",
                    "technologies": [],
                    "url": "",
                    "startDate": "",
                    "endDate": ""
                }
            elif current_project:
                # Add to description
                if current_project["description"]:
                    current_project["description"] += " " + line
                else:
                    current_project["description"] = line
        
        # Add last project
        if current_project:
            projects.append(current_project)
    
    print(f"  📊 Extracted {len(projects)} projects")
    return projects

