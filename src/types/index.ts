export type DomainKey = 'all' | 'legal' | 'health' | 'general' | 'highrisk';

export interface ModuleChapter {
  id: string;
  timestamp: string;
  seconds: number;
  title: string;
  status: 'completed' | 'playing' | 'upcoming';
}

export interface Flashcard {
  id: string;
  icon: string;
  tag: string;
  title: string;
  description: string;
  meta: string;
}

export interface LegalDuty {
  id: string;
  title: string;
  description: string;
}

export interface ModuleItem {
  id: string;
  number: number;
  videoTag: string;
  series: string;
  domainKey: DomainKey;
  domainName: string;
  title: string;
  subtitle: string;
  duration: string;
  mastery: number; // percentage, e.g. 96
  questionsAnswered: number;
  totalQuestions: number;
  thumbnail: string;
  fullVideoBanner?: string;
  regCode?: string;
  isHighWeighting?: boolean;
  examTrap?: {
    variant: string;
    description: string;
  };
  legalDuties?: LegalDuty[];
  flashcards?: Flashcard[];
  chapters?: ModuleChapter[];
  knowledgeReadiness?: {
    overall: number;
    subtopics: { name: string; score: number }[];
  };
}

export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
  isCorrect?: boolean;
}

export interface ExamQuestion {
  id: string;
  number: number;
  totalQuestions: number;
  domainKey: DomainKey;
  domainName: string;
  regCode: string;
  topicTag: string;
  scenarioTitle: string;
  scenarioText: string;
  image?: string;
  alertBadge?: string;
  options: QuestionOption[];
  correctOptionId: 'A' | 'B' | 'C' | 'D';
  rationale: string;
  tip?: string;
  recommendedVideo?: {
    moduleTitle: string;
    videoNumber: number;
    timestamp: string;
    tutorNote?: string;
  };
}

export interface DomainDiagnostic {
  domainKey: DomainKey;
  title: string;
  score: number;
  total: number;
  percentage: number;
  isPerfect: boolean;
}

export interface ExamResultSummary {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  passBenchmark: number; // 90% or 45/50
  timeTakenSeconds: number;
  timeLimitSeconds: number;
  accuracy: number;
  dominantArea: string;
  diagnostics: DomainDiagnostic[];
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>;
  flaggedQuestions: number[];
}
