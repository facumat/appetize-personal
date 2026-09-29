# Loafy 🍞

A mocked bread-baking course app, built with Expo (React Native) and meant to run on [Appetize](https://appetize.io). Loafy the toast is the Lottie mascot.

Nothing here talks to a server. The subscription is mocked, and all state (onboarding answers, plan, progress) stays on the device in AsyncStorage.

## Flow

1. **Onboarding**: Loafy says hi, then asks four questions (name, experience, interests, weekly goal) and shows a "proofing your plan" loader.
2. **Paywall**: Yearly (7-day trial), Monthly or Lifetime. The checkout sheet is a mock and never charges. Closing the paywall drops you into the free tier.
3. **Learn**: an up-next card, an upsell banner and three courses:
   - Principles of Bread (2 free lessons)
   - Parisian Brioche (1 free preview)
   - Milanese Panettone (1 free preview)
4. **Course → Lesson**: ingredients with baker's percentages, the steps and a Loafy tip. Tapping a locked lesson opens the paywall. Marking a lesson complete plays a Loafy celebration.
5. **Profile**: plan status, progress, a mock "cancel subscription" and **Reset demo** (starts over at onboarding).

Deep links use the `loafy://` scheme, e.g. `loafy://paywall`, `loafy://course/brioche`, `loafy://lesson/brioche/what-is-brioche`.

Every interactive element has a `testID`, which shows up as the Android `resource-id`, so Appetize tests can select it with `--select-test-id`.

## Development

```bash
npm install
npm run typecheck
npm run lint
```

### Android release build

You need an Android SDK (`ANDROID_HOME`) and JDK 17+.

```bash
npm run android:build
# → android/app/build/outputs/apk/release/app-release.apk
```

To upload it to Appetize:

```bash
appetize build upload android/app/build/outputs/apk/release/app-release.apk
```

## Loafy animations

The Lottie files in `assets/lottie` are generated from code:

```bash
node scripts/generate-loafy.mjs
```

| File                    | Used for                         |
| ----------------------- | -------------------------------- |
| `loafy-idle.json`       | Bob and blink (default)          |
| `loafy-wave.json`       | Welcome and profile              |
| `loafy-celebrate.json`  | Purchase success, lesson complete |
| `loafy-proofing.json`   | Personalizing loader             |

The app icon and splash are rendered from the idle animation with `scripts/render-icons.mjs`. That script needs `lottie-web` and `playwright-core`, plus a Chromium binary passed in via `CHROME`.
