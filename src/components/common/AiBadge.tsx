import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface AiBadgeProps {
  isAiGenerated?: boolean;
  className?: string;
  label?: string;
}

export const AiBadge: React.FC<AiBadgeProps> = ({ isAiGenerated = false, className = '', label }) => {
  if (isAiGenerated) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs ${className}`}>
        <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" />
        <span>{label || 'AI Estimate'}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-nature-50 text-nature-800 border border-nature-200 shadow-xs ${className}`}>
      <ShieldCheck className="w-3 h-3 text-nature-600" />
      <span>{label || 'Verified Agronomic Data'}</span>
    </span>
  );
};
