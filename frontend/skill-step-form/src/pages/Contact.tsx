import { Mail, MessageSquare, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

const Contact = () => {
  const { t } = useLanguage();
  
  // FAQ data for structured data
  const faqs = [
    {
      question: t('pages.contact.howToCreate'),
      answer: t('pages.contact.howToCreateAnswer'),
    },
    {
      question: t('pages.contact.isFree'),
      answer: t('pages.contact.isFreeAnswer'),
    },
    {
      question: t('pages.contact.multipleResumes'),
      answer: t('pages.contact.multipleResumesAnswer'),
    },
    {
      question: t('pages.contact.howToDownload'),
      answer: t('pages.contact.howToDownloadAnswer'),
    },
  ];
  
  return (
    <>
      <SEO
        title="Contact Us - 123Resume Support"
        description="Get in touch with 123Resume. Have questions about our CV builder? Contact our support team for assistance."
        keywords="contact 123resume, CV builder support, resume builder help, customer service"
        url="https://123resume.de/contact"
        faqs={faqs}
      />
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">{t('pages.contact.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('pages.contact.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="p-6 rounded-lg bg-card border border-border">
            <Mail className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('pages.contact.emailUs')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('pages.contact.emailUsDesc')}
            </p>
            <a href="mailto:contact@123resume.de">
              <Button variant="outline" className="w-full">contact@123resume.de</Button>
            </a>
          </div>

          <div className="p-6 rounded-lg bg-card border border-border">
            <HelpCircle className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('pages.contact.support')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('pages.contact.supportDesc')}
            </p>
            <a href="mailto:contact@123resume.de?subject=Support Request">
              <Button variant="outline" className="w-full">{t('pages.contact.getSupport')}</Button>
            </a>
          </div>
        </div>

        <div className="p-6 rounded-lg bg-muted/30 border border-border">
          <h2 className="text-xl font-semibold text-foreground mb-4">{t('pages.contact.faq')}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">{t('pages.contact.howToCreate')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('pages.contact.howToCreateAnswer')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{t('pages.contact.isFree')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('pages.contact.isFreeAnswer')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{t('pages.contact.multipleResumes')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('pages.contact.multipleResumesAnswer')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{t('pages.contact.howToDownload')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('pages.contact.howToDownloadAnswer')}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            {t('pages.contact.businessInquiries')}{" "}
            <a href="mailto:contact@123resume.de" className="text-primary hover:underline">
              contact@123resume.de
            </a>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Contact;

