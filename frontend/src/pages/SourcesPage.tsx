import React, { useState, useEffect } from 'react';
import { Database, ExternalLink, ShieldCheck, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { SourceRegistryItem, SubjectItem } from '../types';

export const SourcesPage: React.FC = () => {
  const [sources, setSources] = useState<SourceRegistryItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [srcList, subjList] = await Promise.all([
        apiClient.getSources(),
        apiClient.getSubjects()
      ]);
      setSources(srcList);
      setSubjects(subjList);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-700/50 text-cyan-300 text-xs font-semibold">
          <Database className="w-3.5 h-3.5" />
          <span>Curated Academic Repository</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Approved Source Registry</h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          LearnWise enforces strict source grounding. All answers and quiz items are retrieved exclusively from authorized, open-access, or legally permitted academic repositories.
        </p>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sources.map((src) => (
          <div key={src.id} className="glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="bg-brand-900/60 border border-brand-700/50 text-brand-300 text-[11px] font-bold px-2 py-0.5 rounded">
                  Tier {src.authority_level} Authority
                </span>
                <span className="text-emerald-400 text-xs flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active
                </span>
              </div>

              <h3 className="font-bold text-white text-base leading-snug">{src.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{src.license_notes}</p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono">
                Weight: <strong>{Math.round(src.authority_score * 100)}%</strong>
              </span>
              {src.base_url && (
                <a
                  href={src.base_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline"
                >
                  <span>Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Subject Taxonomy Section */}
      <div className="space-y-4 pt-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-brand-400" />
          <span>Curriculum Subject Taxonomy</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map((subj) => (
            <div key={subj.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">{subj.display_name}</h4>
                <span className="text-[10px] font-mono text-slate-500">{subj.slug}</span>
              </div>
              <p className="text-xs text-slate-400">{subj.description}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
