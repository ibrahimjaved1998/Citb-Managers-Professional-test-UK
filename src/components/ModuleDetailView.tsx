import React, { useState } from 'react';
import type { ModuleItem } from '../types/index.ts';
import { ASSETS, MODULES_DATA } from '../data/mockData.ts';

interface ModuleDetailViewProps {
  module?: ModuleItem;
  onBack: () => void;
  onTakeTest: () => void;
}

export const ModuleDetailView: React.FC<ModuleDetailViewProps> = ({
  module = MODULES_DATA.find((m) => m.number === 16) || MODULES_DATA[0],
  onTakeTest,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<string | null>(null);

  const chapters = module.chapters || [
    {
      id: 'ch-1',
      timestamp: '00:00',
      seconds: 0,
      title: '00:00 Trench Collapse Hazards & Soil Pressures',
      status: 'completed',
    },
    {
      id: 'ch-2',
      timestamp: '04:30',
      seconds: 270,
      title: '04:30 Shoring Solutions & Trench Boxes',
      status: 'completed',
    },
    {
      id: 'ch-3',
      timestamp: '11:15',
      seconds: 675,
      title: '11:15 Underground Utilities & CAT Scanners',
      status: 'playing',
    },
    {
      id: 'ch-4',
      timestamp: '17:40',
      seconds: 1060,
      title: '17:40 Daily Inspections & Competent Person',
      status: 'upcoming',
    },
  ];

  const legalDuties = module.legalDuties || [
    {
      id: 'duty-1',
      title: 'Written Report within 24 Hours',
      description:
        'The appointed competent person must complete and hand over the formal safety inspection report within 24 hours of examination.',
    },
    {
      id: 'duty-2',
      title: 'Retention Period: 3 Months',
      description:
        'Inspection reports must be kept on site until the project finishes, and subsequently archived for a minimum of 3 months.',
    },
    {
      id: 'duty-3',
      title: 'HSG47 3-Stage Pre-Dig Protocol',
      description:
        '1. Utility plans review → 2. Cable Avoidance Tool (CAT & Genny sweep) → 3. Safe hand digging with blunt tools.',
    },
  ];

  const flashcards = module.flashcards || [
    {
      id: 'fc-1',
      icon: 'landscape',
      tag: 'Soil Angles',
      title: 'Battering & Stepping',
      description:
        'Granular sand/gravel requires safe slope of 1:1 (45°), while stiff cohesive clay may allow steeper profiles after geotechnical sign-off.',
      meta: 'Angle of repose standard',
    },
    {
      id: 'fc-2',
      icon: 'sensors',
      tag: 'HSG47 Signal',
      title: 'Genny Signal Induction',
      description:
        'Passive P & R modes miss inert or dead metallic cables. A Signal Generator (Genny) must be applied to energize buried conductors.',
      meta: 'Dual-frequency sweeping',
    },
    {
      id: 'fc-3',
      icon: 'assignment_turned_in',
      tag: 'PTW System',
      title: 'Permit to Dig Mandate',
      description:
        'Time-bound excavation permit issued strictly by the appointed excavation coordinator before any mechanical tooth breaks ground.',
      meta: 'Valid shift duration only',
    },
  ];

  const videoBannerUrl = module.fullVideoBanner || ASSETS.videoModule16;

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto pb-28">
      {/* Progress Header Ribbon */}
      <div className="px-4 py-2.5 flex items-center justify-between bg-surface-container-low border-b border-surface-container/60">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-primary-container text-white">
            CITB MAP Prep
          </span>
          <span className="text-on-surface-variant text-xs">
            Module {module.number} of 24
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-secondary text-xs font-semibold">
          <span
            className="material-symbols-outlined text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          <span>Accredited HSG47</span>
        </div>
      </div>

      {/* Video Viewport Container */}
      <div className="w-full px-4 py-3">
        <div className="relative w-full rounded-xl overflow-hidden bg-primary-container shadow-md">
          {/* Video Thumbnail Screen */}
          <div
            className="relative aspect-video w-full bg-cover bg-center flex flex-col justify-between p-3"
            style={{ backgroundImage: `url('${videoBannerUrl}')` }}
          >
            {/* Top Video Badges */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
                HD REVISION MASTERCLASS
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/70 backdrop-blur-md text-white text-[10px] font-bold">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                <span>22:45</span>
              </div>
            </div>

            {/* Center Play Overlay Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                aria-label={isPlaying ? 'Pause Lesson Video' : 'Play Lesson Video'}
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-secondary-container text-primary-container flex items-center justify-center shadow-lg transition-transform active:scale-95 hover:brightness-105 cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-[32px] ml-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>

            {/* Scrubber and Controls Drawer */}
            <div className="z-10 w-full pt-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent rounded-b-lg">
              {/* Timeline with Chapter Pins */}
              <div className="relative w-full h-2 bg-white/25 rounded-full cursor-pointer flex items-center">
                <div
                  className="h-full bg-secondary-container rounded-full"
                  style={{ width: '48%' }}
                />
                {/* Chapter Markers */}
                <span
                  className="absolute left-0 w-2.5 h-2.5 rounded-full bg-white shadow-xs"
                  title="00:00 Intro"
                />
                <span
                  className="absolute left-[19.8%] w-2.5 h-2.5 rounded-full bg-secondary-container shadow-xs"
                  title="04:30 Shoring"
                />
                <span
                  className="absolute left-[49.5%] w-3 h-3 rounded-full bg-white ring-2 ring-secondary-container shadow-xs"
                  title="11:15 CAT Scanners"
                />
                <span
                  className="absolute left-[77.7%] w-2.5 h-2.5 rounded-full bg-white shadow-xs"
                  title="17:40 Inspections"
                />
              </div>

              {/* Bottom Micro Control Bar */}
              <div className="flex items-center justify-between mt-2 text-white text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white text-xs">11:15</span>
                  <span className="text-white/60 text-xs">/ 22:45</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Audio Track"
                    className="hover:text-secondary-container transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      volume_up
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Subtitles"
                    className="hover:text-secondary-container transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      closed_caption
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Playback Speed"
                    className="hover:text-secondary-container transition-colors cursor-pointer"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-bold">
                      1.25x
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label="Full Screen"
                    className="hover:text-secondary-container transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      fullscreen
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Chapter Navigator Banner */}
          <div className="p-3 bg-primary-container text-white flex items-center justify-between border-t border-white/10">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded bg-secondary-container text-primary-container flex items-center justify-center text-[10px] font-bold shrink-0">
                CH3
              </span>
              <div className="truncate">
                <p className="text-[10px] text-secondary-fixed-dim uppercase tracking-wider font-bold">
                  Current Topic
                </p>
                <p className="text-xs text-white font-bold truncate">
                  Underground Utilities & CAT Scanners
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowChapters(!showChapters)}
              className="shrink-0 px-2.5 py-1 rounded bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Chapters</span>
              <span className="material-symbols-outlined text-[16px]">
                {showChapters ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>

          {/* Expandable Chapter Timeline Drawer */}
          {showChapters && (
            <div className="divide-y divide-white/10 bg-primary-container text-white text-xs animate-in slide-in-from-top-2 duration-150">
              {chapters.map((ch) => (
                <div
                  key={ch.id}
                  className={`p-2.5 px-3 flex items-center justify-between transition-colors ${
                    ch.status === 'playing'
                      ? 'bg-secondary-container/15 text-secondary-fixed-dim font-semibold'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        ch.status === 'completed'
                          ? 'text-outline'
                          : ch.status === 'playing'
                          ? 'text-secondary-container'
                          : 'text-outline'
                      }`}
                      style={
                        ch.status === 'playing'
                          ? { fontVariationSettings: "'FILL' 1" }
                          : undefined
                      }
                    >
                      {ch.status === 'completed'
                        ? 'check_circle'
                        : ch.status === 'playing'
                        ? 'play_circle'
                        : 'radio_button_unchecked'}
                    </span>
                    <span className="truncate">{ch.title}</span>
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold shrink-0 ml-2 ${
                      ch.status === 'playing'
                        ? 'text-secondary-container'
                        : ch.status === 'completed'
                        ? 'text-outline'
                        : 'text-white/60'
                    }`}
                  >
                    {ch.status === 'playing'
                      ? 'Playing'
                      : ch.status === 'completed'
                      ? 'Completed'
                      : 'Next'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-4 flex flex-col gap-4">
        {/* Title & Module Meta */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-surface-container text-on-surface">
              {module.regCode || 'CDM 2015 / Reg 22'}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-surface-container text-secondary">
              High Exam Weighting
            </span>
          </div>
          <h2 className="text-xl font-bold text-on-surface font-headline leading-tight mt-0.5">
            {module.title}
          </h2>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {module.subtitle}
          </p>
        </div>

        {/* Key Exam Trap Alert Banner */}
        {module.examTrap && (
          <div className="p-3.5 rounded-xl bg-error-container text-on-error-container shadow-xs flex items-start gap-3 border border-error/20">
            <div className="w-8 h-8 rounded-full bg-error text-on-error flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                warning
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wide font-headline">
                  Key Exam Trap
                </span>
                <span className="text-[9px] px-1.5 py-0.5 bg-error text-on-error rounded font-bold uppercase">
                  {module.examTrap.variant}
                </span>
              </div>
              <p className="text-xs text-on-error-container leading-relaxed mt-0.5">
                {module.examTrap.description}
              </p>
            </div>
          </div>
        )}

        {/* Mandatory Legal Duties Bento Card */}
        <div className="p-4 rounded-xl bg-surface-container shadow-xs flex flex-col gap-3 border border-surface-container-high/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="material-symbols-outlined text-secondary text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                gavel
              </span>
              <h3 className="text-sm font-bold text-on-surface font-headline">
                Mandatory Legal Duties
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-white uppercase tracking-wider">
              HSE Enforced
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {legalDuties.map((duty) => (
              <div
                key={duty.id}
                className="p-3 rounded-lg bg-surface-container-lowest shadow-xs flex items-start gap-2.5 border border-surface-container"
              >
                <span
                  className="material-symbols-outlined text-on-tertiary-container text-[20px] shrink-0 mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface font-headline">
                    {duty.title}
                  </span>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed mt-0.5">
                    {duty.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Revision Flashcards Grid */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-on-surface font-headline">
              Flashcard Protocols
            </h3>
            <span className="text-secondary text-xs font-semibold">
              Tap card to inspect
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {flashcards.map((fc) => {
              const isSelected = selectedFlashcard === fc.id;
              return (
                <div
                  key={fc.id}
                  onClick={() =>
                    setSelectedFlashcard(isSelected ? null : fc.id)
                  }
                  className={`p-3 rounded-xl bg-surface-container-lowest shadow-xs flex flex-col justify-between gap-3 border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-secondary-container ring-2 ring-secondary-container/40'
                      : 'border-surface-container hover:border-surface-container-high'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
                      <span className="material-symbols-outlined text-[20px]">
                        {fc.icon}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                      {fc.tag}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface font-headline">
                      {fc.title}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1">
                      {fc.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-secondary text-[10px] font-bold pt-1 border-t border-surface-container-low">
                    <span className="material-symbols-outlined text-[13px]">tune</span>
                    <span>{fc.meta}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Knowledge Readiness Bar */}
        <div className="p-4 rounded-xl bg-surface-container-high shadow-xs flex flex-col gap-2 border border-surface-container-highest">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface font-headline">
              Knowledge Readiness
            </span>
            <span className="text-xs font-bold text-secondary">
              82% Benchmark
            </span>
          </div>
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary-container rounded-full transition-all duration-500"
              style={{ width: '82%' }}
            />
          </div>
          <div className="flex justify-between items-center text-on-surface-variant text-[11px] pt-1">
            <span>Trench Shields: 95%</span>
            <span>Service Tracing: 70%</span>
            <span>CDM Duties: 88%</span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Action Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] border-t border-surface-container pb-safe">
        <div className="max-w-3xl mx-auto flex items-center gap-2.5">
          {/* Bookmark Button */}
          <button
            type="button"
            aria-label={isBookmarked ? 'Remove Bookmark' : 'Save Video Bookmark'}
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer ${
              isBookmarked
                ? 'bg-secondary-container text-on-secondary-fixed'
                : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={
                isBookmarked
                  ? { fontVariationSettings: "'FILL' 1" }
                  : { fontVariationSettings: "'FILL' 0" }
              }
            >
              {isBookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>

          {/* Primary Action CTA */}
          <button
            type="button"
            onClick={onTakeTest}
            className="h-12 flex-1 rounded-xl bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed text-sm font-bold flex items-center justify-center gap-2 shadow-sm active:translate-y-0.5 transition-all cursor-pointer font-headline"
          >
            <span className="material-symbols-outlined text-[20px]">quiz</span>
            <span>Take 15-Question Practice Test</span>
          </button>
        </div>
      </div>
    </div>
  );
};
