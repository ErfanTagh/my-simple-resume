import { Link } from "react-router-dom";
import { FileText, Sparkles, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">About 123Resume</h1>
          <p className="text-lg text-muted-foreground">
            Empowering job seekers to create professional resumes that get noticed
          </p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              At 123Resume, we believe that everyone deserves a resume that showcases their true potential. 
              Our mission is to make professional resume creation accessible, easy, and effective for job seekers 
              at all stages of their careers. We combine cutting-edge AI technology with proven resume best 
              practices to help you stand out in today's competitive job market.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">What We Offer</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-card border border-border">
                <Sparkles className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">AI-Powered Suggestions</h3>
                <p className="text-sm text-muted-foreground">
                  Get intelligent recommendations to improve your resume's impact and ATS compatibility.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-card border border-border">
                <FileText className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Professional Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from multiple professionally designed templates that suit your industry and style.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-card border border-border">
                <Target className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">ATS Optimized</h3>
                <p className="text-sm text-muted-foreground">
                  Ensure your resume passes Applicant Tracking Systems and reaches human recruiters.
                </p>
              </div>
              <div className="p-6 rounded-lg bg-card border border-border">
                <Users className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-2">User-Friendly</h3>
                <p className="text-sm text-muted-foreground">
                  Create your resume in minutes with our intuitive, step-by-step builder.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">Why Choose Us</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span>Free to use with no hidden costs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span>Save and edit your resumes anytime</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span>Export to PDF ready for applications</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <span>Privacy-focused - your data stays secure</span>
              </li>
            </ul>
          </section>

          <div className="text-center pt-8">
            <Link to="/create">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Building Your Resume
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

