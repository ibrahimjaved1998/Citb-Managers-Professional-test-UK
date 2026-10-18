import React from 'react';
import { ASSETS } from '../data/mockData.ts';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  onLaunchGame?: () => void;
  onLaunchAI?: () => void;
  unreadNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  onLaunchGame,
  onLaunchAI,
  unreadNotifications = true,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#f8f9ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 min-w-0">
          {showBack ? (
            <button
              type="button"
              aria-label="Back"
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center text-on-surface rounded-xl hover:bg-surface-container-high active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
          ) : (
            <img
              alt="BuildPass CSCS Logo"
              className="h-8 w-auto object-contain"
              src={ASSETS.logo}
            />
          )}

          <div className="flex flex-col min-w-0">
            {!showBack && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] tracking-wider uppercase text-on-surface font-bold truncate">
                  BUILDPASS MAP
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[9px] font-bold uppercase tracking-widest leading-none">
                  CITB
                </span>
              </div>
            )}
            <h1 className="text-base font-bold text-on-surface truncate leading-tight font-headline">
              {title}
            </h1>
            {subtitle && (
              <span className="text-xs text-on-surface-variant truncate">{subtitle}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onLaunchGame && !showBack && (
            <button
              type="button"
              onClick={onLaunchGame}
              title="Launch Hazard Hunter 3D Game"
              className="h-9 px-2.5 rounded-xl bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed text-xs font-bold flex items-center gap-1 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">sports_esports</span>
              <span className="hidden sm:inline">3D Game</span>
            </button>
          )}

          {onLaunchAI && !showBack && (
            <button
              type="button"
              onClick={onLaunchAI}
              title="Open Veo 3 & Nano Banana Studio"
              className="h-9 px-2.5 rounded-xl bg-primary-container text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:opacity-90 transition-transform active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">movie</span>
              <span className="hidden sm:inline">AI Studio</span>
            </button>
          )}

          {!showBack && (
            <button
              type="button"
              aria-label="Notifications"
              className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface relative rounded-xl transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadNotifications && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary-container ring-2 ring-surface"></span>
              )}
            </button>
          )}

          <div className="relative flex items-center justify-center pl-0.5">
            <img
              alt="Site Manager Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container-high"
              src={ASSETS.avatar}
            />
            <span className="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[8px] font-bold px-1 py-0.2 rounded-full leading-tight uppercase shadow-sm">
              SM
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
