import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, FileText, X } from 'lucide-react';
import { resumeAPI } from '@/lib/api';
import { CVFormData } from './types';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface ResumeUploadProps {
  onDataParsed: (data: Partial<CVFormData>) => void;
  onClose?: () => void;
}

export const ResumeUpload = ({ onDataParsed, onClose }: ResumeUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or text file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setIsExtracting(false);
    setError('');

    try {
      // Send the file directly to backend - backend will extract with proper line breaks
      // This is better than frontend extraction which destroys line breaks
      console.log("📤 Sending PDF file to backend for extraction and parsing...");
      console.log("📄 File:", selectedFile.name, selectedFile.type, selectedFile.size, "bytes");
      
      const parsedData = await resumeAPI.parseResume(selectedFile);
      console.log("📥 Received parsed data from API:", parsedData);
      console.log("📥 Parsed data structure:", {
        personalInfo: parsedData.personalInfo,
        workExperience: parsedData.workExperience?.length || 0,
        education: parsedData.education?.length || 0,
        skills: parsedData.skills?.length || 0,
      });
      
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
      setIsExtracting(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
      <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors hover:border-primary/50">
        {!selectedFile ? (
          <>
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">
              Upload your existing resume to auto-fill the form
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supports PDF and text files (max 10MB)
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileSelect}
              disabled={isUploading}
              className="hidden"
              id="resume-upload"
            />
            <Button
              type="button"
              variant="outline"
              disabled={isUploading}
              onClick={() => document.getElementById('resume-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Choose File
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Button
              type="button"
              onClick={handleFileUpload}
              disabled={isUploading || isExtracting}
              className="w-full"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting Text from PDF...
                </>
              ) : isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Parsing Resume...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Parse Resume
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
};

