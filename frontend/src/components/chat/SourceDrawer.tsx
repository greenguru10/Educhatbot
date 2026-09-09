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
      <div className="w-full max-w-md bg-[#0f172a] border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-slide-left">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2">
            <span className="bg-brand-900 text-brand-300 font-bold px-2 py-0.5 rounded text-xs border border-brand-700/50">
              [{citation.citation_key}]
            </span>
            <h3 className="font-semibold text-slate-100 text-sm truncate">Source Evidence</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Title & Publisher */}
          <div>
            <span className="text-[11px] font-medium text-brand-400 uppercase tracking-wider">Document Title</span>
            <h2 className="text-base font-bold text-white mt-0.5">{citation.title}</h2>
            {citation.source_name && (
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Publisher: {citation.source_name}</span>
              </p>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
            {citation.section && (
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Section</span>
                <span className="font-medium text-slate-200">{citation.section}</span>
              </div>
            )}
            {citation.page_number && (
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Page</span>
                <span className="font-medium text-slate-200">{citation.page_number}</span>
              </div>
            )}
            {citation.license && (
              <div className="col-span-2">
                <span className="text-slate-500 block text-[10px] uppercase">License / Terms</span>
                <span className="font-medium text-slate-200">{citation.license}</span>
              </div>
            )}
            {citation.author && (
              <div className="col-span-2">
                <span className="text-slate-500 block text-[10px] uppercase">Author / Contributor</span>
                <span className="font-medium text-slate-200">{citation.author}</span>
              </div>
            )}
          </div>

          {/* Grounded Excerpt */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-brand-400" />
              <span>Retrieved Evidence Excerpt</span>
            </span>
            <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl text-xs text-slate-300 leading-relaxed font-mono">
              {citation.excerpt || "No raw excerpt recorded."}
            </div>
          </div>

          {/* Direct URL */}
          {citation.url && (
            <a
              href={citation.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700/60"
            >
              <span>Open Primary Source</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          )}

        </div>

      </div>
    </div>
  );
};
