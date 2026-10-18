import type { ExamQuestion, DomainDiagnostic, DomainKey } from '../types/index.ts';

/**
 * Formats elapsed seconds into mm:ss display
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(Math.max(0, seconds) / 60);
  const secs = Math.floor(Math.max(0, seconds) % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Checks if a candidate passes the CITB MAP certification benchmark (minimum 45/50 or 90%)
 */
export function checkExamPassStatus(score: number, total: number = 50, benchmarkPercent: number = 90): boolean {
  if (total <= 0) return false;
  const percentage = (score / total) * 100;
  return percentage >= benchmarkPercent;
}

/**
 * Computes overall score and breakdown from questions and user answers
 */
export function calculateExamScore(
  questions: ExamQuestion[],
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>
): {
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  incorrectQuestionNumbers: number[];
} {
  const total = questions.length;
  let score = 0;
  const incorrectQuestionNumbers: number[] = [];

  questions.forEach((q) => {
    const selected = userAnswers[q.number];
    if (selected && selected === q.correctOptionId) {
      score += 1;
    } else {
      incorrectQuestionNumbers.push(q.number);
    }
  });

  const percentage = total > 0 ? Math.round((score / total) * 100 * 10) / 10 : 0;
  const passed = checkExamPassStatus(score, total, 90);

  return {
    score,
    total,
    percentage,
    passed,
    incorrectQuestionNumbers,
  };
}

/**
 * Calculates domain level performance breakdown
 */
export function calculateDomainDiagnostics(
  questions: ExamQuestion[],
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>
): DomainDiagnostic[] {
  const domainMap: Record<
    string,
    { key: DomainKey; title: string; score: number; total: number }
  > = {
    legal: { key: 'legal', title: 'Legal & Management (CDM 2015)', score: 0, total: 0 },
    health: { key: 'health', title: 'Health & Welfare (Hazardous Substances)', score: 0, total: 0 },
    general: { key: 'general', title: 'General Safety & Site Plant Operations', score: 0, total: 0 },
    highrisk: { key: 'highrisk', title: 'High Risk Activities (Work at Height, Demolition)', score: 0, total: 0 },
  };

  questions.forEach((q) => {
    const domainObj = domainMap[q.domainKey];
    if (domainObj) {
      domainObj.total += 1;
      if (userAnswers[q.number] === q.correctOptionId) {
        domainObj.score += 1;
      }
    }
  });

  return Object.values(domainMap).map((item) => {
    const percentage = item.total > 0 ? Math.round((item.score / item.total) * 100) : 0;
    return {
      domainKey: item.key,
      title: item.title,
      score: item.score,
      total: item.total,
      percentage,
      isPerfect: item.score === item.total && item.total > 0,
    };
  });
}

/**
 * Filters question list for the audit review screen based on tab
 */
export function filterReviewQuestions(
  questions: ExamQuestion[],
  userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'>,
  flaggedQuestionNumbers: number[],
  filterType: 'all' | 'incorrect' | 'flagged'
): ExamQuestion[] {
  return questions.filter((q) => {
    if (filterType === 'all') return true;
    if (filterType === 'incorrect') {
      return userAnswers[q.number] !== q.correctOptionId;
    }
    if (filterType === 'flagged') {
      return flaggedQuestionNumbers.includes(q.number);
    }
    return true;
  });
}
