export interface Citation {
  citation_key: string;
  document_id?: string;
  chunk_id?: string;
  title: string;
  source_name?: string;
  author?: string;
  section?: string;
  page_number?: number;
  url?: string;
  license?: string;
  excerpt?: string;
}

export interface Confidence {
  score: number;
  label: 'high' | 'medium' | 'low' | 'insufficient';
  explanation?: string;
}

export interface QuizQuestion {
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject?: string;
  topic_tag?: string;
  source_citation?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  key_points?: string[];
  example?: string;
  quiz?: QuizQuestion[];
  sources?: Citation[];
  confidence?: Confidence;
  follow_up_suggestions?: string[];
  resolved_intent?: string;
  subject?: string;
  created_at?: string;
}

export interface SessionItem {
  id: string;
  title: string;
  subject?: string;
  learner_level: string;
  created_at: string;
}

export interface SourceRegistryItem {
  id: string;
  name: string;
  base_url?: string;
  authority_level: string;
  authority_score: number;
  license_notes?: string;
  active: boolean;
  document_count: number;
}

export interface SubjectItem {
  id: number;
  slug: string;
  display_name: string;
  description?: string;
  active: boolean;
  document_count: number;
}

export interface DocumentItem {
  id: string;
  source_id?: string;
  subject_id?: number;
  title: string;
  author?: string;
  document_type: string;
  source_url?: string;
  license?: string;
  status: string;
  created_at: string;
  chunk_count: number;
}
