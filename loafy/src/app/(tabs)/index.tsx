import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseCard } from '../../components/CourseCard';
import { Loafy } from '../../components/Loafy';
import { ProBadge } from '../../components/ProBadge';
import { courses } from '../../data/courses';
import { useAppState } from '../../state/AppState';
import { colors, font, radius, spacing } from '../../theme';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function Learn() {
  const { profile, isPro, isLessonComplete } = useAppState();

  const ordered = [...courses].sort(
    (a, b) => Number(profile.interests.includes(b.id)) - Number(profile.interests.includes(a.id)),
  );
  const upNext = ordered
    .flatMap((c) => c.lessons.map((l) => ({ course: c, lesson: l })))
    .find(({ course, lesson }) => (isPro || lesson.free) && !isLessonComplete(course.id, lesson.id));
  const lockedCount = courses.flatMap((c) => c.lessons).filter((l) => !l.free).length;

  return (
    <SafeAreaView style={styles.screen} edges={['top']} testID="home">
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={font.caption}>{greeting()},</Text>
            <Text style={styles.name} testID="home-greeting">
              {profile.name || 'Baker'} 👋
            </Text>
            {isPro ? <ProBadge label="PRO MEMBER" /> : null}
          </View>
          <Loafy mood="idle" size={96} />
        </View>

        {upNext ? (
          <Pressable
            style={styles.upNext}
            testID="home-up-next"
            onPress={() => router.push(`/lesson/${upNext.course.id}/${upNext.lesson.id}`)}
          >
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.upNextLabel}>UP NEXT · {upNext.course.title.toUpperCase()}</Text>
              <Text style={styles.upNextTitle}>{upNext.lesson.title}</Text>
              <Text style={styles.upNextMeta}>{upNext.lesson.minutes} min lesson</Text>
            </View>
            <View style={styles.play}>
              <MaterialCommunityIcons name="play" size={28} color={colors.crust} />
            </View>
          </Pressable>
        ) : null}

        {!isPro ? (
          <Pressable
            style={styles.upsell}
            testID="home-upsell"
            onPress={() => router.push({ pathname: '/paywall', params: { source: 'home' } })}
          >
            <MaterialCommunityIcons name="crown" size={28} color={colors.crustDark} />
            <View style={{ flex: 1 }}>
              <Text style={styles.upsellTitle}>Unlock {lockedCount} Pro lessons</Text>
              <Text style={font.caption}>Brioche, panettone and every fundamental. 7 days free.</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.crustDark} />
          </Pressable>
        ) : null}

        <Text style={styles.section}>Courses</Text>
        <View style={{ gap: spacing.md }}>
          {ordered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isPro={isPro}
              completed={course.lessons.filter((l) => isLessonComplete(course.id, l.id)).length}
              onPress={() => router.push(`/course/${course.id}`)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  name: { ...font.title, marginBottom: 4 },
  upNext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.crust,
  },
  upNextLabel: { fontSize: 11, fontWeight: '800', color: colors.goldenSoft, letterSpacing: 0.6 },
  upNextTitle: { fontSize: 20, fontWeight: '800', color: colors.white },
  upNextMeta: { fontSize: 13, color: colors.goldenSoft },
  play: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upsell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.goldenSoft,
    borderWidth: 1,
    borderColor: colors.golden,
  },
  upsellTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  section: { ...font.heading, marginTop: spacing.sm },
});
