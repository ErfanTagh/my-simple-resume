import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, AlertCircle, Mail } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleResendVerification = async () => {
    if (!userEmail) return;

    try {
      const response = await fetch('/api/auth/resend-verification/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Verification email sent! Please check your inbox.');
        setShowResend(false);
      } else {
        alert(data.error || 'Failed to resend email.');
      }
    } catch (error) {
      alert('Network error. Please try again later.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowResend(false);
    setIsLoading(true);

    try {
      await login(username, password);
      
      // Check for redirect or resume saving
      const redirect = searchParams.get('redirect');
      const saveResume = searchParams.get('saveResume');
      
      // Check for pending resume ID (resume already saved, just need to view it)
      const pendingResumeId = localStorage.getItem('pendingResumeId');
      
      if (redirect) {
        // Redirect to specified page (e.g., resume page)
        navigate(redirect);
        if (pendingResumeId) {
          localStorage.removeItem('pendingResumeId');
        }
      } else if (pendingResumeId) {
        // Resume already saved, redirect to resumes list
        localStorage.removeItem('pendingResumeId');
        navigate('/resumes');
      } else if (saveResume === 'true') {
        // Save pending resume and redirect to resumes list
        const pendingResume = localStorage.getItem('pendingResume');
        if (pendingResume) {
          try {
            const resumeData = JSON.parse(pendingResume);
            const { resumeAPI } = await import('@/lib/api');
            const savedResume = await resumeAPI.create(resumeData);
            localStorage.removeItem('pendingResume');
            toast({
              title: "Resume Saved!",
              description: "Your resume has been created successfully.",
            });
            setTimeout(() => {
              navigate('/resumes');
            }, 1000);
          } catch (error: any) {
            console.error("Failed to save resume:", error);
            toast({
              title: "Error Saving Resume",
              description: error.message || "Failed to save your resume. You can create it again from the dashboard.",
              variant: "destructive",
            });
            navigate('/resumes');
          }
        } else {
          navigate('/resumes');
        }
      } else {
        navigate('/resumes');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to login. Please check your credentials.';
      setError(errorMessage);
      
      // Check if it's an email verification error
      if (errorMessage.toLowerCase().includes('verify') || errorMessage.toLowerCase().includes('email')) {
        setShowResend(true);
        // Try to get user email - you might need to call an API to get this
        // For now, we'll ask them to check their email
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md p-8 shadow-elevated">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              {showResend && (
                <div className="mt-3 pt-3 border-t border-destructive/20">
                  <p className="text-sm mb-2">Need to verify your email?</p>
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Enter your email to resend verification"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleResendVerification}
                      disabled={!userEmail}
                    >
                      <Mail className="mr-2 h-3 w-3" />
                      Resend Verification Email
                    </Button>
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}

