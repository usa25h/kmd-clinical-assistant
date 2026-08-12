import { useState, useCallback } from 'react';

export type PainQuality = 'throbbing' | 'numb' | 'dullAche' | 'stabbing';
export type BodySide = 'front' | 'back';
export type SubMapType = 'hand' | 'foot' | 'face';

export interface BodyPin {
  id: string;
  x: number;
  y: number;
  side: BodySide;
  regionId: string;
  svgRegionId: string;
  label: string;
  painQualities: PainQuality[];
  intensity: number;
  subMapType?: SubMapType;
}

export interface BodyMapHook {
  pins: BodyPin[];
  activeSide: BodySide;
  selectedRegionId: string | null;
  setActiveSide: (side: BodySide) => void;
  setSelectedRegionId: (id: string | null) => void;
  addPin: (pin: Omit<BodyPin, 'id'>) => string;
  updatePin: (id: string, updates: Partial<Omit<BodyPin, 'id'>>) => void;
  removePin: (id: string) => void;
}

let _counter = 0;
function newId() {
  return `pin-${++_counter}`;
}

export function useBodyMap(preSelectedRegionId?: string): BodyMapHook {
  const [pins, setPins] = useState<BodyPin[]>([]);
  const [activeSide, setActiveSide] = useState<BodySide>('front');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
    preSelectedRegionId ?? null,
  );

  const addPin = useCallback((pin: Omit<BodyPin, 'id'>): string => {
    const id = newId();
    setPins((prev) => [...prev, { ...pin, id }]);
    return id;
  }, []);

  const updatePin = useCallback((id: string, updates: Partial<Omit<BodyPin, 'id'>>) => {
    setPins((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const removePin = useCallback((id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return {
    pins,
    activeSide,
    selectedRegionId,
    setActiveSide,
    setSelectedRegionId,
    addPin,
    updatePin,
    removePin,
  };
}
