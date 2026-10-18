import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatTime,
  checkExamPassStatus,
  calculateExamScore,
  calculateDomainDiagnostics,
  filterReviewQuestions,
} from './examEngine.ts';
import type { ExamQuestion } from '../types/index.ts';

const mockQuestions: ExamQuestion[] = [
  {
    id: 'q1',
    number: 1,
    totalQuestions: 3,
    domainKey: 'legal',
    domainName: 'Legal & Management',
    regCode: 'CDM 2015',
    topicTag: 'Roles',
    scenarioTitle: 'Principal Designer Duties',
    scenarioText: 'What is the principal designer responsible for?',
    options: [
      { id: 'A', text: 'Option A' },
      { id: 'B', text: 'Option B' },
    ],
    correctOptionId: 'B',
    rationale: 'Reason B',
  },
  {
    id: 'q2',
    number: 2,
    totalQuestions: 3,
    domainKey: 'health',
    domainName: 'Health & Welfare',
    regCode: 'Asbestos Regs',
    topicTag: 'Hazardous Materials',
    scenarioTitle: 'Asbestos R&D Survey',
    scenarioText: 'When is survey needed?',
    options: [
      { id: 'A', text: 'Visual check' },
      { id: 'C', text: 'UKAS Survey' },
    ],
    correctOptionId: 'C',
    rationale: 'Reason C',
  },
  {
    id: 'q3',
    number: 3,
    totalQuestions: 3,
    domainKey: 'highrisk',
    domainName: 'High Risk',
    regCode: 'HSG47',
    topicTag: 'Trenching',
    scenarioTitle: 'Unmapped Gas Conduits',
    scenarioText: 'What is immediate action?',
    options: [
      { id: 'A', text: 'Hand digging' },
      { id: 'B', text: 'Halt and evacuate' },
    ],
    correctOptionId: 'B',
    rationale: 'Reason B',
  },
];

test('formatTime formats seconds accurately into mm:ss', () => {
  assert.equal(formatTime(0), '00:00');
  assert.equal(formatTime(65), '01:05');
  assert.equal(formatTime(1932), '32:12');
  assert.equal(formatTime(2052), '34:12');
});

test('checkExamPassStatus enforces 90% benchmark', () => {
  assert.equal(checkExamPassStatus(45, 50, 90), true);
  assert.equal(checkExamPassStatus(47, 50, 90), true);
  assert.equal(checkExamPassStatus(44, 50, 90), false);
  assert.equal(checkExamPassStatus(40, 50, 90), false);
});

test('calculateExamScore calculates correct score, percentage, and misses', () => {
  const userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'> = {
    1: 'B', // correct
    2: 'A', // incorrect (expected C)
    3: 'B', // correct
  };
  const result = calculateExamScore(mockQuestions, userAnswers);
  assert.equal(result.score, 2);
  assert.equal(result.total, 3);
  assert.equal(result.percentage, 66.7);
  assert.deepEqual(result.incorrectQuestionNumbers, [2]);
});

test('calculateDomainDiagnostics tallies scores per domain', () => {
  const userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'> = {
    1: 'B',
    2: 'A',
    3: 'B',
  };
  const diagnostics = calculateDomainDiagnostics(mockQuestions, userAnswers);
  const legal = diagnostics.find((d) => d.domainKey === 'legal');
  const health = diagnostics.find((d) => d.domainKey === 'health');
  const highrisk = diagnostics.find((d) => d.domainKey === 'highrisk');

  assert.equal(legal?.score, 1);
  assert.equal(legal?.total, 1);
  assert.equal(legal?.isPerfect, true);

  assert.equal(health?.score, 0);
  assert.equal(health?.total, 1);
  assert.equal(health?.percentage, 0);

  assert.equal(highrisk?.score, 1);
  assert.equal(highrisk?.total, 1);
  assert.equal(highrisk?.isPerfect, true);
});

test('filterReviewQuestions handles all, incorrect, and flagged modes', () => {
  const userAnswers: Record<number, 'A' | 'B' | 'C' | 'D'> = {
    1: 'B',
    2: 'A',
    3: 'B',
  };
  const flagged = [3];

  const all = filterReviewQuestions(mockQuestions, userAnswers, flagged, 'all');
  assert.equal(all.length, 3);

  const incorrect = filterReviewQuestions(mockQuestions, userAnswers, flagged, 'incorrect');
  assert.equal(incorrect.length, 1);
  assert.equal(incorrect[0].number, 2);

  const flaggedList = filterReviewQuestions(mockQuestions, userAnswers, flagged, 'flagged');
  assert.equal(flaggedList.length, 1);
  assert.equal(flaggedList[0].number, 3);
});
