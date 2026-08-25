import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme, typography } from '../theme';
import {
  ChiefComplaintScreen,
  AIInterviewScreen,
  BodyMapScreen,
  ClinicalReasoningScreen,
  SOAPNoteScreen,
  DailyTipScreen,
  AcupointDetailScreen,
  SaamLookupScreen,
  DongsLookupScreen,
  ChongtongLookupScreen,
  QuickPrescriptionScreen,
  DongsArchiveScreen,
} from '../screens';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const colors = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ChiefComplaint"
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface1 },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontSize: typography.fontSize.md,
            fontWeight: typography.fontWeight.medium,
          },
          contentStyle: { backgroundColor: colors.surface0 },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="ChiefComplaint"
          component={ChiefComplaintScreen}
          options={{ title: 'Chief complaint' }}
        />
        <Stack.Screen
          name="AIInterview"
          component={AIInterviewScreen}
          options={{ title: 'AI interview' }}
        />
        <Stack.Screen
          name="BodyMap"
          component={BodyMapScreen}
          options={{ title: 'Body map' }}
        />
        <Stack.Screen
          name="ClinicalReasoning"
          component={ClinicalReasoningScreen}
          options={{ title: 'Clinical reasoning' }}
        />
        <Stack.Screen
          name="SOAPNote"
          component={SOAPNoteScreen}
          options={{ title: 'SOAP note' }}
        />
        <Stack.Screen
          name="DailyTip"
          component={DailyTipScreen}
          options={{ title: 'Daily tip' }}
        />
        <Stack.Screen
          name="AcupointDetail"
          component={AcupointDetailScreen}
          options={({ route }) => ({ title: `${route.params.code} 자침 요령` })}
        />
        <Stack.Screen
          name="SaamLookup"
          component={SaamLookupScreen}
          options={{ title: '사암침법 프로토콜' }}
        />
        <Stack.Screen
          name="DongsLookup"
          component={DongsLookupScreen}
          options={{ title: '동씨침법 혈위' }}
        />
        <Stack.Screen
          name="ChongtongLookup"
          component={ChongtongLookupScreen}
          options={{ title: '총통침법 (이원재)' }}
        />
        <Stack.Screen
          name="QuickPrescription"
          component={QuickPrescriptionScreen}
          options={{ title: '처방 조회' }}
        />
        <Stack.Screen
          name="DongsArchive"
          component={DongsArchiveScreen}
          options={{ title: '동씨침 원문 아카이브' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
