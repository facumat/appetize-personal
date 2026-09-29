import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Course } from '../data/courses';
import { colors, font, radius, spacing } from '../theme';
import { ProBadge } from './ProBadge';
import { ProgressBar } from './ProgressBar';

type Props = { course: Course; completed: number; isPro: boolean; onPress: () => void };

export function CourseCard({ course, completed, isPro, onPress }: Props) {
  const free = course.lessons.filter((l) => l.free).length;
  return (
    <Pressable
      onPress={onPress}
      testID={`course-card-${course.id}`}
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.9 }]}
    >
      <View style={[styles.art, { backgroundColor: course.color }]}>
        <Text style={styles.emoji}>{course.emoji}</Text>
      </View>
      <View style={styles.info}>
        {course.pro && !isPro ? <ProBadge /> : <Text style={styles.freeTag}>{isPro ? 'UNLOCKED' : `${free} FREE LESSONS`}</Text>}
        <Text style={styles.title}>{course.title}</Text>
        <Text style={font.caption} numberOfLines={1}>
          {course.subtitle}
        </Text>
        <View style={styles.meta}>
          <MaterialCommunityIcons name="signal-cellular-2" size={14} color={colors.textMuted} />
          <Text style={font.caption}>{course.level}</Text>
          <MaterialCommunityIcons name="clock-outline" size={14} color={colors.textMuted} />
          <Text style={font.caption}>{course.totalTime}</Text>
        </View>
        <ProgressBar progress={completed / course.lessons.length} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: 12,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  art: { width: 96, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', minHeight: 120 },
  emoji: { fontSize: 44 },
  info: { flex: 1, gap: 5 },
  freeTag: { fontSize: 11, fontWeight: '800', color: colors.success, letterSpacing: 0.5 },
  title: { ...font.heading, fontSize: 18 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
});
