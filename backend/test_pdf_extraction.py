#!/usr/bin/env python3
"""
Test PDF extraction with the updated extract_text_from_pdf function
"""
import sys
import os

# Add the api directory to the path so we can import pdf_parser
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'api'))

from pdf_parser import extract_text_from_pdf

def test_pdf_extraction(pdf_path: str):
    """Test PDF extraction and show the results"""
    print("=" * 80)
    print("🔍 TESTING PDF EXTRACTION")
    print("=" * 80)
    print(f"📄 PDF file: {pdf_path}")
    print()
    
    # Open the PDF file
    with open(pdf_path, 'rb') as f:
        extracted_text = extract_text_from_pdf(f)
    
    if extracted_text:
        print()
        print("=" * 80)
        print("📝 EXTRACTED TEXT (Full):")
        print("=" * 80)
        print(extracted_text)
        print("=" * 80)
        
        # Show statistics
        line_count = extracted_text.count('\n') + 1
        char_count = len(extracted_text)
        print()
        print("📊 STATISTICS:")
        print(f"  Total characters: {char_count}")
        print(f"  Total lines: {line_count}")
        print(f"  Average chars per line: {char_count // line_count if line_count > 0 else 0}")
        print()
        
        # Show first 1000 characters
        print("=" * 80)
        print("📝 FIRST 1000 CHARACTERS:")
        print("=" * 80)
        print(extracted_text[:1000])
        print("=" * 80)
        print()
        
        # Show last 500 characters
        print("=" * 80)
        print("📝 LAST 500 CHARACTERS:")
        print("=" * 80)
        print(extracted_text[-500:])
        print("=" * 80)
        
        # Check for section headers
        print()
        print("=" * 80)
        print("🔍 CHECKING FOR SECTION HEADERS:")
        print("=" * 80)
        section_keywords = ['education', 'experience', 'skills', 'projects', 'certifications', 'languages']
        for keyword in section_keywords:
            if keyword.lower() in extracted_text.lower():
                # Find the line containing the keyword
                lines = extracted_text.split('\n')
                for i, line in enumerate(lines):
                    if keyword.lower() in line.lower():
                        print(f"  ✓ Found '{keyword}' in line {i+1}: {line[:80]}...")
                        break
            else:
                print(f"  ✗ '{keyword}' not found")
        print("=" * 80)
        
    else:
        print("❌ No text extracted from PDF")

if __name__ == "__main__":
    pdf_path = "Erfan Taghvaei-Eng.pdf"
    if not os.path.exists(pdf_path):
        print(f"❌ PDF file not found: {pdf_path}")
        sys.exit(1)
    
    test_pdf_extraction(pdf_path)

