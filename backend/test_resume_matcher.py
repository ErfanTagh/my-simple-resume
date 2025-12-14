"""
Test script for the resume-job-matcher model
This model is for semantic similarity between resumes and job descriptions,
not for extracting structured data from resumes.
"""
from sentence_transformers import SentenceTransformer
import numpy as np

def test_resume_matcher():
    """Test the resume-job-matcher model with sample resume and job descriptions"""
    
    print("=" * 80)
    print("Testing Resume-Job Matcher Model")
    print("=" * 80)
    
    try:
        print("\n📥 Loading model: anass1209/resume-job-matcher-all-MiniLM-L6-v2")
        model = SentenceTransformer("anass1209/resume-job-matcher-all-MiniLM-L6-v2")
        print("✅ Model loaded successfully")
        
        # Sample resume text (from your actual resume)
        resume_text = """
        Software Engineer with 4+ years of experience in React Native and full-stack JavaScript/TypeScript development. 
        Strong background in test automation (Detox, Storybook), CI/CD, and Dockerized deployments. 
        Experience delivering production-grade applications for multiple enterprise clients. 
        Proficient in Microsoft 365 (Outlook, Teams, PowerPoint, Excel, SharePoint) for reporting and stakeholder communication.
        
        Work Experience:
        - Software Engineer / Full-Stack Developer at Neocosmo (02/2023 - 02/2025)
        - React Native Developer at Magiavas (09/2020 - 09/2022)
        
        Education:
        - Master of Computer Science, RPTU Kaiserslautern (10/2021 - 08/2026)
        - Bachelor of Software Engineering, Tehran Azad University (03/2017 - 08/2021)
        
        Skills: JavaScript, TypeScript, React, React Native, Python, Django, Flask, MongoDB, Git, Docker, CI/CD
        """
        
        # Sample job descriptions to test matching
        job_descriptions = [
            {
                "title": "Senior Full-Stack Developer",
                "description": """
                We are looking for a Senior Full-Stack Developer with experience in React and TypeScript.
                Must have experience with test automation, CI/CD pipelines, and Docker.
                Experience with Python backend frameworks (Django/Flask) is a plus.
                """
            },
            {
                "title": "Frontend React Developer",
                "description": """
                Seeking a React Developer for building modern web applications.
                Experience with React Native is preferred but not required.
                Knowledge of JavaScript and TypeScript essential.
                """
            },
            {
                "title": "Data Scientist",
                "description": """
                Looking for a Data Scientist with strong Python skills.
                Experience with machine learning models and data analysis required.
                Ph.D. in Computer Science or related field preferred.
                """
            }
        ]
        
        print("\n📝 Resume Summary:")
        print(resume_text[:200] + "...")
        
        # Prepare texts for encoding
        texts = [resume_text] + [job["description"] for job in job_descriptions]
        
        print("\n🔍 Computing embeddings...")
        embeddings = model.encode(texts, show_progress_bar=True)
        print(f"✅ Generated embeddings shape: {embeddings.shape}")
        
        # Calculate similarity scores
        resume_embedding = embeddings[0]
        job_embeddings = embeddings[1:]
        
        print("\n📊 Similarity Scores (Cosine Similarity):")
        print("-" * 80)
        for i, job in enumerate(job_descriptions):
            similarity = np.dot(resume_embedding, job_embeddings[i]) / (
                np.linalg.norm(resume_embedding) * np.linalg.norm(job_embeddings[i])
            )
            print(f"{job['title']:30s} | Similarity: {similarity:.3f}")
        
        # Find best match
        similarities = [
            np.dot(resume_embedding, job_emb) / (np.linalg.norm(resume_embedding) * np.linalg.norm(job_emb))
            for job_emb in job_embeddings
        ]
        best_match_idx = np.argmax(similarities)
        
        print("\n🎯 Best Match:")
        print(f"   {job_descriptions[best_match_idx]['title']}")
        print(f"   Similarity: {similarities[best_match_idx]:.3f}")
        
        print("\n" + "=" * 80)
        print("Model Usage:")
        print("=" * 80)
        print("✅ This model is good for:")
        print("   - Matching resumes to job descriptions")
        print("   - Finding similar job postings")
        print("   - Resume ranking/sorting")
        print("   - Semantic search over resumes")
        print("\n❌ This model is NOT for:")
        print("   - Extracting structured data (name, email, experience, etc.)")
        print("   - Parsing resume sections")
        print("   - Named Entity Recognition")
        print("\n💡 To use for parsing, you'd need:")
        print("   - NER model (like the one we removed)")
        print("   - Or keep using regex-based parsing (current approach)")
        
    except ImportError:
        print("❌ Error: sentence-transformers not installed")
        print("   Install with: pip install sentence-transformers")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_resume_matcher()

