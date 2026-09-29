import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '../theme';

export function ProBadge({ label = 'PRO' }: { label?: string }) {
  return (
    <View style={styles.badge}>
      <MaterialCommunityIcons name="crown" size={12} color={colors.crustDark} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.golden,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 11, fontWeight: '800', color: colors.crustDark, letterSpacing: 0.5 },
});
