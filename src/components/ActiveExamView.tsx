import React, { useState, useEffect } from 'react';
import type { ExamQuestion } from '../types/index.ts';
import { MOCK_EXAM_QUESTIONS, ASSETS } from '../data/mockData.ts';
import { formatTime } from '../utils/examEngine.ts';

interface ActiveExamViewProps {
  onBack: () => void;
  onSubmitExam: () => void;
  initialQuestionIndex?: number;
}

export const ActiveExamView: React.FC<ActiveExamViewProps> = ({
  onSubmitExam,
  initialQuestionIndex = 0,
}) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(initialQuestionIndex);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, 'A' | 'B' | 'C' | 'D'>>({
    19: 'B', // pre-selected B as shown in screenshot 3
  });
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([4, 12, 19, 25, 28]);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(32 * 60 + 12);

  // Active question
  const currentQuestion: ExamQuestion =
    MOCK_EXAM_QUESTIONS[currentQuestionIdx] || MOCK_EXAM_QUESTIONS[0];
  const questionNumber = currentQuestion.number;

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectOption = (optionId: 'A' | 'B' | 'C' | 'D') => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionNumber]: optionId,
    }));
  };

  const handleToggleFlag = () => {
    setFlaggedQuestions((prev) =>
      prev.includes(questionNumber)
        ? prev.filter((n) => n !== questionNumber)
        : [...prev, questionNumber]
    );
  };

  const isCurrentFlagged = flaggedQuestions.includes(questionNumber);
  const currentSelectedOption = selectedAnswers[questionNumber];

  const handleNext = () => {
    if (currentQuestionIdx < MOCK_EXAM_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Reached end of sample questions, submit exam
      onSubmitExam();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-32">
      {/* Top Telemetry & Precision Progress Bar */}
      <section className="w-full bg-surface-container-low px-4 py-2.5 shadow-xs sticky top-16 z-20 border-b border-surface-container/60">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-primary text-white text-[10px] uppercase font-bold tracking-wider">
              CITB MAP
            </span>
            <span className="text-xs text-on-surface-variant font-semibold">
              Question {questionNumber} of 50
            </span>
          </div>

          {/* Precision Countdown Timer */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container shadow-xs border border-surface-container-high">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-container opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary-fixed-dim" />
            </span>
            <span className="material-symbols-outlined text-secondary text-[18px]">
              timer
            </span>
            <span className="text-sm font-bold text-on-surface tracking-tight font-mono">
              {formatTime(remainingSeconds)}
            </span>
          </div>
        </div>

        {/* Segmented Industrial Metric Bar */}
        <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden flex">
          <div
            className="h-full bg-secondary-container transition-all duration-300"
            style={{ width: `${(questionNumber / 50) * 100}%` }}
          />
        </div>
      </section>

      {/* Main Question Canvas */}
      <section className="flex flex-col px-4 pt-4 gap-4 w-full">
        {/* Regulation Badge & Context Tracker */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-inverse-surface text-inverse-on-surface text-[10px] font-bold tracking-wider uppercase">
              {currentQuestion.topicTag || 'HSG47 PROTOCOL'}
            </span>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[10px] font-semibold">
              {currentQuestion.regCode || 'CDM 2015 Reg 22'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span className="text-xs font-medium">High-Risk Trenching</span>
          </div>
        </div>

        {/* Industrial Incident Visual Anchor */}
        <div className="relative w-full h-40 rounded-xl overflow-hidden shadow-sm bg-surface-container-high border border-surface-container">
          <img
            src={currentQuestion.image || ASSETS.activeExamTrench}
            alt="Excavation site incident"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-3">
            <div className="flex items-center gap-1.5 text-white">
              <span
                className="material-symbols-outlined text-secondary-fixed-dim text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
              <span className="text-[11px] uppercase tracking-wider text-surface-container-low font-bold">
                {currentQuestion.alertBadge || 'Unidentified Live Service Alert'}
              </span>
            </div>
          </div>
        </div>

        {/* Technical Scenario Statement */}
        <article className="bg-surface-container-lowest p-4 rounded-xl shadow-xs flex flex-col gap-1.5 border border-surface-container">
          <div className="flex items-center gap-1.5 text-secondary">
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              gavel
            </span>
            <span className="text-[11px] uppercase tracking-wider font-bold">
              {currentQuestion.scenarioTitle || 'Mandatory Statutory Procedure'}
            </span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-on-surface leading-snug font-headline">
            {currentQuestion.scenarioText}
          </h2>
        </article>

        {/* Interactive Option Selector Cards */}
        <fieldset className="flex flex-col gap-2 w-full">
          <legend className="sr-only">Choose the correct immediate procedure</legend>
          {currentQuestion.options.map((opt) => {
            const isSelected = currentSelectedOption === opt.id;
            return (
              <label
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`cursor-pointer flex items-start gap-3 p-3.5 rounded-xl transition-all relative overflow-hidden group border shadow-xs ${
                  isSelected
                    ? 'bg-surface-container border-secondary-container ring-1 ring-secondary-container'
                    : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
                }`}
              >
                <input
                  type="radio"
                  name={`citb_q${questionNumber}`}
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => handleSelectOption(opt.id)}
                  className="sr-only"
                />

                {/* Option Letter Tag */}
                <div
                  className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                    isSelected
                      ? 'bg-primary text-white'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {opt.id}
                </div>

                {/* Option Content Text */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p
                    className={`text-xs sm:text-sm text-on-surface leading-relaxed ${
                      isSelected ? 'font-semibold text-on-surface' : 'font-normal'
                    }`}
                  >
                    {opt.text}
                  </p>
                </div>

                {/* Checkbox indicator */}
                <div
                  className={`w-5 h-5 rounded shrink-0 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-secondary-container text-on-secondary-fixed'
                      : 'bg-surface-container-high text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] font-bold">
                    check
                  </span>
                </div>
              </label>
            );
          })}
        </fieldset>

        {/* Delight Feedback Pill */}
        {currentQuestion.tip && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-surface-container-high text-on-surface-variant border border-surface-container-highest">
            <span
              className="material-symbols-outlined text-secondary text-[20px] shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lightbulb
            </span>
            <span className="text-xs leading-relaxed">
              <strong className="text-on-surface">Tip:</strong> {currentQuestion.tip}
            </span>
          </div>
        )}
      </section>

      {/* Collapsible Question Matrix Drawer */}
      {isMatrixOpen && (
        <div className="fixed inset-x-0 bottom-20 z-40 bg-surface-container-lowest shadow-2xl max-h-96 rounded-t-2xl p-4 flex flex-col border-t border-surface-container max-w-2xl mx-auto animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-surface-container">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-on-surface font-headline">
                Exam Telemetry Grid
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface">
                50 Total
              </span>
            </div>
            <button
              type="button"
              aria-label="Close question matrix"
              onClick={() => setIsMatrixOpen(false)}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Status Legend */}
          <div className="flex items-center gap-4 py-2 text-on-surface-variant text-[11px]">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span>Answered (18)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
              <span>Flagged (3)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-surface-container-high" />
              <span>Skipped (29)</span>
            </div>
          </div>

          {/* Matrix Cells Grid (50 questions) */}
          <div className="grid grid-cols-10 gap-1.5 overflow-y-auto py-2 max-h-56 pr-1">
            {Array.from({ length: 50 }, (_, i) => i + 1).map((qNum) => {
              const isCurrent = qNum === questionNumber;
              const isAnswered = qNum < 19 || selectedAnswers[qNum] !== undefined;
              const isFlagged = flaggedQuestions.includes(qNum);

              let cellClass = 'bg-surface-container text-on-surface-variant';
              if (isCurrent) {
                cellClass =
                  'bg-secondary-fixed-dim text-on-secondary-fixed font-bold shadow-sm ring-2 ring-secondary';
              } else if (isFlagged) {
                cellClass = 'bg-secondary-container text-on-secondary-fixed font-bold';
              } else if (isAnswered) {
                cellClass = 'bg-primary text-white font-semibold';
              }

              return (
                <button
                  key={qNum}
                  type="button"
                  onClick={() => {
                    const foundIdx = MOCK_EXAM_QUESTIONS.findIndex(
                      (q) => q.number === qNum
                    );
                    if (foundIdx >= 0) {
                      setCurrentQuestionIdx(foundIdx);
                    }
                    setIsMatrixOpen(false);
                  }}
                  className={`h-8 rounded text-xs flex items-center justify-center transition-all hover:opacity-85 cursor-pointer ${cellClass}`}
                >
                  {qNum}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Industrial Fixed Action Toolbar */}
      <footer className="fixed bottom-0 inset-x-0 z-30 bg-surface-container-lowest/95 backdrop-blur-md px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] border-t border-surface-container flex items-center justify-between gap-2 max-w-2xl mx-auto w-full pb-safe">
        {/* Flag Button */}
        <button
          type="button"
          aria-label={isCurrentFlagged ? 'Unflag question' : 'Flag question for review'}
          onClick={handleToggleFlag}
          className={`h-12 px-3.5 rounded-xl transition-colors flex items-center gap-1.5 active:translate-y-0.5 cursor-pointer shrink-0 ${
            isCurrentFlagged
              ? 'bg-secondary-container text-on-secondary-fixed font-bold'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={{
              fontVariationSettings: isCurrentFlagged ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            bookmark
          </span>
          <span className="text-xs font-semibold hidden sm:inline">
            {isCurrentFlagged ? 'Flagged' : 'Flag'}
          </span>
        </button>

        {/* Grid Matrix Toggle */}
        <button
          type="button"
          aria-label="Open Question Palette"
          onClick={() => setIsMatrixOpen(!isMatrixOpen)}
          className="h-12 px-3.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-2 active:translate-y-0.5 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-[20px] text-secondary">
            grid_view
          </span>
          <span className="text-xs font-bold font-mono">{questionNumber}/50</span>
        </button>

        {/* Paging / Navigation Controls */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentQuestionIdx === 0}
            className="h-12 px-3 rounded-xl bg-surface-container text-on-surface text-xs font-semibold hover:bg-surface-container-high transition-colors flex items-center gap-1 active:translate-y-0.5 disabled:opacity-40 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            <span className="hidden xs:inline">Prev</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="h-12 px-5 rounded-xl bg-secondary-container text-on-secondary-fixed text-xs sm:text-sm font-bold shadow-xs hover:bg-secondary-fixed-dim transition-all flex items-center gap-1.5 active:translate-y-0.5 cursor-pointer font-headline"
          >
            <span>{currentQuestionIdx === MOCK_EXAM_QUESTIONS.length - 1 ? 'Finish Exam' : 'Next'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
