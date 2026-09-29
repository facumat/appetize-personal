import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../../components/Button';
import { Loafy } from '../../../components/Loafy';
import { getCourse } from '../../../data/courses';
import { useAppState } from '../../../state/AppState';
import { colors, font, radius, spacing } from '../../../theme';

export default function LessonScreen() {
  const { courseId, lessonId } = useLocalSearchParams<{ courseId: string; lessonId: string }>();
  const { isPro, isLessonComplete, toggleLessonComplete } = useAppState();
  const [celebrating, setCelebrating] = useState(false);

  const course = getCourse(courseId);
  const index = course?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  const lesson = course?.lessons[index];
  if (!course || !lesson) return null;
  if (!isPro && !lesson.free) return <Redirect href={{ pathname: '/paywall', params: { source: 'lesson' } }} />;

  const complete = isLessonComplete(course.id, lesson.id);
  const nextLesson = course.lessons[index + 1];

  const markComplete = () => {
    if (!complete) {
      toggleLessonComplete(course.id, lesson.id);
      setCelebrating(true);
    } else toggleLessonComplete(course.id, lesson.id);
  };

  const goNext = () => {
    setCelebrating(false);
    if (!nextLesson) return router.back();
    if (isPro || nextLesson.free) router.replace(`/lesson/${course.id}/${nextLesson.id}`);
    else router.push({ pathname: '/paywall', params: { source: 'lesson' } });
  };

  return (
    <SafeAreaView style={styles.screen} testID={`screen-lesson-${lesson.id}`}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} testID="lesson-back" accessibilityLabel="Back">
          <MaterialCommunityIcons name="arrow-left" size={26} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {course.title}
        </Text>
        <Text style={font.caption}>
          {index + 1}/{course.lessons.length}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={font.title}>{lesson.title}</Text>
        <Text style={font.caption}>{lesson.minutes} min read</Text>
        <Text style={[font.body, styles.summary]}>{lesson.summary}</Text>

        {lesson.ingredients ? (
          <View style={styles.card} testID="lesson-ingredients">
            <View style={styles.row}>
              <Text style={[styles.th, { flex: 1, textAlign: 'left' }]}>Ingredient</Text>
              <Text style={styles.th}>Grams</Text>
              <Text style={styles.th}>Baker’s %</Text>
            </View>
            {lesson.ingredients.map((ing) => (
              <View key={ing.name} style={styles.row}>
                <Text style={[font.body, { flex: 1 }]}>{ing.name}</Text>
                <Text style={styles.td}>{ing.grams} g</Text>
                <Text style={[styles.td, styles.pct]}>{ing.percent}%</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Text style={font.heading}>Steps</Text>
        {lesson.steps.map((step, i) => (
          <View key={step} style={styles.step}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{i + 1}</Text>
            </View>
            <Text style={[font.body, { flex: 1 }]}>{step}</Text>
          </View>
        ))}

        <View style={styles.tip} testID="lesson-tip">
          <Loafy mood="idle" size={72} />
          <View style={{ flex: 1 }}>
            <Text style={styles.tipLabel}>LOAFY’S TIP</Text>
            <Text style={font.body}>{lesson.tip}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={complete ? 'Completed ✓' : 'Mark as complete'}
          variant={complete ? 'secondary' : 'primary'}
          onPress={markComplete}
          testID="lesson-complete"
        />
      </View>

      <Modal
        visible={celebrating}
        transparent
        animationType="fade"
        onRequestClose={() => setCelebrating(false)}
        navigationBarTranslucent
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <View style={styles.celebrate} testID="lesson-celebration">
            <Loafy mood="celebrate" size={200} />
            <Text style={[font.title, { textAlign: 'center' }]}>Beautiful bake!</Text>
            <Text style={[font.body, { textAlign: 'center', color: colors.textMuted }]}>
              You finished “{lesson.title}”.
            </Text>
            <Button
              title={nextLesson ? 'Next lesson' : 'Back to course'}
              onPress={goNext}
              style={{ alignSelf: 'stretch' }}
              testID="lesson-next"
            />
            <Button
              title="Stay here"
              variant="ghost"
              onPress={() => setCelebrating(false)}
              testID="lesson-celebrate-dismiss"
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: spacing.md },
  summary: { color: colors.textMuted },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  th: { fontSize: 12, fontWeight: '800', color: colors.textMuted, minWidth: 64, textAlign: 'right' },
  td: { fontSize: 15, color: colors.text, minWidth: 64, textAlign: 'right' },
  pct: { fontWeight: '800', color: colors.crust },
  step: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.crust,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  stepNumText: { color: colors.white, fontWeight: '800' },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.goldenSoft,
  },
  tipLabel: { fontSize: 11, fontWeight: '800', color: colors.crustDark, letterSpacing: 0.6, marginBottom: 2 },
  footer: { padding: spacing.lg, paddingTop: spacing.sm },
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'center', padding: spacing.lg },
  celebrate: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
});
