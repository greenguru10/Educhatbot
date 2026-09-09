import React, { useState } from 'react';
import { 
  Bot, 
  User, 
  CheckCircle2, 
  Sparkles, 
  HelpCircle, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  BookmarkCheck 
} from 'lucide-react';
import { ChatMessage, Citation } from '../../types';
import { CodeBlock } from './CodeBlock';

interface MessageBubbleProps {
  message: ChatMessage;
  onOpenSource: (citation: Citation) => void;
  onQuickQuiz?: (topic: string) => void;
  onQuickFlashcards?: (topic: string) => void;
  onSaveNote?: (note: { topic: string; content: string; sources?: string[] }) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onOpenSource,
  onQuickQuiz,
  onQuickFlashcards,
  onSaveNote,
}) => {
  const isUser = message.role === 'user';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  // Audio SpeechSynthesis
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.content.replace(/\[S\d+\]/g, ''));
      utterance.rate = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleCopyMarkdown = () => {
    let text = message.content;
    if (message.key_points && message.key_points.length > 0) {
      text += `\n\n### Key Takeaways:\n` + message.key_points.map(k => `- ${k}`).join('\n');
    }
    if (message.example) {
      text += `\n\n### ${message.example}`;
    }
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleBookmark = () => {
    if (onSaveNote && !isNoteSaved) {
      onSaveNote({
        topic: message.content.slice(0, 60).replace(/[#*]/g, '').trim() + '...',
        content: message.content,
        sources: message.sources?.map(s => `${s.title} (${s.citation_key})`)
      });
      setIsNoteSaved(true);
      setTimeout(() => setIsNoteSaved(false), 3000);
    }
  };

  // Render text with clickable citations and embedded code blocks
  const renderFormattedContent = (content: string) => {
    // Check for code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Push text before code block
      if (match.index > lastIndex) {
        parts.push({ type: 'text', value: content.slice(lastIndex, match.index) });
      }
      parts.push({ type: 'code', lang: match[1] || 'python', value: match[2].trim() });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({ type: 'text', value: content.slice(lastIndex) });
    }

    return parts.map((part, pIdx) => {
      if (part.type === 'code') {
        return <CodeBlock key={pIdx} language={part.lang} code={part.value} />;
      }

      // Format inline citations [S1], [S2]
      const citParts = part.value.split(/(\[S\d+\])/g);
      return (
        <span key={pIdx} className="leading-relaxed">
          {citParts.map((sub, sIdx) => {
            const m = sub.match(/\[S(\d+)\]/);
            if (m) {
              const citKey = `S${m[1]}`;
              const citObj = message.sources?.find(s => s.citation_key === citKey);
              return (
                <button
                  key={sIdx}
                  onClick={() => citObj && onOpenSource(citObj)}
                  className="inline-flex items-center gap-0.5 mx-1 px-1.5 py-0.5 rounded text-[11px] font-bold bg-brand-950 text-brand-300 border border-brand-700/60 hover:bg-brand-700 hover:text-white transition-all cursor-pointer shadow-sm"
                  title={citObj ? `${citObj.title} - ${citObj.section || ''}` : 'View Source'}
                >
                  [{citKey}]
                </button>
              );
            }
            return <span key={sIdx}>{sub}</span>;
          })}
        </span>
      );
    });
  };

  if (isUser) {
    return (
      <div className="flex items-start justify-end gap-3 my-4">
        <div className="max-w-2xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-md text-sm leading-relaxed">
          {message.content}
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-slate-300">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 my-5 group">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shrink-0 shadow-md shadow-brand-500/20 text-white mt-1">
        <Bot className="w-4 h-4" />
      </div>

      <div className="max-w-3xl flex-1 space-y-3">
        {/* Main Answer Card */}
        <div className="glass-panel p-5 rounded-2xl rounded-tl-sm text-slate-100 text-sm leading-relaxed space-y-4 shadow-xl">
          
          {/* Top Bar with Audio & Copy Tools */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-slate-200">Grounded Answer</span>
              {message.confidence && (
                <span className="text-[11px] text-slate-400">
                  • Confidence: <strong className="capitalize text-brand-300">{message.confidence.label}</strong> ({Math.round(message.confidence.score * 100)}%)
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleToggleSpeech}
                className={`p-1.5 rounded-lg transition-colors ${
                  isSpeaking ? 'bg-brand-600 text-white' : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={isSpeaking ? 'Stop audio' : 'Read aloud'}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleBookmark}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
                title="Save to My Notes"
              >
                {isNoteSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-cyan-400" /> : <Bookmark className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleCopyMarkdown}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Copy Markdown"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Answer Content */}
          <div className="text-slate-200 text-sm leading-relaxed space-y-2">
            {renderFormattedContent(message.content)}
          </div>

          {/* Key Takeaways */}
          {message.key_points && message.key_points.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Core Takeaways</span>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300 pl-1">
                {message.key_points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-brand-500 font-bold">•</span>
                    <span>{renderFormattedContent(point)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Illustrative Example */}
          {message.example && (
            <div className="bg-indigo-950/40 border border-indigo-800/40 rounded-xl p-3.5 text-xs text-indigo-200 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-indigo-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Illustrative Demonstration</span>
              </div>
              <p className="leading-relaxed text-slate-300">{message.example}</p>
            </div>
          )}

          {/* Citation Trays */}
          {message.sources && message.sources.length > 0 && (
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Verified Sources:</span>
              {message.sources.map((src) => (
                <button
                  key={src.citation_key}
                  onClick={() => onOpenSource(src)}
                  className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1 rounded-lg text-xs text-slate-300 transition-colors"
                >
                  <span className="font-bold text-brand-400">[{src.citation_key}]</span>
                  <span className="truncate max-w-[150px]">{src.title}</span>
                  {src.section && <span className="text-slate-500 text-[10px]">({src.section})</span>}
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2 pl-2">
          {onQuickQuiz && (
            <button
              onClick={() => onQuickQuiz(message.subject || 'this topic')}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-300 transition-colors bg-slate-900/60 hover:bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md"
            >
              <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
              <span>Practice Quiz</span>
            </button>
          )}

          {onQuickFlashcards && (
            <button
              onClick={() => onQuickFlashcards(message.subject || 'this topic')}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors bg-slate-900/60 hover:bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md"
            >
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              <span>Flashcard Deck</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
