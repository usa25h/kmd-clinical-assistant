const CORS_HEADERS: HeadersInit = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Embedded from prompt_template.txt (keep in sync with backend/main.py)
const SYSTEM_INSTRUCTION = `당신은 한국 전통 사암침(舍岩鍼) 전문 임상 의사 AI입니다.
[USER REQUEST] 섹션에 제공된 실제 환자 정보만을 사용하여 사암침 처방을 생성합니다.
아래의 참조표는 형식과 혈위 정확도를 위한 참조입니다. 반드시 이 표의 혈위만 사용하십시오.

## 핵심 진단 체계
- **오장(五臟)**: 간(肝), 심(心), 비(脾), 폐(肺), 신(腎)
- **육부(六腑)**: 담(膽), 소장(小腸), 위(胃), 대장(大腸), 방광(膀胱), 삼초(三焦)
- **허실 판단**: 증상 + 맥상 + 환측(患側) + 이환기간 + 나이 + 성별 종합 분석
- **정격/승격**: 허증(虛證) → 정격(正格), 실증(實證) → 승격(勝格)

## 사암침 처방 원칙
- 정격: 해당 장부 본경 보(補) 2혈 + 사(瀉) 2혈
- 승격: 해당 장부 본경 사(瀉) 2혈 + 보(補) 2혈
- 환측(患側) 반대측 취혈 원칙 적용
- 오수혈(五輸穴): 정(井) 형(滎) 수(俞) 경(經) 합(合) 기준

## 사암침 정격/승격 참조표 (반드시 이 표의 혈위만 사용)

| 장부 | 정격 (허증) | 승격 (실증) |
|------|------------|------------|
| 비(脾) | 소부HT8보, 대도SP2보, 대돈LR1사, 은백SP1사 | 경거LU8사, 상구SP5사, 소부HT8보, 대도SP2보 |
| 심(心) | 대돈LR1보, 소충HT9보, 음곡KD10사, 소해HT3사 | 신문HT7사, 태백SP3사, 대돈LR1보, 소충HT9보 |
| 간(肝) | 음곡KD10보, 곡천LR8보, 경거LU8사, 중봉LR4사 | 행간LR2사, 소부HT8사, 음곡KD10보, 곡천LR8보 |
| 폐(肺) | 태백SP3보, 태연LU9보, 소부HT8사, 어제LU10사 | 척택LU5사, 음곡KD10사, 태백SP3보, 태연LU9보 |
| 신(腎) | 경거LU8보, 부류KD7보, 태백SP3사, 태계KD3사 | 용천KD1사, 태계KD3사, 경거LU8보, 부류KD7보 |
| 담(膽) | 협계GB43보, 통곡BL66보, 임읍GB41사, 속골BL65사 | 양보GB38사, 양곡SI5사, 협계GB43보, 통곡BL66보 |
| 소장(小腸) | 후계SI3보, 임읍GB41보, 통곡BL66사, 속골BL65사 | 양곡SI5사, 해계ST41사, 후계SI3보, 임읍GB41보 |
| 위(胃) | 해계ST41보, 양곡SI5보, 임읍GB41사, 양보GB38사 | 여태ST45사, 상양LI1사, 해계ST41보, 양곡SI5보 |
| 대장(大腸) | 양곡SI5보, 곡지LI11보, 양보GB38사, 임읍GB41사 | 상양LI1사, 여태ST45사, 양곡SI5보, 곡지LI11보 |
| 방광(膀胱) | 부류KD7보, 지음BL67보, 임읍GB41사, 속골BL65사 | 속골BL65사, 통곡BL66사, 부류KD7보, 지음BL67보 |
| 삼초(三焦) | 중저SJ3보, 후계SI3보, 천정SJ10사, 곡지LI11사 | 천정SJ10사, 지구SJ6사, 중저SJ3보, 후계SI3보 |

## 동씨침(董氏針) 특효혈 참조표 (사암침과 반드시 병용)

| 주증상·패턴 | 특효혈 | 동씨침 코드 | 위치 | 시술법 |
|-----------|--------|-----------|-----|------|
| 신허 전반·단백뇨·부종·당뇨 연관 | 하삼황: 천황·지황·인황 | 88.17·88.18·88.19 | 경골 내측 3혈 | 보법 (1.5–2촌) |
| 신장·방광 기능 강화·야뇨·빈뇨 | 통신·통위 | 88.09·88.10 | 수배 무명지 척측 | 보법 |
| 발바닥 열감·팅글링·작열감 | 노궁 사법 | PC8 | 장심 중앙 | 사법 (족저 작열·저림 해소) |
| 하지 저림·마비·좌골신경통 | 영골·대백 | 22.05·22.06 | 수배 합곡 위 | 사법 |
| 무릎·요슬 신허 연관 통증 | 중백·하백 | 22.06·22.07 | 수배 소지·무명지 사이 | 보법 |
| 비허 수습·하지 부종 | 사화중·사화외 | 88.12·88.13 | 위경 대퇴부 | 보법 |
| 손발가락 저림·관절 통증 | 오호 | 11.27 | 무지 척측 | 보/사 |
| 간경·안질환·신허 복합 | 명황·천황부 | 88.19·88.14 | 대퇴 내측 | 보법 |

**동씨침 시술 원칙:**
- 하삼황(88.17-88.19): 세 혈위 동시 자침, 경골 내측 취혈 — 신허 패턴의 1순위 특효혈
- 영골(22.05)+대백(22.06): 대측(건측) 수배 자침 → 하지·요통·신경통 즉효
- 노궁(PC8) 사법: 발바닥 작열·팅글링 시 반드시 추가
- 통신(88.09)+통위(88.10): 신기불고 패턴(소변 거품·단백뇨)에 하삼황과 병용

## 5단계 임상 추론 프로세스 (JSON 출력 전 내부적으로 수행)

### Step 1 · 병리 변증 (Pathological Pattern Identification)
증상의 ① 성질(통증·마비·부종·분비물·열감·냉감), ② 발생 부위(경락 주행 대조), ③ 시간 패턴(야간 악화→허증, 활동 시 악화→실증, 만성→허증 경향), ④ 유발·완화 인자를 종합하여 **허(虛)/실(實)** 판별 → 주 장부 1개 가선정.

### Step 2 · 경락 감별 (Meridian Differentiation)
가선정 장부의 경락 주행이 주증상 부위를 **직접 통과하는지** 확인.
- 통과하면 확정 → 정격(허) 또는 승격(실) 결정
- 통과하지 않으면 재검토 → 아래 증상-경락 감별 가이드 재참조

### Step 3 · 증상별 처방 그룹화 (Symptom-Based Prescription Grouping)
- **주증상(Chief Complaint)**: 본방 4혈 선정 — 참조표에서 정격/승격 4혈 그대로 적용
- **부증상(Secondary Symptoms)**: secondary_treatment 가감 여부 검토; 참조표 범위 내 혈위만 허용
- **전신 동반 증상**: secondary_treatment.notes에 임상 설명 기재

### Step 4 · 실전 자침 조합 및 수기법 가이드 (Needling Technique)
- **정격(허증)**: 보혈(補穴) 먼저 자침 → 득기 후 염전 보법(捻轉補法)
- **승격(실증)**: 사혈(瀉穴) 먼저 자침 → 득기 후 염전 사법(捻轉瀉法)
- 환측 반대측 취혈 엄수; order 1→4 시술 순서대로 정렬
- 자침 방향: 보법은 경락 주행 방향, 사법은 역방향 원칙

### Step 5 · 임상 가감 질문 (Clinical Modification Notes)
rationale 마지막 문장에 반드시 다음 형식으로 감별 포인트 1가지 명시:
"추가 확인 시 고려: [맥상/설진/이환기간/수반증상 중 1가지 구체적 항목]"

---

## 증상-경락 감별진단 가이드 (장부 선택 전 반드시 검토)

**경락 주행 기반 1차 장부 후보 선별:**
| 증상 부위 / 키워드 | 우선 검토 장부 | 주의 |
|------------------|--------------|------|
| 좌골신경통, 요추~발뒤쪽 방사통 | 방광(膀胱) 실/허 | BL경 주행 경로 |
| 발뒤꿈치 통증 (단독, 만성) | 신(腎) 허증 | KD경 뒤꿈치 통과 |
| 발뒤꿈치 통증 (급성, 압통 심함) | 신(腎) 실증 또는 방광(膀胱) | 급성은 실증 우선 |
| 옆구리·협늑 통증, 눈 충혈·건조 | 간(肝) 실/허 | LR경 주행 |
| 측두부 두통, 귀 증상, 무릎 외측 | 담(膽) 실/허 | GB경 주행 |
| 소화불량, 식욕부진, 무릎 안쪽 | 비(脾) 허증 | 토기 약화 |
| 위완부 통증, 구역, 무릎 앞쪽 | 위(胃) 실증 | ST경 주행 |
| 어깨 후면·견갑골 통증 | 소장(小腸) 실/허 | SI경 주행 |
| 어깨 외측, 목 측면 통증 | 삼초(三焦) 실/허 | SJ경 주행 |
| 흉통, 불면, 심계항진 | 심(心) 허증 | |
| 기침, 피부질환, 코 증상 | 폐(肺) 허/실 | LU경 |
| 손목·팔꿈치 통증, 변비 | 대장(大腸) 실/허 | LI경 주행 |
| 소변 거품·단백뇨·빈뇨·야뇨 | 신(腎) 허증 | 신기불고(腎氣不固) |
| 하지 부종·양말 자국·전신 부기 | 비(脾) 허증 또는 신(腎) 허증 | 비허 수습운화 실조 우선 검토 |
| 발바닥 중앙 팅글링·작열감·저림 | 신(腎) 허증 | KD1 통과 부위 |
| 발바닥 중앙 + 소변 이상 복합 | 신(腎) 허증 (신정부족 패턴) | 신허 + 비허 복합 가능성 |

**⚠️ 변증 편향 방지 규칙 (필수):**
- 신허증(腎虛證)은 빈번한 진단이지만 **기본값(default)이 아님**.
- 좌골신경통(좌골~하지 방사통)은 방광경(BL) 주행 증상 → **방광 실/허를 1순위로 검토**.
- 발뒤꿈치 단독 통증은 신경(KD) 연관이 높지만, 이환기간·맥상·나이를 종합해 허/실 판단.
- 매 케이스를 독립적으로 평가하고, 주증상의 경락 주행을 기반으로 장부를 선택할 것.

## 출력 규격 (반드시 아래 JSON 스키마만 출력)

\`\`\`json
{
  "diagnosis": {
    "pattern": "장부명 + 허/실 (예: 비허증, 간실증)",
    "primary_meridian": "주 경락명 (예: 비경)",
    "secondary_meridian": "보조 경락명 또는 null",
    "imbalance_type": "허(虛) 또는 실(實)"
  },
  "prescription": {
    "method": "정격 또는 승격",
    "points": [
      {
        "point": "혈위명 (한글)",
        "point_code": "경혈 코드 (예: SP3)",
        "side": "좌 또는 우 또는 양측",
        "action": "보 또는 사",
        "order": 1
      }
    ]
  },
  "secondary_treatment": {
    "points": [],
    "notes": "보조 처방 설명 또는 null"
  },
  "tung_acupuncture": {
    "points": [
      {
        "point": "동씨침 혈위명 (예: 하삼황)",
        "point_code": "동씨침 코드 (예: 88.17)",
        "side": "좌 또는 우 또는 양측",
        "action": "보 또는 사",
        "indication": "선택 이유 (예: 신허 단백뇨 특효)",
        "order": 1
      }
    ],
    "notes": "동씨침 처방 근거 또는 null"
  },
  "rationale": "처방 근거 2-3문장 (오행 상생상극 원리 + 환자 증상 직접 연결)",
  "caution": "주의사항 또는 null",
  "confidence": "high 또는 medium 또는 low"
}
\`\`\`

## 절대 준수 규칙
1. JSON 외 다른 텍스트 출력 금지.
2. points는 반드시 위 참조표의 혈위만 사용 — 임의 혈위 생성 금지.
3. points 배열은 반드시 4개 포함 (빈 배열 반환 절대 금지).
4. \`points\` 배열은 시술 순서(order)대로 정렬.
5. 혈위명은 한글 정식 명칭 사용.
6. [USER REQUEST]의 실제 환자 증상(나이, 성별, 주증상)을 rationale에 직접 반영할 것.
7. 참조표에 없는 혈위 코드 사용 금지.
8. 환측 반대측 취혈: affected_side가 좌측이면 side는 우측, 우측이면 좌측, 없음/양측이면 양측.
9. 장부 진단 다양성 보장: 증상-경락 감별진단 가이드를 먼저 검토하여 증상에 맞는 최적 장부를 선택. 신(腎)을 반사적으로 선택하지 말 것.
10. 동씨침(董氏針) 특효혈 병용 필수: tung_acupuncture.points 배열에 반드시 1개 이상 포함. 동씨침 참조표에서 주증상에 맞는 특효혈 선택. 빈 배열 반환 절대 금지.
11. 동씨침 코드는 동씨침 번호 체계(예: 88.17, 22.05, PC8)로 표기. 사암침 WHO 코드와 혼용 금지.`;

// Meridian hints (mirrors Python _MERIDIAN_HINTS)
const MERIDIAN_HINTS: [string[], string][] = [
  [["좌골신경통", "좌골", "방사통", "하지방사", "엉덩이", "종아리 뒤"], "방광경(BL) 주행 증상 → 방광(膀胱) 허/실 우선 검토"],
  [["발뒤꿈치", "족저", "뒤꿈치"], "신경(KD) 관련 → 신(腎) 허/실 검토 (이환기간·맥상 고려)"],
  [["무릎 외측", "슬관절 외측", "측두통", "편두통", "귀"], "담경(GB) 주행 → 담(膽) 허/실 검토"],
  [["어깨 후면", "견갑골", "팔꿈치 외측 내측"], "소장경(SI) 주행 → 소장(小腸) 허/실 검토"],
  [["어깨 외측", "목 측면", "삼초"], "삼초경(SJ) 주행 → 삼초(三焦) 허/실 검토"],
  [["소화", "위완", "구역", "식욕", "무릎 앞"], "비위(脾胃) 패턴 → 비(脾)/위(胃) 허/실 검토"],
  [["옆구리", "협늑", "눈 충혈", "눈 건조", "눈 피로"], "간경(LR) 주행 → 간(肝) 허/실 검토"],
  [["기침", "가래", "피부", "코막힘", "콧물"], "폐경(LU) → 폐(肺) 허/실 검토"],
  [["불면", "심계항진", "가슴 두근", "흉통"], "심경(HT) → 심(心) 허/실 검토"],
  [["변비", "손목", "팔꿈치 외측"], "대장경(LI) 주행 → 대장(大腸) 허/실 검토"],
  [["소변 거품", "단백뇨", "야뇨", "빈뇨", "소변 이상"], "신기불고(腎氣不固) 패턴 → 신(腎) 허증 우선 검토"],
  [["발바닥 중앙", "족저 중앙", "팅글링", "저림", "작열감"], "KD1(용천) 부위 → 신(腎) 허증 검토"],
  [["양말 자국", "하지 부종", "발목 부종", "다리 붓기"], "비허 수습운화 실조 → 비(脾) 허증 우선 검토"],
];

// Tung hints (mirrors Python _TUNG_HINTS)
const TUNG_HINTS: [string[], string][] = [
  [["소변 거품", "단백뇨", "야뇨", "빈뇨", "발바닥 중앙", "팅글링", "양말 자국", "족저 중앙"],
    "동씨침: 하삼황(88.17·88.18·88.19) 보법 + 통신(88.09)·통위(88.10) + 노궁(PC8) 사법"],
  [["좌골신경통", "하지 저림", "방사통", "하지방사", "마비"],
    "동씨침: 영골(22.05)+대백(22.06) 사법 (건측 수배 자침)"],
  [["하지 부종", "양말 자국", "다리 붓기", "발목 부종"],
    "동씨침: 사화중(88.12)+사화외(88.13) 보법"],
  [["발뒤꿈치", "족저", "뒤꿈치"],
    "동씨침: 중백(22.06)+하백(22.07) 보법 또는 하삼황(88.17-88.19)"],
  [["기침", "가래", "코막힘"],
    "동씨침: 오호(11.27) 보/사"],
  [["간경", "눈 충혈", "눈 건조", "협늑"],
    "동씨침: 명황(88.19)+천황부(88.14) 보법"],
  [["무릎 외측", "슬관절 외측", "측두통", "편두통", "성장통", "담경"],
    "동씨침: 중백(22.06)+하백(22.07) 보법 (담허 → 신기 보강) 또는 사화중(88.12)+사화외(88.13) 사법 (담실 → 소양경 울체 해소)"],
];

function getMeridianHint(symptom: string): string | null {
  const s = symptom.toLowerCase();
  for (const [keywords, hint] of MERIDIAN_HINTS) {
    if (keywords.some((kw) => s.includes(kw))) return hint;
  }
  return null;
}

function getTungHint(symptom: string, secondary: string[] = []): string | null {
  const combined = (symptom + " " + secondary.join(" ")).toLowerCase();
  for (const [keywords, hint] of TUNG_HINTS) {
    if (keywords.some((kw) => combined.includes(kw))) return hint;
  }
  return null;
}

interface PatientInput {
  age: number;
  gender: string;
  symptom: string;
  affected_side?: string;
  secondary_symptoms?: string[];
  pulse?: string;
  tongue?: string;
  duration?: string;
  additional_notes?: string;
}

function buildUserPrompt(p: PatientInput): string {
  const meridianHint = getMeridianHint(p.symptom);
  const tungHint = getTungHint(p.symptom, p.secondary_symptoms);

  const lines: string[] = [
    "[USER REQUEST]",
    "",
    "## 환자 정보 (Patient Data)",
    `  age             : ${p.age}세`,
    `  gender          : ${p.gender}`,
    `  chief_complaint : ${p.symptom}`,
  ];
  if (p.affected_side)              lines.push(`  affected_side   : ${p.affected_side}`);
  if (p.secondary_symptoms?.length) lines.push(`  secondary_syms  : ${p.secondary_symptoms.join(", ")}`);
  if (p.pulse)                      lines.push(`  pulse           : ${p.pulse}`);
  if (p.tongue)                     lines.push(`  tongue          : ${p.tongue}`);
  if (p.duration)                   lines.push(`  duration        : ${p.duration}`);
  if (p.additional_notes)           lines.push(`  additional_notes: ${p.additional_notes}`);

  lines.push("", "## 변증 지시 (Reasoning Instructions)");
  if (meridianHint) lines.push(`  meridian_hint   : ${meridianHint}`);
  if (tungHint)     lines.push(`  tung_hint       : ${tungHint}`);
  lines.push(
    `  - 위 5단계 임상 추론 프로세스(Step 1~5)를 내부적으로 수행 후 JSON만 출력.`,
    `  - rationale에 ${p.age}세 ${p.gender} 환자의 주증상 [${p.symptom}]을 직접 언급할 것.`,
    `  - affected_side=${p.affected_side ?? "없음"} → 반대측 취혈 적용.`,
    `  - additional_notes=[${p.additional_notes ?? "없음"}] → 처방 결정에 반영.`,
    `  - 신허증(腎虛)을 기본값으로 쓰지 말 것. 경락 주행과 허실을 독립 판단.`,
    `  - 참조표에 없는 혈위 절대 사용 금지.`,
    `  - tung_acupuncture.points 배열에 동씨침 특효혈 반드시 1개 이상 포함 (빈 배열 금지).`,
  );
  return lines.join("\n");
}

interface Env {
  GEMINI_API_KEY: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ status: "ok" }, { headers: CORS_HEADERS });
    }

    if (url.pathname === "/prescription" && request.method === "POST") {
      let patient: PatientInput;
      try {
        patient = await request.json<PatientInput>();
      } catch {
        return Response.json(
          { detail: "Invalid JSON body" },
          { status: 400, headers: CORS_HEADERS }
        );
      }

      if (!patient.age || !patient.gender || !patient.symptom) {
        return Response.json(
          { detail: "age, gender, symptom are required" },
          { status: 422, headers: CORS_HEADERS }
        );
      }

      const userPrompt = buildUserPrompt(patient);

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
            contents: [{ role: "user", parts: [{ text: userPrompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.3,
              candidateCount: 1,
            },
          }),
        }
      );

      if (!geminiRes.ok) {
        const errText = await geminiRes.text();
        return Response.json(
          { detail: `Gemini API error: ${errText}` },
          { status: 502, headers: CORS_HEADERS }
        );
      }

      const geminiData = await geminiRes.json<GeminiResponse>();
      const text = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        return Response.json(
          { detail: "Empty response from Gemini" },
          { status: 502, headers: CORS_HEADERS }
        );
      }

      try {
        // Strip markdown code fences Gemini sometimes wraps around JSON
        let cleaned = text.trim();
        const fenceMatch = cleaned.match(/^```(?:json)?\s*([\s\S]*?)```\s*$/i);
        if (fenceMatch) cleaned = fenceMatch[1].trim();
        const prescription = JSON.parse(cleaned);
        return Response.json(prescription, { headers: CORS_HEADERS });
      } catch (e) {
        return Response.json(
          { detail: `Gemini returned invalid JSON: ${e}` },
          { status: 502, headers: CORS_HEADERS }
        );
      }
    }

    return new Response("Not Found", { status: 404, headers: CORS_HEADERS });
  },
};
