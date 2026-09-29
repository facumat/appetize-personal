import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { useAppState } from '../state/AppState';
import { colors } from '../theme';

export default function Index() {
  const { ready, onboarded } = useAppState();
  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  return <Redirect href={onboarded ? '/(tabs)' : '/onboarding'} />;
}
