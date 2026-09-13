const API_BASE = 'https://acu-cdss-api-production.up.railway.app';

export interface PrescriptionRequest {
  age: number;
  gender: string;
  chief_complaint: string;
  affected_side?: string;
  secondary_symptoms?: string[];
  pulse?: string;
  tongue?: string;
  duration?: string;
  additional_notes?: string;
}

export interface PrescriptionPoint {
  point: string;
  point_code: string;
  side: string;
  action: string;
  order: number;
}

export interface PrescriptionDiagnosis {
  pattern: string;
  primary_meridian: string;
  secondary_meridian?: string;
  imbalance_type: string;
}

export interface PrescriptionResponse {
  diagnosis: PrescriptionDiagnosis;
  prescription: {
    method: string;
    points: PrescriptionPoint[];
  };
  secondary_treatment?: {
    points: string[];
    notes: string;
  };
  rationale: string;
  caution?: string;
  confidence: string;
}

export async function fetchPrescription(
  input: PrescriptionRequest,
): Promise<PrescriptionResponse> {
  const res = await fetch(`${API_BASE}/prescription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}
