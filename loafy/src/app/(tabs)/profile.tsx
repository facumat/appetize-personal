import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { Loafy } from '../../components/Loafy';
import { ProBadge } from '../../components/ProBadge';
import { courses } from '../../data/courses';
import { getPlan } from '../../data/plans';
import { useAppState } from '../../state/AppState';
import { colors, font, radius, spacing } from '../../theme';

const experienceLabel = { new: 'Brand new baker', some: 'Home baker', seasoned: 'Seasoned baker' };

export default function Profile() {
  const { profile, plan, isPro, completedLessons, cancelSubscription, reset } = useAppState();
  const total = courses.reduce((n, c) => n + c.lessons.length, 0);

  const confirmReset = () =>
    Alert.alert('Reset demo?', 'This clears your profile, purchases and progress.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          reset();
          router.replace('/onboarding');
        },
      },
    ]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']} testID="screen-profile">
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatar}>
          <Loafy mood="wave" size={140} />
          <Text style={font.title} testID="profile-name">
            {profile.name || 'Baker'}
          </Text>
          <Text style={font.caption}>{profile.experience ? experienceLabel[profile.experience] : 'Baker'}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue} testID="profile-lessons-completed">
              {completedLessons.length}
            </Text>
            <Text style={font.caption}>Lessons baked</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{Math.round((completedLessons.length / total) * 100)}%</Text>
            <Text style={font.caption}>Of all courses</Text>
          </View>
        </View>

        <View style={styles.card} testID="profile-subscription">
          <View style={styles.row}>
            <MaterialCommunityIcons name="crown" size={24} color={isPro ? colors.golden : colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{isPro ? 'Loafy Pro' : 'Free plan'}</Text>
              <Text style={font.caption} testID="profile-plan">
                {plan ? `${getPlan(plan).title} · ${getPlan(plan).price}` : 'Limited to free lessons'}
              </Text>
            </View>
            {isPro ? <ProBadge label="ACTIVE" /> : null}
          </View>
          {isPro ? (
            <Button
              title="Cancel subscription"
              variant="secondary"
              onPress={cancelSubscription}
              testID="profile-cancel-subscription"
            />
          ) : (
            <Button
              title="Upgrade to Pro"
              onPress={() => router.push({ pathname: '/paywall', params: { source: 'profile' } })}
              testID="profile-upgrade"
            />
          )}
        </View>

        <Pressable style={styles.reset} onPress={confirmReset} testID="profile-reset">
          <MaterialCommunityIcons name="restart" size={20} color={colors.textMuted} />
          <Text style={styles.resetText}>Reset demo</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  avatar: { alignItems: 'center', gap: 2 },
  stats: { flexDirection: 'row', gap: spacing.md },
  stat: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: { fontSize: 26, fontWeight: '800', color: colors.crust },
  card: {
    padding: spacing.md,
    gap: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
  reset: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: spacing.md },
  resetText: { ...font.body, color: colors.textMuted },
});
