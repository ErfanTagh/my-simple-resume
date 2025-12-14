"""
Certificates extraction from resume text
"""
import re
from typing import Dict, List, Any


def extract_certificates(text: str = "", sections: Dict[str, str] = None) -> List[Dict]:
    """Extract certificates from text"""
    certificates = []
    
    print("\n" + "-" * 80)
    print("🏆 CERTIFICATES EXTRACTION")
    print("-" * 80)
    
    cert_text = ""
    if sections and "certifications" in sections:
        cert_text = sections["certifications"]
        print(f"  Section found: {len(cert_text)} chars")
    else:
        print(f"  ⚠️ No CERTIFICATIONS section found")
        return []
    
    if cert_text:
        # Look for certificate names and dates
        lines = cert_text.split('\n')
        for line in lines:
            line = line.strip()
            if not line or len(line) < 5:
                continue
            
            # Look for year pattern (4 digits, likely a certificate year)
            year_match = re.search(r'\b(19|20)\d{2}\b', line)
            if year_match:
                # Extract certificate name (everything before the year)
                cert_name = line[:year_match.start()].strip()
                if cert_name and len(cert_name) > 3:
                    certificates.append({
                        "name": cert_name,
                        "issuer": "",
                        "date": year_match.group(0),
                        "url": ""
                    })
            elif len(line) > 10 and not any(word in line.lower() for word in ['view', 'badge', 'credly']):
                # Might be a certificate name without year
                certificates.append({
                    "name": line,
                    "issuer": "",
                    "date": "",
                    "url": ""
                })
    
    print(f"  📊 Extracted {len(certificates)} certificates")
    return certificates

