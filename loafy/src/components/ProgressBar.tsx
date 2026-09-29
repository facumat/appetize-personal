import { StyleSheet, View } from 'react-native';

import { colors, radius } from '../theme';

export function ProgressBar({ progress, testID }: { progress: number; testID?: string }) {
  const pct = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <View style={styles.track} testID={testID}>
      <View style={[styles.fill, { width: `${pct}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 8, borderRadius: radius.pill, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.golden },
});
