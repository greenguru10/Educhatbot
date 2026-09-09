import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Plus, 
  Trash2, 
  Bookmark, 
  Loader2, 
  PanelLeftClose, 
  PanelLeft, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  User, 
  Zap, 
  Home, 
  MessageSquare, 
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { apiClient } from './api/client';
import { ChatMessage, Citation, SessionItem } from './types';
import { CodeBlock } from './components/chat/CodeBlock';
import { SourceDrawer } from './components/chat/SourceDrawer';
import { NotesDrawer } from './components/learning/NotesDrawer';
import { Logo } from './components/common/Logo';
import { UserProfileModal } from './components/common/UserProfileModal';
import { LandingPage } from './pages/LandingPage';
import { getCurrentUser, UserProfile } from './utils/user';

export function App() {
  // Navigation: 'landing' or 'chat'
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');

  // Theme: 'dark' or 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('learnwise_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  // Active User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(getCurrentUser());
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Citation & Notes Drawer
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [savedNotes, setSavedNotes] = useState<Array<{ id: string; topic: string; content: string; sources?: string[]; date: string }>>(() => {
    try {
      const stored = localStorage.getItem(`learnwise_notes_${currentUser.id}`);
      return stored ? JSON.parse(stored) : [
        {
          id: 'n_1',
          topic: 'Recursion in Python: Base & Recursive Cases',
          content: 'A recursive function requires a base case to terminate execution and prevent stack overflow. The recursive case reduces the problem toward the base case.',
          sources: ['Python Functions [S1]'],
          date: new Date().toLocaleDateString()
        }
      ];
    } catch {
      return [];
    }
  });

  // Audio Speech State
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const starterCards = [
    { title: "Binary Search Trees", desc: "BST invariants, insertion algorithm & O(log n) complexity", query: "Explain how binary search tree insertion works with code and time complexity" },
    { title: "React Hooks & Lifecycle", desc: "useState, useEffect, component mounting & cleanup", query: "Explain React Hooks (useState, useEffect) and component lifecycle in functional components" },
    { title: "TCP vs UDP Protocols", desc: "3-way handshake, packet reliability & latency tradeoffs", query: "Compare TCP vs UDP protocols and explain the 3-way handshake" },
    { title: "DBMS Normalization (1NF - 3NF)", desc: "Relational dependencies, anomalies & ACID transactions", query: "Explain 1NF, 2NF, 3NF database normalization with practical table examples" },
  ];

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('learnwise_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Load Sessions whenever user changes
  useEffect(() => {
    loadUserSessions(currentUser.id);
    try {
      const stored = localStorage.getItem(`learnwise_notes_${currentUser.id}`);
      if (stored) setSavedNotes(JSON.parse(stored));
      else setSavedNotes([]);
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadUserSessions = async (userId: string) => {
    try {
      const list = await apiClient.getSessions(userId);
      setSessions(list);
    } catch (e) {
      console.error('Failed to load sessions', e);
    }
  };

  const handleUserChanged = (user: UserProfile) => {
    setCurrentUser(user);
    handleStartNewChat();
    loadUserSessions(user.id);
  };

  const handleStartNewChat = () => {
    setSessionId('');
    setMessages([]);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeakingId(null);
  };

  const handleLaunchChat = (query?: string) => {
    setCurrentView('chat');
    if (query) {
      setTimeout(() => {
        handleSendMessage(query);
      }, 100);
    }
  };

  const handleSendMessage = async (textOverride?: string) => {
    const text = (textOverride || inputQuery).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInputQuery('');
    setIsLoading(true);

    try {
      const resp = await apiClient.sendChat({
        message: text,
        session_id: sessionId || undefined,
        user_id: currentUser.id,
        learner_level: 'beginner',
        response_style: 'detailed'
      });

      if (!sessionId && resp.session_id) {
        setSessionId(resp.session_id);
        loadUserSessions(currentUser.id);
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
        subject: resp.subject,
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, asstMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `I encountered an issue processing your request: ${err.message || 'Please try again'}.`,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSession = async (sId: string) => {
    if (sId === sessionId) return;
    setIsLoading(true);
    try {
      const data = await apiClient.getSession(sId);
      setSessionId(sId);
      const formattedMsgs: ChatMessage[] = data.messages.map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        key_points: m.metadata?.key_points,
        example: m.metadata?.example,
        quiz: m.metadata?.quiz,
        sources: m.metadata?.sources,
        confidence: m.metadata?.confidence,
        created_at: m.created_at
      }));
      setMessages(formattedMsgs);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, sId: string) => {
    e.stopPropagation();
    try {
      await fetch(`/api/v1/sessions/${sId}`, { method: 'DELETE' });
      setSessions(prev => prev.filter(s => s.id !== sId));
      if (sessionId === sId) {
        handleStartNewChat();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveToNotes = (topic: string, content: string, sources?: string[]) => {
    const newNote = {
      id: `n_${Date.now()}`,
      topic: topic || 'Academic Insight',
      content,
      sources,
      date: new Date().toLocaleDateString()
    };
    const updated = [newNote, ...savedNotes];
    setSavedNotes(updated);
    localStorage.setItem(`learnwise_notes_${currentUser.id}`, JSON.stringify(updated));
    setIsNotesOpen(true);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSpeech = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\[S\d+\]/g, '').replace(/[#*`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Render Markdown with Code Highlighting & Clickable Citations
  const renderFormattedContent = (content: string, citations?: Citation[]) => {
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, match.index)
        });
      }
      parts.push({
        type: 'code',
        language: match[1] || 'python',
        code: match[2].trim()
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex)
      });
    }

    return (
      <div className="space-y-3">
        {parts.map((part, idx) => {
          if (part.type === 'code') {
            return (
              <CodeBlock
                key={idx}
                language={part.language}
                code={part.code}
              />
            );
          }

          // Format text with headings, bold, bullet points, and citations
          const paragraphs = part.content.split('\n\n');
          return (
            <div key={idx} className="space-y-2.5">
              {paragraphs.map((p, pIdx) => {
                if (!p.trim()) return null;

                // Headings
                if (p.startsWith('### ')) {
                  return (
                    <h3 key={pIdx} className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-1">
                      {p.replace('### ', '')}
                    </h3>
                  );
                }
                if (p.startsWith('#### ')) {
                  return (
                    <h4 key={pIdx} className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-2 mb-1">
                      {p.replace('#### ', '')}
                    </h4>
                  );
                }

                // Inline citations parser [S1], [S2]
                const inlineParts = p.split(/(\[S\d+\])/g);

                return (
                  <p key={pIdx} className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                    {inlineParts.map((sub, sIdx) => {
                      const citationMatch = sub.match(/\[S(\d+)\]/);
                      if (citationMatch && citations) {
                        const citKey = `S${citationMatch[1]}`;
                        const foundCit = citations.find(c => c.citation_key === citKey);
                        if (foundCit) {
                          return (
                            <button
                              key={sIdx}
                              onClick={() => setSelectedCitation(foundCit)}
                              className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all cursor-pointer select-none"
                              title={`View source: ${foundCit.title}`}
                            >
                              <span>[{citKey}]</span>
                            </button>
                          );
                        }
                      }
                      return <span key={sIdx}>{sub}</span>;
                    })}
                  </p>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  // If in Landing Page view, show Landing Page
  if (currentView === 'landing') {
    return <LandingPage onStartChat={handleLaunchChat} theme={theme} onToggleTheme={toggleTheme} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased overflow-hidden selection:bg-emerald-500 selection:text-black font-sans transition-colors duration-200">
      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out md:static shadow-lg md:shadow-none ${
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:w-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo & Navigation */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <button 
              onClick={() => setCurrentView('landing')}
              className="hover:opacity-80 transition-opacity"
              title="Back to Landing Page"
            >
              <Logo size="sm" showSubtitle={false} />
            </button>
            <button
              onClick={() => setCurrentView('landing')}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Landing Page"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <button
              onClick={handleStartNewChat}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Conversation</span>
            </button>
          </div>

          {/* User Chat Sessions List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-1">
              Your Sessions
            </div>
            {sessions.length === 0 ? (
              <div className="text-xs text-slate-400 dark:text-slate-500 px-3 py-4 text-center">
                No past chats yet for {currentUser.name}. Start a conversation!
              </div>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => handleSelectSession(s.id)}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    sessionId === s.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate pr-6">
                    <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${sessionId === s.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                    <span className="truncate">{s.title || 'Academic Session'}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(e, s.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition-all"
                    title="Delete session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Sidebar Footer / User Profile & Notes */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/40 space-y-2">
            <button
              onClick={() => setIsNotesOpen(true)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs transition-colors shadow-sm"
            >
              <span className="flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Saved Notes</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-semibold">
                {savedNotes.length}
              </span>
            </button>

            {/* Active User Switcher */}
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="w-full flex items-center justify-between p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-left shadow-sm"
            >
              <div className="flex items-center gap-2.5 truncate">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 truncate">{currentUser.role}</div>
                </div>
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Switch</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CHAT WORKSPACE */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Workspace Header */}
        <header className="h-14 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md px-4 flex items-center justify-between shrink-0 transition-colors">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isSidebarOpen ? "Collapse sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Landing Page</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
              <Zap className="w-3.5 h-3.5" />
              <span>Groq 120B Connected</span>
            </div>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={() => setIsNotesOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Open Saved Notes"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 max-w-4xl w-full mx-auto">
          {messages.length === 0 ? (
            /* Empty State / Welcome Screen */
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 max-w-2xl mx-auto space-y-8 animate-fade-in">
              <div className="space-y-3">
                <Logo size="lg" />
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  Ask any computer science, programming, database, or algorithmic question. Responses are grounded in verified academic materials.
                </p>
              </div>

              {/* Starter Topics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                {starterCards.map((card, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(card.query)}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 text-left transition-all shadow-sm group"
                  >
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {card.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {card.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages List */
            messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0 shadow-md shadow-emerald-500/10 mt-1">
                      LW
                    </div>
                  )}

                  <div
                    className={`relative group max-w-[85%] rounded-2xl p-4 text-sm ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-sm shadow-md'
                        : 'bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/90 text-slate-800 dark:text-slate-200 rounded-tl-sm shadow-sm dark:shadow-lg'
                    }`}
                  >
                    {/* Content */}
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="space-y-3">
                        {renderFormattedContent(msg.content, msg.sources)}

                        {/* Discrete Citation Badges if present */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1">
                              Sources:
                            </span>
                            {msg.sources.map((s) => (
                              <button
                                key={s.citation_key}
                                onClick={() => setSelectedCitation(s)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-slate-100 dark:bg-slate-800/90 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-500/40 transition-all cursor-pointer"
                              >
                                <span className="font-semibold text-emerald-600 dark:text-emerald-400">[{s.citation_key}]</span>
                                <span className="truncate max-w-[120px]">{s.title}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons: Copy, TTS, Save Note */}
                        <div className="pt-2 flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleToggleSpeech(msg.id, msg.content)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              speakingId === msg.id
                                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                                : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                            title={speakingId === msg.id ? "Stop Read-Aloud" : "Read Aloud"}
                          >
                            {speakingId === msg.id ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleSaveToNotes(msg.content.slice(0, 40) + '...', msg.content, msg.sources?.map(s => `${s.title} [${s.citation_key}]`))}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Save to Study Notes"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0 mt-1 shadow-sm"
                    />
                  )}
                </div>
              );
            })
          )}

          {isLoading && (
            <div className="flex gap-3.5 animate-fade-in">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-400 flex items-center justify-center text-slate-950 font-bold text-xs shrink-0">
                LW
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-400 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                <span>Synthesizing grounded explanation via Groq 120B...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Message Composer */}
        <div className="p-4 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-50/80 dark:via-slate-950/80 to-transparent shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 focus-within:border-emerald-500 shadow-lg transition-all">
              <textarea
                ref={textareaRef}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask an academic or coding question (e.g. 'Explain Dijkstra algorithm with Python code')..."
                rows={2}
                className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 p-3.5 pr-14 resize-none focus:outline-none max-h-36"
              />

              <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputQuery.trim() || isLoading}
                  className="w-8 h-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 flex items-center justify-center transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
              <span>Press <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-700 dark:text-slate-300">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-slate-700 dark:text-slate-300">Shift + Enter</kbd> for new line</span>
              <span>LearnWise AI Tutor</span>
            </div>
          </div>
        </div>
      </main>

      {/* Slide-out Source Citation Drawer */}
      <SourceDrawer
        citation={selectedCitation}
        isOpen={Boolean(selectedCitation)}
        onClose={() => setSelectedCitation(null)}
      />

      {/* Slide-out Study Notes Drawer */}
      <NotesDrawer
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        notes={savedNotes}
        onDeleteNote={(id) => {
          const updated = savedNotes.filter(n => n.id !== id);
          setSavedNotes(updated);
          localStorage.setItem(`learnwise_notes_${currentUser.id}`, JSON.stringify(updated));
        }}
      />

      {/* User Profile Switcher Modal */}
      <UserProfileModal
        currentUser={currentUser}
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onUserChanged={handleUserChanged}
      />
    </div>
  );
}

export default App;
