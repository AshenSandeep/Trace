import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AVATAR_COLORS = [
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#06B6D4',
  '#6366F1',
];

const SIZE_MAP = { sm: 24, md: 32, lg: 40, xl: 64 };
const FONT_MAP = { sm: 9, md: 12, lg: 15, xl: 24 };

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, size = 'md', color }) => {
  const dim = SIZE_MAP[size];
  const fontSize = FONT_MAP[size];
  const bgColor = color ?? AVATAR_COLORS[initials.charCodeAt(0) % AVATAR_COLORS.length];

  return (
    <View
      style={[
        styles.circle,
        { width: dim, height: dim, borderRadius: dim / 2, backgroundColor: bgColor },
      ]}
    >
      <Text style={[styles.text, { fontSize }]}>{initials.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
