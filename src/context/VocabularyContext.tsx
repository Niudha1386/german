import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  VocabularyItem, 
  UserProgressState, 
  StudyStatus, 
  UserWordProgress,
  SourceType,
  CategoryType
} from '../types/vocabulary';
import { INITIAL_VOCABULARY } from '../data/initialVocabulary';

interface VocabularyContextType {
  vocabulary: VocabularyItem[];
  userProgress: UserProgressState;
  
  // Progress Actions
  setWordStatus: (wordId: string, status: StudyStatus) => void;
  toggleStarWord: (wordId: string) => void;
  setWordNotes: (wordId: string, notes: string) => void;
  recordQuizResult: (wordId: string, isCorrect: boolean) => void;
  
  // Vocabulary CRUD & Import Actions
  addVocabularyItem: (item: Omit<VocabularyItem, 'id'>) => void;
  updateVocabularyItem: (item: VocabularyItem) => void;
  deleteVocabularyItem: (id: string) => void;
  importVocabularyBatch: (items: VocabularyItem[], mergeDuplicates?: boolean) => { added: number; merged: number };
  exportDatabaseJson: () => string;
  resetToDefaults: () => void;
  
  // Stats helpers
  getLessonStats: (lessonNum: number) => {
    total: number;
    lehrbuchCount: number;
    hoertexteCount: number;
    bothSourcesCount: number;
    learned: number;
    review: number;
    unseen: number;
    percentage: number;
  };
  getGlobalStats: () => {
    totalWords: number;
    learnedWords: number;
    reviewWords: number;
    unseenWords: number;
    completionPercentage: number;
    totalStarred: number;
  };
}

const STORAGE_KEY_VOCAB = 'aspekte_b1plus_vocab_v13';
const STORAGE_KEY_PROGRESS = 'aspekte_b1plus_progress_v13';

const defaultProgress: UserProgressState = {
  words: {},
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalQuizzesTaken: 0,
};

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export const VocabularyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(() => {
    if (typeof window === 'undefined') return INITIAL_VOCABULARY;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_VOCAB);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_VOCABULARY.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load vocabulary from localStorage', e);
    }
    return INITIAL_VOCABULARY;
  });

  const [userProgress, setUserProgress] = useState<UserProgressState>(() => {
    if (typeof window === 'undefined') return defaultProgress;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load progress from localStorage', e);
    }
    return defaultProgress;
  });

  // Persist vocabulary changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VOCAB, JSON.stringify(vocabulary));
    } catch (e) {
      console.error('Failed to save vocabulary', e);
    }
  }, [vocabulary]);

  // Persist progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(userProgress));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  }, [userProgress]);

  // Status updates
  const setWordStatus = (wordId: string, status: StudyStatus) => {
    setUserProgress((prev) => {
      const current = prev.words[wordId] || {
        status: 'unseen',
        studyCount: 0,
        correctCount: 0,
        incorrectCount: 0,
      };

      return {
        ...prev,
        words: {
          ...prev.words,
          [wordId]: {
            ...current,
            status,
            lastStudiedAt: Date.now(),
            studyCount: current.studyCount + 1,
          },
        },
      };
    });
  };

  const toggleStarWord = (wordId: string) => {
    setUserProgress((prev) => {
      const current = prev.words[wordId] || {
        status: 'unseen',
        studyCount: 0,
        correctCount: 0,
        incorrectCount: 0,
      };

      return {
        ...prev,
        words: {
          ...prev.words,
          [wordId]: {
            ...current,
            isStarred: !current.isStarred,
          },
        },
      };
    });
  };

  const setWordNotes = (wordId: string, notes: string) => {
    setUserProgress((prev) => {
      const current = prev.words[wordId] || {
        status: 'unseen',
        studyCount: 0,
        correctCount: 0,
        incorrectCount: 0,
      };

      return {
        ...prev,
        words: {
          ...prev.words,
          [wordId]: {
            ...current,
            notes,
          },
        },
      };
    });
  };

  const recordQuizResult = (wordId: string, isCorrect: boolean) => {
    setUserProgress((prev) => {
      const current = prev.words[wordId] || {
        status: 'unseen',
        studyCount: 0,
        correctCount: 0,
        incorrectCount: 0,
      };

      const newCorrect = isCorrect ? current.correctCount + 1 : current.correctCount;
      const newIncorrect = !isCorrect ? current.incorrectCount + 1 : current.incorrectCount;
      const newStatus: StudyStatus = isCorrect 
        ? (current.status === 'learned' || newCorrect >= 2 ? 'learned' : 'learning')
        : 'review';

      return {
        ...prev,
        totalQuizzesTaken: prev.totalQuizzesTaken + 1,
        words: {
          ...prev.words,
          [wordId]: {
            ...current,
            status: newStatus,
            correctCount: newCorrect,
            incorrectCount: newIncorrect,
            studyCount: current.studyCount + 1,
            lastStudiedAt: Date.now(),
          },
        },
      };
    });
  };

  // Add / Edit / Delete
  const addVocabularyItem = (itemData: Omit<VocabularyItem, 'id'>) => {
    const newId = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newItem: VocabularyItem = {
      ...itemData,
      id: newId,
      dateAdded: new Date().toISOString(),
    };
    setVocabulary((prev) => [newItem, ...prev]);
  };

  const updateVocabularyItem = (updatedItem: VocabularyItem) => {
    setVocabulary((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const deleteVocabularyItem = (id: string) => {
    setVocabulary((prev) => prev.filter((item) => item.id !== id));
  };

  // Duplicate-aware Batch Importer
  const importVocabularyBatch = (items: VocabularyItem[], mergeDuplicates = true) => {
    let added = 0;
    let merged = 0;

    setVocabulary((prevList) => {
      const updatedList = [...prevList];

      items.forEach((newItem) => {
        // Normalization key for matching
        const normNewGerman = newItem.german.trim().toLowerCase().replace(/^(der|die|das)\s+/, '');

        const existingIdx = updatedList.findIndex((item) => {
          const normExisting = item.german.trim().toLowerCase().replace(/^(der|die|das)\s+/, '');
          return normExisting === normNewGerman && item.category === newItem.category;
        });

        if (existingIdx !== -1 && mergeDuplicates) {
          // Merge source and details into existing record
          const existing = updatedList[existingIdx];
          const combinedSources = Array.from(new Set([...existing.sources, ...newItem.sources])) as SourceType[];
          const combinedDetails = [...existing.sourceDetails, ...(newItem.sourceDetails || [])];

          updatedList[existingIdx] = {
            ...existing,
            sources: combinedSources,
            sourceDetails: combinedDetails,
            // Keep richer examples if available
            example: existing.example || newItem.example,
            exampleTranslation: existing.exampleTranslation || newItem.exampleTranslation,
            audioUrl: existing.audioUrl || newItem.audioUrl,
            pronunciation: existing.pronunciation || newItem.pronunciation,
          };
          merged += 1;
        } else {
          // Add as new item
          const validId = newItem.id || `vocab-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          updatedList.push({
            ...newItem,
            id: validId,
          });
          added += 1;
        }
      });

      return updatedList;
    });

    return { added, merged };
  };

  const exportDatabaseJson = () => {
    return JSON.stringify(vocabulary, null, 2);
  };

  const resetToDefaults = () => {
    setVocabulary(INITIAL_VOCABULARY);
    setUserProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY_VOCAB);
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
  };

  // Stats calculation
  const getLessonStats = (lessonNum: number) => {
    const lessonWords = vocabulary.filter((v) => v.lesson === lessonNum);
    const total = lessonWords.length;
    if (total === 0) {
      return {
        total: 0,
        lehrbuchCount: 0,
        hoertexteCount: 0,
        bothSourcesCount: 0,
        learned: 0,
        review: 0,
        unseen: 0,
        percentage: 0,
      };
    }

    let lehrbuchCount = 0;
    let hoertexteCount = 0;
    let bothSourcesCount = 0;
    let learned = 0;
    let review = 0;
    let unseen = 0;

    lessonWords.forEach((word) => {
      const hasLehrbuch = word.sources.includes('Lehrbuch');
      const hasHoertexte = word.sources.includes('Hörtexte');

      if (hasLehrbuch && hasHoertexte) {
        bothSourcesCount += 1;
        lehrbuchCount += 1;
        hoertexteCount += 1;
      } else if (hasLehrbuch) {
        lehrbuchCount += 1;
      } else if (hasHoertexte) {
        hoertexteCount += 1;
      }

      const p = userProgress.words[word.id]?.status || 'unseen';
      if (p === 'learned') learned += 1;
      else if (p === 'review') review += 1;
      else unseen += 1;
    });

    const percentage = total > 0 ? Math.round((learned / total) * 100) : 0;

    return {
      total,
      lehrbuchCount,
      hoertexteCount,
      bothSourcesCount,
      learned,
      review,
      unseen,
      percentage,
    };
  };

  const getGlobalStats = () => {
    const totalWords = vocabulary.length;
    let learnedWords = 0;
    let reviewWords = 0;
    let unseenWords = 0;
    let totalStarred = 0;

    vocabulary.forEach((word) => {
      const wordProg = userProgress.words[word.id];
      const status = wordProg?.status || 'unseen';
      if (status === 'learned') learnedWords += 1;
      else if (status === 'review') reviewWords += 1;
      else unseenWords += 1;

      if (wordProg?.isStarred) totalStarred += 1;
    });

    const completionPercentage = totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;

    return {
      totalWords,
      learnedWords,
      reviewWords,
      unseenWords,
      completionPercentage,
      totalStarred,
    };
  };

  return (
    <VocabularyContext.Provider
      value={{
        vocabulary,
        userProgress,
        setWordStatus,
        toggleStarWord,
        setWordNotes,
        recordQuizResult,
        addVocabularyItem,
        updateVocabularyItem,
        deleteVocabularyItem,
        importVocabularyBatch,
        exportDatabaseJson,
        resetToDefaults,
        getLessonStats,
        getGlobalStats,
      }}
    >
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabulary = () => {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
};
