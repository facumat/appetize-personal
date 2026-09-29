import LottieView from 'lottie-react-native';
import { StyleProp, ViewStyle } from 'react-native';

const animations = {
  idle: require('../../assets/lottie/loafy-idle.json'),
  wave: require('../../assets/lottie/loafy-wave.json'),
  celebrate: require('../../assets/lottie/loafy-celebrate.json'),
  proofing: require('../../assets/lottie/loafy-proofing.json'),
};

export type LoafyMood = keyof typeof animations;

type Props = {
  mood?: LoafyMood;
  size?: number;
  loop?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function Loafy({ mood = 'idle', size = 180, loop = true, style, testID }: Props) {
  return (
    <LottieView
      key={mood}
      testID={testID ?? `loafy-${mood}`}
      source={animations[mood]}
      autoPlay
      loop={loop}
      style={[{ width: size, height: size }, style]}
    />
  );
}
