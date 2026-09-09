import React from 'react';
import { X, Download, Trash2, BookmarkCheck, FileText } from 'lucide-react';

interface NoteItem {
  id: string;
  topic: string;
  content: string;
  sources?: string[];
  date: string;
}

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notes: NoteItem[];
  onDeleteNote: (id: string) => void;
}

export const NotesDrawer: React.FC<NotesDrawerProps> = ({ isOpen, onClose, notes, onDeleteNote }) => {
  if (!isOpen) return null;

  const exportNotesAsMarkdown = () => {
    if (notes.length === 0) return;
    let md = `# LearnWise Academic Learning Notes\nGenerated on: ${new Date().toLocaleDateString()}\n\n---\n\n`;
    notes.forEach((n, i) => {
      md += `## ${i + 1}. ${n.topic}\n*Date: ${n.date}*\n\n${n.content}\n\n`;
      if (n.sources && n.sources.length > 0) {
        md += `**Sources Grounded**: ${n.sources.join(', ')}\n\n`;
      }
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LearnWise_Study_Notes_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-slide-left transition-colors">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Saved Academic Notes</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{notes.length} key concepts saved</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notes.length > 0 && (
              <button
                onClick={exportNotesAsMarkdown}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs transition-colors border border-slate-200 dark:border-slate-700"
                title="Download as Markdown"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Export .md</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notes.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 dark:text-slate-500 space-y-3">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              <p className="text-xs">No saved notes yet. Click bookmark on any answer to save key insights.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 relative group shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-snug">{note.topic}</h4>
                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans line-clamp-4">
                  {note.content}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800/50 font-mono">
                  <span>{note.date}</span>
                  {note.sources && note.sources.length > 0 && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{note.sources.length} sources cited</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
