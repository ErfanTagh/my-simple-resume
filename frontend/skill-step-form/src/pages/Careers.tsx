import { Briefcase } from "lucide-react";

const Careers = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Join Our Team</h1>
          <p className="text-lg text-muted-foreground">
            Help us build the future of resume creation
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Briefcase className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">No Open Positions Yet!</h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl mb-8">
            We're a small team just getting started, but we're always open to hearing from talented people 
            who share our passion for helping job seekers succeed. Check back soon, or feel free to reach out!
          </p>
          <a href="mailto:contact@123resume.de?subject=General Application">
            <button className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors">
              Send Us Your Resume
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Careers;

