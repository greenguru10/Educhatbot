import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FollowUpChipsProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

export const FollowUpChips: React.FC<FollowUpChipsProps> = ({ suggestions, onSelect }) => {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 my-3 pl-11">
      <span className="text-xs text-slate-400 font-medium">Follow up:</span>
      {suggestions.map((sug, i) => (
        <button
          key={i}
          onClick={() => onSelect(sug)}
          className="flex items-center gap-1 text-xs bg-slate-900/90 hover:bg-brand-900/40 text-slate-300 hover:text-brand-300 border border-slate-800 hover:border-brand-600/50 px-3 py-1.5 rounded-full transition-all text-left"
        >
          <span>{sug}</span>
          <ArrowRight className="w-3 h-3 text-brand-400" />
        </button>
      ))}
    </div>
  );
};
