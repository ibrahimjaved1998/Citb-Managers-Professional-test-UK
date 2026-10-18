import React from 'react';

export type NavTab = 'modules' | 'mock-exam' | 'analytics' | 'review' | 'ai-studio';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    {
      id: 'modules' as NavTab,
      label: 'Modules',
      icon: 'subscriptions',
    },
    {
      id: 'mock-exam' as NavTab,
      label: 'Mock Exam',
      icon: 'assignment',
    },
    {
      id: 'ai-studio' as NavTab,
      label: 'AI Studio',
      icon: 'auto_awesome',
    },
    {
      id: 'analytics' as NavTab,
      label: 'Analytics',
      icon: 'insights',
    },
    {
      id: 'review' as NavTab,
      label: 'Review',
      icon: 'bookmarks',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 w-full z-50 pb-safe bg-[#f8f9ff]/85 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)] border-t border-surface-container"
      aria-label="Main Navigation"
    >
      <div className="flex justify-around items-center h-16 px-2 max-w-3xl mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-h-[44px] transition-colors cursor-pointer ${
                isActive
                  ? 'text-primary-container font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className={`material-symbols-outlined text-[24px] ${
                  isActive ? 'font-bold' : ''
                }`}
                style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
