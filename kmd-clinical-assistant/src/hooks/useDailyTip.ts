export interface DailyTip {
  id: string;
  category: string;
  title: string;
  body: string;
  source: string;
}

export interface DailyTipHook {
  featured: DailyTip;
  tips: DailyTip[];
}

const TIPS: DailyTip[] = [
  {
    id: 't1',
    category: '경혈',
    title: '풍지(GB20) — 두통·목 강직의 요혈',
    body:
      '풍지는 족소양담경의 경혈로, 풍사(風邪)를 제거하는 대표 혈위입니다. 후두부 두통, 목 강직, 어지럼증에 직접 자침하면 즉각적인 통증 완화를 기대할 수 있습니다. 합곡(LI4)과 병용 시 해표(解表) 효과가 배가됩니다.',
    source: '침구학 교과서 / 동의학사전',
  },
  {
    id: 't2',
    category: '경혈',
    title: '사관혈(四關穴) — 합곡 + 태충',
    body:
      '합곡(LI4)과 태충(LV3)을 함께 취혈하면 \'사관(四關)\'이 완성됩니다. 기혈(氣血)의 전신 순환을 촉진하고, 감정 변화로 인한 기체울결(氣滯鬱結)을 풀어주는 데 탁월합니다. 스트레스성 두통·흉협 불쾌감에 응용하세요.',
    source: '황제내경 / 실용침구학',
  },
  {
    id: 't3',
    category: '변증',
    title: '두통의 부위로 변증 단서 잡기',
    body:
      '• 전두부 → 양명경 (胃·大腸)\n• 측두부 → 소양경 (膽·三焦)\n• 후두부 → 태양경 (膀胱·小腸)\n• 두정부 → 궐음경 (肝·心包)\n부위에 해당하는 경락의 경혈을 원위 취혈로 병용하면 치료 효율이 높아집니다.',
    source: '동의보감 두통문 / 침구대성',
  },
  {
    id: 't4',
    category: '섭생',
    title: '두통 환자에게 권장하는 생활 지침',
    body:
      '풍한두통: 목·어깨 보온, 찬 음식·음료 자제.\n간양상항: 취침 전 족욕(40°C, 20분), 격한 감정 조절.\n기체두통: 복식호흡, 가벼운 유산소 운동 30분/일.',
    source: '한의학 섭생 가이드라인',
  },
  {
    id: 't5',
    category: '처방',
    title: '갈근탕(葛根湯) 적응증과 주의사항',
    body:
      '갈근탕은 외감풍한(外感風寒)으로 인한 두통·항강(項强)에 적합합니다. 땀이 없고 오한이 있는 표실증(表實證)에 주로 사용합니다. 음허(陰虛) 체질이나 발한 과다자에게는 신중하게 사용하세요.',
    source: '방제학 교과서 / 상한론',
  },
];

export function useDailyTip(): DailyTipHook {
  return {
    featured: TIPS[0],
    tips: TIPS.slice(1),
  };
}
