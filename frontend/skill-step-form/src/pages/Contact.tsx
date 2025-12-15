import { Mail, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 rounded-lg bg-card border border-border">
            <Mail className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Email Us</h3>
            <p className="text-muted-foreground mb-4">
              For general inquiries, support, or feedback
            </p>
            <a href="mailto:contact@123resume.de">
              <Button variant="outline" className="w-full">contact@123resume.de</Button>
            </a>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border">
            <HelpCircle className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Support</h3>
            <p className="text-muted-foreground mb-4">
              Need help with your resume? We're here to assist.
            </p>
            <a href="mailto:contact@123resume.de?subject=Support Request">
              <Button variant="outline" className="w-full">Get Support</Button>
            </a>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-muted/30 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">How do I create a resume?</h3>
              <p className="text-sm text-muted-foreground">
                Simply click "Start Building Free" and follow our step-by-step guide. It takes just a few minutes!
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Is 123Resume free?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! Our basic resume builder is completely free. You can create, edit, and download your resume at no cost.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Can I save multiple resumes?</h3>
              <p className="text-sm text-muted-foreground">
                Absolutely! You can create and save as many resumes as you need. Perfect for tailoring resumes to different job applications.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">How do I download my resume?</h3>
              <p className="text-sm text-muted-foreground">
                Once you've created your resume, you can download it as a PDF directly from the resume view page.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            For business inquiries or partnerships, please email us at{" "}
            <a href="mailto:contact@123resume.de" className="text-primary hover:underline">
              contact@123resume.de
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

