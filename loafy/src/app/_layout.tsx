import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppStateProvider } from '../state/AppState';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="paywall" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
          <Stack.Screen name="course/[id]" />
          <Stack.Screen name="lesson/[courseId]/[lessonId]" />
        </Stack>
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
