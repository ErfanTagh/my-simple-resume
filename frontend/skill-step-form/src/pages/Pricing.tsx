import { Link } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground">
            Build professional resumes without breaking the bank
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Free Plan */}
          <div className="p-8 rounded-2xl bg-card border-2 border-border">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Free</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/forever</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Unlimited resume creation</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">All 4 professional templates</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">AI-powered suggestions</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">PDF download</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Save and edit anytime</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">ATS-optimized formatting</span>
              </li>
            </ul>
            <Link to="/create" className="block">
              <Button size="lg" variant="outline" className="w-full">
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Premium Plan - Coming Soon */}
          <div className="p-8 rounded-2xl bg-card border-2 border-primary relative">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                Coming Soon
              </span>
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Premium</h2>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">$9</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Everything in Free</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Advanced AI resume analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Cover letter builder</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Priority support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Resume analytics & insights</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">Custom branding options</span>
              </li>
            </ul>
            <Button size="lg" className="w-full bg-primary hover:bg-primary/90" disabled>
              Coming Soon
            </Button>
          </div>
        </div>

        <div className="text-center p-6 rounded-lg bg-muted/30 border border-border">
          <p className="text-muted-foreground">
            All plans include our core features. No credit card required to get started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

