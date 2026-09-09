import React, { useState } from 'react';
import { Calendar, CheckSquare, Square, Sparkles, Trophy, ArrowRight } from 'lucide-react';

interface StudyPlanViewProps {
  onSelectTopic: (topic: string) => void;
}

export const StudyPlanView: React.FC<StudyPlanViewProps> = ({ onSelectTopic }) => {
  const [selectedSubject, setSelectedSubject] = useState('computer_science');
  const [duration, setDuration] = useState<'7_days' | '14_days'>('7_days');
  const [completedDays, setCompletedDays] = useState<number[]>([]);

  const studyPlans: Record<string, Array<{ day: number; title: string; focus: string; topic: string }>> = {
    computer_science: [
      { day: 1, title: "Binary Search & Big-O Notation", focus: "Logarithmic time complexity, loop invariants, and boundary conditions.", topic: "Binary Search Trees and Big O" },
      { day: 2, title: "Linked Lists & Pointer Logic", focus: "Singly vs doubly linked lists, fast and slow pointer technique.", topic: "Linked Lists and Stacks" },
      { day: 3, title: "Stacks, Queues, & Deques", focus: "LIFO vs FIFO patterns, monotonic stack algorithms.", topic: "Stacks and Queues in DSA" },
      { day: 4, title: "Binary Search Trees & AVL Rotations", focus: "Inorder traversal, tree balancing factor, and rotations.", topic: "Binary Search Trees and AVL" },
      { day: 5, title: "Sorting: Merge Sort vs Quick Sort", focus: "Divide and conquer partitioning and space complexity.", topic: "Merge Sort and Sorting Algorithms" },
      { day: 6, title: "Graph Traversals: BFS & DFS", focus: "Queue-based BFS for shortest paths and recursive DFS.", topic: "Graph Algorithms BFS DFS" },
      { day: 7, title: "Dijkstra & Shortest Path", focus: "Priority queues, edge relaxation, and greedy shortest paths.", topic: "Dijkstra Algorithm in Graphs" },
    ],
    programming: [
      { day: 1, title: "Python Data Types & Memory Model", focus: "Mutability, references, list comprehensions, and hashing.", topic: "Python syntax and built-in data types" },
      { day: 2, title: "Functions, *args, and Scopes", focus: "LEGB scope resolution rule and keyword argument unpacking.", topic: "Python Functions and variable scope" },
      { day: 3, title: "Recursion & Call Stacks", focus: "Base cases, recursion limits, and tree recursion.", topic: "Recursion and functions in Python" },
      { day: 4, title: "OOP: Classes & Encapsulation", focus: "Dunder methods, private variables, and object state.", topic: "Object Oriented Programming in Python" },
      { day: 5, title: "Inheritance & Polymorphism", focus: "Abstract base classes, super() calls, and method overriding.", topic: "Inheritance and Polymorphism in Python" },
      { day: 6, title: "Exception Handling & Context Managers", focus: "Try-except-finally blocks and custom context managers.", topic: "Error handling and exceptions in Python" },
      { day: 7, title: "Functional Patterns & Itertools", focus: "Generators, yield expressions, and lambda functions.", topic: "Python Generators and iterables" },
    ],
    artificial_intelligence: [
      { day: 1, title: "Supervised Learning & Linear Regression", focus: "Loss functions, mean squared error, and linear models.", topic: "Supervised learning and linear regression" },
      { day: 2, title: "Classification & Logistic Regression", focus: "Sigmoid activation, binary cross-entropy, and decision boundaries.", topic: "Logistic regression and classification" },
      { day: 3, title: "Gradient Descent Optimization", focus: "Learning rate, batch vs stochastic gradient descent.", topic: "Gradient descent and optimization algorithms" },
      { day: 4, title: "Artificial Neural Networks (ANN)", focus: "Perceptrons, hidden layers, and ReLU non-linearities.", topic: "Neural networks and multi layer perceptrons" },
      { day: 5, title: "Backpropagation Algorithm", focus: "Chain rule of calculus, computational graphs, and gradients.", topic: "Backpropagation in deep learning" },
      { day: 6, title: "Transformer Self-Attention", focus: "Query, Key, Value matrices and scaled dot-product attention.", topic: "Transformer architectures and self attention" },
      { day: 7, title: "Large Language Models & Fine-Tuning", focus: "Pre-training, prompt engineering, and RLHF alignment.", topic: "Large Language Models and pre training" },
    ]
  };

  const currentSchedule = studyPlans[selectedSubject] || studyPlans['computer_science'];

  const toggleDay = (day: number) => {
    setCompletedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const progressPercent = Math.round((completedDays.length / currentSchedule.length) * 100);

  return (
    <div className="space-y-6">
      
      {/* Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 glass-panel rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-400" />
            <h2 className="text-lg font-bold text-white">Adaptive Learning Roadmap</h2>
          </div>
          <p className="text-xs text-slate-400">
            Select an academic track to view structured daily milestones and citations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setCompletedDays([]);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="computer_science">Computer Science & DSA</option>
            <option value="programming">Python Mastery</option>
            <option value="artificial_intelligence">AI & Deep Learning</option>
          </select>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setDuration('7_days')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                duration === '7_days' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              7-Day Sprint
            </button>
            <button
              onClick={() => setDuration('14_days')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                duration === '14_days' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              14-Day Deep
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card p-4 rounded-xl space-y-2 border border-slate-800">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            Roadmap Progress: {completedDays.length} / {currentSchedule.length} Modules Completed
          </span>
          <span className="text-brand-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-cyan-400 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Daily Milestones List */}
      <div className="space-y-3">
        {currentSchedule.map((item) => {
          const isDone = completedDays.includes(item.day);
          return (
            <div
              key={item.day}
              className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                isDone 
                  ? 'bg-slate-900/40 border-emerald-900/50 text-slate-400' 
                  : 'glass-card border-slate-800/80 hover:border-brand-500/40 text-slate-200'
              }`}
            >
              <button
                onClick={() => toggleDay(item.day)}
                className="mt-0.5 text-slate-400 hover:text-brand-400 transition-colors"
              >
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-950 px-2 py-0.5 rounded border border-brand-800/40">
                    Day {item.day}
                  </span>
                  <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.focus}</p>
              </div>

              <button
                onClick={() => onSelectTopic(item.topic)}
                className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-all shrink-0"
              >
                <span>Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
