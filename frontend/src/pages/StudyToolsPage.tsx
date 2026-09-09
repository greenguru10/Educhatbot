import React, { useState } from 'react';
import { HelpCircle, Bookmark, Calendar, Sparkles, Trophy, BookOpen } from 'lucide-react';
import { QuizCard } from '../components/learning/QuizCard';
import { FlashcardDeck } from '../components/learning/FlashcardDeck';
import { StudyPlanView } from '../components/learning/StudyPlanView';
import { apiClient } from '../api/client';
import { QuizQuestion, Flashcard } from '../types';

interface StudyToolsPageProps {
  onStartChatWithQuery: (query: string) => void;
}

export const StudyToolsPage: React.FC<StudyToolsPageProps> = ({ onStartChatWithQuery }) => {
  const [activeTab, setActiveTab] = useState<'study_plans' | 'quiz_hub' | 'flashcards_studio'>('study_plans');
  
  // Quiz Generator State
  const [quizTopic, setQuizTopic] = useState('Data Structures and Algorithms');
  const [quizSubject, setQuizSubject] = useState('computer_science');
  const [activeQuiz, setActiveQuiz] = useState<{ topic: string; questions: QuizQuestion[] } | null>(null);
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // Flashcards Generator State
  const [flashcardTopic, setFlashcardTopic] = useState('Database Normalization');
  const [flashcardSubject, setFlashcardSubject] = useState('computer_science');
  const [activeFlashcards, setActiveFlashcards] = useState<{ topic: string; cards: Flashcard[] } | null>(null);
  const [isFCLoading, setIsFCLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim()) return;
    try {
      setIsQuizLoading(true);
      const qList = await apiClient.generateQuiz({
        topic: quizTopic,
        subject: quizSubject,
        question_count: 4
      });
      setActiveQuiz({ topic: quizTopic, questions: qList });
    } catch (e) {
      console.error(e);
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!flashcardTopic.trim()) return;
    try {
      setIsFCLoading(true);
      const res = await apiClient.generateFlashcards({
        topic: flashcardTopic,
        subject: flashcardSubject,
        card_count: 6
      });
      setActiveFlashcards({ topic: flashcardTopic, cards: res.cards });
    } catch (e) {
      console.error(e);
    } finally {
      setIsFCLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950 border border-brand-700/50 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Learning Studio</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Academic Study Tools</h1>
          <p className="text-sm text-slate-400">
            Reinforce concepts with active recall, test your understanding with cited practice quizzes, and follow structured curriculum roadmaps.
          </p>
        </div>

        {/* Studio Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('study_plans')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'study_plans' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Study Roadmaps</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz_hub')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'quiz_hub' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Practice Quiz Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards_studio')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'flashcards_studio' ? 'bg-brand-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Flashcards Studio</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Study Plans */}
      {activeTab === 'study_plans' && (
        <StudyPlanView
          onSelectTopic={(topic) => onStartChatWithQuery(`Explain ${topic} in detail with examples and citations`)}
        />
      )}

      {/* Tab 2: Quiz Hub */}
      {activeTab === 'quiz_hub' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-400" />
              <span>Generate Cited Practice Quiz</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Concept / Topic</label>
                <input
                  type="text"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  placeholder="e.g. Binary Search Trees, 7-Layer OSI Model, Bayes' Theorem..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Subject Discipline</label>
                <select
                  value={quizSubject}
                  onChange={(e) => setQuizSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="computer_science">Computer Science & DSA</option>
                  <option value="programming">Python Programming</option>
                  <option value="artificial_intelligence">Artificial Intelligence</option>
                  <option value="mathematics">Mathematics & Stats</option>
                  <option value="physics">Physics & Mechanics</option>
                  <option value="cybersecurity_fundamentals">Cybersecurity</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGenerateQuiz}
                disabled={isQuizLoading || !quizTopic.trim()}
                className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
              >
                {isQuizLoading ? 'Retrieving evidence & generating quiz...' : 'Generate 4-Question Quiz'}
              </button>
            </div>
          </div>

          {activeQuiz && (
            <div className="max-w-3xl mx-auto">
              <QuizCard
                topic={activeQuiz.topic}
                questions={activeQuiz.questions}
                onClose={() => setActiveQuiz(null)}
              />
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Flashcards Studio */}
      {activeTab === 'flashcards_studio' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-cyan-400" />
              <span>Generate 3D Flip Flashcard Deck</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Concept / Chapter</label>
                <input
                  type="text"
                  value={flashcardTopic}
                  onChange={(e) => setFlashcardTopic(e.target.value)}
                  placeholder="e.g. Database Normalization 1NF 2NF 3NF, Newton's Laws..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Subject Discipline</label>
                <select
                  value={flashcardSubject}
                  onChange={(e) => setFlashcardSubject(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="computer_science">Computer Science & DSA</option>
                  <option value="programming">Python Programming</option>
                  <option value="artificial_intelligence">Artificial Intelligence</option>
                  <option value="mathematics">Mathematics & Stats</option>
                  <option value="physics">Physics & Mechanics</option>
                  <option value="cybersecurity_fundamentals">Cybersecurity</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGenerateFlashcards}
                disabled={isFCLoading || !flashcardTopic.trim()}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
              >
                {isFCLoading ? 'Synthesizing flashcards...' : 'Generate 6 Flashcards'}
              </button>
            </div>
          </div>

          {activeFlashcards && (
            <div className="max-w-2xl mx-auto">
              <FlashcardDeck
                topic={activeFlashcards.topic}
                cards={activeFlashcards.cards}
                onClose={() => setActiveFlashcards(null)}
              />
            </div>
          )}
        </div>
      )}

    </div>
  );
};
