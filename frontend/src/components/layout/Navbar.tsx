import React from 'react';
import { BookOpen, Sparkles, Database, Layers, BookmarkCheck, GraduationCap } from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'chat' | 'study_tools' | 'sources' | 'admin';
  onSelectTab: (tab: 'landing' | 'chat' | 'study_tools' | 'sources' | 'admin') => void;
  corpusCount?: number;
  notesCount?: number;
  onOpenNotes?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentTab, 
  onSelectTab, 
  corpusCount = 35, 
  notesCount = 0,
  onOpenNotes 
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-[#0f172a]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectTab('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">Learn<span className="text-brand-400">Wise</span></span>
              <span className="text-[10px] uppercase font-semibold bg-brand-950 text-brand-300 border border-brand-700/50 px-1.5 py-0.5 rounded">RAG v1.0</span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Source-Grounded Academic Assistant</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => onSelectTab('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'landing'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => onSelectTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'chat'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-brand-300" />
            <span>Chat Workspace</span>
          </button>

          <button
            onClick={() => onSelectTab('study_tools')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'study_tools'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Study Tools</span>
          </button>

          <button
            onClick={() => onSelectTab('sources')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'sources'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Source Registry</span>
          </button>

          <button
            onClick={() => onSelectTab('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentTab === 'admin'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">Admin</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {onOpenNotes && (
            <button
              onClick={onOpenNotes}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
              title="View Saved Notes"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Notes</span>
              {notesCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-cyan-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {notesCount}
                </span>
              )}
            </button>
          )}

          <div className="hidden lg:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{corpusCount} Chunks</span>
          </div>
        </div>

      </div>
    </header>
  );
};
