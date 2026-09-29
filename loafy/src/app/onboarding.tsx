import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { Loafy } from '../components/Loafy';
import { OptionCard } from '../components/OptionCard';
import { ProgressBar } from '../components/ProgressBar';
import { Experience, Goal, useAppState } from '../state/AppState';
import { colors, font, radius, spacing } from '../theme';

const experiences: { id: Experience; emoji: string; title: string; description: string }[] = [
  { id: 'new', emoji: '🥚', title: 'Brand new', description: "I've never baked bread before" },
  { id: 'some', emoji: '🍞', title: 'A few loaves', description: 'I can follow a basic recipe' },
  { id: 'seasoned', emoji: '👩‍🍳', title: 'Seasoned baker', description: 'Bring on the laminated doughs' },
];

const interests = [
  { id: 'principles', emoji: '🌾', title: 'Bread fundamentals', description: 'Gluten, fermentation, shaping' },
  { id: 'brioche', emoji: '🧈', title: 'Enriched breads', description: 'Brioche, challah, milk bread' },
  { id: 'panettone', emoji: '🎄', title: 'Holiday breads', description: 'Panettone, stollen, pandoro' },
  { id: 'sourdough', emoji: '🫙', title: 'Sourdough', description: 'Wild yeast and rustic loaves' },
];

const goals: { id: Goal; emoji: string; title: string; description: string }[] = [
  { id: 'casual', emoji: '☕', title: 'Casual', description: 'A bake now and then' },
  { id: 'weekly', emoji: '📅', title: 'Weekly baker', description: 'One project every week' },
  { id: 'pro', emoji: '🔥', title: 'Obsessed', description: 'I want to bake like a pro' },
];

const plansFor = (name: string) => [
  'Measuring your flour power…',
  'Picking recipes for your level…',
  `Building ${name ? `${name}'s` : 'your'} baking path…`,
];

type Step = 'welcome' | 'name' | 'experience' | 'interests' | 'goal' | 'personalizing';
const STEPS: Step[] = ['welcome', 'name', 'experience', 'interests', 'goal', 'personalizing'];
const QUESTION_STEPS = STEPS.filter((s) => s !== 'welcome' && s !== 'personalizing');

export default function Onboarding() {
  const { completeOnboarding } = useAppState();
  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState('');
  const [experience, setExperience] = useState<Experience>();
  const [picked, setPicked] = useState<string[]>([]);
  const [goal, setGoal] = useState<Goal>();
  const [checks, setChecks] = useState(0);

  const next = () => setStep(STEPS[STEPS.indexOf(step) + 1]);
  const back = () => setStep(STEPS[STEPS.indexOf(step) - 1]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (step === 'welcome' || step === 'personalizing') return false;
      back();
      return true;
    });
    return () => sub.remove();
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (step !== 'personalizing') return;
    const timers = [1, 2, 3].map((n) => setTimeout(() => setChecks(n), n * 900));
    const done = setTimeout(() => {
      completeOnboarding({ name: name.trim(), experience, interests: picked, goal });
      router.replace({ pathname: '/paywall', params: { source: 'onboarding' } });
    }, 3600);
    return () => [...timers, done].forEach(clearTimeout);
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  if (step === 'welcome') {
    return (
      <SafeAreaView style={styles.screen} testID="screen-onboarding-welcome">
        <View style={styles.center}>
          <Loafy mood="wave" size={260} />
          <Text style={styles.hero}>Hi, I’m Loafy!</Text>
          <Text style={styles.heroBody}>
            Your pocket baking coach. From your first loaf to a towering panettone, I’ll guide every fold.
          </Text>
        </View>
        <Button title="Let's get baking" onPress={next} testID="onboarding-start" />
      </SafeAreaView>
    );
  }

  if (step === 'personalizing') {
    return (
      <SafeAreaView style={styles.screen} testID="screen-onboarding-personalizing">
        <View style={styles.center}>
          <Loafy mood="proofing" size={240} />
          <Text style={styles.heading}>Proofing your plan…</Text>
          <View style={styles.checklist}>
            {plansFor(name.trim()).map((label, i) => (
              <View key={label} style={styles.checkRow}>
                <MaterialCommunityIcons
                  name={checks > i ? 'check-circle' : 'circle-outline'}
                  size={22}
                  color={checks > i ? colors.success : colors.border}
                />
                <Text style={[styles.checkText, checks > i && styles.checkDone]}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const questionIndex = QUESTION_STEPS.indexOf(step);
  const canContinue =
    (step === 'name' && name.trim().length > 0) ||
    (step === 'experience' && !!experience) ||
    (step === 'interests' && picked.length > 0) ||
    (step === 'goal' && !!goal);

  return (
    <SafeAreaView style={styles.screen} testID={`screen-onboarding-${step}`}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Pressable onPress={back} testID="onboarding-back" hitSlop={12} accessibilityLabel="Back">
            <MaterialCommunityIcons name="arrow-left" size={26} color={colors.text} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <ProgressBar progress={(questionIndex + 1) / QUESTION_STEPS.length} testID="onboarding-progress" />
          </View>
          <Text style={font.caption}>
            {questionIndex + 1}/{QUESTION_STEPS.length}
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <View style={styles.bubbleRow}>
            <Loafy mood="idle" size={84} />
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>{questionFor(step, name.trim())}</Text>
            </View>
          </View>

          {step === 'name' && (
            <TextInput
              testID="onboarding-name-input"
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              autoFocus
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => canContinue && next()}
              maxLength={24}
            />
          )}

          {step === 'experience' &&
            experiences.map((o) => (
              <OptionCard
                key={o.id}
                testID={`experience-${o.id}`}
                {...o}
                selected={experience === o.id}
                onPress={() => setExperience(o.id)}
              />
            ))}

          {step === 'interests' &&
            interests.map((o) => (
              <OptionCard
                key={o.id}
                testID={`interest-${o.id}`}
                {...o}
                selected={picked.includes(o.id)}
                onPress={() =>
                  setPicked((p) => (p.includes(o.id) ? p.filter((x) => x !== o.id) : [...p, o.id]))
                }
              />
            ))}

          {step === 'goal' &&
            goals.map((o) => (
              <OptionCard
                key={o.id}
                testID={`goal-${o.id}`}
                {...o}
                selected={goal === o.id}
                onPress={() => setGoal(o.id)}
              />
            ))}
        </ScrollView>

        <Button title="Continue" onPress={next} disabled={!canContinue} testID="onboarding-continue" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function questionFor(step: Step, name: string) {
  switch (step) {
    case 'name':
      return 'First things first — what should I call you?';
    case 'experience':
      return `Nice to meet you${name ? `, ${name}` : ''}! How much bread have you baked?`;
    case 'interests':
      return 'What would you love to bake? Pick as many as you like.';
    case 'goal':
      return 'How much time do you want to spend with dough?';
    default:
      return '';
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  hero: { ...font.title, fontSize: 34, textAlign: 'center' },
  heroBody: { ...font.body, color: colors.textMuted, textAlign: 'center', paddingHorizontal: spacing.md },
  heading: { ...font.heading, fontSize: 24 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingBottom: spacing.md },
  body: { gap: spacing.md, paddingVertical: spacing.md },
  bubbleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  bubble: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderTopLeftRadius: 4,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleText: { ...font.body, fontWeight: '600' },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 58,
    fontSize: 18,
    color: colors.text,
  },
  checklist: { gap: spacing.md, marginTop: spacing.md, alignSelf: 'stretch', paddingHorizontal: spacing.lg },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  checkText: { ...font.body, color: colors.textMuted },
  checkDone: { color: colors.text, fontWeight: '600' },
});
