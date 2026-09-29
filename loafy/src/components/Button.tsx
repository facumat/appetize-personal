import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

import { colors, radius } from '../theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  testID?: string;
};

export function Button({ title, onPress, variant = 'primary', disabled, loading, style, testID }: Props) {
  const inactive = disabled || loading;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      onPress={onPress}
      disabled={inactive}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        inactive && styles.disabled,
        pressed && !inactive && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.crust} />
      ) : (
        <Text style={[styles.label, variant !== 'primary' && styles.labelAlt]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  primary: {
    backgroundColor: colors.crust,
    shadowColor: colors.crustDark,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  secondary: { backgroundColor: colors.surface, borderWidth: 2, borderColor: colors.crust },
  ghost: { backgroundColor: 'transparent', minHeight: 44 },
  disabled: { opacity: 0.45 },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  label: { color: colors.white, fontSize: 17, fontWeight: '700' },
  labelAlt: { color: colors.crust },
});
