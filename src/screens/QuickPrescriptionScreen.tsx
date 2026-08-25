import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme, typography, spacing, radii } from '../theme';
import { callClaude, CLAUDE_API_KEY } from '../lib/claude';
import type { RootStackParamList } from '../navigation/types';

// Matches standard meridian codes like LU7, ST36, GB41, GV14, CV6
const ACUPOINT_CODE_RE = /\b((?:LU|LI|ST|SP|HT|SI|BL|KI|PC|TE|GB|LV|GV|CV)\d+)\b/;

// ── Common diagnosis chips ────────────────────────────────────────────────────

const QUICK_DIAGNOSES = [
  '구안와사', '요통', '경항통', '두통', '편두통',
  '불면', '소화불량', '이명', '어지럼증', '천식·기침',
  '슬관절통', '어깨통증', '좌골신경통', '월경통', '고혈압',
];

// ── System prompt with all four acupuncture systems ───────────────────────────

const SYSTEM_PROMPT = `당신은 대한민국 한의과대학 출신의 임상 한의사 AI 보조입니다.
환자의 진단·증상을 입력받으면 아래 4가지 침법을 통합하여 실용적인 처방을 제시합니다.

## 사용 가능한 침법 데이터베이스

### 1. 정경침법 (正經鍼法) — 주요 경혈
LU7열결·LU9태연, LI4합곡·LI11곡지·LI20영향, ST25천추·ST36족삼리·ST40풍륭·ST44내정,
SP6삼음교·SP9음릉천·SP10혈해, HT7신문, SI3후계,
BL10천주·BL23신수·BL40위중·BL57승산·BL60곤륜,
KI3태계·KI6조해, PC6내관, TE5외관,
GB20풍지·GB21견정·GB30환도·GB34양릉천·GB39현종·GB40구허·GB41족임읍,
LV3태충, GV4명문·GV14대추·GV20백회, CV4관원·CV6기해·CV12중완

### 2. 사암침법 (捨巖鍼法) — 정격·승격
- 폐정격: LU9補 SP3補 HT7瀉 KI10瀉 / 폐승격: LU5補 KI10補 LU9瀉 SP3瀉
- 심정격: HT9補 LV1補 HT7瀉 SP1瀉 / 심승격: HT7補 KI7補 HT3瀉 KI10瀉
- 비정격: SP2補 HT8補 SP5瀉 LU8瀉 / 비승격: SP5補 LU8補 SP2瀉 HT8瀉
- 간정격: LV8補 KI10補 LV2瀉 HT8瀉 / 간승격: LV2補 HT8補 LV8瀉 KI10瀉
- 신정격: KI7補 LU8補 KI3瀉 SP3瀉 / 신승격: KI3補 SP3補 KI7瀉 LU8瀉
- 대장정격: LI11補 ST36補 LI2瀉 ST44瀉
- 위정격: ST41補 ST36補 ST43瀉 ST44瀉
- 담정격: GB43補 BL66補 GB38瀉 BL60瀉
- 방광정격: BL67補 GB44補 BL65瀉 GB41瀉

### 3. 동씨침법 (董氏鍼法) — 주요 혈위
- 11.01중자·11.02중선: 배통·폐 질환 (엄지 손바닥)
- 22.06중백·22.07하백: 요통·슬통·이명 (제4·5중수골 사이)
- 22.08영골·22.09대백: 좌골신경통·요통·두통·폐기종 (병자 극효, 임신 금기)
- 33.08심문: 심통·심계·구역 (중지 척측)
- 44.06신관: 신허·요통·이명·빈뇨
- 77.01정근·77.02정종: 목 강직·경추통·안면 근경련 (전완 배면)
- 88.01통관·88.02통산·88.03통천: 심장질환 (대퇴 전면, 3혈 병자)
- 88.12명황·88.13천황·88.14기황: 간질환·피로 (대퇴 내측, 3혈 병자)

### 4. 총통침법 (總統鍼法, 이원재) — 팔맥교회혈 4쌍
- CT-A 내관(PC6)+공손(SP4): 심흉위 — 심계·흉통·구역·위통·불면
  → 공손 먼저, 내관 후 자침
- CT-B 외관(TE5)+족임읍(GB41): 측두·견협 — 편두통·어깨통·협늑통·이명
  → 족임읍 먼저, 외관 후 자침
- CT-C 후계(SI3)+신맥(BL62): 후두·경추·척추 — 후두통·경항통·요통·간질
  → 신맥 먼저, 후계 후 자침
- CT-D 열결(LU7)+조해(KI6): 폐·인후·흉 — 기침·천식·인후통·불면
  → 조해 먼저, 열결 후 자침

## 처방 원칙
1. **환측(마비·통증 쪽) 방혈, 건측(반대쪽) 자침** — 구안와사·마비 질환 시 필수 명시
2. **원위혈 우선** — 총통침은 반드시 원위혈 먼저
3. **동씨침 병자(倂刺)** — 영골·대백, 통관·통산·통천 등 짝혈 함께 사용
4. **사암침 허실 구분** — 정격은 허증, 승격은 실증

## 출력 형식
환자 진단을 분석하여 한국어로 다음 구조로 답하시오:

**[핵심 처방]**
가장 중요한 혈위 3~5개를 별(★)로 중요도 표시

**[1. 정경침 처방]**
선택 경혈과 자침 방법 (환측/건측, 보사)

**[2. 사암침 처방]**
해당 장부 정격 또는 승격 (보사 4혈 명시)

**[3. 동씨침 처방]**
추천 혈위와 병자 여부

**[4. 총통침 처방]**
해당 쌍(CT-A~D)과 자침 순서

**[가감 처방]**
세부 증상별 추가 혈위

**[임상 포인트]**
주의사항 1~2줄

간결하고 실용적으로. 한의사가 바로 임상에서 쓸 수 있는 수준으로 작성.`;

// ── Screen ────────────────────────────────────────────────────────────────────

export function QuickPrescriptionScreen() {
  const colors = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const toggleChip = (diagnosis: string) => {
    setInput((prev) => {
      const parts = prev.split(/[,，、\s]+/).map((s) => s.trim()).filter(Boolean);
      if (parts.includes(diagnosis)) {
        return parts.filter((p) => p !== diagnosis).join(', ');
      }
      return parts.length ? `${prev.trim()}, ${diagnosis}` : diagnosis;
    });
  };

  const isChipSelected = (d: string) =>
    input.split(/[,，、\s]+/).map((s) => s.trim()).includes(d);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    if (!CLAUDE_API_KEY) {
      setError('.env.local에 EXPO_PUBLIC_CLAUDE_KEY를 설정해 주세요.');
      return;
    }

    setIsLoading(true);
    setResult('');
    setError('');

    try {
      const userMsg = `환자 정보 및 진단:\n${input.trim()}\n\n위 환자에게 최적의 침 처방을 제시해 주세요.`;
      const text = await callClaude(SYSTEM_PROMPT, userMsg, CLAUDE_API_KEY, 2000);
      setResult(text);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300);
    } catch (e) {
      setError(e instanceof Error ? e.message : '처방 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.surface0 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Input section ──────────────────────────────────────────────── */}
        <View style={[styles.inputCard, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
          <Text style={[styles.inputLabel, { color: colors.textPrimary }]}>
            진단·증상 입력
          </Text>
          <TextInput
            style={[styles.textInput, { color: colors.textPrimary, borderColor: colors.border, backgroundColor: colors.surface0 }]}
            placeholder={'예: 구안와사, 두통, 이명, 30대 남성'}
            placeholderTextColor={colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            returnKeyType="default"
          />

          {/* Quick-select chips */}
          <View style={styles.chipWrap}>
            {QUICK_DIAGNOSES.map((d) => {
              const sel = isChipSelected(d);
              return (
                <Pressable
                  key={d}
                  onPress={() => toggleChip(d)}
                  style={[
                    styles.quickChip,
                    {
                      backgroundColor: sel ? colors.accentFill : colors.surface2,
                      borderColor: sel ? colors.accentFill : colors.border,
                    },
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: sel }}
                >
                  <Text style={[styles.quickChipText, { color: sel ? colors.accentText : colors.textSecondary }]}>
                    {d}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Generate button */}
          <Pressable
            style={[
              styles.generateBtn,
              { backgroundColor: input.trim() && !isLoading ? colors.accentFill : colors.surface2 },
            ]}
            onPress={handleGenerate}
            disabled={!input.trim() || isLoading}
            accessibilityRole="button"
            accessibilityLabel="침 처방 생성"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.accentText} />
            ) : (
              <Text style={[styles.generateBtnText, { color: input.trim() ? colors.accentText : colors.textMuted }]}>
                처방 생성 →
              </Text>
            )}
          </Pressable>
        </View>

        {/* ── Error ──────────────────────────────────────────────────────── */}
        {!!error && (
          <View style={[styles.errorBox, { backgroundColor: '#FFF1F0', borderColor: '#FFA39E' }]}>
            <Text style={[styles.errorText, { color: '#CF1322' }]}>{error}</Text>
          </View>
        )}

        {/* ── Loading placeholder ─────────────────────────────────────────── */}
        {isLoading && (
          <View style={[styles.loadingCard, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
            <ActivityIndicator size="large" color={colors.accentFill} />
            <Text style={[styles.loadingText, { color: colors.textMuted }]}>
              사암침·동씨침·총통침 처방 분석 중…
            </Text>
          </View>
        )}

        {/* ── Reference lookup shortcuts ────────────────────────────────────── */}
        <View style={styles.refRow}>
          <Pressable
            style={[styles.refButton, { backgroundColor: colors.surface1, borderColor: colors.border }]}
            onPress={() => navigation.navigate('SaamLookup')}
            accessibilityRole="button"
            accessibilityLabel="사암침 프로토콜 참고"
          >
            <Text style={[styles.refLabel, { color: colors.textPrimary }]}>사암침</Text>
          </Pressable>
          <Pressable
            style={[styles.refButton, { backgroundColor: colors.surface1, borderColor: colors.border }]}
            onPress={() => navigation.navigate('DongsLookup')}
            accessibilityRole="button"
            accessibilityLabel="동씨침 혈위 참고"
          >
            <Text style={[styles.refLabel, { color: colors.textPrimary }]}>동씨침</Text>
          </Pressable>
          <Pressable
            style={[styles.refButton, { backgroundColor: colors.surface1, borderColor: colors.border }]}
            onPress={() => navigation.navigate('ChongtongLookup')}
            accessibilityRole="button"
            accessibilityLabel="총통침 프로토콜 참고"
          >
            <Text style={[styles.refLabel, { color: colors.textPrimary }]}>총통침</Text>
          </Pressable>
          <Pressable
            style={[styles.refButton, { backgroundColor: colors.surface1, borderColor: colors.border }]}
            onPress={() => navigation.navigate('DongsArchive')}
            accessibilityRole="button"
            accessibilityLabel="동씨침 원문 아카이브"
          >
            <Text style={[styles.refLabel, { color: colors.textPrimary }]}>원문 아카이브</Text>
          </Pressable>
        </View>

        {/* ── Result ─────────────────────────────────────────────────────── */}
        {!!result && !isLoading && (
          <View style={[styles.resultCard, { backgroundColor: colors.surface1, borderColor: colors.border }]}>
            <View style={styles.resultHeader}>
              <Text style={[styles.resultTitle, { color: colors.textPrimary }]}>처방 결과</Text>
              <Pressable
                onPress={() => { setResult(''); setInput(''); }}
                style={[styles.clearBtn, { backgroundColor: colors.surface2 }]}
                accessibilityRole="button"
                accessibilityLabel="초기화"
              >
                <Text style={[styles.clearBtnText, { color: colors.textMuted }]}>초기화</Text>
              </Pressable>
            </View>
            <View style={[styles.resultDivider, { backgroundColor: colors.border }]} />
            <PrescriptionText
              text={result}
              colors={colors}
              onTapCode={(code) => navigation.navigate('AcupointDetail', { code })}
            />
          </View>
        )}

        <View style={{ height: spacing[10] }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ── Prescription text renderer ────────────────────────────────────────────────
// Renders **bold** markers and section headers with styled typography.

function renderInlineSegment(
  text: string,
  isBold: boolean,
  onTapCode: (code: string) => void,
  colors: ReturnType<typeof useTheme>,
  keyPrefix: string,
) {
  const codeParts = text.split(ACUPOINT_CODE_RE);
  return codeParts.map((cp, k) => {
    const isCode = k % 2 === 1;
    const style = isCode
      ? styles.codeText
      : isBold
      ? [styles.boldText, { color: colors.textPrimary }]
      : { color: colors.textSecondary };
    return isCode ? (
      <Text
        key={`${keyPrefix}-${k}`}
        style={[styles.codeText, { color: colors.accentFill, backgroundColor: colors.accentSubtle }]}
        onPress={() => onTapCode(cp)}
        suppressHighlighting
      >
        {cp}
      </Text>
    ) : (
      <Text
        key={`${keyPrefix}-${k}`}
        style={isBold ? [styles.boldText, { color: colors.textPrimary }] : undefined}
      >
        {cp}
      </Text>
    );
  });
}

function PrescriptionText({
  text,
  colors,
  onTapCode,
}: {
  text: string;
  colors: ReturnType<typeof useTheme>;
  onTapCode: (code: string) => void;
}) {
  const lines = text.split('\n');

  return (
    <View style={styles.prescriptionBody}>
      {lines.map((line, i) => {
        const isSectionHeader = line.startsWith('**[') && line.includes(']**');
        const isEmpty = line.trim() === '';

        if (isEmpty) return <View key={i} style={{ height: spacing[2] }} />;

        if (isSectionHeader) {
          const title = line.replace(/\*\*/g, '').replace(/^\[/, '').replace(/\]$/, '');
          return (
            <View key={i} style={[styles.sectionHeader, { backgroundColor: colors.accentSubtle }]}>
              <Text style={[styles.sectionHeaderText, { color: colors.accentFill }]}>{title}</Text>
            </View>
          );
        }

        // Split on ** for bold, then within each segment detect acupoint codes
        const boldParts = line.split('**');
        return (
          <Text key={i} style={[styles.prescriptionLine, { color: colors.textSecondary }]}>
            {boldParts.map((part, j) =>
              renderInlineSegment(part, j % 2 === 1, onTapCode, colors, `${i}-${j}`),
            )}
          </Text>
        );
      })}
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: spacing[4],
    gap: spacing[4],
  },
  inputCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  inputLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  textInput: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing[3],
    fontSize: typography.fontSize.base,
    minHeight: 80,
    lineHeight: typography.fontSize.base * 1.6,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  quickChip: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1] + 2,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  quickChipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
  },
  generateBtn: {
    borderRadius: radii.md,
    paddingVertical: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  generateBtnText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  refRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  refButton: {
    flexGrow: 1,
    flexBasis: '45%',
    borderRadius: radii.md,
    borderWidth: 1,
    paddingVertical: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  refLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  errorBox: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing[3],
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.5,
  },
  loadingCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing[8],
    alignItems: 'center',
    gap: spacing[3],
  },
  loadingText: {
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
  },
  resultCard: {
    borderRadius: radii.lg,
    borderWidth: 1,
    padding: spacing[4],
    gap: spacing[3],
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  clearBtn: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: radii.sm,
  },
  clearBtnText: {
    fontSize: typography.fontSize.sm,
  },
  resultDivider: {
    height: 1,
  },
  prescriptionBody: {
    gap: 2,
  },
  sectionHeader: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: radii.sm,
    marginTop: spacing[2],
    marginBottom: spacing[1],
  },
  sectionHeaderText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  prescriptionLine: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.fontSize.sm * 1.7,
  },
  boldText: {
    fontWeight: typography.fontWeight.medium,
  },
  codeText: {
    fontWeight: typography.fontWeight.medium,
    borderRadius: 3,
    overflow: 'hidden',
    paddingHorizontal: 2,
  },
});
