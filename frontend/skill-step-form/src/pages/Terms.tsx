import { useLanguage } from "@/contexts/LanguageContext";

const Terms = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">{t('pages.terms.title')}</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm text-muted-foreground/80">{t('pages.terms.lastUpdated')}</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using 123Resume, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use License</h2>
            <p className="leading-relaxed mb-3">Permission is granted to use 123Resume for personal, non-commercial purposes. This license allows you to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Create and edit resumes for your personal use</li>
              <li>Download your resumes as PDF files</li>
              <li>Save multiple resume versions</li>
            </ul>
            <p className="leading-relaxed mt-3">This license does not permit:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Reselling or redistributing our templates</li>
              <li>Using our service for commercial purposes without authorization</li>
              <li>Reverse engineering or copying our code</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Accounts</h2>
            <p className="leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us 
              immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts 
              that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. User Content</h2>
            <p className="leading-relaxed">
              You retain all rights to the content you create using 123Resume. You are solely responsible for the accuracy 
              and legality of the information you include in your resumes. We do not claim ownership of your content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Service Availability</h2>
            <p className="leading-relaxed">
              We strive to provide reliable service but do not guarantee uninterrupted or error-free operation. We reserve 
              the right to modify, suspend, or discontinue any aspect of the service at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by law, 123Resume shall not be liable for any indirect, incidental, special, 
              or consequential damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Information</h2>
            <p className="leading-relaxed">
              For questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:contact@123resume.de" className="text-primary hover:underline">
                contact@123resume.de
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;

