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

export interface WorkerPrescription {
  diagnosis: {
    pattern: string;
    primary_meridian: string;
    secondary_meridian: string | null;
    imbalance_type: string;
  };
  prescription: {
    method: string;
    points: AcuPoint[];
  };
  secondary_treatment: {
    points: AcuPoint[];
    notes: string | null;
  };
  tung_acupuncture: {
    points: TungPoint[];
    notes: string | null;
  };
  rationale: string;
  caution: string | null;
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
