import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { RootNavigator } from './src/navigation';
import { SessionProvider } from './src/context/SessionContext';

export default function App() {
  const scheme = useColorScheme();
  return (
    <SessionProvider>
      <RootNavigator />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </SessionProvider>
  );
}
