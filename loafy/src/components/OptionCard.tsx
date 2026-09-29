import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '../theme';

type Props = {
  emoji: string;
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  testID?: string;
};

export function OptionCard({ emoji, title, description, selected, onPress, testID }: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.card, selected && styles.selected]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      <MaterialCommunityIcons
        name={selected ? 'check-circle' : 'circle-outline'}
        size={26}
        color={selected ? colors.crust : colors.border}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
  },
  selected: { borderColor: colors.crust, backgroundColor: colors.surfaceWarm },
  emoji: { fontSize: 30 },
  text: { flex: 1 },
  title: { fontSize: 17, fontWeight: '700', color: colors.text },
  description: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
});
