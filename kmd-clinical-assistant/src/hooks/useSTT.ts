import { useState, useRef, useCallback } from 'react';

// ─── Public types ────────────────────────────────────────────────────────────

export type STTFieldType = 'body-part' | 'duration' | 'symptom' | 'km-term';

export interface STTField {
  id: string;
  type: STTFieldType;
  label: string;
  /** 0–1 confidence from the STT + NLP pipeline */
  confidence: number;
  /** Up to 3 AI-suggested corrections */
  alternatives: string[];
}

export interface STTHook {
  isRecording: boolean;
  liveTranscript: string;
  extractedFields: STTField[];
  startRecording: () => void;
  stopRecording: () => void;
  /** Replace a field's label (e.g. after user picks a correction) */
  correctField: (id: string, newLabel: string) => void;
  dismissField: (id: string) => void;
}

// ─── Fixture data (swap for Whisper / Naver Clova / Google STT + KM glossary) ─

const MOCK_TRANSCRIPT =
  '머리 위쪽이 3일 전부터 지끈거리며 두통이 심합니다. 풍한두통인 것 같고, 풍지혈 자침을 고려해 보세요.';

// Emit transcript in small chunks to simulate streaming STT output
const TRANSCRIPT_CHUNKS: string[] = MOCK_TRANSCRIPT.match(/.{1,7}/g) ?? [];

const MOCK_FIELDS: STTField[] = [
  {
    id: 'f1',
    type: 'body-part',
    label: '두정부',
    confidence: 0.94,
    alternatives: ['두부', '편두부', '후두부'],
  },
  {
    id: 'f2',
    type: 'duration',
    label: '3일 전부터',
    confidence: 0.91,
    alternatives: ['2일 전부터', '1주일 전부터', '어제부터'],
  },
  {
    id: 'f3',
    type: 'symptom',
    label: '두통',
    confidence: 0.89,
    alternatives: ['편두통', '군발성 두통', '긴장성 두통'],
  },
  {
    id: 'f4',
    type: 'km-term',
    label: '풍한두통',
    confidence: 0.41,
    alternatives: ['풍열두통', '담울두통', '기허두통'],
  },
  {
    id: 'f5',
    type: 'km-term',
    label: '풍지 GB20',
    confidence: 0.35,
    alternatives: ['태양 EX-HN5', '백회 GV20', '합곡 LI4'],
  },
];

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSTT(): STTHook {
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [extractedFields, setExtractedFields] = useState<STTField[]>([]);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const startRecording = useCallback(() => {
    // Clear any in-flight mock timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setIsRecording(true);
    setLiveTranscript('');
    setExtractedFields([]);

    // Stream transcript chunks
    TRANSCRIPT_CHUNKS.forEach((chunk, i) => {
      const t = setTimeout(
        () => setLiveTranscript((prev) => prev + chunk),
        300 + i * 320,
      );
      timersRef.current.push(t);
    });

    const transcriptEnd = 300 + TRANSCRIPT_CHUNKS.length * 320;

    // Emit extracted fields one by one after transcription
    MOCK_FIELDS.forEach((field, i) => {
      const t = setTimeout(
        () => setExtractedFields((prev) => [...prev, field]),
        transcriptEnd + 500 + i * 480,
      );
      timersRef.current.push(t);
    });

    // Auto-stop
    const t = setTimeout(() => {
      setIsRecording(false);
    }, transcriptEnd + 500 + MOCK_FIELDS.length * 480);
    timersRef.current.push(t);
  }, []);

  const stopRecording = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setIsRecording(false);
  }, []);

  const correctField = useCallback((id: string, newLabel: string) => {
    setExtractedFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, label: newLabel, confidence: 1 } : f)),
    );
  }, []);

  const dismissField = useCallback((id: string) => {
    setExtractedFields((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return { isRecording, liveTranscript, extractedFields, startRecording, stopRecording, correctField, dismissField };
}
