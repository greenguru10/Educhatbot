import { ChatMessage, Citation, Flashcard, QuizQuestion, SessionItem, SourceRegistryItem, SubjectItem, DocumentItem } from '../types';

const getApiBase = (): string => {
  try {
    let url = (import.meta as any)?.env?.VITE_API_BASE_URL;
    if (url && typeof url === 'string') {
      url = url.trim().replace(/\/+$/, '');
      if (!url.endsWith('/api/v1') && !url.includes('/api/v1')) {
        url = `${url}/api/v1`;
      }
      return url;
    }
  } catch {}
  return '/api/v1';
};

const API_BASE = getApiBase();

export const apiClient = {
  async health() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) return { status: 'offline' };
      return res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  async sendChat(params: {
    message: string;
    session_id?: string;
    user_id?: string;
    subject?: string;
    learner_level?: string;
    response_style?: string;
  }) {
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        let errorDetail = '';
        try {
          const errData = await res.json();
          errorDetail = errData.detail || errData.message || JSON.stringify(errData);
        } catch {
          errorDetail = await res.text();
        }
        throw new Error(`Server returned HTTP ${res.status} (${res.statusText || 'Error'}): ${errorDetail || 'Please check backend logs.'}`);
      }
      return res.json();
    } catch (err: any) {
      if (err.message && err.message.startsWith('Server returned')) {
        throw err;
      }
      throw new Error(`Cannot connect to backend (${API_BASE}). If Render is cold-starting, please wait ~30 seconds and retry.`);
    }
  },

  async getSessions(user_id?: string): Promise<SessionItem[]> {
    try {
      const url = user_id ? `${API_BASE}/sessions?user_id=${encodeURIComponent(user_id)}` : `${API_BASE}/sessions`;
      const res = await fetch(url);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },

  async getSession(id: string) {
    const res = await fetch(`${API_BASE}/sessions/${id}`);
    if (!res.ok) throw new Error('Failed to load session');
    return res.json();
  },

  async generateQuiz(params: {
    topic: string;
    subject?: string;
    learner_level?: string;
    question_count?: number;
  }): Promise<QuizQuestion[]> {
    const res = await fetch(`${API_BASE}/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate quiz');
    return res.json();
  },

  async generateFlashcards(params: {
    topic: string;
    subject?: string;
    learner_level?: string;
    card_count?: number;
  }): Promise<{ cards: Flashcard[] }> {
    const res = await fetch(`${API_BASE}/flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to generate flashcards');
    return res.json();
  },

  async getSources(): Promise<SourceRegistryItem[]> {
    try {
      const res = await fetch(`${API_BASE}/sources`);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },

  async getSubjects(): Promise<SubjectItem[]> {
    try {
      const res = await fetch(`${API_BASE}/subjects`);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },

  async getDocuments(): Promise<DocumentItem[]> {
    try {
      const res = await fetch(`${API_BASE}/documents`);
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  },

  async getDocumentDetail(id: string) {
    const res = await fetch(`${API_BASE}/documents/${id}`);
    if (!res.ok) throw new Error('Failed to load document');
    return res.json();
  },

  async uploadDocument(formData: FormData) {
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Upload failed');
    return res.json();
  },

  async updateDocumentStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Update failed');
    return res.json();
  },

  async reindexCorpus() {
    const res = await fetch(`${API_BASE}/documents/reindex`, {
      method: 'POST',
    });
    return res.json();
  },

  async submitFeedback(answer_id: string, rating: number, comment?: string) {
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer_id, rating, comment }),
      });
      return res.json();
    } catch {
      return { status: 'skipped' };
    }
  }
};
