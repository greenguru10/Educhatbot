import { ChatMessage, Citation, Flashcard, QuizQuestion, SessionItem, SourceRegistryItem, SubjectItem, DocumentItem } from '../types';

const API_BASE = '/api/v1';

export const apiClient = {
  async health() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async sendChat(params: {
    message: string;
    session_id?: string;
    user_id?: string;
    subject?: string;
    learner_level?: string;
    response_style?: string;
  }) {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error(`Chat error: ${res.statusText}`);
    return res.json();
  },

  async getSessions(user_id?: string): Promise<SessionItem[]> {
    const url = user_id ? `${API_BASE}/sessions?user_id=${encodeURIComponent(user_id)}` : `${API_BASE}/sessions`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
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
    const res = await fetch(`${API_BASE}/sources`);
    if (!res.ok) return [];
    return res.json();
  },

  async getSubjects(): Promise<SubjectItem[]> {
    const res = await fetch(`${API_BASE}/subjects`);
    if (!res.ok) return [];
    return res.json();
  },

  async getDocuments(): Promise<DocumentItem[]> {
    const res = await fetch(`${API_BASE}/documents`);
    if (!res.ok) return [];
    return res.json();
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
    const res = await fetch(`${API_BASE}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer_id, rating, comment }),
    });
    return res.json();
  }
};
