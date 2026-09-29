import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Experience = 'new' | 'some' | 'seasoned';
export type Goal = 'casual' | 'weekly' | 'pro';
export type PlanId = 'monthly' | 'yearly' | 'lifetime';

export type Profile = {
  name: string;
  experience?: Experience;
  interests: string[];
  goal?: Goal;
};

type State = {
  onboarded: boolean;
  profile: Profile;
  plan: PlanId | null;
  completedLessons: string[];
};

const STORAGE_KEY = 'loafy/state/v1';

const initialState: State = {
  onboarded: false,
  profile: { name: '', interests: [] },
  plan: null,
  completedLessons: [],
};

type AppStateValue = State & {
  ready: boolean;
  isPro: boolean;
  completeOnboarding: (profile: Profile) => void;
  purchase: (plan: PlanId) => void;
  cancelSubscription: () => void;
  toggleLessonComplete: (courseId: string, lessonId: string) => void;
  isLessonComplete: (courseId: string, lessonId: string) => boolean;
  reset: () => void;
};

const AppStateContext = createContext<AppStateValue | null>(null);

const lessonKey = (courseId: string, lessonId: string) => `${courseId}/${lessonId}`;

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => raw && setState({ ...initialState, ...JSON.parse(raw) }))
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [ready, state]);

  const completeOnboarding = useCallback(
    (profile: Profile) => setState((s) => ({ ...s, onboarded: true, profile })),
    [],
  );
  const purchase = useCallback((plan: PlanId) => setState((s) => ({ ...s, plan })), []);
  const cancelSubscription = useCallback(() => setState((s) => ({ ...s, plan: null })), []);
  const toggleLessonComplete = useCallback((courseId: string, lessonId: string) => {
    const key = lessonKey(courseId, lessonId);
    setState((s) => ({
      ...s,
      completedLessons: s.completedLessons.includes(key)
        ? s.completedLessons.filter((k) => k !== key)
        : [...s.completedLessons, key],
    }));
  }, []);
  const reset = useCallback(() => setState(initialState), []);

  const value = useMemo<AppStateValue>(
    () => ({
      ...state,
      ready,
      isPro: state.plan !== null,
      completeOnboarding,
      purchase,
      cancelSubscription,
      toggleLessonComplete,
      isLessonComplete: (courseId, lessonId) =>
        state.completedLessons.includes(lessonKey(courseId, lessonId)),
      reset,
    }),
    [state, ready, completeOnboarding, purchase, cancelSubscription, toggleLessonComplete, reset],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
