import os
import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types
from saam_table import lookup, SAAM_TABLE

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

app = FastAPI(title="KMD Clinical Assistant", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PatientInput(BaseModel):
    age: int
    gender: str
    chief_complaint: str
    affected_side: str | None = None
    secondary_symptoms: list[str] = []
    pulse: str | None = None
    tongue: str | None = None
    duration: str | None = None
    additional_notes: str | None = None


def build_user_prompt(p: PatientInput) -> str:
    lines = [
        "[USER REQUEST] — 아래 환자 정보를 변증하여 JSON만 출력하시오.",
        "",
        "환자 정보:",
        f"- 나이: {p.age}세, 성별: {p.gender}",
        f"- 주증상: {p.chief_complaint}",
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
    lines += [
        "",
        "위 증상으로 장부 허실 변증 후 pattern_key를 반드시 22개 값 중 하나로 출력하시오.",
        "rationale에 위 환자의 나이, 성별, 주증상을 직접 언급할 것.",
    ]
    return "\n".join(lines)


def _build_prescription_response(diagnosis: dict, formula: dict, patient: PatientInput) -> dict:
    """Assemble final response from LLM diagnosis + hardcoded table formula."""
    points_with_side = []
    side = patient.affected_side or "양측"
    # Saam acupuncture: needling on contralateral side
    contralateral = {"좌측": "우측", "우측": "좌측", "양측": "양측", "없음": "양측"}.get(side, "양측")

    for pt in formula["points"]:
        points_with_side.append({
            "point": pt["point"],
            "point_code": pt["point_code"],
            "side": contralateral,
            "action": pt["action"],
            "order": pt["order"],
        })

    pattern_key = diagnosis.get("pattern_key", "")
    organ = diagnosis.get("organ", "")
    imbalance = diagnosis.get("imbalance_type", "")
    pattern_label = f"{organ}{'허증' if imbalance == '허' else '실증'}"

    return {
        "diagnosis": {
            "pattern": pattern_label,
            "pattern_key": pattern_key,
            "primary_meridian": diagnosis.get("primary_meridian") or formula.get("primary_meridian", ""),
            "secondary_meridian": diagnosis.get("secondary_meridian") or formula.get("secondary_meridian"),
            "imbalance_type": imbalance,
        },
        "prescription": {
            "method": formula["method"],
            "points": points_with_side,
        },
        "secondary_treatment": {
            "points": [],
            "notes": None,
        },
        "rationale": diagnosis.get("rationale", ""),
        "caution": diagnosis.get("caution"),
        "confidence": diagnosis.get("confidence", "medium"),
    }


@app.post("/prescription")
async def get_prescription(patient: PatientInput):
    prompt = build_user_prompt(patient)
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION,
                response_mime_type="application/json",
                temperature=0.1,
                candidate_count=1,
            ),
            contents=prompt,
        )
        diagnosis = json.loads(response.text)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"Gemini returned invalid JSON: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    pattern_key = diagnosis.get("pattern_key", "")
    if pattern_key not in SAAM_TABLE:
        raise HTTPException(
            status_code=422,
            detail=f"LLM returned unknown pattern_key: '{pattern_key}'. Valid keys: {list(SAAM_TABLE.keys())}",
        )

    formula = SAAM_TABLE[pattern_key]
    return _build_prescription_response(diagnosis, formula, patient)


@app.get("/health")
def health():
    return {"status": "ok"}
