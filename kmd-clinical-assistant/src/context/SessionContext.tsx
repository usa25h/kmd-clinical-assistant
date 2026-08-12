import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { CardAnswer } from '../hooks/useAIInterview';
import type { BodyPin } from '../hooks/useBodyMap';
import type { DiagnosticPattern, AcupointRecommendation } from '../hooks/useClinicalReasoning';

export interface PulseFindings {
  buChim: number;
  jiSak: number;
  heoSil: number;
}

export interface SessionState {
  chiefComplaints: string[];
  tongueFindings: string[];
  pulse: PulseFindings;
  interviewAnswers: CardAnswer[];
  bodyMapPins: BodyPin[];
  diagnosticPatterns: DiagnosticPattern[];
  recommendedAcupoints: AcupointRecommendation[];
}

type SessionAction =
  | {
      type: 'SET_CHIEF_COMPLAINT';
      complaints: string[];
      tongue: string[];
      pulse: PulseFindings;
    }
  | { type: 'SET_INTERVIEW_ANSWERS'; answers: CardAnswer[] }
  | { type: 'SET_BODY_MAP_PINS'; pins: BodyPin[] }
  | {
      type: 'SET_REASONING';
      patterns: DiagnosticPattern[];
      acupoints: AcupointRecommendation[];
    }
  | { type: 'RESET' };

const INITIAL: SessionState = {
  chiefComplaints: [],
  tongueFindings: [],
  pulse: { buChim: 0, jiSak: 0, heoSil: 0 },
  interviewAnswers: [],
  bodyMapPins: [],
  diagnosticPatterns: [],
  recommendedAcupoints: [],
};

function reducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SET_CHIEF_COMPLAINT':
      return {
        ...state,
        chiefComplaints: action.complaints,
        tongueFindings: action.tongue,
        pulse: action.pulse,
      };
    case 'SET_INTERVIEW_ANSWERS':
      return { ...state, interviewAnswers: action.answers };
    case 'SET_BODY_MAP_PINS':
      return { ...state, bodyMapPins: action.pins };
    case 'SET_REASONING':
      return {
        ...state,
        diagnosticPatterns: action.patterns,
        recommendedAcupoints: action.acupoints,
      };
    case 'RESET':
      return INITIAL;
    default:
      return state;
  }
}

interface SessionContextValue {
  session: SessionState;
  dispatch: React.Dispatch<SessionAction>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, dispatch] = useReducer(reducer, INITIAL);
  return (
    <SessionContext.Provider value={{ session, dispatch }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be inside SessionProvider');
  return ctx;
}
