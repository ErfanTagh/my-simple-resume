"""
Text normalization and utility functions
"""
import re
from typing import Dict, Any


def normalize_text(text: str) -> str:
    """
    Text normalization: trim whitespace, collapse spacing, preserve line breaks
    This is the primary normalization - always run on original text
    """
    lines = text.split('\n')
    normalized_lines = []
    
    for line in lines:
        # Trim leading/trailing whitespace
        line = line.strip()
        # Collapse excessive internal spacing (3+ spaces to single space)
        line = re.sub(r' {3,}', ' ', line)
        # Preserve the line (even if empty, to maintain structure)
        normalized_lines.append(line)
    
    return '\n'.join(normalized_lines)


def detect_two_column_hint(text: str) -> Dict[str, Any]:
    """
    Conservative two-column detection - treat as HINT only, not mode switch
    Returns hints about potential columns, but original text is always used for section detection
    """
    lines = text.split('\n')
    two_column_hints = []
    personal_info_hints = []
    
    for line in lines:
        # Only detect if there's a large whitespace gap (8+ spaces) - more conservative
        if re.search(r'\s{8,}', line):
            parts = re.split(r'\s{8,}', line, 1)
            if len(parts) == 2:
                left = parts[0].strip()
                right = parts[1].strip()
                
                # Only consider it a column if both parts have meaningful content
                if len(left) > 3 and len(right) > 3:
                    two_column_hints.append({
                        'left': left,
                        'right': right,
                        'original': line
                    })
                    # Left column might be personal info
                    if any(keyword in left.lower() for keyword in ['contact', 'phone', 'email', '@', '+']):
                        personal_info_hints.append(left)
    
    return {
        'has_hint': len(two_column_hints) > 0,
        'hint_count': len(two_column_hints),
        'personal_info_hints': personal_info_hints
    }


def create_flat_text(text: str) -> str:
    """
    Create a lightly cleaned version for email/phone regex only
    Preserves newlines but fixes broken email/phone patterns
    """
    # Fix common email patterns with spaces (but preserve newlines)
    text = re.sub(r'(\w+)\s*@\s*(\w+)\s*\.\s*(\w+)', r'\1@\2.\3', text, flags=re.IGNORECASE)
    text = re.sub(r'(\S+?)\s+@\s+(\S+?)\s+\.\s+(\S+)', r'\1@\2.\3', text, flags=re.IGNORECASE)
    # Only normalize spaces within lines (not newlines)
    text = re.sub(r'[ \t]+', ' ', text)
    return text

