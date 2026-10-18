import { useState, useEffect } from 'react';
import type { ModuleItem } from './types/index.ts';
import { MODULES_DATA } from './data/mockData.ts';
import { Header } from './components/Header.tsx';
import { BottomNav, type NavTab } from './components/BottomNav.tsx';
import { ModulesView } from './components/ModulesView.tsx';
import { ModuleDetailView } from './components/ModuleDetailView.tsx';
import { ActiveExamView } from './components/ActiveExamView.tsx';
import { ExamResultsView } from './components/ExamResultsView.tsx';
import { AnalyticsView } from './components/AnalyticsView.tsx';
import { ReviewView } from './components/ReviewView.tsx';
import { VideoPlayerModal } from './components/VideoPlayerModal.tsx';
import { AIStudioView } from './components/AIStudioView.tsx';
import { HazardHunterGame } from './game/HazardHunterGame.tsx';

type ScreenState = 'modules' | 'module_detail' | 'active_exam' | 'exam_results' | 'game';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('modules');
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('modules');
  const [selectedModule, setSelectedModule] = useState<ModuleItem>(
    MODULES_DATA.find((m) => m.number === 16) || MODULES_DATA[0]
  );
  const [videoModal, setVideoModal] = useState<{
    isOpen: boolean;
    title: string;
    timestamp: string;
    tutorNote?: string;
  }>({
    isOpen: false,
    title: '',
    timestamp: '',
    tutorNote: '',
  });

  // Handle URL query parameters for fast verification testing (?screen=... or ?autostart=1)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const screenParam = params.get('screen');
    const autostart = params.get('autostart');

    if (screenParam === 'module_detail') {
      setCurrentScreen('module_detail');
    } else if (screenParam === 'active_exam' || autostart === '1') {
      setCurrentScreen('active_exam');
      setActiveNavTab('mock-exam');
    } else if (screenParam === 'exam_results') {
      setCurrentScreen('exam_results');
    } else if (screenParam === 'game') {
      setCurrentScreen('game');
    } else if (screenParam === 'ai_studio') {
      setActiveNavTab('ai-studio');
      setCurrentScreen('modules');
    }
  }, []);

  const handleSelectModule = (mod: ModuleItem) => {
    setSelectedModule(mod);
    setCurrentScreen('module_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartExam = () => {
    setCurrentScreen('active_exam');
    setActiveNavTab('mock-exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuditLog = () => {
    setCurrentScreen('exam_results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchGame = () => {
    setCurrentScreen('game');
  };

  const handleLaunchAI = () => {
    setActiveNavTab('ai-studio');
    setCurrentScreen('modules');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavTabChange = (tab: NavTab) => {
    setActiveNavTab(tab);
    if (tab === 'modules') {
      setCurrentScreen('modules');
    } else if (tab === 'mock-exam') {
      setCurrentScreen('active_exam');
    } else {
      setCurrentScreen('modules');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenVideo = (title: string, timestamp: string, note?: string) => {
    setVideoModal({
      isOpen: true,
      title,
      timestamp,
      tutorNote: note,
    });
  };

  // If game is active, render full-viewport Game Shell without website headers or footers!
  if (currentScreen === 'game') {
    return (
      <HazardHunterGame
        onExit={() => {
          setCurrentScreen('modules');
          setActiveNavTab('modules');
        }}
      />
    );
  }

  // Compute header title & back button behavior
  let headerTitle = 'Modules';
  let showBack = false;

  if (activeNavTab === 'ai-studio') {
    headerTitle = 'AI Media Studio';
  } else if (activeNavTab === 'analytics') {
    headerTitle = 'Analytics & Readiness';
  } else if (activeNavTab === 'review') {
    headerTitle = 'Statutory Review';
  } else if (currentScreen === 'module_detail') {
    headerTitle = 'MODULE DETAIL';
    showBack = true;
  } else if (currentScreen === 'active_exam') {
    headerTitle = 'ACTIVE EXAM SESSION';
    showBack = true;
  } else if (currentScreen === 'exam_results') {
    headerTitle = 'EXAM RESULT SUMMARY';
    showBack = true;
  }

  const handleBack = () => {
    if (currentScreen === 'module_detail') {
      setCurrentScreen('modules');
      setActiveNavTab('modules');
    } else if (currentScreen === 'active_exam') {
      setCurrentScreen('modules');
      setActiveNavTab('modules');
    } else if (currentScreen === 'exam_results') {
      setCurrentScreen('modules');
      setActiveNavTab('modules');
    } else {
      setCurrentScreen('modules');
      setActiveNavTab('modules');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showBottomNav =
    currentScreen === 'modules' ||
    activeNavTab === 'analytics' ||
    activeNavTab === 'review' ||
    activeNavTab === 'ai-studio';

  return (
    <div className="bg-surface font-body text-on-surface flex flex-col min-h-screen relative">
      {/* Top Header */}
      <Header
        title={headerTitle}
        showBack={showBack}
        onBack={handleBack}
        onLaunchGame={handleLaunchGame}
        onLaunchAI={handleLaunchAI}
      />

      {/* Main Body View */}
      <main className="flex-1 pt-16">
        {activeNavTab === 'ai-studio' ? (
          <AIStudioView />
        ) : activeNavTab === 'analytics' ? (
          <AnalyticsView onStartExam={handleStartExam} />
        ) : activeNavTab === 'review' ? (
          <ReviewView
            onSelectModule={(num) => {
              const m = MODULES_DATA.find((item) => item.number === num);
              if (m) handleSelectModule(m);
            }}
            onOpenVideo={handleOpenVideo}
          />
        ) : currentScreen === 'modules' ? (
          <ModulesView
            onSelectModule={handleSelectModule}
            onStartExam={handleStartExam}
            onOpenAuditLog={handleOpenAuditLog}
            onLaunchGame={handleLaunchGame}
            onLaunchAI={handleLaunchAI}
          />
        ) : currentScreen === 'module_detail' ? (
          <ModuleDetailView
            module={selectedModule}
            onBack={handleBack}
            onTakeTest={handleStartExam}
          />
        ) : currentScreen === 'active_exam' ? (
          <ActiveExamView
            onBack={handleBack}
            onSubmitExam={handleOpenAuditLog}
          />
        ) : currentScreen === 'exam_results' ? (
          <ExamResultsView
            onReturnToModules={() => {
              setCurrentScreen('modules');
              setActiveNavTab('modules');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRetakeMissed={() => {
              setCurrentScreen('active_exam');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : null}
      </main>

      {/* Persistent Bottom Nav Bar when browsing high-level views */}
      {showBottomNav && (
        <BottomNav activeTab={activeNavTab} onTabChange={handleNavTabChange} />
      )}

      {/* Global Video Modal */}
      <VideoPlayerModal
        isOpen={videoModal.isOpen}
        title={videoModal.title}
        timestamp={videoModal.timestamp}
        tutorNote={videoModal.tutorNote}
        onClose={() => setVideoModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
