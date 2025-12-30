import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI, Resume } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Sparkles, TrendingUp, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface MatchResult {
  resume_id: string;
  job_title: string;
  job_description: string;
  similarity: number;
  match_percentage: number;
  resume_summary: string;
}

export default function JobMatching() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadResumes();
  }, [user, navigate]);

  const loadResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const data = await resumeAPI.getAll();
      setResumes(data);
      if (data.length > 0 && !selectedResumeId) {
        setSelectedResumeId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load resumes');
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const handleMatch = async () => {
    if (!selectedResumeId) {
      toast({
        title: 'Error',
        description: 'Please select a resume',
        variant: 'destructive',
      });
      return;
    }

    if (!jobDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a job description',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError('');
    setMatchResult(null);

    try {
      const result = await resumeAPI.matchToJob(
        selectedResumeId,
        jobTitle || 'Job Description',
        jobDescription
      );
      setMatchResult(result);
      
      toast({
        title: 'Matching Complete',
        description: `Your resume matches ${result.match_percentage}% with this job`,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to match resume to job');
      toast({
        title: 'Error',
        description: err.message || 'Failed to match resume to job',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-5xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            Resume-Job Matching
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Compare your resume with a job description and get your match score using AI
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Resume Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Your Resume</CardTitle>
              <CardDescription>Choose which resume to compare</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingResumes ? (
                <div className="text-center py-4">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading resumes...</p>
                </div>
              ) : resumes.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No resumes found. <Button variant="link" className="p-0 h-auto" onClick={() => navigate('/create')}>Create one first</Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.personalInfo.firstName} {resume.personalInfo.lastName}
                        {resume.personalInfo.professionalTitle && ` - ${resume.personalInfo.professionalTitle}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          {/* Job Description Input */}
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>Enter the job you want to match against</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title (Optional)</Label>
                <Input
                  id="job-title"
                  placeholder="e.g., Senior Full-Stack Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-description">Job Description *</Label>
                <Textarea
                  id="job-description"
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </div>
              <Button 
                onClick={handleMatch} 
                disabled={isLoading || !selectedResumeId || !jobDescription.trim()}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-4 w-4" />
                    Get Match Score
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Match Result */}
        {matchResult && (
          <Card className={`border-2 ${getMatchColor(matchResult.match_percentage)}`}>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-2xl mb-2">Match Score</CardTitle>
                  <CardDescription>
                    {matchResult.job_title}
                  </CardDescription>
                </div>
                <div className="text-center">
                  <div className={`text-5xl font-bold mb-1 ${getMatchColor(matchResult.match_percentage).split(' ')[0]}`}>
                    {matchResult.match_percentage}%
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {getMatchLabel(matchResult.match_percentage)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Similarity Score</Label>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <span className="text-lg font-medium">{matchResult.similarity.toFixed(3)}</span>
                    <span className="text-sm text-muted-foreground">(out of 1.0)</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Match Quality</Label>
                  <div className="space-y-1">
                    {matchResult.match_percentage >= 80 && (
                      <p className="text-sm text-green-600">✅ Excellent - Strong alignment with job requirements</p>
                    )}
                    {matchResult.match_percentage >= 60 && matchResult.match_percentage < 80 && (
                      <p className="text-sm text-yellow-600">⚠️ Good - Some alignment, consider highlighting relevant skills</p>
                    )}
                    {matchResult.match_percentage >= 40 && matchResult.match_percentage < 60 && (
                      <p className="text-sm text-orange-600">⚠️ Fair - Consider tailoring your resume for this role</p>
                    )}
                    {matchResult.match_percentage < 40 && (
                      <p className="text-sm text-red-600">❌ Poor - Significant gaps, may need more experience or skills</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Label className="text-sm font-semibold mb-2 block">Resume Summary</Label>
                <p className="text-sm text-muted-foreground">{matchResult.resume_summary}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
