const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm text-muted-foreground/80">Last updated: December 2024</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
            <p className="leading-relaxed">
              At 123Resume ("we", "our", or "us"), we are committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you use our resume builder 
              service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
            <p className="leading-relaxed mb-3">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Account information (email address, password)</li>
              <li>Resume content and data you enter into our platform</li>
              <li>Usage data and preferences</li>
              <li>Communication data when you contact us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your resume creation and storage requests</li>
              <li>Send you service-related communications</li>
              <li>Respond to your inquiries and provide support</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information. 
              However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
            <p className="leading-relaxed mb-3">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Export your resume data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at{" "}
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

export default Privacy;

