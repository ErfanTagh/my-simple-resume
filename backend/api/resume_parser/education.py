"""
Education extraction from resume text
"""
import re
from typing import Dict, List, Any
from .utils import month_to_number


def extract_education_block_based(text: str, sections: Dict[str, str] = None) -> List[Dict]:
    """
    Block-based education extraction (conservative)
    Anchors on degree keywords, associates institutions loosely
    """
    education = []
    
    print("\n" + "-" * 80)
    print("🎓 EDUCATION EXTRACTION (Block-based)")
    print("-" * 80)
    
    # ONLY extract from education section
    education_text = ""
    if sections and "education" in sections:
        education_text = sections["education"]
        print(f"  Section found: {len(education_text)} chars")
    else:
        print(f"  ⚠️ No EDUCATION section found")
        return [{
            "degree": "",
            "institution": "",
            "location": "",
            "startDate": "",
            "endDate": "",
            "field": "",
            "keyCourses": []
        }]
    
    if not education_text:
        return [{
            "degree": "",
            "institution": "",
            "location": "",
            "startDate": "",
            "endDate": "",
            "field": "",
            "keyCourses": []
        }]
    
    print(f"  📄 Education section text (first 500 chars):")
    print(f"  {repr(education_text[:500])}")
    print()
    
    lines = education_text.split('\n')
    
    # Step 1: Find degree keywords (anchor points)
    degree_patterns = [
        re.compile(r'(?:B\.?Sc\.?|Bachelor(?:\'?s)?)\s+(?:of\s+)?(?:Science|Engineering|Arts|Computer Science|Software Engineering)?', re.IGNORECASE),
        re.compile(r'(?:M\.?Sc\.?|Master(?:\'?s)?)\s+(?:of\s+)?(?:Science|Engineering|Arts|Computer Science)?', re.IGNORECASE),
        re.compile(r'(?:Ph\.?D\.?|Doctorate)\s+(?:of\s+)?(?:Philosophy|Science|Engineering)?', re.IGNORECASE),
    ]
    
    degree_blocks = []
    for i, line in enumerate(lines):
        for pattern in degree_patterns:
            if pattern.search(line):
                # Define block: current line + 3 lines after
                block_start = i
                block_end = min(len(lines), i + 4)
                block_lines = lines[block_start:block_end]
                block_text = '\n'.join(block_lines)
                
                # Extract degree
                degree_match = pattern.search(line)
                degree = degree_match.group(0).strip() if degree_match else ""
                
                degree_blocks.append({
                    'line_idx': i,
                    'degree': degree,
                    'block_lines': block_lines,
                    'block_text': block_text
                })
                print(f"    Found degree: '{degree}' at line {i+1}")
                break
    
    # Step 2: For each degree block, find institution and dates
    for block_info in degree_blocks:
        block_lines = block_info['block_lines']
        degree = block_info['degree']
        
        edu_entry = {
            "degree": degree,
            "institution": "",
            "location": "",
            "startDate": "",
            "endDate": "",
            "field": "",
            "keyCourses": []
        }
        
        # Find institution in block (look for University/College/Institute)
        # General pattern that works for most institutions
        institution_patterns = [
            # Full pattern: Name + University/College/Institute/School
            re.compile(r'(.+?)\s+(University|College|Institute|School)', re.IGNORECASE),
            # Pattern for abbreviations followed by location (e.g., "MIT Cambridge", "RPTU Kaiserslautern")
            # Only match if it's capitalized and looks like an institution
            re.compile(r'([A-Z]{2,}(?:\s+[A-Z][a-zA-Z]+)+)', re.IGNORECASE),
        ]
        
        for line in block_lines:
            for pattern in institution_patterns:
                match = pattern.search(line)
                if match:
                    # If pattern has groups, check if we got the full institution name
                    if len(match.groups()) >= 2:
                        # Pattern like "Name University" - include the full match
                        full_institution = match.group(0).strip()
                        institution = full_institution
                    else:
                        # Pattern like abbreviation + location
                        institution = match.group(1).strip()
                        # Validate: should be reasonable length and not a date
                        if len(institution) < 3 or re.search(r'\d{4}', institution):
                            continue
                    
                    if institution and len(institution) > 2:
                        # Additional validation: skip if it looks like a course name or other text
                        skip_keywords = ['grade', 'seminar', 'course', 'language', 'visualization', 'highest']
                        if any(keyword in institution.lower() for keyword in skip_keywords):
                            continue
                        edu_entry["institution"] = institution
                        print(f"      Found institution: '{institution}'")
                        break
            if edu_entry["institution"]:
                break
        
        # Find dates in block (loose association)
        # Support MM/YYYY - MM/YYYY explicitly, only use "Present" if word exists
        date_patterns = [
            # Format: MM/YYYY - MM/YYYY or Present
            re.compile(r'(\d{1,2})/(\d{4})\s*[-–]\s*(\d{1,2})?/?(\d{4}|Present|present)?', re.IGNORECASE),
            # Format: Month YYYY - Month YYYY or Present
            re.compile(r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})\s*[-–]\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*(\d{4}|Present|present)?', re.IGNORECASE),
            # Format: YYYY - YYYY or Present
            re.compile(r'(\d{4})\s*[-–]\s*(\d{4}|Present|present)?', re.IGNORECASE),
        ]
        
        # Check if "Present" exists in the block text (only use if it does)
        block_text_lower = '\n'.join(block_lines).lower()
        has_present_word = 'present' in block_text_lower
        
        for line in block_lines:
            for pattern_idx, pattern in enumerate(date_patterns):
                match = pattern.search(line)
                if match:
                    if pattern_idx == 0:  # MM/YYYY format
                        start_month = match.group(1)
                        start_year = match.group(2)
                        end_month = match.group(3) if match.lastindex >= 3 and match.group(3) else None
                        end_year = match.group(4) if match.lastindex >= 4 and match.group(4) else None
                        
                        edu_entry["startDate"] = f"{start_year}-{start_month.zfill(2)}"
                        if end_year:
                            # Only use "Present" if the word actually exists in text
                            if end_year.lower() == 'present' and has_present_word:
                                edu_entry["endDate"] = ""
                            elif end_year.lower() != 'present':
                                edu_entry["endDate"] = f"{end_year}-{end_month.zfill(2)}" if end_month else end_year
                    elif pattern_idx == 1:  # Month YYYY format
                        start_month = match.group(1)
                        start_year = match.group(2)
                        end_year = match.group(3) if len(match.groups()) >= 3 else None
                        
                        edu_entry["startDate"] = f"{start_year}-{month_to_number(start_month)}"
                        if end_year:
                            # Only use "Present" if the word actually exists in text
                            if end_year.lower() == 'present' and has_present_word:
                                edu_entry["endDate"] = ""
                            elif end_year.lower() != 'present':
                                edu_entry["endDate"] = end_year
                    else:  # YYYY format
                        start_year = match.group(1)
                        end_year = match.group(2) if len(match.groups()) >= 2 else None
                        
                        edu_entry["startDate"] = f"{start_year}-01"
                        if end_year:
                            # Only use "Present" if the word actually exists in text
                            if end_year.lower() == 'present' and has_present_word:
                                edu_entry["endDate"] = ""
                            elif end_year.lower() != 'present':
                                edu_entry["endDate"] = end_year
                    
                    print(f"      Found dates: {edu_entry['startDate']} - {edu_entry['endDate'] or 'Present'}")
                    break
            if edu_entry["startDate"]:
                break
        
        education.append(edu_entry)
    
    print(f"  📊 Extracted {len(education)} education entries")
    return education if education else [{
        "degree": "",
        "institution": "",
        "location": "",
        "startDate": "",
        "endDate": "",
        "field": "",
        "keyCourses": []
    }]


def extract_education_with_fallback(text: str, sections: Dict[str, str] = None) -> List[Dict]:
    """
    Extract education with fallback: try section first, then full text
    Returns partial results instead of empty sections
    """
    # Try section-based extraction first
    if sections and "education" in sections:
        result = extract_education_block_based(text, sections)
        if result and any(edu.get('degree') or edu.get('institution') for edu in result):
            return result
    
    # Fallback: extract from full text using block-based patterns
    print(f"  ⚠️ No EDUCATION section found, extracting from full text")
    return extract_education_block_based(text, None)

