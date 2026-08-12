import { useState, useCallback } from 'react';
import type { STTField } from './useSTT';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CardType = 'yes-no' | 'chips';

export interface InterviewCard {
  id: string;
  question: string;
  /** Contextual sub-prompt shown in small text below the question */
  hint?: string;
  type: CardType;
  /** Only for 'chips' type */
  options?: string[];
}

export interface CardAnswer {
  cardId: string;
  /** 'yes'/'no' for yes-no cards; the selected option label for chip cards */
  value: string;
  /** Voice-recognized chips on this card (may be empty) */
  spokenChips: STTField[];
}

export interface AIInterviewHook {
  cards: InterviewCard[];
  currentIndex: number;
  answers: CardAnswer[];
  isComplete: boolean;
  advance: (value: string, spokenChips?: STTField[]) => void;
  /** Navigate back to a previous card for editing (clears answers from that index) */
  goTo: (index: number) => void;
  correctSpokenChip: (cardId: string, fieldId: string, newLabel: string) => void;
}

// ─── Fixture question bank ────────────────────────────────────────────────────
// Swap this for a real LLM-driven adaptive question generator later.

export const INTERVIEW_CARDS: InterviewCard[] = [
  {
    id: 'q1',
    question: '두통이 언제부터 시작됐나요?',
    hint: '발병 시기를 최대한 정확하게 알려주세요.',
    type: 'chips',
    options: ['오늘', '어제', '3일 전', '1주일 전', '1개월 이상'],
  },
  {
    id: 'q2',
    question: '통증 강도는 어떤가요?',
    hint: '일상생활에 지장을 주는 정도를 기준으로 선택해 주세요.',
    type: 'chips',
    options: ['경증', '중등증', '중증'],
  },
  {
    id: 'q3',
    question: '오한이나 발열이 동반되나요?',
    type: 'yes-no',
  },
  {
    id: 'q4',
    question: '언제 통증이 더 심해지나요?',
    type: 'chips',
    options: ['아침', '낮', '저녁', '밤', '특정 없음'],
  },
  {
    id: 'q5',
    question: '구역이나 현기증이 있나요?',
    type: 'yes-no',
  },
  {
    id: 'q6',
    question: '최근 스트레스가 많았나요?',
    type: 'yes-no',
  },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAIInterview(): AIInterviewHook {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<CardAnswer[]>([]);

  const isComplete = currentIndex >= INTERVIEW_CARDS.length;

  const advance = useCallback(
    (value: string, spokenChips: STTField[] = []) => {
      const cardId = INTERVIEW_CARDS[currentIndex]?.id;
      if (!cardId) return;

      setAnswers((prev) => {
        const existing = prev.findIndex((a) => a.cardId === cardId);
        const entry: CardAnswer = { cardId, value, spokenChips };
        if (existing >= 0) {
          const next = [...prev];
          next[existing] = entry;
          return next;
        }
        return [...prev, entry];
      });

      setCurrentIndex((i) => i + 1);
    },
    [currentIndex],
  );

  const goTo = useCallback((index: number) => {
    const cardId = INTERVIEW_CARDS[index]?.id;
    if (!cardId) return;

    setAnswers((prev) => {
      const cut = prev.findIndex((a) => a.cardId === cardId);
      return cut >= 0 ? prev.slice(0, cut) : prev;
    });
    setCurrentIndex(index);
  }, []);

  const correctSpokenChip = useCallback(
    (cardId: string, fieldId: string, newLabel: string) => {
      setAnswers((prev) =>
        prev.map((a) =>
          a.cardId === cardId
            ? {
                ...a,
                spokenChips: a.spokenChips.map((f) =>
                  f.id === fieldId ? { ...f, label: newLabel, confidence: 1 } : f,
                ),
              }
            : a,
        ),
      );
    },
    [],
  );

  return {
    cards: INTERVIEW_CARDS,
    currentIndex,
    answers,
    isComplete,
    advance,
    goTo,
    correctSpokenChip,
  };
}
