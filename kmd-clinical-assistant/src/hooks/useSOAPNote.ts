import { useState, useCallback, useEffect, useRef } from 'react';
import { callClaude, extractJson, CLAUDE_API_KEY } from '../lib/claude';
import { useSession, type SessionState } from '../context/SessionContext';
import type { DiagnosticPattern, AcupointRecommendation } from './useClinicalReasoning';

export interface SOAPSection {
  key: 'S' | 'O' | 'A' | 'P';
  label: string;
  labelKorean: string;
  content: string;
}

export interface SOAPNoteHook {
  sections: SOAPSection[];
  updateSection: (key: SOAPSection['key'], content: string) => void;
  isLoading: boolean;
}

// ── Fallback ──────────────────────────────────────────────────────────────────

const INITIAL_SECTIONS: SOAPSection[] = [
  {
    key: 'S',
    label: 'Subjective',
    labelKorean: '주관적 소견',
    content:
      '3일 전 갑자기 시작된 두정부 두통. 욱신거리는 양상, VAS 7/10. 오한 동반. 스트레스 증가 이후 악화 경향. 구역감 없음.',
  },
  {
    key: 'O',
    label: 'Objective',
    labelKorean: '객관적 소견',
    content:
      '설진: 박백태(薄白苔), 설질 담홍색.\n맥진: 부긴맥(浮緊脈).\n압통: 풍지(GB20)·천주(BL10) 압통 양성.',
  },
  {
    key: 'A',
    label: 'Assessment',
    labelKorean: '평가 (변증)',
    content:
      '풍한두통(風寒頭痛) — 외감풍한, 청양불승(淸陽不升).\n간양상항(肝陽上亢) 가능성 병존 — 스트레스 유발 요인.',
  },
  {
    key: 'P',
    label: 'Plan',
    labelKorean: '치료 계획',
    content:
      '치법: 祛風散寒止痛 / 平肝潛陽 병용.\n침치: GB20·LI4·GV20·BL10 (20분, 평보평사).\n처방 검토: 葛根湯 또는 川芎茶調散.\n다음 내원: 3일 후 재평가.',
  },
];

// ── Prompts ───────────────────────────────────────────────────────────────────

const SYSTEM = `당신은 한의학 전문의입니다. 환자 정보와 변증 결과를 바탕으로 SOAP 노트를 작성합니다.
반드시 유효한 JSON 형식으로만 응답하세요. 마크다운, 코드블록, 설명 없이 순수 JSON 객체만 반환하세요.

응답 형식:
{
  "S": "주관적 소견 내용 (환자가 호소하는 증상, 발병 시기, 통증 양상, 악화·완화 요인)",
  "O": "객관적 소견 내용 (설진, 맥진, 압통 등 객관적 소견)",
  "A": "평가 내용 (변증, 한의학적 진단)",
  "P": "치료 계획 (침치혈, 치법, 처방, 다음 방문)"
}

한의학 전문 용어를 적절히 사용하고 한자를 병기하세요. 실용적이고 임상에서 바로 쓸 수 있는 내용으로 작성하세요.`;

function formatPatterns(patterns: DiagnosticPattern[]): string {
  if (patterns.length === 0) return '변증 없음';
  return patterns
    .map((p) => `  - ${p.name}(${p.hanja}) ${Math.round(p.confidence * 100)}%: ${p.treatmentPrinciple}`)
    .join('\n');
}

function formatAcupoints(acupoints: AcupointRecommendation[]): string {
  if (acupoints.length === 0) return '경혈 없음';
  return acupoints.map((a) => `  - ${a.code} ${a.korean}(${a.hanja}): ${a.reason}`).join('\n');
}

function buildUserMessage(
  session: SessionState,
  patterns: DiagnosticPattern[],
  acupoints: AcupointRecommendation[],
): string {
  const cc = session.chiefComplaints.length > 0 ? session.chiefComplaints.join(', ') : '미기록';
  const tongue = session.tongueFindings.length > 0 ? session.tongueFindings.join(', ') : '미기록';

  const answers =
    session.interviewAnswers.length > 0
      ? session.interviewAnswers.map((a) => `  - ${a.cardId}: ${a.value}`).join('\n')
      : '  (문진 없음)';

  return `SOAP 노트를 작성하여 JSON만 반환하세요.

주소: ${cc}
설진: ${tongue}
문진:
${answers}

변증 결과:
${formatPatterns(patterns)}

처방 경혈:
${formatAcupoints(acupoints)}`;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

interface RawSOAP {
  S: string;
  O: string;
  A: string;
  P: string;
}

function applyRawToSections(raw: RawSOAP, prev: SOAPSection[]): SOAPSection[] {
  return prev.map((s) => {
    const content = raw[s.key];
    return content ? { ...s, content } : s;
  });
}

export function useSOAPNote(): SOAPNoteHook {
  const { session } = useSession();
  const [sections, setSections] = useState<SOAPSection[]>(INITIAL_SECTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    if (!CLAUDE_API_KEY) return;

    const patterns = session.diagnosticPatterns;
    const acupoints = session.recommendedAcupoints;
    const hasData =
      session.chiefComplaints.length > 0 || session.interviewAnswers.length > 0 || patterns.length > 0;
    if (!hasData) return;

    calledRef.current = true;
    setIsLoading(true);

    (async () => {
      try {
        const text = await callClaude(
          SYSTEM,
          buildUserMessage(session, patterns, acupoints),
          CLAUDE_API_KEY,
        );
        const raw = extractJson<RawSOAP>(text);
        if (raw.S || raw.O || raw.A || raw.P) {
          setSections((prev) => applyRawToSections(raw, prev));
        }
      } catch (err) {
        console.warn('useSOAPNote: Claude API error, keeping initial content', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const updateSection = useCallback((key: SOAPSection['key'], content: string) => {
    setSections((prev) => prev.map((s) => (s.key === key ? { ...s, content } : s)));
  }, []);

  return { sections, updateSection, isLoading };
}
