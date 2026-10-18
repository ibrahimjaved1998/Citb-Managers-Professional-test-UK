import React from 'react';
import { INITIAL_EXAM_RESULT } from '../data/mockData.ts';

interface AnalyticsViewProps {
  onStartExam: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ onStartExam }) => {
  const result = INITIAL_EXAM_RESULT;

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4 py-4 gap-4 pb-28">
      {/* Overview Metric Cards */}
      <section className="bg-primary-container text-white p-4 rounded-xl shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-secondary-fixed-dim tracking-wider">
              CITB MAP Readiness Index
            </span>
            <h2 className="text-2xl font-bold font-headline mt-0.5">82.4% Overall</h2>
            <p className="text-xs text-surface-container-highest mt-0.5">
              Target for certified test booking: 90%
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">trending_up</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/60 uppercase">Completed</span>
            <span className="text-sm font-bold text-white mt-0.5">19 / 23 Units</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/60 uppercase">Study Streak</span>
            <span className="text-sm font-bold text-secondary-fixed-dim mt-0.5">
              12 Days 🔥
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/60 uppercase">Avg Speed</span>
            <span className="text-sm font-bold text-white mt-0.5">41s / Question</span>
          </div>
        </div>
      </section>

      {/* Domain Competency Diagnostics */}
      <section className="bg-surface-container-lowest p-4 rounded-xl shadow-xs border border-surface-container flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-on-surface font-headline">
            Domain Competency Audit
          </h3>
          <span className="text-[10px] font-bold text-secondary uppercase">
            Updated Today
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {result.diagnostics.map((diag) => (
            <div key={diag.domainKey} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-on-surface font-semibold">{diag.title}</span>
                <span className="font-bold text-on-surface">{diag.percentage}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    diag.percentage >= 90
                      ? 'bg-on-tertiary-container'
                      : 'bg-secondary-container'
                  }`}
                  style={{ width: `${diag.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action CTA */}
      <button
        type="button"
        onClick={onStartExam}
        className="w-full h-12 bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-[0.99] cursor-pointer font-headline"
      >
        <span className="material-symbols-outlined text-[20px]">assignment</span>
        <span>Launch Full Practice Mock Exam</span>
      </button>
    </div>
  );
};
