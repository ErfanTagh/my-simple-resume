import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { SEO } from '@/components/SEO';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthState } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for error from OAuth provider
        const error = searchParams.get('error');
        if (error) {
          setStatus('error');
          setMessage(`OAuth error: ${error}`);
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Get code and state from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code || !state) {
          setStatus('error');
          setMessage('Missing OAuth parameters');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Verify state matches what we stored
        const storedState = sessionStorage.getItem('oauth_state');
        const storedProvider = sessionStorage.getItem('oauth_provider');

        if (state !== storedState || !storedProvider) {
          setStatus('error');
          setMessage('Invalid OAuth state');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // The backend callback endpoint should have already processed the OAuth
        // and redirected here with tokens in the URL or we need to fetch them
        // For now, let's check if tokens are in URL params
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        if (accessToken && refreshToken) {
          // Tokens are in URL, fetch user info from backend
          try {
            // Fetch user profile using the access token
            const profileResponse = await fetch('/api/auth/profile/', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            });

            if (!profileResponse.ok) {
              throw new Error('Failed to fetch user profile');
            }

            const userData = await profileResponse.json();
            
            const user = {
              id: userData.id || 0,
              username: userData.username || '',
              email: userData.email || '',
              first_name: userData.first_name || '',
              last_name: userData.last_name || '',
            };

            // Set auth state
            setAuthState({
              user,
              tokens: {
                access: accessToken,
                refresh: refreshToken,
              },
            });

            // Clear OAuth state
            sessionStorage.removeItem('oauth_state');
            sessionStorage.removeItem('oauth_provider');

            setStatus('success');
            setMessage('Login successful! Redirecting...');

            // Redirect to resumes page
            setTimeout(() => {
              navigate('/resumes');
            }, 1500);
          } catch (err: any) {
            setStatus('error');
            setMessage(err.message || 'Failed to process login tokens');
            setTimeout(() => navigate('/login'), 3000);
          }
        } else {
          // Tokens not in URL, need to fetch from backend
          // This shouldn't happen with our current implementation, but handle it
          setStatus('error');
          setMessage('OAuth callback completed but tokens not received');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message || 'OAuth callback failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setAuthState]);

  return (
    <>
      <SEO
        title="OAuth Callback - 123Resume"
        description="Processing social login"
        noindex={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {status === 'loading' && (
            <Alert>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
              <AlertDescription>Processing your login...</AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                {message}
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </>
  );
}

