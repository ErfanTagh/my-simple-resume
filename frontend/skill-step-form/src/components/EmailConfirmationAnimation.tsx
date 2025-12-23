import { Mail } from "lucide-react";

export const EmailConfirmationAnimation = () => {
  return (
    <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
      {/* Outer pulsing ring */}
      <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring"></div>
      
      {/* Middle pulsing ring */}
      <div 
        className="absolute inset-0 rounded-full bg-primary/30 animate-pulse-ring"
        style={{ animationDelay: '0.5s' }}
      ></div>
      
      {/* Inner pulsing ring */}
      <div 
        className="absolute inset-0 rounded-full bg-primary/40 animate-pulse-ring"
        style={{ animationDelay: '1s' }}
      ></div>
      
      {/* Center circle with icon */}
      <div className="relative z-10 w-16 h-16 rounded-full bg-primary flex items-center justify-center">
        <Mail className="w-8 h-8 text-primary-foreground" />
      </div>
    </div>
  );
};

