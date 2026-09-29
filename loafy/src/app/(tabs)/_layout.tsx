import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors } from '../../theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.crust,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Learn',
          tabBarButtonTestID: 'tab-learn',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="bread-slice" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarButtonTestID: 'tab-profile',
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
