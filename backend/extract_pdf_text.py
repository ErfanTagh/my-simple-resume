#!/usr/bin/env python3
"""
Extract text from PDF using pdfplumber
Usage: python extract_pdf_text.py <pdf_file_path>
"""
import sys
import pdfplumber

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF file using pdfplumber"""
    text = ""
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            print(f"📄 PDF has {len(pdf.pages)} pages")
            
            for i, page in enumerate(pdf.pages, 1):
                # Use layout=True to preserve line breaks and structure
                page_text = page.extract_text(layout=True, x_tolerance=3, y_tolerance=3)
                if page_text:
                    text += page_text + "\n"
                    print(f"📄 Page {i}: extracted {len(page_text)} characters")
                else:
                    print(f"⚠️ Page {i}: No text extracted")
        
        print(f"\n✅ Total extracted text length: {len(text)} characters")
        return text.strip()
        
    except Exception as e:
        print(f"❌ Error extracting text: {e}")
        import traceback
        traceback.print_exc()
        return ""

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python extract_pdf_text.py <pdf_file_path>")
        print("Example: python extract_pdf_text.py test_resume.pdf")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    print(f"🔍 Extracting text from: {pdf_path}")
    print("=" * 80)
    
    extracted_text = extract_text_from_pdf(pdf_path)
    
    if extracted_text:
        print("\n" + "=" * 80)
        print("📝 EXTRACTED TEXT:")
        print("=" * 80)
        print(extracted_text)
        print("=" * 80)
        
        # Also save to a text file
        output_file = pdf_path.replace('.pdf', '_extracted.txt')
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(extracted_text)
        print(f"\n💾 Text also saved to: {output_file}")
    else:
        print("\n❌ No text extracted from PDF")

