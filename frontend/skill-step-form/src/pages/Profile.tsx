import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, User, Mail, Save, ArrowLeft, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProfessionalTitleAutocomplete } from '@/components/ProfessionalTitleAutocomplete';

interface UserProfile {
  id?: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  professional_title?: string;
}

export default function Profile() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    professional_title: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await authAPI.getProfile();
      setProfile(data);
      setFormData({
        username: data.username || '',
        email: data.email || '',
        first_name: data.first_name || data.firstName || '',
        last_name: data.last_name || data.lastName || '',
        professional_title: data.professional_title || data.professionalTitle || '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
      toast({
        title: 'Error',
        description: err.message || 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      // Note: Update profile endpoint may need to be implemented on backend
      // For now, we'll just show a message
      toast({
        title: 'Profile Update',
        description: 'Profile update functionality is coming soon. Currently, profile information is managed through your account settings.',
      });
      
      // If backend has update endpoint, uncomment this:
      // const updated = await authAPI.updateProfile(formData);
      // setProfile(updated);
      // toast({
      //   title: 'Success',
      //   description: 'Profile updated successfully',
      // });
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      toast({
        title: 'Error',
        description: err.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Profile Settings
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              View and manage your profile details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="pl-9"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Username cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-9"
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Email cannot be changed here</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Enter your last name"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="professional_title">Professional Title</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                    <div className="pl-9">
                      <ProfessionalTitleAutocomplete
                        id="professional_title"
                        value={formData.professional_title}
                        onChange={(value) => setFormData({ ...formData, professional_title: value })}
                        placeholder="Type your professional title (e.g., Software Developer)"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Start typing to see suggestions based on your language preference
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label>Password</Label>
                  <p className="text-sm text-muted-foreground">Change your account password</p>
                </div>
                <Button variant="outline" disabled>
                  Change Password
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password management is coming soon. Use the "Forgot Password" feature if you need to reset your password.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

