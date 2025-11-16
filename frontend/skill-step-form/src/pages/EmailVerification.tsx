import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Mail, Loader2, Home } from 'lucide-react';

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          setEmail(data.user?.email || '');
          
          // Note: Resume will be saved after user logs in (handled in Login component)
          // We just keep the pendingResume in localStorage for now
        } else {
          if (data.expired) {
            setStatus('expired');
            setMessage(data.error);
          } else {
            setStatus('error');
            setMessage(data.error || 'Verification failed');
          }
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error. Please try again later.');
      }
    };

    verifyEmail();
  }, [token]);

  const handleResendEmail = async () => {
    if (!email) return;

    try {
      const response = await fetch('/api/auth/resend-verification/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Verification email sent! Please check your inbox.');
      } else {
        alert(data.error || 'Failed to resend email.');
      }
    } catch (error) {
      alert('Network error. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8 shadow-elevated">
        <div className="text-center">
          {/* Loading State */}
          {status === 'loading' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Verifying Your Email</h1>
              <p className="text-muted-foreground">Please wait while we verify your email address...</p>
            </>
          )}

          {/* Success State */}
          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-green-600 dark:text-green-400">Email Verified!</h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              
              <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-700 dark:text-green-300">
                  Your account is now active! You can log in to start creating your resume.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {(() => {
                  const pendingResumeId = localStorage.getItem('pendingResumeId');
                  const pendingResume = localStorage.getItem('pendingResume');
                  
                  if (pendingResumeId) {
                    // Resume already saved, redirect to login then resumes list
                    return (
                      <Link to="/login" className="block">
                        <Button className="w-full" size="lg">
                          <Home className="mr-2 h-4 w-4" />
                          Go to Login & View Resumes
                        </Button>
                      </Link>
                    );
                  } else if (pendingResume) {
                    // Resume needs to be saved after login
                    return (
                      <Link to="/login?saveResume=true" className="block">
                        <Button className="w-full" size="lg">
                          <Home className="mr-2 h-4 w-4" />
                          Go to Login & Save Resume
                        </Button>
                      </Link>
                    );
                  } else {
                    // No pending resume
                    return (
                      <>
                        <Link to="/login" className="block">
                          <Button className="w-full" size="lg">
                            <Home className="mr-2 h-4 w-4" />
                            Go to Login
                          </Button>
                        </Link>
                        <Link to="/" className="block">
                          <Button variant="outline" className="w-full">
                            Back to Home
                          </Button>
                        </Link>
                      </>
                    );
                  }
                })()}
              </div>
            </>
          )}

          {/* Error State */}
          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">Verification Failed</h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              
              <Alert variant="destructive" className="mb-6">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  The verification link may be invalid or has already been used.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Go to Login
                  </Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button variant="ghost" className="w-full">
                    Create New Account
                  </Button>
                </Link>
              </div>
            </>
          )}

          {/* Expired State */}
          {status === 'expired' && (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4">
                <Mail className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-orange-600 dark:text-orange-400">Link Expired</h1>
              <p className="text-muted-foreground mb-6">{message}</p>
              
              <Alert className="mb-6 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                <Mail className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <AlertDescription className="text-orange-700 dark:text-orange-300">
                  Verification links expire after 24 hours for security reasons.
                </AlertDescription>
              </Alert>

              {email && (
                <Button onClick={handleResendEmail} className="w-full mb-3" size="lg">
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </Button>
              )}

              <Link to="/login" className="block">
                <Button variant="outline" className="w-full">
                  Go to Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

