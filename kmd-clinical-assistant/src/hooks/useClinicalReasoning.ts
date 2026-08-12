import { useState, useEffect, useRef } from 'react';
import { callClaude, extractJson, CLAUDE_API_KEY } from '../lib/claude';
import { useSession, type SessionState } from '../context/SessionContext';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DiagnosticPattern {
  id: string;
  name: string;
  hanja: string;
  category: string;
  confidence: number;
  keySymptoms: string[];
  treatmentPrinciple: string;
}

export interface AcupointRecommendation {
  id: string;
  code: string;
  korean: string;
  hanja: string;
  location: string;
  reason: string;
  primaryFor: string;
}

export interface ClinicalReasoningHook {
  patterns: DiagnosticPattern[];
  acupoints: AcupointRecommendation[];
  evidenceChips: string[];
  isLoading: boolean;
}

// ── Mock fallback ─────────────────────────────────────────────────────────────

const MOCK_PATTERNS: DiagnosticPattern[] = [
  {
    id: 'wind-cold',
    name: '풍한두통',
    hanja: '風寒頭痛',
    category: '외감병',
    confidence: 0.52,
    keySymptoms: ['오한 동반', '갑작스런 발병', '후두부·목 뻣뻣함', '박백태'],
    treatmentPrinciple: '祛風散寒止痛 — 풍사를 제거하고 한사를 흩어 통증을 멈춤',
  },
  {
    id: 'liver-yang',
    name: '간양상항',
    hanja: '肝陽上亢',
    category: '내상병',
    confidence: 0.31,
    keySymptoms: ['스트레스 후 악화', '두정부 욱신거림', '안면 홍조'],
    treatmentPrinciple: '平肝潛陽 — 간양을 평정하고 잠복시켜 상항을 억제',
  },
  {
    id: 'qi-stagnation',
    name: '기체두통',
    hanja: '氣滯頭痛',
    category: '내상병',
    confidence: 0.17,
    keySymptoms: ['감정 변화 시 악화', '흉협 그득함', '식욕 저하'],
    treatmentPrinciple: '疏肝理氣止痛 — 간기를 소통시키고 기체를 풀어 통증을 해소',
  },
];

const MOCK_ACUPOINTS: AcupointRecommendation[] = [
  {
    id: 'gb20',
    code: 'GB20',
    korean: '풍지',
    hanja: '風池',
    location: '후두부 근육 바깥쪽 오목한 곳',
    reason: '풍사 제거, 두통·목 강직의 요혈',
    primaryFor: 'wind-cold',
  },
  {
    id: 'li4',
    code: 'LI4',
    korean: '합곡',
    hanja: '合谷',
    location: '손등, 1·2 중수골 사이',
    reason: '두면부 모든 질환의 원혈 — 頭面之疾',
    primaryFor: 'wind-cold',
  },
  {
    id: 'gv20',
    code: 'GV20',
    korean: '백회',
    hanja: '百會',
    location: '두정부 정중앙',
    reason: '청양 상승, 두정부 두통에 직접 작용',
    primaryFor: 'liver-yang',
  },
  {
    id: 'lv3',
    code: 'LV3',
    korean: '태충',
    hanja: '太衝',
    location: '발등, 1·2 중족골 사이',
    reason: '간기 소설, 간양 억제의 요혈',
    primaryFor: 'liver-yang',
  },
  {
    id: 'st36',
    code: 'ST36',
    korean: '족삼리',
    hanja: '足三里',
    location: '비골두 아래 3촌, 경골 외측 1촌',
    reason: '扶正培元 — 기혈 생성, 위기 강화',
    primaryFor: 'qi-stagnation',
  },
  {
    id: 'bl10',
    code: 'BL10',
    korean: '천주',
    hanja: '天柱',
    location: '후발제 안쪽, 승모근 외측',
    reason: '후두부·목 강직 완화, 풍한 외감 해표',
    primaryFor: 'wind-cold',
  },
];

const MOCK_EVIDENCE = [
  '두정부 두통', '3일 전 발병', '강도 7/10', '오한', '풍지 GB20', '스트레스 후 악화',
];

// ── Prompts ───────────────────────────────────────────────────────────────────

const SYSTEM = `당신은 한의학 전문가 AI입니다. 환자 정보를 분석하여 변증 및 경혈 처방을 수행합니다.
반드시 유효한 JSON 형식으로만 응답하세요. 마크다운, 코드블록, 설명 없이 순수 JSON 객체만 반환하세요.

응답 형식:
{
  "patterns": [
    {
      "id": "고유ID(영문)",
      "name": "변증명(한글)",
      "hanja": "변증명(한자)",
      "category": "외감병 또는 내상병 또는 잡병",
      "confidence": 0.0에서1.0사이숫자,
      "keySymptoms": ["근거증상1", "근거증상2"],
      "treatmentPrinciple": "치법(한자+한글설명)"
    }
  ],
  "acupoints": [
    {
      "id": "고유ID(영문소문자)",
      "code": "국제표준코드(예:GB20)",
      "korean": "경혈명(한글)",
      "hanja": "경혈명(한자)",
      "location": "취혈 위치",
      "reason": "선택 이유(한글)",
      "primaryFor": "패턴id"
    }
  ],
  "evidenceChips": ["수집된증거1", "수집된증거2"]
}

중요:
- patterns는 신뢰도 내림차순으로 정렬, confidence 합산 1.0
- acupoints는 4~8개, 변증별 주요혈 포함
- evidenceChips는 환자 호소에서 뽑은 핵심 키워드 6~10개`;

function formatPulse(p: SessionState['pulse']): string {
  const bc = p.buChim < -0.5 ? '침맥(沈脈)' : p.buChim > 0.5 ? '부맥(浮脈)' : '중맥(中脈)';
  const js = p.jiSak < -0.5 ? '지맥(遲脈)' : p.jiSak > 0.5 ? '삭맥(數脈)' : '평맥';
  const hs = p.heoSil < -0.5 ? '허맥(虛脈)' : p.heoSil > 0.5 ? '실맥(實脈)' : '';
  return [bc, js, hs].filter(Boolean).join(', ');
}

function buildUserMessage(session: SessionState): string {
  const cc = session.chiefComplaints.length > 0 ? session.chiefComplaints.join(', ') : '미기록';
  const tongue = session.tongueFindings.length > 0 ? session.tongueFindings.join(', ') : '미기록';
  const pulse = formatPulse(session.pulse);

  const answers =
    session.interviewAnswers.length > 0
      ? session.interviewAnswers.map((a) => `  - ${a.cardId}: ${a.value}`).join('\n')
      : '  (문진 없음)';

  const pins =
    session.bodyMapPins.length > 0
      ? session.bodyMapPins
          .map((p) => `  - ${p.label} 부위 강도 ${p.intensity}/10 (${p.painQualities.join(', ') || '통증'})`)
          .join('\n')
      : '  (바디맵 미기록)';

  return `환자 정보를 바탕으로 변증 분석을 수행하여 JSON만 반환하세요.

주소(主訴): ${cc}
설진(舌診): ${tongue}
맥진(脈診): ${pulse}

문진 답변:
${answers}

바디맵 통증 부위:
${pins}`;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

interface RawResponse {
  patterns: DiagnosticPattern[];
  acupoints: AcupointRecommendation[];
  evidenceChips: string[];
}

export function useClinicalReasoning(): ClinicalReasoningHook {
  const { session, dispatch } = useSession();
  const [patterns, setPatterns] = useState<DiagnosticPattern[]>(MOCK_PATTERNS);
  const [acupoints, setAcupoints] = useState<AcupointRecommendation[]>(MOCK_ACUPOINTS);
  const [evidenceChips, setEvidenceChips] = useState<string[]>(MOCK_EVIDENCE);
  const [isLoading, setIsLoading] = useState(false);

  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    if (!CLAUDE_API_KEY) return;

    // Only call Claude if we have meaningful session data
    const hasData =
      session.chiefComplaints.length > 0 ||
      session.interviewAnswers.length > 0 ||
      session.bodyMapPins.length > 0;
    if (!hasData) return;

    calledRef.current = true;
    setIsLoading(true);

    (async () => {
      try {
        const text = await callClaude(SYSTEM, buildUserMessage(session), CLAUDE_API_KEY);
        const parsed = extractJson<RawResponse>(text);

        if (Array.isArray(parsed.patterns) && parsed.patterns.length > 0) {
          setPatterns(parsed.patterns);
          setAcupoints(parsed.acupoints ?? []);
          setEvidenceChips(parsed.evidenceChips ?? []);

          dispatch({
            type: 'SET_REASONING',
            patterns: parsed.patterns,
            acupoints: parsed.acupoints ?? [],
          });
        }
      } catch (err) {
        console.warn('useClinicalReasoning: Claude API error, using mock data', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { patterns, acupoints, evidenceChips, isLoading };
}
