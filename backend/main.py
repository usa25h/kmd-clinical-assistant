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
]


def _get_meridian_hint(symptom: str) -> str | None:
    s = symptom.lower()
    for keywords, hint in _MERIDIAN_HINTS:
        if any(kw in s for kw in keywords):
            return hint
    return None


def build_user_prompt(p: PatientInput) -> str:
    lines = [
        "[USER REQUEST] — 아래 환자 정보에 대해서만 처방을 생성하시오.",
        "",
        "실제 환자 정보:",
        f"- 나이: {p.age}세, 성별: {p.gender}",
        f"- 주증상: {p.symptom}",
    ]
    if p.affected_side:
        lines.append(f"- 환측: {p.affected_side}")
    if p.secondary_symptoms:
        lines.append(f"- 부증상: {', '.join(p.secondary_symptoms)}")
    if p.pulse:
        lines.append(f"- 맥상: {p.pulse}")
    if p.tongue:
        lines.append(f"- 설진: {p.tongue}")
    if p.duration:
        lines.append(f"- 이환기간: {p.duration}")
    if p.additional_notes:
        lines.append(f"- 추가 소견: {p.additional_notes}")

    meridian_hint = _get_meridian_hint(p.symptom)
    lines += ["", "변증 지시:"]
    if meridian_hint:
        lines.append(f"- 경락 힌트: {meridian_hint}")
    lines += [
        "- 위 증상을 오행이론과 경락 주행으로 변증하고, 참조표에서 정확한 혈위를 선택하여 JSON만 출력하시오.",
        "- rationale에 위 환자의 나이, 성별, 주증상을 반드시 직접 언급할 것.",
        "- 참조표에 없는 혈위 사용 금지.",
        "- 신허증(腎虛)을 기본값으로 쓰지 말 것. 경락 주행과 허실을 독립적으로 판단하라.",
    ]
    lang_block = _LANGUAGE_INSTRUCTIONS.get(p.language, "")
    if lang_block:
        lines.append(lang_block)
    return "\n".join(lines)


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
