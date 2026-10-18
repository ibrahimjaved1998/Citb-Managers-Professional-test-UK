import React, { useState } from 'react';
import { ASSETS } from '../data/mockData.ts';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  timestamp: string;
  tutorNote?: string;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  title,
  timestamp,
  tutorNote = 'Pay close attention to statutory requirements, mandatory inspection schedules, and certified dutyholder responsibilities.',
}) => {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-primary-container/80 backdrop-blur-sm flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
    >
      <div className="w-full sm:max-w-lg bg-surface-container-lowest rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 bg-primary text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="material-symbols-outlined text-secondary-container text-[24px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_circle
            </span>
            <div className="truncate">
              <h4
                id="video-modal-title"
                className="text-sm font-bold text-on-primary truncate font-headline"
              >
                {title}
              </h4>
              <span className="text-[11px] text-on-primary-container">
                Jumped to {timestamp}
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close video player"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-on-primary/10 hover:bg-on-primary/20 flex items-center justify-center text-on-primary transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Video Viewport Frame */}
        <div className="relative bg-black w-full aspect-video flex items-center justify-center overflow-hidden">
          <img
            className="w-full h-full object-cover opacity-85"
            src={ASSETS.videoModalSnapshot}
            alt="Technical training lecture on UK construction safety regulations"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-4">
            <span className="self-start px-2 py-0.5 rounded bg-secondary-container text-on-secondary-fixed text-[10px] font-bold uppercase tracking-wider">
              Key Regulatory Cue
            </span>

            {/* Big Center Play / Pause Button */}
            <div className="flex items-center justify-center w-full">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center shadow-lg active:scale-95 transition-transform hover:brightness-105 cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-[32px] ml-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>
            </div>

            {/* Scrubber Timeline with Amber Hazard Cue */}
            <div className="flex flex-col gap-1 w-full">
              <div className="relative w-full h-2 bg-white/30 rounded-full cursor-pointer flex items-center">
                <div
                  className="h-full bg-secondary-container rounded-full"
                  style={{ width: '62%' }}
                />
                <div className="absolute left-[62%] -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-secondary-container shadow-md border-2 border-primary" />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-white/90">
                <span>{timestamp}</span>
                <span>24:18</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tutor Commentary Note & Close CTA */}
        <div className="p-4 flex flex-col gap-2 bg-surface-container-lowest">
          <div className="flex items-center gap-1.5 text-on-surface font-semibold text-xs">
            <span className="material-symbols-outlined text-secondary text-[16px]">
              school
            </span>
            <span>Tutor Explanation Note</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-low p-2.5 rounded-lg border border-surface-container">
            &ldquo;{tutorNote}&rdquo;
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-sm font-bold transition-colors cursor-pointer"
          >
            Close Player
          </button>
        </div>
      </div>
    </div>
  );
};
