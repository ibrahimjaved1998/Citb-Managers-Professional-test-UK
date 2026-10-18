import React, { useState } from 'react';
import type { DomainKey, ModuleItem } from '../types/index.ts';
import { MODULES_DATA } from '../data/mockData.ts';

interface ModulesViewProps {
  onSelectModule: (module: ModuleItem) => void;
  onStartExam: () => void;
  onOpenAuditLog: () => void;
  onLaunchGame?: () => void;
  onLaunchAI?: () => void;
}

export const ModulesView: React.FC<ModulesViewProps> = ({
  onSelectModule,
  onStartExam,
  onOpenAuditLog,
  onLaunchGame,
  onLaunchAI,
}) => {
  const [activeDomain, setActiveDomain] = useState<DomainKey>('all');

  const domainTabs: { key: DomainKey; label: string; icon?: string }[] = [
    { key: 'all', label: 'All 23 Modules', icon: 'grid_view' },
    { key: 'legal', label: '1. Legal & CDM (5)' },
    { key: 'health', label: '2. Health & Welfare (5)' },
    { key: 'general', label: '3. General Safety (5)' },
    { key: 'highrisk', label: '4. High Risk (8)' },
  ];

  const domainsMeta: {
    key: DomainKey;
    title: string;
    stats: string;
  }[] = [
    {
      key: 'legal',
      title: 'Domain 1: Legal & Management',
      stats: '5 MODULES • 92% MASTERY',
    },
    {
      key: 'health',
      title: 'Domain 2: Health & Welfare',
      stats: '5 MODULES • 85% MASTERY',
    },
    {
      key: 'general',
      title: 'Domain 3: General Safety',
      stats: '5 MODULES • 79% MASTERY',
    },
    {
      key: 'highrisk',
      title: 'Domain 4: High Risk & Environment',
      stats: '8 MODULES • 80% MASTERY',
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto pb-24">
      {/* Interactive Readiness Banner */}
      <section className="px-4 pt-4 pb-2">
        <div className="bg-primary-container text-on-primary rounded-xl p-4 shadow-md relative overflow-hidden">
          {/* Decorative schematic corner grid */}
          <div className="absolute -right-8 -bottom-8 w-36 h-36 opacity-10 pointer-events-none">
            <svg
              className="w-full h-full stroke-surface fill-none stroke-2"
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="45" strokeDasharray="4 2" />
              <polygon points="50,15 85,75 15,75" />
              <path d="M20 50 L80 50 M50 20 L50 80" />
            </svg>
          </div>

          <div className="flex items-center justify-between gap-4 relative z-10">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-secondary-container text-on-secondary-fixed">
                  <span className="material-symbols-outlined text-[14px]">shield</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-secondary-fixed-dim">
                  MAP Certification Target
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white font-headline">
                Exam Readiness
              </h2>
              <p className="text-xs text-surface-container-highest mt-0.5">
                Passing benchmark is 90% (45/50)
              </p>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[16px] text-secondary-container">
                    local_fire_department
                  </span>
                  <span className="text-xs text-white font-semibold">12-Day Streak</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-fixed-dim">
                    verified
                  </span>
                  <span className="text-xs text-white font-semibold">19/23 Done</span>
                </div>
              </div>
            </div>

            {/* 82% Circular Gauge Visual */}
            <div className="relative shrink-0 flex items-center justify-center w-24 h-24">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 88 88">
                <circle
                  className="text-white/15"
                  cx="44"
                  cy="44"
                  fill="transparent"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-secondary-container"
                  cx="44"
                  cy="44"
                  fill="transparent"
                  r="36"
                  stroke="currentColor"
                  strokeDasharray="226.19"
                  strokeDashoffset="40.71"
                  strokeLinecap="round"
                  strokeWidth="8"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl text-white font-extrabold tracking-tighter leading-none">
                  82<span className="text-secondary-fixed-dim text-xs font-bold">%</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-surface-container-highest mt-0.5">
                  Readiness
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action CTA */}
          <button
            type="button"
            onClick={onStartExam}
            className="w-full mt-4 h-12 bg-secondary-container hover:bg-secondary-fixed-dim active:scale-[0.99] text-on-secondary-fixed text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-transform cursor-pointer font-headline"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_circle
            </span>
            <span>Start 50-Question Daily Mock Exam</span>
          </button>
        </div>

        {/* Interactive Feature Banners: 3D Game & AI Studio */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
          {onLaunchGame && (
            <div
              onClick={onLaunchGame}
              className="bg-primary-container text-white p-3.5 rounded-xl shadow-xs border border-white/10 hover:border-secondary-container transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-fixed flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">sports_esports</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-headline text-white">Hazard Hunter 3D</span>
                    <span className="px-1.5 py-0.2 bg-[#4edea3] text-[#002113] rounded text-[9px] font-extrabold uppercase">3D Game</span>
                  </div>
                  <p className="text-[11px] text-surface-container-highest">
                    Interactive site inspection simulation
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]">
                arrow_forward
              </span>
            </div>
          )}

          {onLaunchAI && (
            <div
              onClick={onLaunchAI}
              className="bg-surface-container text-on-surface p-3.5 rounded-xl shadow-xs border border-surface-container-high hover:border-primary-container transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-primary-container text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">movie</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold font-headline text-on-surface">AI Media Studio</span>
                    <span className="px-1.5 py-0.2 bg-secondary-container text-on-secondary-fixed rounded text-[9px] font-extrabold uppercase">Veo 3</span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    Video generation &amp; image editor
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px]">
                arrow_forward
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Quick Filter / Tabs */}
      <section className="px-4 pt-2 pb-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          {domainTabs.map((tab) => {
            const isActive = activeDomain === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveDomain(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-white shadow-sm'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.icon && (
                  <span className="material-symbols-outlined text-[15px]">
                    {tab.icon}
                  </span>
                )}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Module List Content */}
      <div className="px-4 space-y-4">
        {domainsMeta.map((domain) => {
          if (activeDomain !== 'all' && activeDomain !== domain.key) return null;

          const modulesInDomain = MODULES_DATA.filter((m) => m.domainKey === domain.key);

          return (
            <div key={domain.key} className="space-y-3">
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-container" />
                  <h3 className="text-base font-bold text-on-surface font-headline">
                    {domain.title}
                  </h3>
                </div>
                <span className="text-[10px] text-on-surface-variant uppercase font-semibold tracking-wider">
                  {domain.stats}
                </span>
              </div>

              {/* Module Cards */}
              {modulesInDomain.map((module) => {
                const isMastered = module.mastery >= 85;
                const isCompletedQuestions =
                  module.questionsAnswered === module.totalQuestions;

                return (
                  <article
                    key={module.id}
                    className="bg-surface-container-lowest rounded-xl p-4 shadow-sm relative overflow-hidden transition-all hover:shadow-md border border-surface-container/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Video Thumbnail with duration */}
                        <div
                          className="relative shrink-0 w-20 h-16 rounded-lg overflow-hidden bg-primary-container cursor-pointer group"
                          onClick={() => onSelectModule(module)}
                        >
                          <img
                            src={module.thumbnail}
                            alt={module.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-sm text-white text-[9px] px-1 py-0.5 rounded font-bold">
                            {module.duration}
                          </span>
                        </div>

                        {/* Title & Metadata */}
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-secondary uppercase font-bold tracking-wide">
                              {module.videoTag}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-outline-variant" />
                            <span className="text-[11px] text-on-surface-variant font-medium">
                              {module.series}
                            </span>
                          </div>
                          <h4
                            onClick={() => onSelectModule(module)}
                            className="text-sm font-bold text-on-surface truncate mt-0.5 font-headline hover:text-secondary transition-colors cursor-pointer"
                          >
                            {module.title}
                          </h4>
                          <p className="text-xs text-on-surface-variant truncate">
                            {module.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Mastery Badge */}
                      <span
                        className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-bold ${
                          isMastered
                            ? 'bg-tertiary-container text-tertiary-fixed'
                            : 'bg-secondary-container text-on-secondary-fixed'
                        }`}
                      >
                        {module.mastery}%
                      </span>
                    </div>

                    {/* Bottom Action Ribbon */}
                    <div className="mt-3 pt-3 flex items-center justify-between bg-surface-container-low -mx-4 -mb-4 px-4 py-2.5 rounded-b-xl border-t border-surface-container/40">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`material-symbols-outlined text-[16px] ${
                            isCompletedQuestions
                              ? 'text-on-tertiary-container'
                              : 'text-secondary'
                          }`}
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {isCompletedQuestions ? 'check_circle' : 'pending'}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          Questions:{' '}
                          <strong className="text-on-surface font-semibold">
                            {module.questionsAnswered}/{module.totalQuestions}
                          </strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectModule(module)}
                          className="px-3 py-1 rounded-lg bg-surface-container text-on-surface text-xs font-bold flex items-center gap-1 hover:bg-surface-container-high transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            smart_display
                          </span>
                          <span>Watch</span>
                        </button>
                        <button
                          type="button"
                          onClick={onStartExam}
                          className="px-3 py-1 rounded-lg bg-primary-container text-white text-xs font-bold flex items-center gap-1 hover:opacity-90 transition-opacity cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[15px]">
                            quiz
                          </span>
                          <span>Quiz</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          );
        })}

        {/* Syllabus Completion Summary Card */}
        <div className="bg-surface-container rounded-xl p-4 flex items-center justify-between gap-2 mt-4 border border-surface-container-high shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-container text-secondary-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">
                workspace_premium
              </span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface font-headline">
                Official CITB Question Bank
              </h4>
              <p className="text-xs text-on-surface-variant">
                All 23 video units calibrated to 2025 MAP standards
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAuditLog}
            className="shrink-0 px-3 py-1.5 rounded-lg bg-surface-container-highest text-on-surface text-xs font-bold hover:bg-surface-variant transition-colors cursor-pointer shadow-xs"
          >
            Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};
