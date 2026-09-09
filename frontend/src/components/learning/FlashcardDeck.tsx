import React, { useState } from 'react';
import { Bookmark, RotateCw, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Flashcard } from '../../types';

interface FlashcardDeckProps {
  topic: string;
  cards: Flashcard[];
  onClose: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({ topic, cards, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="glass-panel border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-700/50 flex items-center justify-center text-cyan-300">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Flashcard Deck: {topic}</h3>
            <p className="text-[11px] text-slate-400">Card {currentIndex + 1} of {cards.length}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/60"
        >
          Close
        </button>
      </div>

      {/* 3D Flip Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-56 bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-lg relative group"
      >
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>{isFlipped ? 'BACK (EXPLANATION)' : 'FRONT (CONCEPT)'}</span>
          <div className="flex items-center gap-1 text-cyan-400 group-hover:underline">
            <RotateCw className="w-3 h-3" />
            <span>Click to flip</span>
          </div>
        </div>

        <div className="my-auto text-center px-4">
          {!isFlipped ? (
            <h4 className="text-base font-bold text-white leading-relaxed">
              {currentCard.front}
            </h4>
          ) : (
            <p className="text-xs text-slate-200 leading-relaxed font-sans text-left">
              {currentCard.back}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/60">
          <span>{currentCard.topic_tag || 'Core Subject'}</span>
          {currentCard.source_citation && (
            <span className="text-cyan-400">{currentCard.source_citation}</span>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs text-slate-500 font-mono">
          {currentIndex + 1} / {cards.length}
        </span>

        <button
          onClick={handleNext}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-medium text-white transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
