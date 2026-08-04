import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Linkedin } from 'lucide-react';
import { linkedinAPI } from '@/lib/api';
import { SEO } from '@/components/SEO';

/** Where the imported profile is parked for the resume form to pick up. */
export const LINKEDIN_IMPORT_STORAGE_KEY = 'linkedinImportedResume';

export default function LinkedInImportCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Importing your LinkedIn profile…');
  // React 18 StrictMode double-invokes effects in dev; the OAuth code is
  // single-use, so guard against exchanging it twice.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const run = async () => {
      const oauthError = searchParams.get('error');
      if (oauthError) {
        setStatus('error');
        setMessage(
          searchParams.get('error_description') ||
            'LinkedIn access was declined. You can still upload your resume as a file.',
        );
        return;
      }

      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const expectedState = sessionStorage.getItem('linkedin_import_state');

      if (!code) {
        setStatus('error');
        setMessage('LinkedIn did not return an authorization code. Please try again.');
        return;
      }
      if (expectedState && state !== expectedState) {
        setStatus('error');
        setMessage('Security check failed (state mismatch). Please start the import again.');
        return;
      }

      try {
        const { resume } = await linkedinAPI.importProfile(code);
        sessionStorage.setItem(LINKEDIN_IMPORT_STORAGE_KEY, JSON.stringify(resume));
        sessionStorage.removeItem('linkedin_import_state');
        setStatus('success');
        setMessage('Profile imported! Taking you back to your resume…');
        setTimeout(() => navigate('/create'), 1200);
      } catch (err: any) {
        setStatus('error');
        setMessage(err?.message || 'Could not import your LinkedIn profile.');
      }
    };

    run();
  }, [searchParams, navigate]);

  return (
    <>
      <SEO title="Importing from LinkedIn - 123Resume" description="Importing your LinkedIn profile" noindex />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-4">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0A66C2]/10">
              <Linkedin className="h-6 w-6 text-[#0A66C2]" />
            </div>
          </div>

          {status === 'loading' && (
            <Alert>
              <div className="flex items-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <AlertDescription>{message}</AlertDescription>
              </div>
            </Alert>
          )}

          {status === 'success' && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">{message}</AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
              <Button className="w-full" onClick={() => navigate('/create')}>
                Back to my resume
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
