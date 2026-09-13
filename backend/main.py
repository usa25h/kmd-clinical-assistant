import os
import json
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Load system prompt — resolve from PROMPT_PATH env var, repo root, or file-relative
def _load_prompt() -> str:
    candidates = [
        Path(os.getenv("PROMPT_PATH", "")),
        Path("prompt_template.txt"),                       # cwd = repo root (Railway)
        Path(__file__).parent.parent / "prompt_template.txt",  # local dev
    ]
    for p in candidates:
        if p.is_file():
            return p.read_text(encoding="utf-8")
    raise FileNotFoundError("prompt_template.txt not found")

SYSTEM_INSTRUCTION = _load_prompt()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set in environment")

genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    system_instruction=SYSTEM_INSTRUCTION,
    generation_config=genai.GenerationConfig(
        response_mime_type="application/json",
        temperature=0.2,
    ),
)

app = FastAPI(title="KMD Clinical Assistant", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class PatientInput(BaseModel):
    age: int
    gender: str                        # "남" | "여"
    chief_complaint: str               # 주증상
    affected_side: str | None = None   # "좌" | "우" | "양측" | None
    secondary_symptoms: list[str] = [] # 부증상 목록
    pulse: str | None = None           # 맥상 (예: "침세")
    tongue: str | None = None          # 설진 (예: "담백설 백태")
    duration: str | None = None        # 이환기간 (예: "3개월")
    additional_notes: str | None = None


def build_user_prompt(p: PatientInput) -> str:
    lines = [
        f"환자 정보:",
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
    lines.append("\n위 정보를 바탕으로 사암침 처방 JSON을 생성하시오.")
    return "\n".join(lines)


@app.post("/prescription")
async def get_prescription(patient: PatientInput):
    prompt = build_user_prompt(patient)
    try:
        response = model.generate_content(prompt)
        prescription = json.loads(response.text)
        return prescription
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"Gemini returned invalid JSON: {e}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok"}
