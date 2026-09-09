import React from 'react';
import { X, ExternalLink, ShieldCheck, FileText, User, Calendar, Tag } from 'lucide-react';
import { Citation } from '../../types';

interface SourceDrawerProps {
  citation: Citation | null;
  onClose: () => void;
  isOpen?: boolean;
}

export const SourceDrawer: React.FC<SourceDrawerProps> = ({ citation, onClose, isOpen }) => {
  if (!citation || (isOpen !== undefined && !isOpen)) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-slide-left transition-colors">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold px-2 py-0.5 rounded text-xs border border-emerald-500/30">
              [{citation.citation_key}]
            </span>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">Source Evidence</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Title & Publisher */}
          <div>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Document Title</span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{citation.title}</h2>
            {citation.source_name && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{citation.source_name}</p>
            )}
          </div>

          {/* Institutional Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs">
            {citation.author && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{citation.author}</span>
              </div>
            )}
            {citation.section && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{citation.section}</span>
              </div>
            )}
            {citation.page_number && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Page {citation.page_number}</span>
              </div>
            )}
            {citation.license && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="truncate">{citation.license}</span>
              </div>
            )}
          </div>

          {/* Grounded Excerpt */}
          <div className="space-y-2">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Verified Text Excerpt
            </span>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-serif italic whitespace-pre-wrap">
              "{citation.excerpt || 'No specific excerpt recorded for this citation.'}"
            </div>
          </div>

          {/* External URL if available */}
          {citation.url && (
            <div className="pt-2">
              <a
                href={citation.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>Access Primary Document</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Verification Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Institutionally Verified
          </span>
          <span className="font-mono text-[10px]">ID: {citation.chunk_id ? citation.chunk_id.slice(0, 8) : 'chk_indexed'}</span>
        </div>

      </div>
    </div>
  );
};
