import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Sparkles, TrendingUp } from "lucide-react";
import { CVFormData } from "./types";
import { calculateResumeScore } from "@/lib/resumeScorer";
import { useEffect, useState } from "react";

interface RatingCategory {
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
}

interface CVRatingProps {
  data?: CVFormData;
  onAnalyze?: () => void;
  isAnalyzing?: boolean;
  rating?: {
    overallScore: number;
    categories: RatingCategory[];
    suggestions: string[];
  };
}

export const CVRating = ({ data, onAnalyze, isAnalyzing, rating: externalRating }: CVRatingProps) => {
  const [rating, setRating] = useState(externalRating);

  // Calculate score whenever data changes
  useEffect(() => {
    if (data) {
      const score = calculateResumeScore(data);
      setRating(score);
    }
  }, [data]);

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-green-600 dark:text-green-400";
    if (percentage >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getOverallScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getOverallStatus = (score: number) => {
    if (score >= 80) return { 
      label: "Excellent", 
      color: "bg-green-500",
      borderColor: "border-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      textColor: "text-green-700 dark:text-green-400"
    };
    if (score >= 60) return { 
      label: "Good", 
      color: "bg-yellow-500",
      borderColor: "border-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      textColor: "text-yellow-700 dark:text-yellow-400"
    };
    if (score >= 40) return { 
      label: "Fair", 
      color: "bg-orange-500",
      borderColor: "border-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      textColor: "text-orange-700 dark:text-orange-400"
    };
    return { 
      label: "Needs Improvement", 
      color: "bg-red-500",
      borderColor: "border-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      textColor: "text-red-700 dark:text-red-400"
    };
  };

if (!rating) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          CV Rating & Analysis
        </CardTitle>
        <CardDescription>
          {data
            ? "Click analyze to generate your latest resume score"
            : "Get AI-powered feedback on your CV and suggestions for improvement"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze My CV"}
        </Button>
      </CardContent>
    </Card>
  );
}

  const status = getOverallStatus(rating.overallScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Resume Score
        </CardTitle>
        <CardDescription>
          Real-time completeness analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Indicator Box */}
        <div className={`rounded-lg border-2 ${status.borderColor} ${status.bgColor} p-4 transition-colors duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-full ${status.color} flex items-center justify-center shadow-lg`}>
                <span className="text-white font-bold text-lg">{rating.overallScore}</span>
              </div>
              <div>
                <p className={`font-semibold text-lg ${status.textColor}`}>
                  {status.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  Resume Status
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold ${status.textColor}`}>
                {rating.overallScore}/100
              </p>
              <p className="text-xs text-muted-foreground">Overall Score</p>
            </div>
          </div>
        </div>
        {/* Overall Score */}
        <div className="space-y-3 text-center">
          <div className={`text-5xl font-bold ${getOverallScoreColor(rating.overallScore)}`}>
            {rating.overallScore}
            <span className="text-2xl text-muted-foreground">/100</span>
          </div>
          <Badge className={status.color}>{status.label}</Badge>
          <Progress value={rating.overallScore} className="h-3" />
        </div>

        {/* Category Scores */}
        <div className="space-y-4">
          <h4 className="font-semibold">Score Breakdown</h4>
          {rating.categories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{category.name}</span>
                <span className={`text-sm font-semibold ${getScoreColor(category.score, category.maxScore)}`}>
                  {category.score}/{category.maxScore}
                </span>
              </div>
              <Progress value={(category.score / category.maxScore) * 100} className="h-2" />
              <p className="text-xs text-muted-foreground">{category.feedback}</p>
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {rating.suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Suggestions for Improvement
            </h4>
            <ul className="space-y-2">
              {rating.suggestions.map((suggestion, index) => (
                <li key={index} className="flex gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button 
          onClick={onAnalyze} 
          variant="outline"
          className="w-full"
          disabled={isAnalyzing}
        >
          Re-analyze CV
        </Button>
      </CardContent>
    </Card>
  );
};
