import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { Loafy } from '../components/Loafy';
import { getPlan, Plan, plans, proPerks } from '../data/plans';
import { PlanId, useAppState } from '../state/AppState';
import { colors, font, radius, spacing } from '../theme';

type Phase = 'choose' | 'confirm' | 'processing' | 'success';

export default function Paywall() {
  const { source } = useLocalSearchParams<{ source?: string }>();
  const { profile, purchase } = useAppState();
  const [selected, setSelected] = useState<PlanId>('yearly');
  const [phase, setPhase] = useState<Phase>('choose');
  const plan = getPlan(selected);

  const leave = () => {
    if (source === 'onboarding' || !router.canGoBack()) router.replace('/(tabs)');
    else router.back();
  };

  const confirm = () => {
    setPhase('processing');
    setTimeout(() => {
      purchase(selected);
      setPhase('success');
    }, 1600);
  };

  const restore = () =>
    Alert.alert('Nothing to restore', 'We could not find a previous Loafy Pro purchase on this account.');

  if (phase === 'success') {
    return (
      <SafeAreaView style={[styles.screen, styles.center]} testID="screen-purchase-success">
        <Loafy mood="celebrate" size={260} />
        <Text style={styles.title}>You’re a Pro baker{profile.name ? `, ${profile.name}` : ''}!</Text>
        <Text style={styles.subtitle}>
          {plan.trialDays
            ? `Your ${plan.trialDays}-day free trial has started. Every course is now unlocked.`
            : 'Every course is now unlocked. Time to preheat the oven.'}
        </Text>
        <Button title="Start baking" onPress={leave} style={styles.fullWidth} testID="purchase-success-continue" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen} testID="screen-paywall">
      <View style={styles.topBar}>
        <Pressable onPress={leave} hitSlop={12} testID="paywall-close" accessibilityLabel="Close">
          <MaterialCommunityIcons name="close" size={26} color={colors.textMuted} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Loafy mood="idle" size={110} />
          <Text style={styles.title}>Unlock Loafy Pro</Text>
          <Text style={styles.subtitle}>
            {profile.name ? `${profile.name}, your` : 'Your'} personal baking path is ready. Go Pro to bake every
            recipe, step by step.
          </Text>
        </View>

        <View style={styles.perks}>
          {proPerks.map((perk) => (
            <View key={perk.text} style={styles.perk}>
              <View style={styles.perkIcon}>
                <MaterialCommunityIcons name={perk.icon} size={20} color={colors.crust} />
              </View>
              <Text style={styles.perkText}>{perk.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.plans}>
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} selected={p.id === selected} onPress={() => setSelected(p.id)} />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={plan.trialDays ? `Start ${plan.trialDays}-day free trial` : `Continue with ${plan.title}`}
          onPress={() => setPhase('confirm')}
          testID="paywall-cta"
        />
        <Text style={styles.legal}>
          {plan.trialDays
            ? `Free for ${plan.trialDays} days, then ${plan.price}${plan.period}. Cancel anytime.`
            : `${plan.price} ${plan.period === 'once' ? 'one-time payment' : plan.period}.`}
        </Text>
        <View style={styles.links}>
          <Pressable onPress={restore} testID="paywall-restore">
            <Text style={styles.link}>Restore purchases</Text>
          </Pressable>
          <Text style={styles.legal}>·</Text>
          <Text style={styles.link}>Terms</Text>
          <Text style={styles.legal}>·</Text>
          <Text style={styles.link}>Privacy</Text>
        </View>
      </View>

      <PurchaseSheet
        visible={phase === 'confirm' || phase === 'processing'}
        processing={phase === 'processing'}
        plan={plan}
        onCancel={() => setPhase('choose')}
        onConfirm={confirm}
      />
    </SafeAreaView>
  );
}

function PlanCard({ plan, selected, onPress }: { plan: Plan; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      testID={`plan-${plan.id}`}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      style={[styles.plan, selected && styles.planSelected]}
    >
      <MaterialCommunityIcons
        name={selected ? 'radiobox-marked' : 'radiobox-blank'}
        size={24}
        color={selected ? colors.crust : colors.border}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.planTitle}>{plan.title}</Text>
        <Text style={font.caption}>{plan.detail}</Text>
      </View>
      <Text style={styles.planPrice}>
        {plan.price}
        <Text style={font.caption}> {plan.period}</Text>
      </Text>
      {plan.badge ? (
        <View style={styles.planBadge}>
          <Text style={styles.planBadgeText}>{plan.badge}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

type SheetProps = {
  visible: boolean;
  processing: boolean;
  plan: Plan;
  onCancel: () => void;
  onConfirm: () => void;
};

/** Mocked app-store confirmation sheet. No real payment happens. */
function PurchaseSheet({ visible, processing, plan, onCancel, onConfirm }: SheetProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCancel} navigationBarTranslucent statusBarTranslucent>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={processing ? undefined : onCancel} />
        <View style={[styles.sheet, { paddingBottom: spacing.md + insets.bottom }]} testID="purchase-sheet">
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <View style={styles.appIcon}>
              <Text style={{ fontSize: 26 }}>🍞</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.planTitle}>Loafy Pro ({plan.title})</Text>
              <Text style={font.caption}>Loafy: Learn to Bake Bread</Text>
            </View>
          </View>
          <View style={styles.sheetRow}>
            <Text style={font.body}>{plan.trialDays ? 'Starting today' : 'Total'}</Text>
            <Text style={[font.body, styles.bold]}>{plan.trialDays ? 'Free' : plan.price}</Text>
          </View>
          {plan.trialDays ? (
            <View style={styles.sheetRow}>
              <Text style={font.body}>After {plan.trialDays} days</Text>
              <Text style={[font.body, styles.bold]}>
                {plan.price}
                {plan.period}
              </Text>
            </View>
          ) : null}
          <View style={styles.sheetRow}>
            <Text style={font.caption}>Account</Text>
            <Text style={font.caption}>baker@loafy.app</Text>
          </View>
          <Text style={styles.mockNote}>Demo checkout — you will not be charged.</Text>
          <Button
            title={plan.id === 'lifetime' ? 'Buy' : 'Subscribe'}
            onPress={onConfirm}
            loading={processing}
            testID="purchase-confirm"
          />
          <Button title="Cancel" variant="ghost" onPress={onCancel} disabled={processing} testID="purchase-cancel" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center', gap: spacing.sm, padding: spacing.lg },
  fullWidth: { alignSelf: 'stretch', marginTop: spacing.lg },
  topBar: { alignItems: 'flex-end', paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  hero: { alignItems: 'center', gap: spacing.sm },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  title: { ...font.title, textAlign: 'center' },
  subtitle: { ...font.body, color: colors.textMuted, textAlign: 'center' },
  perks: { gap: 10, marginVertical: spacing.md },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  perkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.goldenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkText: { ...font.body, fontWeight: '600', flex: 1 },
  plans: { gap: 12, marginTop: spacing.sm },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  planSelected: { borderColor: colors.crust, backgroundColor: colors.surfaceWarm },
  planTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  planPrice: { fontSize: 17, fontWeight: '800', color: colors.text },
  planBadge: {
    position: 'absolute',
    top: -11,
    right: 16,
    backgroundColor: colors.golden,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  planBadgeText: { fontSize: 11, fontWeight: '800', color: colors.crustDark },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
  legal: { ...font.caption, textAlign: 'center' },
  links: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  link: { ...font.caption, textDecorationLine: 'underline' },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  handle: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: colors.border },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  appIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.goldenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bold: { fontWeight: '700' },
  mockNote: { ...font.caption, textAlign: 'center', fontStyle: 'italic' },
});
