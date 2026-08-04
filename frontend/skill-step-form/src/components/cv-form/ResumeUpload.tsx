import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, FileText, X, CheckCircle2, AlertCircle, Linkedin } from 'lucide-react';
import { resumeAPI, linkedinAPI } from '@/lib/api';
import { CVFormData } from './types';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { LINKEDIN_IMPORT_STORAGE_KEY } from '@/pages/LinkedInImportCallback';

interface ResumeUploadProps {
  onDataParsed: (data: Partial<CVFormData>) => void;
  onClose?: () => void;
  /** Notifies the parent while the uploaded file is being parsed (for a preview overlay). */
  onParsingChange?: (parsing: boolean) => void;
}

export const ResumeUpload = ({ onDataParsed, onClose, onParsingChange }: ResumeUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  // Coming back from the LinkedIn consent flow: the callback page parks the
  // imported profile in sessionStorage, so apply it here through the same path
  // the PDF parser uses.
  const appliedImportRef = useRef(false);
  useEffect(() => {
    if (appliedImportRef.current) return;
    const stored = sessionStorage.getItem(LINKEDIN_IMPORT_STORAGE_KEY);
    if (!stored) return;

    appliedImportRef.current = true;
    sessionStorage.removeItem(LINKEDIN_IMPORT_STORAGE_KEY);
    try {
      onDataParsed(JSON.parse(stored) as Partial<CVFormData>);
      toast({
        title: 'LinkedIn profile imported!',
        description: 'Your details have been filled in. Please review and edit as needed.',
      });
    } catch {
      // Corrupted payload — nothing worth surfacing beyond leaving the form as-is.
    }
  }, [onDataParsed]);

  const handleLinkedInImport = async () => {
    setIsLinkedInLoading(true);
    setError('');
    try {
      const { auth_url, state } = await linkedinAPI.getImportUrl();
      if (state) sessionStorage.setItem('linkedin_import_state', state);
      window.location.href = auth_url;
    } catch (err: any) {
      setError(err?.message || 'Could not start the LinkedIn import. Please try again.');
      setIsLinkedInLoading(false);
    }
  };

  const validateFile = (file: File): string | null => {
    // Validate file type
    const validTypes = ['application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      return 'Please upload a PDF or text file (.pdf, .txt)';
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError('');
    onParsingChange?.(true);

    try {
      const parsedData = await resumeAPI.parseResume(selectedFile);
      
      // Merge parsed data with existing form structure
      onDataParsed(parsedData as Partial<CVFormData>);
      
      toast({
        title: "Resume Parsed Successfully!",
        description: "Your resume has been analyzed and the form has been pre-filled. Please review and edit as needed.",
      });

      // Reset file selection
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Close if onClose is provided
      if (onClose) {
        onClose();
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to parse resume. Please try again or fill the form manually.';
      setError(errorMessage);
      toast({
        title: "Parsing Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      onParsingChange?.(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, []);

  if (!user) {
    return (
      <div className="border-2 border-dashed rounded-lg p-6 text-center bg-muted/50">
        <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Please sign in to use resume parsing
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          isDragging
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-muted-foreground/25 hover:border-primary/50 bg-muted/30'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <>
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-full ${isDragging ? 'bg-primary/10' : 'bg-muted'}`}>
                <Upload className={`h-6 w-6 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {isDragging ? 'Drop your resume here' : 'Upload your existing resume'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports PDF and text files (max 10MB)
                </p>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileInputChange}
                disabled={isUploading}
                className="hidden"
                id="resume-upload"
              />
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                onClick={() => document.getElementById('resume-upload')?.click()}
                className="mt-2"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose File
              </Button>

              <div className="flex w-full items-center gap-3 pt-2">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={isUploading || isLinkedInLoading}
                onClick={handleLinkedInImport}
                className="bg-[#0A66C2] text-white border-[#0A66C2] hover:bg-[#0d7bd4] hover:border-[#0d7bd4] hover:text-white transition-colors"
              >
                {isLinkedInLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Linkedin className="mr-2 h-4 w-4" />
                )}
                {isLinkedInLoading ? 'Connecting…' : 'Import from LinkedIn'}
              </Button>
              <p className="text-xs text-muted-foreground">
                Fills in your experience, education and skills automatically.
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background border rounded-lg shadow-sm">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                disabled={isUploading}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button
              type="button"
              onClick={handleFileUpload}
              disabled={isUploading}
              className="w-full"
              size="lg"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Scan & Parse Resume
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive mb-1">Upload Error</p>
            <p className="text-sm text-destructive/90">{error}</p>
          </div>
        </div>
      )}

    </div>
  );
};

