import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Sparkles, 
  Plus, 
  Trash2, 
  BookOpen, 
  SlidersHorizontal, 
  HelpCircle, 
  Bookmark, 
  Loader2,
  GraduationCap
} from 'lucide-react';
import { apiClient } from '../api/client';
import { ChatMessage, Citation, QuizQuestion, Flashcard, SessionItem } from '../types';
import { MessageBubble } from '../components/chat/MessageBubble';
import { SourceDrawer } from '../components/chat/SourceDrawer';
import { FollowUpChips } from '../components/chat/FollowUpChips';
import { QuizCard } from '../components/learning/QuizCard';
import { FlashcardDeck } from '../components/learning/FlashcardDeck';

interface ChatPageProps {
  initialQuery?: string;
  initialSubject?: string;
  onSaveNote?: (note: { topic: string; content: string; sources?: string[] }) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ initialQuery, initialSubject, onSaveNote }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState(initialQuery || '');
  const [sessionId, setSessionId] = useState<string>('');
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || 'programming');
  const [learnerLevel, setLearnerLevel] = useState<string>('beginner');
  const [responseStyle, setResponseStyle] = useState<string>('detailed');

  // Interactive Overlays
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<{ topic: string; questions: QuizQuestion[] } | null>(null);
  const [activeFlashcards, setActiveFlashcards] = useState<{ topic: string; cards: Flashcard[] } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    loadSessions();
    if (initialQuery) {
      handleSendMessage(initialQuery);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const loadSessions = async () => {
    try {
      const list = await apiClient.getSessions();
      setSessions(list);
    } catch (e) {
      console.error(e);
    }
  };

  const startNewSession = () => {
    setSessionId('');
    setMessages([]);
    setActiveQuiz(null);
    setActiveFlashcards(null);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: query,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const resp = await apiClient.sendChat({
        message: query,
        session_id: sessionId || undefined,
        subject: selectedSubject,
        learner_level: learnerLevel,
        response_style: responseStyle
      });

      if (!sessionId && resp.session_id) {
        setSessionId(resp.session_id);
        loadSessions();
      }

      const asstMsg: ChatMessage = {
        id: resp.request_id || `asst_${Date.now()}`,
        role: 'assistant',
        content: resp.answer,
        key_points: resp.key_points,
        example: resp.example,
        quiz: resp.quiz,
        sources: resp.sources,
        confidence: resp.confidence,
        follow_up_suggestions: resp.follow_up_suggestions,
        resolved_intent: resp.resolved_intent,
        subject: resp.subject
      };

      setMessages(prev => [...prev, asstMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `Error generating grounded response: ${err.message}. Please check backend connection.`
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchQuiz = async (topic: string) => {
    try {
      setIsLoading(true);
      const questions = await apiClient.generateQuiz({
        topic,
        subject: selectedSubject,
        learner_level: learnerLevel,
        question_count: 3
      });
      setActiveQuiz({ topic, questions });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLaunchFlashcards = async (topic: string) => {
    try {
      setIsLoading(true);
      const res = await apiClient.generateFlashcards({
        topic,
        subject: selectedSubject,
        learner_level: learnerLevel,
        card_count: 5
      });
      setActiveFlashcards({ topic, cards: res.cards });
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreviousSession = async (sessId: string) => {
    try {
      setIsLoading(true);
      const data = await apiClient.getSession(sessId);
      setSessionId(sessId);
      const formatted = data.messages.map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        key_points: m.metadata?.key_points,
        example: m.metadata?.example,
        quiz: m.metadata?.quiz,
        sources: m.metadata?.sources,
        confidence: m.metadata?.confidence
      }));
      setMessages(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      
      {/* Sessions Sidebar */}
      <aside className="w-64 bg-[#0a0f1d] border-r border-slate-800/80 p-4 hidden md:flex flex-col justify-between shrink-0">
        <div className="space-y-4">
          <button
            onClick={startNewSession}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Academic Session</span>
          </button>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 block">
              Recent Conversations
            </span>
            <div className="space-y-1 max-h-[50vh] overflow-y-auto">
              {sessions.map(s => (
                <button
                  key={s.id}
                  onClick={() => loadPreviousSession(s.id)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-center justify-between group ${
                    sessionId === s.id
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate flex-1">{s.title || 'Academic Session'}</span>
                </button>
              ))}
              {sessions.length === 0 && (
                <p className="text-xs text-slate-600 px-2 py-3 italic">No recent sessions yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Tools info */}
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/60 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300">
            <GraduationCap className="w-4 h-4 text-brand-400" />
            <span>Learning Mode</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Responses conform to strict citation validation rules.
          </p>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col bg-[#0b0f19] overflow-hidden relative">
        
        {/* Top Controls Bar */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300">
              <span className="text-slate-500">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-transparent border-none focus:outline-none font-medium text-white cursor-pointer"
              >
                <option value="programming" className="bg-slate-900 text-white">Programming & Python</option>
                <option value="computer_science" className="bg-slate-900 text-white">Computer Science & DSA</option>
                <option value="artificial_intelligence" className="bg-slate-900 text-white">AI & Machine Learning</option>
                <option value="mathematics" className="bg-slate-900 text-white">Mathematics & Stats</option>
                <option value="physics" className="bg-slate-900 text-white">Physics & Mechanics</option>
                <option value="cybersecurity_fundamentals" className="bg-slate-900 text-white">Cybersecurity & OWASP</option>
                <option value="cloud_computing" className="bg-slate-900 text-white">Cloud & DevOps</option>
                <option value="study_skills" className="bg-slate-900 text-white">Study Skills & Revision</option>
              </select>
            </div>

            {/* Learner Level */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300">
              <span className="text-slate-500">Level:</span>
              <select
                value={learnerLevel}
                onChange={(e) => setLearnerLevel(e.target.value)}
                className="bg-transparent border-none focus:outline-none font-medium text-brand-300 capitalize cursor-pointer"
              >
                <option value="beginner" className="bg-slate-900">Beginner</option>
                <option value="intermediate" className="bg-slate-900">Intermediate</option>
                <option value="advanced" className="bg-slate-900">Advanced</option>
              </select>
            </div>

            {/* Response Style */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-300">
              <span className="text-slate-500">Format:</span>
              <select
                value={responseStyle}
                onChange={(e) => setResponseStyle(e.target.value)}
                className="bg-transparent border-none focus:outline-none font-medium text-cyan-300 capitalize cursor-pointer"
              >
                <option value="detailed" className="bg-slate-900">Detailed</option>
                <option value="concise" className="bg-slate-900">Concise</option>
                <option value="exam_oriented" className="bg-slate-900">Exam-Oriented</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLaunchQuiz(selectedSubject)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-brand-900/60 text-slate-300 hover:text-brand-300 border border-slate-700/80 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
              <span>Quiz Mode</span>
            </button>

            <button
              onClick={() => handleLaunchFlashcards(selectedSubject)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-700/80 transition-colors cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
              <span>Flashcards</span>
            </button>
          </div>

        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-4">
          
          {/* Active Quiz Card Overlay */}
          {activeQuiz && (
            <div className="max-w-3xl mx-auto my-4 animate-fade-in">
              <QuizCard
                topic={activeQuiz.topic}
                questions={activeQuiz.questions}
                onClose={() => setActiveQuiz(null)}
              />
            </div>
          )}

          {/* Active Flashcards Overlay */}
          {activeFlashcards && (
            <div className="max-w-2xl mx-auto my-4 animate-fade-in">
              <FlashcardDeck
                topic={activeFlashcards.topic}
                cards={activeFlashcards.cards}
                onClose={() => setActiveFlashcards(null)}
              />
            </div>
          )}

          {messages.length === 0 && !activeQuiz && !activeFlashcards && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 py-16">
              <div className="w-14 h-14 rounded-2xl bg-brand-900/40 border border-brand-700/50 flex items-center justify-center text-brand-400 shadow-xl shadow-brand-500/10">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Ask an Educational Question</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Enter any concept from Computer Science, Mathematics, Physics, AI, or Study Skills to retrieve grounded explanations with source citations.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <button
                  onClick={() => handleSendMessage("What is recursion in Python with base and recursive cases?")}
                  className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  "What is recursion in Python?"
                </button>
                <button
                  onClick={() => handleSendMessage("Explain TCP vs UDP and 3-way handshake")}
                  className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  "Explain TCP vs UDP"
                </button>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <React.Fragment key={msg.id}>
              <MessageBubble
                message={msg}
                onOpenSource={(cit) => setSelectedCitation(cit)}
                onQuickQuiz={(topic) => handleLaunchQuiz(topic)}
                onQuickFlashcards={(topic) => handleLaunchFlashcards(topic)}
                onSaveNote={onSaveNote}
              />
              {msg.follow_up_suggestions && (
                <FollowUpChips
                  suggestions={msg.follow_up_suggestions}
                  onSelect={(txt) => handleSendMessage(txt)}
                />
              )}
            </React.Fragment>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 py-4 text-xs text-slate-400 animate-pulse pl-2">
              <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
              <span>Retrieving source evidence & synthesizing grounded explanation...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-4xl mx-auto flex items-center gap-2 bg-slate-950 border border-slate-800 focus-within:border-brand-500 rounded-2xl px-4 py-2.5 shadow-2xl transition-all"
          >
            <textarea
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask an academic question or ask for a quiz / example... (Press Enter to send)"
              rows={1}
              className="flex-1 bg-transparent border-none text-slate-100 text-sm focus:outline-none resize-none placeholder-slate-500"
            />

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="p-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 text-white disabled:text-slate-600 transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed shadow-md"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>

      </main>

      {/* Slide-out Source Drawer */}
      <SourceDrawer
        citation={selectedCitation}
        onClose={() => setSelectedCitation(null)}
      />

    </div>
  );
};
