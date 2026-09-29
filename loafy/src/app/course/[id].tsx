import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { ProBadge } from '../../components/ProBadge';
import { getCourse, Lesson } from '../../data/courses';
import { useAppState } from '../../state/AppState';
import { colors, font, radius, spacing } from '../../theme';

export default function CourseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const course = getCourse(id);
  const { isPro, isLessonComplete } = useAppState();
  const insets = useSafeAreaInsets();

  if (!course) return null;

  const open = (lesson: Lesson) => {
    if (isPro || lesson.free) router.push(`/lesson/${course.id}/${lesson.id}`);
    else router.push({ pathname: '/paywall', params: { source: 'course' } });
  };
  const next = course.lessons.find((l) => !isLessonComplete(course.id, l.id)) ?? course.lessons[0];
  const nextLocked = !isPro && !next.free;
  const done = course.lessons.filter((l) => isLessonComplete(course.id, l.id)).length;

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']} testID={`screen-course-${course.id}`}>
      <Pressable
        onPress={() => router.back()}
        style={[styles.back, { top: insets.top + spacing.sm }]}
        testID="course-back"
        accessibilityLabel="Back"
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
      </Pressable>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.lg }}>
        <View
          style={[styles.hero, { backgroundColor: course.color, paddingTop: insets.top, height: 200 + insets.top }]}
        >
          <Text style={styles.emoji}>{course.emoji}</Text>
        </View>

        <View style={styles.body}>
          {course.pro && !isPro ? <ProBadge /> : null}
          <Text style={font.title}>{course.title}</Text>
          <View style={styles.stats}>
            <Stat icon="signal-cellular-2" label={course.level} />
            <Stat icon="clock-outline" label={course.totalTime} />
            <Stat icon="book-open-variant" label={`${done}/${course.lessons.length} lessons`} />
          </View>
          <Text style={[font.body, { color: colors.textMuted }]}>{course.description}</Text>

          <Text style={[font.heading, { marginTop: spacing.sm }]}>Lessons</Text>
          {course.lessons.map((lesson, i) => {
            const locked = !isPro && !lesson.free;
            const complete = isLessonComplete(course.id, lesson.id);
            return (
              <Pressable
                key={lesson.id}
                onPress={() => open(lesson)}
                style={styles.lesson}
                testID={`lesson-row-${lesson.id}`}
                accessibilityHint={locked ? 'Locked. Opens Loafy Pro.' : undefined}
              >
                <View style={[styles.index, complete && styles.indexDone]}>
                  {complete ? (
                    <MaterialCommunityIcons name="check" size={18} color={colors.white} />
                  ) : (
                    <Text style={styles.indexText}>{i + 1}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.lessonTitle, locked && { color: colors.textMuted }]}>{lesson.title}</Text>
                  <Text style={font.caption}>{lesson.minutes} min</Text>
                </View>
                {locked ? (
                  <MaterialCommunityIcons name="lock" size={20} color={colors.textMuted} />
                ) : lesson.free && !isPro ? (
                  <Text style={styles.free}>FREE</Text>
                ) : (
                  <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title={nextLocked ? 'Unlock with Loafy Pro' : done === 0 ? 'Start course' : 'Continue course'}
          onPress={() => open(next)}
          testID="course-cta"
        />
      </View>
    </SafeAreaView>
  );
}

function Stat({ icon, label }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }) {
  return (
    <View style={styles.stat}>
      <MaterialCommunityIcons name={icon} size={16} color={colors.crust} />
      <Text style={styles.statText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  hero: { height: 200, alignItems: 'center', justifyContent: 'center' },
  back: {
    position: 'absolute',
    left: spacing.md,
    zIndex: 2,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 88 },
  body: { padding: spacing.lg, gap: spacing.sm },
  stats: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap', marginBottom: spacing.xs },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 14, fontWeight: '600', color: colors.text },
  lesson: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  index: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.goldenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexDone: { backgroundColor: colors.success },
  indexText: { fontWeight: '800', color: colors.crustDark },
  lessonTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  free: { fontSize: 11, fontWeight: '800', color: colors.success, letterSpacing: 0.5 },
  footer: { padding: spacing.lg, paddingTop: spacing.sm },
});
