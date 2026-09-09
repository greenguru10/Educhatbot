import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  RotateCw, 
  Layers, 
  Search, 
  AlertCircle,
  Eye,
  Plus
} from 'lucide-react';
import { apiClient } from '../api/client';
import { DocumentItem } from '../types';

export const AdminPage: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [reindexMsg, setReindexMsg] = useState<string | null>(null);

  // Upload Form State
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [subjectSlug, setSubjectSlug] = useState('programming');
  const [licenseText, setLicenseText] = useState('Creative Commons Attribution 4.0');
  const [customTitle, setCustomTitle] = useState('');

  // Chunk Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setIsLoading(true);
      const list = await apiClient.getDocuments();
      setDocuments(list);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('subject_slug', subjectSlug);
      formData.append('license', licenseText);
      if (customTitle) formData.append('title', customTitle);

      await apiClient.uploadDocument(formData);
      setFileToUpload(null);
      setCustomTitle('');
      await loadDocuments();
      setReindexMsg('Document uploaded, parsed, chunked, and indexed successfully!');
      setTimeout(() => setReindexMsg(null), 4000);
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleDocStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await apiClient.updateDocumentStatus(id, nextStatus);
      await loadDocuments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleReindex = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.reindexCorpus();
      setReindexMsg(`Corpus re-indexed: ${res.total_chunks} chunks ready across BM25 & Vector index.`);
      setTimeout(() => setReindexMsg(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const viewDocDetails = async (id: string) => {
    try {
      const details = await apiClient.getDocumentDetail(id);
      setPreviewDoc(details);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Document Ingestion & Indexing</h1>
          <p className="text-sm text-slate-400 mt-1">
            Admin console for uploading, section-aware chunking, vector embedding, and corpus lifecycle management.
          </p>
        </div>

        <button
          onClick={handleReindex}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors shadow-lg"
        >
          <RotateCw className="w-3.5 h-3.5 text-brand-400" />
          <span>Re-index Entire Corpus</span>
        </button>
      </div>

      {reindexMsg && (
        <div className="bg-brand-950 border border-brand-700 p-3.5 rounded-xl text-xs text-brand-300 flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-brand-400" />
          <span>{reindexMsg}</span>
        </div>
      )}

      {/* Upload Section */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Upload className="w-4 h-4 text-brand-400" />
          <span>Ingest New Educational Document</span>
        </h3>

        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="md:col-span-3 border-2 border-dashed border-slate-800 hover:border-brand-500/50 rounded-2xl p-6 text-center cursor-pointer bg-slate-900/40 transition-colors">
            <input
              type="file"
              id="file-upload"
              accept=".md,.txt,.html,.pdf"
              onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label htmlFor="file-upload" className="cursor-pointer block space-y-2">
              <FileText className="w-8 h-8 text-brand-400 mx-auto" />
              <div className="text-xs text-slate-300">
                {fileToUpload ? (
                  <span className="font-bold text-white">{fileToUpload.name} ({(fileToUpload.size / 1024).toFixed(1)} KB)</span>
                ) : (
                  <span>Click to choose Markdown, Text, HTML, or PDF file</span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">Auto-chunked by headings and semantic boundaries</p>
            </label>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Subject</label>
            <select
              value={subjectSlug}
              onChange={(e) => setSubjectSlug(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="programming">Programming & Python</option>
              <option value="computer_science">Computer Science & DSA</option>
              <option value="artificial_intelligence">AI & Machine Learning</option>
              <option value="mathematics">Mathematics & Stats</option>
              <option value="physics">Physics & Mechanics</option>
              <option value="cybersecurity_fundamentals">Cybersecurity</option>
              <option value="cloud_computing">Cloud Computing</option>
              <option value="study_skills">Study Skills</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">Document Title (Optional)</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="e.g. Advanced Tree Algorithms"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">License</label>
            <input
              type="text"
              value={licenseText}
              onChange={(e) => setLicenseText(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              disabled={isUploading || !fileToUpload}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-md"
            >
              {isUploading ? 'Chunking & Ingesting...' : 'Ingest Document'}
            </button>
          </div>

        </form>
      </div>

      {/* Documents Table */}
      <div className="glass-panel rounded-2xl overflow-hidden space-y-4 p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Active Corpus Documents ({documents.length})</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Chunks</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-medium text-white">
                    {doc.title}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    {doc.document_type}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-slate-900 px-2 py-0.5 rounded font-mono text-brand-300 border border-slate-800">
                      {doc.chunk_count} chunks
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      doc.status === 'active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => viewDocDetails(doc.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                      title="Inspect Chunks"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleDocStatus(doc.id, doc.status)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                        doc.status === 'active'
                          ? 'bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300'
                          : 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800'
                      }`}
                    >
                      {doc.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chunk Inspection Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl bg-[#0f172a] border border-slate-800 rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">{previewDoc.title}</h3>
                <p className="text-[11px] text-slate-400">Total Chunks: {previewDoc.chunks.length}</p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {previewDoc.chunks.map((c: any) => (
                <div key={c.id} className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                    <span className="text-brand-400 font-bold">Sequence #{c.chunk_sequence}: {c.section}</span>
                    <span>Tokens: {c.token_count}</span>
                  </div>
                  <p className="text-slate-300 font-mono text-[11px] leading-relaxed bg-slate-950 p-2.5 rounded-lg">
                    {c.raw_text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
