import { ACUPOINT_MAP } from '../data/acupoints';
import type { AcupointData } from '../data/acupoints';

export type { AcupointData } from '../data/acupoints';

export function useAcupoint(code: string): AcupointData | null {
  return ACUPOINT_MAP.get(code) ?? null;
}
