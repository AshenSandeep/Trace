import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  label,
  onPress,
  loading = false,
  disabled = false,
  style,
}) => {
  const { colors } = useTheme();

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';

  const containerStyle: ViewStyle[] = [styles.base];

  if (isPrimary) {
    containerStyle.push({ backgroundColor: colors.accent, borderWidth: 0 });
  } else if (isSecondary) {
    containerStyle.push({
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    });
  } else if (isGhost) {
    containerStyle.push({ backgroundColor: 'transparent', borderWidth: 0 });
  } else if (isDanger) {
    containerStyle.push({ backgroundColor: 'transparent', borderWidth: 1, borderColor: '#EF4444' });
  }

  if (disabled || loading) {
    containerStyle.push({ opacity: 0.5 });
  }

  if (style) {
    containerStyle.push(style);
  }

  const textColor = isPrimary
    ? colors.surface
    : isDanger
    ? '#EF4444'
    : isGhost
    ? colors.textSecondary
    : colors.textPrimary;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
