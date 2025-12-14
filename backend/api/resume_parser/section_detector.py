"""
Section detection logic for resume parsing
"""
import re
from typing import Dict, List
from .constants import SECTION_HEADERS


def is_header_like(line: str) -> bool:
    """
    Check if a line looks like a section header (conservative)
    Headers are: short, mostly alphabetic, not bullet points, not sentences
    """
    line = line.strip()
    if not line or len(line) < 3:
        return False
    
    # Too long to be a header (likely a sentence)
    if len(line) > 50:
        return False
    
    # Contains bullet points - not a header
    if re.search(r'[•\-\*\+]\s+', line):
        return False
    
    # Contains sentence-ending punctuation - likely a sentence
    if re.search(r'[.!?]\s*$', line):
        return False
    
    # Mostly alphabetic (at least 60% letters)
    alpha_count = sum(1 for c in line if c.isalpha())
    if alpha_count / len(line) < 0.6:
        return False
    
    # Not all caps (headers are usually title case or mixed)
    if line.isupper() and len(line) > 10:
        return False
    
    return True


def normalize_header(line: str) -> str:
    """Normalize a header line for section detection"""
    # Remove ALL whitespace first, then remove non-letters, lowercase
    normalized = re.sub(r'\s+', '', line.lower())
    normalized = re.sub(r'[^a-z]', '', normalized)
    return normalized


def split_into_sections(text: str) -> Dict[str, str]:
    """
    Split resume text into sections based on headers
    FIXED: Handles multi-column layouts where headers have leading whitespace
    """
    sections: Dict[str, List[str]] = {}
    current_section = "other"
    sections[current_section] = []
    
    # Build header lookup with normalized keys (no whitespace)
    header_lookup = {}
    for section, variants in SECTION_HEADERS.items():
        for variant in variants:
            # Normalize variant (remove all whitespace and non-letters)
            normalized = normalize_header(variant)
            header_lookup[normalized] = section
    
    lines = text.split('\n')
    found_sections = []
    
    for line in lines:
        original_line = line
        line = line.strip()
        
        # Skip empty lines
        if not line:
            sections[current_section].append(original_line)
            continue
        
        # CONSERVATIVE: Only check if line looks like a header
        if not is_header_like(line):
            # Not header-like, add to current section
            sections[current_section].append(original_line)
            continue
        
        # Check if this header-like line matches a known section header
        matched_section = None
        normalized = normalize_header(line)
        
        # Strategy 1: Exact match (most reliable)
        if normalized in header_lookup:
            matched_section = header_lookup[normalized]
        
        # Strategy 2: Header appears at start of line (for two-column layouts)
        if not matched_section:
            for header_normalized, section in header_lookup.items():
                if len(header_normalized) >= 4:
                    # Check if normalized line starts with header
                    if normalized.startswith(header_normalized):
                        # Verify it's a word boundary (not part of longer word)
                        remaining = normalized[len(header_normalized):]
                        if not remaining or not remaining[0].isalpha():
                            matched_section = section
                            break
                    # Check if header appears in middle (for two-column: "Contact | Work Experience")
                    idx = normalized.find(header_normalized)
                    if idx >= 0 and idx > 0:
                        # Preceded by non-letter and followed by non-letter or end
                        before_ok = not normalized[idx-1].isalpha()
                        after_idx = idx + len(header_normalized)
                        after_ok = after_idx >= len(normalized) or not normalized[after_idx].isalpha()
                        if before_ok and after_ok:
                            matched_section = section
                            break
        
        if matched_section:
            print(f"  🎯 Found section '{matched_section}' in line: {line.strip()[:60]}...")
            current_section = matched_section
            sections.setdefault(current_section, [])
            if current_section not in found_sections:
                found_sections.append(current_section)
            
            # Extract content after the header (if any on same line)
            line_after_header = line
            for header_variant in SECTION_HEADERS.get(matched_section, []):
                header_pattern = re.compile(re.escape(header_variant), re.IGNORECASE)
                if header_pattern.search(line):
                    line_after_header = re.sub(
                        r'^.*?' + re.escape(header_variant) + r'[:\s]*',
                        '',
                        line,
                        flags=re.IGNORECASE,
                        count=1
                    ).strip()
                    break
            
            # Only add if there's content after the header
            if line_after_header and len(line_after_header) > 5:
                sections[current_section].append(line_after_header)
        else:
            # Add line to current section
            sections[current_section].append(line)
    
    # Convert lists to strings
    result = {
        section: '\n'.join(lines).strip()
        for section, lines in sections.items()
        if lines and section != "other"
    }
    
    # Include "other" section if it has meaningful content
    if sections.get("other") and len('\n'.join(sections["other"]).strip()) > 50:
        result["other"] = '\n'.join(sections["other"]).strip()
    
    print(f"📑 Sections found: {', '.join(found_sections) if found_sections else 'none'}")
    
    # Debug: Print section info
    for section in found_sections:
        if section in result:
            content = result[section]
            print(f"  📄 {section}: {len(content)} chars, {content.count(chr(10))} lines")
    
    return result

