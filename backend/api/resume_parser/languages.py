"""
Languages extraction from resume text
"""
import re
from typing import Dict, List, Any


def extract_languages_with_fallback(text: str = "", sections: Dict[str, str] = None) -> List[Dict]:
    """
    Extract languages with fallback: try section first, then full text
    Returns partial results instead of empty sections
    """
    # Try section-based extraction first
    if sections and "languages" in sections:
        result = extract_languages(text, sections)
        if result:
            return result
    
    # Fallback: extract from full text using language + proficiency patterns
    print(f"  ⚠️ No LANGUAGES section found, extracting from full text")
    return extract_languages(text, None)


def extract_languages(text: str = "", sections: Dict[str, str] = None) -> List[Dict]:
    """Extract languages from text"""
    languages = []
    
    print("\n" + "-" * 80)
    print("🌐 LANGUAGES EXTRACTION")
    print("-" * 80)
    
    lang_text = ""
    if sections and "languages" in sections:
        lang_text = sections["languages"]
        print(f"  Section found: {len(lang_text)} chars")
    elif sections is None:
        # Fallback mode: use full text
        lang_text = text
        print(f"  Using full text for extraction: {len(lang_text)} chars")
    else:
        print(f"  ⚠️ No LANGUAGES section found")
        return []
    
    if lang_text:
        # Common language names
        common_languages = ['English', 'German', 'French', 'Spanish', 'Italian', 'Portuguese', 
                          'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Russian',
                          'Persian', 'Farsi', 'Turkish', 'Dutch', 'Polish', 'Czech']
        
        # Look for language names followed by proficiency levels
        lines = lang_text.split('\n')
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Pattern: Language Name + Proficiency (A1, A2, B1, B2, C1, C2, Native, Fluent, etc.)
            lang_pattern = r'\b(' + '|'.join(common_languages) + r')\b\s*([A-Z]?\d|Native|Fluent|Basic|Intermediate|Advanced|Proficient)?'
            matches = re.finditer(lang_pattern, line, re.IGNORECASE)
            for match in matches:
                lang_name = match.group(1)
                proficiency = match.group(2) if match.group(2) else ""
                languages.append({
                    "language": lang_name,
                    "proficiency": proficiency
                })
    
    print(f"  📊 Extracted {len(languages)} languages")
    return languages

