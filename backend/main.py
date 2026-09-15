import os
import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Literal
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()


def _load_prompt() -> str:
    candidates = [
        Path(os.getenv("PROMPT_PATH", "")),
        Path("prompt_template.txt"),
        Path(__file__).parent.parent / "prompt_template.txt",
    ]
    for p in candidates:
        if p.is_file():
            return p.read_text(encoding="utf-8")
    raise FileNotFoundError("prompt_template.txt not found")


SYSTEM_INSTRUCTION = _load_prompt()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set in environment")

client = genai.Client(api_key=GEMINI_API_KEY)

app = FastAPI(title="KMD Clinical Assistant", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PatientInput(BaseModel):
    age: int
    gender: str
    symptom: str
    affected_side: str | None = None
    secondary_symptoms: list[str] = []
    pulse: str | None = None
    tongue: str | None = None
    duration: str | None = None
    additional_notes: str | None = None
    language: Literal["ko", "en", "zh"] = "ko"


_LANGUAGE_INSTRUCTIONS: dict[str, str] = {
    "ko": "",  # base prompt_template.txt already defaults to Korean
    "en": """
## LANGUAGE OVERRIDE: English (en)
Output ALL text fields in English. Apply these field-level rules:
- diagnosis.pattern: English (e.g., "Kidney Deficiency Syndrome", "Liver Excess Syndrome")
- diagnosis.primary_meridian / secondary_meridian: English meridian name (e.g., "Kidney Meridian")
- diagnosis.imbalance_type: "Deficiency" or "Excess"
- prescription.method: "Zheng-Ge (Tonification Formula)" or "Sheng-Ge (Sedation Formula)"
- points[].point: WHO standard English romanization (e.g., "Jingqu", "Fuliu", "Taixi", "Taibai")
  - For Tung's acupoints, append the point number (e.g., "Linggu 22.05", "Zhongzi 22.01")
- points[].point_code: WHO standard code unchanged (e.g., LU8, KD7, SP3)
- points[].action: "Tonify" or "Sedate"
- points[].side: "Left", "Right", or "Bilateral"
- rationale, caution, notes: full English sentences (2-3 sentences; reference Five-Phase theory in English)
""",
    "zh": """
## 语言覆盖指令: Chinese (zh)
所有文本字段必须使用中文输出。各字段规范如下：
- diagnosis.pattern: 中文（如 "肾虚证"、"肝实证"）
- diagnosis.primary_meridian / secondary_meridian: 中文经络名（如 "肾经"、"肝经"）
- diagnosis.imbalance_type: "虚" 或 "实"
- prescription.method: "正格" 或 "胜格"
- points[].point: 穴位汉字名（如 "经渠"、"复溜"、"太溪"、"太白"）
  - 董氏奇穴使用中文名（如 "灵骨"、"重子"、"中白"）
- points[].point_code: WHO标准代码，不变（如 LU8、KD7、SP3）
- points[].action: "补" 或 "泻"
- points[].side: "左" 或 "右" 或 "双侧"
- rationale、caution、notes: 中文临床说明（2-3句；引用五行生克原理）
""",
}


_MERIDIAN_HINTS: list[tuple[list[str], str]] = [
    (["좌골신경통", "좌골", "방사통", "하지방사", "엉덩이", "종아리 뒤"], "방광경(BL) 주행 증상 → 방광(膀胱) 허/실 우선 검토"),
    (["발뒤꿈치", "족저", "뒤꿈치"], "신경(KD) 관련 → 신(腎) 허/실 검토 (이환기간·맥상 고려)"),
    (["무릎 외측", "슬관절 외측", "측두통", "편두통", "귀"], "담경(GB) 주행 → 담(膽) 허/실 검토"),
    (["어깨 후면", "견갑골", "팔꿈치 외측 내측"], "소장경(SI) 주행 → 소장(小腸) 허/실 검토"),
    (["어깨 외측", "목 측면", "삼초"], "삼초경(SJ) 주행 → 삼초(三焦) 허/실 검토"),
    (["소화", "위완", "구역", "식욕", "무릎 앞"], "비위(脾胃) 패턴 → 비(脾)/위(胃) 허/실 검토"),
    (["옆구리", "협늑", "눈 충혈", "눈 건조", "눈 피로"], "간경(LR) 주행 → 간(肝) 허/실 검토"),
    (["기침", "가래", "피부", "코막힘", "콧물"], "폐경(LU) → 폐(肺) 허/실 검토"),
    (["불면", "심계항진", "가슴 두근", "흉통"], "심경(HT) → 심(心) 허/실 검토"),
    (["변비", "손목", "팔꿈치 외측"], "대장경(LI) 주행 → 대장(大腸) 허/실 검토"),
    (["소변 거품", "단백뇨", "야뇨", "빈뇨", "소변 이상"], "신기불고(腎氣不固) 패턴 → 신(腎) 허증 우선 검토"),
    (["발바닥 중앙", "족저 중앙", "팅글링", "저림", "작열감"], "KD1(용천) 부위 → 신(腎) 허증 검토"),
    (["양말 자국", "하지 부종", "발목 부종", "다리 붓기"], "비허 수습운화 실조 → 비(脾) 허증 우선 검토"),
]


def _get_meridian_hint(symptom: str) -> str | None:
    s = symptom.lower()
    for keywords, hint in _MERIDIAN_HINTS:
        if any(kw in s for kw in keywords):
            return hint
    return None


_TUNG_HINTS: list[tuple[list[str], str]] = [
    (["소변 거품", "단백뇨", "야뇨", "빈뇨", "발바닥 중앙", "팅글링", "양말 자국", "족저 중앙"],
     "동씨침: 하삼황(88.17·88.18·88.19) 보법 + 통신(88.09)·통위(88.10) + 노궁(PC8) 사법"),
    (["좌골신경통", "하지 저림", "방사통", "하지방사", "마비"],
     "동씨침: 영골(22.05)+대백(22.06) 사법 (건측 수배 자침)"),
    (["하지 부종", "양말 자국", "다리 붓기", "발목 부종"],
     "동씨침: 사화중(88.12)+사화외(88.13) 보법"),
    (["발뒤꿈치", "족저", "뒤꿈치"],
     "동씨침: 중백(22.06)+하백(22.07) 보법 또는 하삼황(88.17-88.19)"),
    (["기침", "가래", "코막힘"],
     "동씨침: 오호(11.27) 보/사"),
    (["간경", "눈 충혈", "눈 건조", "협늑"],
     "동씨침: 명황(88.19)+천황부(88.14) 보법"),
]


def _get_tung_hint(symptom: str, secondary: list[str] | None = None) -> str | None:
    combined = symptom.lower()
    if secondary:
        combined += " " + " ".join(s.lower() for s in secondary)
    for keywords, hint in _TUNG_HINTS:
        if any(kw in combined for kw in keywords):
            return hint
    return None


def build_user_prompt(p: PatientInput) -> str:
    # ── 필수 환자 정보 (f-string 명시 바인딩) ──────────────────────────
    affected_line   = f"\n  affected_side   : {p.affected_side}" if p.affected_side else ""
    secondary_line  = f"\n  secondary_syms  : {', '.join(p.secondary_symptoms)}" if p.secondary_symptoms else ""
    pulse_line      = f"\n  pulse           : {p.pulse}" if p.pulse else ""
    tongue_line     = f"\n  tongue          : {p.tongue}" if p.tongue else ""
    duration_line   = f"\n  duration        : {p.duration}" if p.duration else ""
    notes_line      = f"\n  additional_notes: {p.additional_notes}" if p.additional_notes else ""

    meridian_hint = _get_meridian_hint(p.symptom)
    hint_line = f"\n  meridian_hint   : {meridian_hint}" if meridian_hint else ""

    tung_hint = _get_tung_hint(p.symptom, p.secondary_symptoms)
    tung_line = f"\n  tung_hint       : {tung_hint}" if tung_hint else ""

    lang_block = _LANGUAGE_INSTRUCTIONS.get(p.language, "")
    lang_section = f"\n{lang_block}" if lang_block else ""

    prompt = (
        f"[USER REQUEST]\n"
        f"\n"
        f"## 환자 정보 (Patient Data)\n"
        f"  age             : {p.age}세\n"
        f"  gender          : {p.gender}\n"
        f"  chief_complaint : {p.symptom}"
        f"{affected_line}"
        f"{secondary_line}"
        f"{pulse_line}"
        f"{tongue_line}"
        f"{duration_line}"
        f"{notes_line}"
        f"\n"
        f"\n## 변증 지시 (Reasoning Instructions)"
        f"{hint_line}"
        f"{tung_line}\n"
        f"  - 위 5단계 임상 추론 프로세스(Step 1~5)를 내부적으로 수행 후 JSON만 출력.\n"
        f"  - rationale에 {p.age}세 {p.gender} 환자의 주증상 [{p.symptom}]을 직접 언급할 것.\n"
        f"  - affected_side={p.affected_side or '없음'} → 반대측 취혈 적용.\n"
        f"  - additional_notes=[{p.additional_notes or '없음'}] → 처방 결정에 반영.\n"
        f"  - 신허증(腎虛)을 기본값으로 쓰지 말 것. 경락 주행과 허실을 독립 판단.\n"
        f"  - 참조표에 없는 혈위 절대 사용 금지.\n"
        f"  - tung_acupuncture.points 배열에 동씨침 특효혈 반드시 1개 이상 포함 (빈 배열 금지)."
        f"{lang_section}"
    )
    return prompt


@app.post("/prescription")
async def get_prescription(patient: PatientInput):
    prompt = build_user_prompt(patient)
    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
                temperature=0.3,
                candidate_count=1,
            ),
            contents=prompt,
        )
        prescription = json.loads(response.text)
        return prescription
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"Gemini returned invalid JSON: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok"}
