export enum AppMode {
  SOURCES = 'SOURCES',
  SUMMARY = 'SUMMARY',
  FLASHCARDS = 'FLASHCARDS',
  MINDMAP = 'MINDMAP',
  QUIZ = 'QUIZ',
  ANALYTICS = 'ANALYTICS',
  RESEARCH = 'RESEARCH',
  ERRORS = 'ERRORS'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro';
}

export interface DriveFile {
  id: string;
  name: string;
  area: string;
  type: 'video' | 'pdf' | 'text';
  date: string;
  transcript?: string;
}

export interface ClassStudyMaterial {
  fileId: string;
  summary: SummaryData | null;
  flashcards: Flashcard[];
  mindMap: MindMapNode | null;
  quizQuestions: QuizQuestion[];
  lastAccessed: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  status: 'new' | 'learning' | 'mastered';
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

export interface QuizFilters {
  specialty: string;
  institution: string;
  difficulty: string;
  count: number;
}

export interface QuizQuestion {
  id: string;
  category: string;
  institution?: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizResult {
  category: string;
  isCorrect: boolean;
  timestamp: number;
}

export interface AnalyticsData {
  category: string;
  correct: number;
  total: number;
  score: number;
}

export interface SearchResults {
  explanation: string;
  relevantFileIds: string[];
}

export interface SummaryData {
  title: string;
  topic: string;
  sections: {
    type: 'concept' | 'clinical' | 'diagnosis' | 'treatment' | 'warning';
    title: string;
    content: string[];
  }[];
  examPearls: string[];
}