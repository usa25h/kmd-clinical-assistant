import os
import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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
    chief_complaint: str
    affected_side: str | None = None
    secondary_symptoms: list[str] = []
    pulse: str | None = None
    tongue: str | None = None
    duration: str | None = None
    additional_notes: str | None = None


def build_user_prompt(p: PatientInput) -> str:
    lines = [
        "[USER REQUEST] — 아래 환자 정보에 대해서만 처방을 생성하시오.",
        "",
        "실제 환자 정보:",
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
        "위 증상을 오행이론으로 변증하고, 참조표에서 정확한 혈위를 선택하여 JSON만 출력하시오.",
        "rationale에 위 환자의 나이, 성별, 주증상을 반드시 직접 언급할 것.",
        "참조표에 없는 혈위 사용 금지.",
    ]
    return "\n".join(lines)


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
        prescription = json.loads(response.text)
        return prescription
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"Gemini returned invalid JSON: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok"}
