import React, { useState, useEffect } from 'react';
import { GeminiHeader, AppTab } from './components/GeminiHeader';
import { GeminiLiveVoice } from './components/GeminiLiveVoice';
import { GeminiChat } from './components/GeminiChat';
import { SpeakingScoreLab } from './components/SpeakingScoreLab';
import { PronunciationChallengesView } from './components/PronunciationChallengesView';
import { SpeakingScoreModal } from './components/SpeakingScoreModal';
import { ChatMessage, DetailedEvaluation, UserLevel, VoiceOption, ConversationScenario } from './types/gemini';
import { SCENARIOS } from './data/geminiData';

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('live-voice');
  const [userLevel, setUserLevel] = useState<UserLevel>('B1');
  const [voice, setVoice] = useState<VoiceOption>('Kore');
  const [scenario, setScenario] = useState<ConversationScenario>('alltag');
  const [evaluationModal, setEvaluationModal] = useState<DetailedEvaluation | null>(null);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  // Dark Mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('gemini_dark_mode');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('gemini_dark_mode', String(darkMode));
  }, [darkMode]);

  // Initial Scenario messages generator
  const getInitialMessages = (sc: ConversationScenario): ChatMessage[] => {
    const scInfo = SCENARIOS.find((s) => s.id === sc) || SCENARIOS[0];
    return [
      {
        id: `init-${sc}-${Date.now()}`,
        role: 'assistant',
        textGerman: scInfo.initialPromptDe,
        textPersian: scInfo.initialPromptFa,
        timestamp: Date.now(),
        suggestedReplies: [
          { german: 'Guten Tag! Ich freue mich, mein Deutsch zu üben.', persian: 'روز بخیر! خوشحالم که آلمانی‌ام را تمرین می‌کنم.' },
          { german: 'Können wir über mein Lieblingsthema sprechen?', persian: 'می‌توانیم درباره موضوع مورد علاقه من صحبت کنیم؟' },
        ],
        keyVocabulary: [
          { german: 'das Gespräch', persian: 'گفتگو، مکالمه', type: 'Nomen' },
          { german: 'üben', persian: 'تمرین کردن', type: 'Verb' },
        ],
      },
    ];
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialMessages('alltag'));

  // Update conversation when scenario changes
  const handleScenarioChange = (newScenario: ConversationScenario) => {
    setScenario(newScenario);
    setMessages(getInitialMessages(newScenario));
  };

  const handleAddMessage = (msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleResetChat = () => {
    if (window.confirm('آیا مایلید این مکالمه بازنشانی شده و از ابتدا آغاز شود؟')) {
      setMessages(getInitialMessages(scenario));
    }
  };

  const handleOpenEvaluationModal = (evalData: DetailedEvaluation) => {
    setEvaluationModal(evalData);
    setIsScoreModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors selection:bg-blue-500/20 selection:text-blue-500">
      {/* Top Header */}
      <GeminiHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userLevel={userLevel}
        onLevelChange={setUserLevel}
        voice={voice}
        onVoiceChange={setVoice}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onResetChat={handleResetChat}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {activeTab === 'live-voice' && (
          <GeminiLiveVoice
            messages={messages}
            onAddMessage={handleAddMessage}
            userLevel={userLevel}
            voice={voice}
            scenario={scenario}
            onScenarioChange={handleScenarioChange}
            onOpenEvaluation={handleOpenEvaluationModal}
            onSwitchToChat={() => setActiveTab('chat')}
          />
        )}

        {activeTab === 'chat' && (
          <GeminiChat
            messages={messages}
            onAddMessage={handleAddMessage}
            userLevel={userLevel}
            voice={voice}
            scenario={scenario}
            onScenarioChange={handleScenarioChange}
            onOpenEvaluation={handleOpenEvaluationModal}
          />
        )}

        {activeTab === 'speaking-lab' && (
          <SpeakingScoreLab userLevel={userLevel} voice={voice} />
        )}

        {activeTab === 'challenges' && (
          <PronunciationChallengesView voice={voice} />
        )}
      </main>

      {/* Speaking Evaluation Breakdown Modal */}
      <SpeakingScoreModal
        isOpen={isScoreModalOpen}
        evaluation={evaluationModal}
        onClose={() => setIsScoreModalOpen(false)}
      />
    </div>
  );
}

export default App;
