const WORKER_URL = 'https://kmd-clinical-assistant.38card.workers.dev';

export interface WorkerInput {
  age: number;
  gender: string;
  symptom: string;
  affected_side?: string;
  secondary_symptoms?: string;
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

export interface WorkerPrescription {
  diagnosis: string;
  prescription: {
    method: string;
    points: AcuPoint[];
  };
  secondary_treatment: string;
  tung_acupuncture: {
    points: TungPoint[];
    notes: string;
  };
  rationale: string;
  caution: string;
  confidence: number;
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
