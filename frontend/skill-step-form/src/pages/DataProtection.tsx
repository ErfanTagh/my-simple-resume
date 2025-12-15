import { useLanguage } from "@/contexts/LanguageContext";

const DataProtection = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">{t('pages.dataProtection.title')}</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm text-muted-foreground/80">{t('pages.dataProtection.lastUpdated')}</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Data Controller</h2>
            <p className="leading-relaxed">
              The data controller responsible for processing your personal data is 123Resume. For any data protection 
              inquiries, please contact us at{" "}
              <a href="mailto:contact@123resume.de" className="text-primary hover:underline">
                contact@123resume.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Legal Basis for Processing</h2>
            <p className="leading-relaxed mb-3">We process your personal data based on:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your consent when you create an account</li>
              <li>Contractual necessity to provide our services</li>
              <li>Legitimate interests in improving our service</li>
              <li>Legal obligations where applicable</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Data Retention</h2>
            <p className="leading-relaxed">
              We retain your personal data only for as long as necessary to fulfill the purposes outlined in our Privacy 
              Policy, unless a longer retention period is required by law. When you delete your account, we will delete 
              or anonymize your personal data within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Transfers</h2>
            <p className="leading-relaxed">
              Your data is stored securely on servers located within the European Union. We do not transfer your personal 
              data to countries outside the EU/EEA without appropriate safeguards in place.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights Under GDPR</h2>
            <p className="leading-relaxed mb-3">As a data subject, you have the following rights:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Right of access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to erasure:</strong> Request deletion of your data</li>
              <li><strong>Right to restrict processing:</strong> Limit how we use your data</li>
              <li><strong>Right to data portability:</strong> Receive your data in a structured format</li>
              <li><strong>Right to object:</strong> Object to processing of your data</li>
              <li><strong>Right to withdraw consent:</strong> Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Data Security Measures</h2>
            <p className="leading-relaxed">
              We implement industry-standard security measures including encryption, secure authentication, regular security 
              audits, and access controls to protect your personal data from unauthorized access, alteration, disclosure, 
              or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact</h2>
            <p className="leading-relaxed">
              To exercise your rights or for any data protection concerns, please contact us at{" "}
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

export default DataProtection;

