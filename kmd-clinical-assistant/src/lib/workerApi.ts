const WORKER_URL = 'https://kmd-clinical-assistant.38card.workers.dev';

export interface WorkerInput {
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

export interface AcuPoint {
  point: string;
  point_code: string;
  side: string;
  action: string;
  order: number;
}

export interface TungPoint extends AcuPoint {
  indication: string;
}

export interface PrescriptionSection {
  formula_name: string;
  points: AcuPoint[];
  notes: string | null;
}

export interface TungSection {
  formula_name: string;
  points: TungPoint[];
  notes: string | null;
}

export interface WorkerPrescription {
  assessment: {
    pattern: string;
    description: string;
  };
  treatment_principle: string;
  tung_acupuncture: TungSection;
  saam: PrescriptionSection;
  meridian: PrescriptionSection;
  precautions: string[];
  confidence: 'high' | 'medium' | 'low';
}

export async function callWorkerApi(input: WorkerInput): Promise<WorkerPrescription> {
  const res = await fetch(`${WORKER_URL}/prescription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Worker ${res.status}: ${body || res.statusText}`);
  }

  return res.json() as Promise<WorkerPrescription>;
}
