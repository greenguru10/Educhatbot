import React, { useState } from 'react';
import { HelpCircle, CheckCircle, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { QuizQuestion } from '../../types';

interface QuizCardProps {
  topic: string;
  questions: QuizQuestion[];
  onClose: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ topic, questions, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!questions || questions.length === 0) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (isAnswerRevealed) return;
    setSelectedOption(opt);
    setIsAnswerRevealed(true);
    if (opt === currentQ.answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="glass-panel border-brand-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-900/60 border border-brand-700/50 flex items-center justify-center text-brand-300">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Practice Quiz: {topic}</h3>
            <p className="text-[11px] text-slate-400">Grounded in approved educational evidence</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/60"
        >
          Close
        </button>
      </div>

      {!isFinished ? (
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Text */}
          <div className="text-sm font-medium text-slate-100 leading-relaxed py-2">
            {currentQ.question}
          </div>

          {/* Options */}
          <div className="space-y-2">
            {(currentQ.options || [currentQ.answer]).map((opt, idx) => {
              let btnStyle = 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/80 text-slate-200';
              if (isAnswerRevealed) {
                if (opt === currentQ.answer) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-600 text-emerald-200';
                } else if (selectedOption === opt) {
                  btnStyle = 'bg-red-950/80 border-red-600 text-red-200';
                } else {
                  btnStyle = 'bg-slate-900/40 border-slate-800/50 text-slate-500';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswerRevealed}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-start gap-2.5 ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center shrink-0 text-[11px] font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswerRevealed && (
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-1 text-xs">
              <span className="font-semibold text-brand-400 block">Explanation</span>
              <p className="text-slate-300">{currentQ.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {isAnswerRevealed && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs rounded-xl shadow-lg transition-all"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Results View */
        <div className="text-center py-6 space-y-4">
          <div className="w-12 h-12 rounded-full bg-brand-900/60 border border-brand-600 flex items-center justify-center mx-auto text-brand-300">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">Quiz Completed!</h4>
            <p className="text-xs text-slate-400 mt-1">
              You scored <strong className="text-brand-300">{score}</strong> out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-medium text-white transition-colors"
            >
              Back to Chat
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
