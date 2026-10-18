import React from 'react';
import { MOCK_EXAM_QUESTIONS, MODULES_DATA } from '../data/mockData.ts';

interface ReviewViewProps {
  onSelectModule: (moduleNumber: number) => void;
  onOpenVideo: (title: string, timestamp: string, note?: string) => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  onSelectModule,
  onOpenVideo,
}) => {
  const highPriorityTraps = MODULES_DATA.filter((m) => m.examTrap);

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 py-4 gap-4 pb-28">
      {/* High-Yield Exam Traps Section */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-secondary text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              warning
            </span>
            <h3 className="text-sm font-bold text-on-surface font-headline">
              Critical Exam Traps &amp; Triggers
            </h3>
          </div>
          <span className="text-[10px] uppercase font-bold text-outline">
            HSE Statutory
          </span>
        </div>

        {highPriorityTraps.map((mod) => (
          <div
            key={mod.id}
            className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-secondary bg-surface-container px-2 py-0.5 rounded">
                {mod.title}
              </span>
              <span className="text-[10px] font-bold text-error bg-error-container px-1.5 py-0.2 rounded">
                {mod.examTrap?.variant}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {mod.examTrap?.description}
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-surface-container/40">
              <span className="text-[10px] text-outline">Reg: {mod.regCode}</span>
              <button
                type="button"
                onClick={() => onSelectModule(mod.number)}
                className="text-xs font-bold text-secondary flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Study Module {mod.number}</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Flagged Question Walkthroughs */}
      <section className="flex flex-col gap-2.5 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-secondary text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              bookmark
            </span>
            <h3 className="text-sm font-bold text-on-surface font-headline">
              Flagged Questions &amp; Rationale
            </h3>
          </div>
          <span className="text-[10px] font-bold text-outline">Active Revision</span>
        </div>

        {MOCK_EXAM_QUESTIONS.map((q) => (
          <div
            key={q.id}
            className="p-3.5 rounded-xl bg-surface-container-lowest border border-surface-container shadow-xs flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded">
                Question {q.number}
              </span>
              <span className="text-[10px] text-outline font-semibold">
                {q.regCode}
              </span>
            </div>
            <p className="text-xs font-semibold text-on-surface leading-snug">
              {q.scenarioText}
            </p>
            <div className="p-2.5 rounded-lg bg-surface-container-low text-xs text-on-surface-variant leading-relaxed border border-surface-container">
              <strong className="text-on-surface">Legal Rationale:</strong> {q.rationale}
            </div>
            {q.recommendedVideo && (
              <button
                type="button"
                onClick={() =>
                  onOpenVideo(
                    q.recommendedVideo!.moduleTitle,
                    q.recommendedVideo!.timestamp,
                    q.recommendedVideo!.tutorNote
                  )
                }
                className="flex items-center justify-between py-1.5 px-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">
                    play_circle
                  </span>
                  <span>
                    Rewatch in {q.recommendedVideo.moduleTitle} (
                    {q.recommendedVideo.timestamp})
                  </span>
                </div>
                <span className="material-symbols-outlined text-[14px]">launch</span>
              </button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};
