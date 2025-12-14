import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI, Resume } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileText,
  Plus,
  Trash2,
  Eye,
  AlertCircle,
  Clock,
  Star,
  Edit,
  X,
  Download,
} from 'lucide-react';
import { downloadResumePDF } from '@/lib/resumePdfUtils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const loadResumes = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await resumeAPI.getAll();
      setResumes(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load resumes');
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies - function is stable

  useEffect(() => {
    if (!user) {
      // No user, don't load resumes
      setIsLoading(false);
      setResumes([]);
      return;
    }

    // Load resumes immediately when user is available
    loadResumes();
    
    // Listen for resume saved event (from AuthContext after login)
    const handleResumeSaved = () => {
      loadResumes();
    };
    
    window.addEventListener('resumeSaved', handleResumeSaved);
    
    return () => {
      window.removeEventListener('resumeSaved', handleResumeSaved);
    };
  }, [user, loadResumes]); // Reload when user changes (e.g., after login)

  const handleDelete = async (id: string) => {
    try {
      await resumeAPI.delete(id);
      setResumes(resumes.filter((r) => r.id !== id));
      toast({
        title: 'Resume Deleted',
        description: 'Your resume has been successfully deleted.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete resume',
        variant: 'destructive',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) {
      return 'No date';
    }
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      // Format as DD/MM/YY (e.g., 10/12/26)
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 9) return "text-green-600";
    if (rating >= 7) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingBadge = (rating: number) => {
    if (rating >= 9) return "Excellent";
    if (rating >= 7) return "Good";
    return "Needs Work";
  };

  const handleDownloadPDF = async (resume: Resume) => {
    try {
      // Fetch the full resume data
      const fullResume = await resumeAPI.getById(resume.id);
      await downloadResumePDF(fullResume);
      toast({
        title: 'PDF Downloaded',
        description: 'Your resume has been downloaded successfully.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to generate PDF',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Resumes</h1>
            <p className="text-muted-foreground">View and manage your created CVs</p>
          </div>
          <Button onClick={() => navigate('/create')} size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Create New CV
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
              <p className="text-muted-foreground">Loading resumes...</p>
            </div>
          </div>
        ) : resumes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first CV to get started
              </p>
              <Button onClick={() => navigate('/create')}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First CV
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => {
              // Get quality scores from API (already converted to camelCase by API)
              const resumeData = resume as any;
              const completenessScore = resumeData.completenessScore || 0;
              const clarityScore = resumeData.clarityScore || 0;
              const formattingScore = resumeData.formattingScore || 0;
              const impactScore = resumeData.impactScore || 0;
              const overallScore = resumeData.overallScore || 0;
              
              // Use overall_score from backend if available, otherwise calculate
              const displayScore = overallScore > 0 
                ? Math.round(overallScore * 10) / 10
                : Math.round(((completenessScore + clarityScore + formattingScore + impactScore) / 4) * 10) / 10;
              
              const template = resumeData.template || 'modern';
              
              return (
                <Card key={resume.id} className="hover:shadow-lg transition-shadow relative group">
                  {/* Delete button - top right corner */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteId(resume.id);
                    }}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-red-50 text-red-600 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-700 transition-all"
                    title="Delete resume"
                    aria-label="Delete resume"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <FileText className="h-8 w-8 text-primary mb-2" />
                      <Badge variant="secondary" className="capitalize">
                        {template}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">
                      {resume.personalInfo.firstName} {resume.personalInfo.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {formatDate((resume as any).updatedAt || (resume as any).updated_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className={`h-5 w-5 fill-current ${getRatingColor(displayScore)}`} />
                        <span className={`text-2xl font-bold ${getRatingColor(displayScore)}`}>
                          {displayScore}
                        </span>
                        <span className="text-muted-foreground">/10</span>
                      </div>
                      <Badge variant="outline">{getRatingBadge(displayScore)}</Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Completeness</span>
                        <span className="font-medium">{completenessScore}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Clarity</span>
                        <span className="font-medium">{clarityScore}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Formatting</span>
                        <span className="font-medium">{formattingScore}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Impact</span>
                        <span className="font-medium">{impactScore}/10</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        size="sm"
                        onClick={() => navigate(`/resume/${resume.id}`)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        size="sm"
                        onClick={() => handleDownloadPDF(resume)}
                        title="Download PDF"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1" 
                        size="sm"
                        onClick={() => navigate(`/create?edit=${resume.id}`)}
                        title="Edit resume"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Resume?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                resume.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && handleDelete(deleteId)}
                className="bg-destructive hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

