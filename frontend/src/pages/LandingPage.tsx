import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Bookmark, 
  Cpu, 
  Layers, 
  Terminal, 
  Play, 
  ChevronRight,
  UserCheck,
  Volume2,
  Sun,
  Moon
} from 'lucide-react';
import { Logo } from '../components/common/Logo';

interface LandingPageProps {
  onStartChat: (initialQuery?: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartChat, theme, onToggleTheme }) => {
  const topics = [
    { title: "Python Fundamentals & OOP", count: "18 Chunks", tag: "Programming" },
    { title: "Data Structures & Trees", count: "24 Chunks", tag: "Algorithms" },
    { title: "React 19 & Lifecycle", count: "12 Chunks", tag: "Web Dev" },
    { title: "DBMS, 1NF-3NF & ACID", count: "16 Chunks", tag: "Databases" },
    { title: "Computer Networks & OSI", count: "14 Chunks", tag: "Infrastructure" },
    { title: "Operating Systems & Concurrency", count: "18 Chunks", tag: "Systems" },
  ];

  const demoQueries = [
    "Explain binary search tree insertion with time complexity and Python code",
    "Compare TCP vs UDP protocols and explain the 3-way handshake",
    "How does React useEffect handle mounting and cleanup?",
    "Explain database normalization from 1NF to 3NF with examples"
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-black overflow-x-hidden transition-colors duration-200">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[10%] w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] bg-teal-500/10 dark:bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</a>
            <a href="#curriculum" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Curriculum</a>
            <a href="#demo" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Interactive Demo</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={() => onStartChat()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
            >
              <span>Launch App</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by 120B LLM & Hybrid Neural RAG</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Your AI Computer Science Tutor, Backed by{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
            Verified Sources.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Say goodbye to hallucinations. LearnWise gives you clear, interactive explanations with line-by-line code examples, verified textbook citations, and isolated user workspaces.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onStartChat()}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 hover:opacity-95 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2.5"
          >
            <span>Start Learning Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href="#demo"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Play className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span>Interactive Demo</span>
          </a>
        </div>

        {/* Quick starter badges */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          <span className="text-xs text-slate-500 mr-2">Try asking:</span>
          {demoQueries.map((q, idx) => (
            <button
              key={idx}
              onClick={() => onStartChat(q)}
              className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-300 text-slate-600 dark:text-slate-400 transition-all text-left shadow-sm"
            >
              &ldquo;{q.slice(0, 42)}...&rdquo;
            </button>
          ))}
        </div>

        {/* Interactive App Preview Terminal */}
        <div id="demo" className="mt-14 relative max-w-4xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xl shadow-emerald-500/5 overflow-hidden text-left">
          <div className="h-10 px-4 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-500 dark:text-slate-400">learnwise-session · BST-Insertion</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
              <span>120B Neural Brain Connected</span>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* User message */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                U
              </div>
              <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm text-slate-800 dark:text-slate-200">
                Explain how Binary Search Tree insertion works with code and time complexity.
              </div>
            </div>

            {/* Assistant response */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-cyan-400 flex items-center justify-center text-xs font-bold text-slate-950">
                LW
              </div>
              <div className="flex-1 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 p-4 rounded-2xl rounded-tl-sm text-sm text-slate-700 dark:text-slate-300 space-y-3">
                <p>
                  A **Binary Search Tree (BST)** maintains the invariant that for every node, all values in the left subtree are smaller and all values in the right subtree are larger{' '}
                  <span className="inline-flex items-center px-1.5 py-0.2 text-[11px] font-semibold rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 cursor-pointer">
                    [S1] 03 DSA Binary Search Trees
                  </span>.
                </p>

                <div className="rounded-lg bg-slate-900 border border-slate-800 p-3 font-mono text-xs text-slate-200 overflow-x-auto">
                  <span className="text-purple-400">def</span> <span className="text-blue-400">insert</span>(root, key):<br />
                  &nbsp;&nbsp;<span className="text-purple-400">if</span> root <span className="text-purple-400">is None</span>:<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> Node(key)<br />
                  &nbsp;&nbsp;<span className="text-purple-400">if</span> key &lt; root.key:<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;root.left = insert(root.left, key)<br />
                  &nbsp;&nbsp;<span className="text-purple-400">else</span>:<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;root.right = insert(root.right, key)<br />
                  &nbsp;&nbsp;<span className="text-purple-400">return</span> root
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span>Average Time Complexity: <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">O(log n)</strong></span>
                  <button
                    onClick={() => onStartChat("Explain how Binary Search Tree insertion works with code and time complexity.")}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    Try this in live chat <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Engineered for Serious Computer Science Learners
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
              A high-precision academic engine that bridges generative conversation with authoritative course materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Verified Citation Grounding</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Every statement and definition is strictly mapped to university-standard sources. Click any citation tag (`[S1]`, `[S2]`) to inspect the original text excerpt.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Ultra-Fast 120B Inference</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Near-instantaneous token generation with built-in multi-key automated failover ensuring zero interruption during study sessions.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition-all shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Syntax Highlighted Code</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Get production-ready code with line-by-line breakdown, time/space complexity analysis, and one-click clipboard copying.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Isolated User Profiles</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Every learner gets their own private workspace. Chat sessions, saved bookmarks, and custom notes are strictly isolated per user.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Personal Study Notebook</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Save key takeaways, code snippets, and explanations directly to your persistent study drawer with one click.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-teal-500/40 transition-all shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-4 group-hover:scale-110 transition-transform">
                <Volume2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Audio Read-Aloud (TTS)</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Listen to long explanations and complex mathematical concepts through crystal-clear speech synthesis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Showcase */}
      <section id="curriculum" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">Pre-Indexed Library</div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Active Academic Domains</h2>
          </div>
          <button
            onClick={() => onStartChat()}
            className="mt-4 md:mt-0 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
          >
            Explore all topics in chat <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((t, idx) => (
            <div
              key={idx}
              onClick={() => onStartChat(`Teach me about ${t.title}`)}
              className="p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between shadow-sm group"
            >
              <div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {t.tag}
                </span>
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2 group-hover:text-emerald-600 dark:group-hover:text-white transition-colors">
                  {t.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">{t.count} indexed</p>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-tr from-emerald-100 via-white to-cyan-100 dark:from-emerald-950/60 dark:via-slate-900 dark:to-cyan-950/60 border border-emerald-500/30 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Ready to accelerate your technical learning?
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-xl mx-auto text-base">
            Get instant, grounded answers to coding problems, algorithms, system design, and database queries.
          </p>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => onStartChat()}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:opacity-95 text-slate-950 font-bold text-base shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              <span>Launch LearnWise Tutor</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" showSubtitle={false} />
          <div>LearnWise AI · Source-Grounded Academic Architecture · Production Ready</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            <span className="text-slate-600 dark:text-slate-400">All Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
