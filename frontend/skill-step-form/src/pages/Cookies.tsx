const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-4xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-8">Cookie Policy</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-muted-foreground">
          <p className="text-sm text-muted-foreground/80">Last updated: December 2024</p>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. What Are Cookies?</h2>
            <p className="leading-relaxed">
              Cookies are small text files that are placed on your device when you visit our website. They help us 
              provide you with a better experience by remembering your preferences and understanding how you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Types of Cookies We Use</h2>
            
            <div className="mt-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">Essential Cookies</h3>
              <p className="leading-relaxed mb-2">
                These cookies are necessary for the website to function properly. They enable core functionality such as 
                security, network management, and accessibility.
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">Functional Cookies</h3>
              <p className="leading-relaxed mb-2">
                These cookies allow us to remember your preferences and provide enhanced, personalized features. For example, 
                they remember your login status and language preferences.
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-xl font-semibold text-foreground mb-2">Analytics Cookies</h3>
              <p className="leading-relaxed mb-2">
                These cookies help us understand how visitors interact with our website by collecting and reporting 
                information anonymously. This helps us improve our service.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Managing Cookies</h2>
            <p className="leading-relaxed mb-3">
              You can control and manage cookies in several ways. Please keep in mind that removing or blocking cookies 
              can impact your user experience and parts of our website may no longer be fully accessible.
            </p>
            <p className="leading-relaxed mb-3">You can manage cookies through:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Your browser settings (most browsers allow you to refuse or accept cookies)</li>
              <li>Our cookie consent banner when you first visit our site</li>
              <li>Third-party opt-out tools for specific cookie types</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Third-Party Cookies</h2>
            <p className="leading-relaxed">
              Some cookies are placed by third-party services that appear on our pages. We do not control these cookies, 
              and you should check the third-party websites for more information about their cookie practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Updates to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other 
              operational, legal, or regulatory reasons. Please revisit this page periodically to stay informed about 
              our use of cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Contact Us</h2>
            <p className="leading-relaxed">
              If you have questions about our use of cookies, please contact us at{" "}
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

export default Cookies;

