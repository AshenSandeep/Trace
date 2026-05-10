import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

interface FilterChipProps {
  label: string;
  count?: number;
  active: boolean;
  color?: string;
  onPress: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  count,
  active,
  color,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[
        styles.chip,
        {
          backgroundColor: active ? colors.textPrimary : colors.surface,
          borderColor: active ? colors.textPrimary : colors.border,
        },
      ]}
    >
      {color && (
        <View
          style={[
            styles.dot,
            { backgroundColor: active ? colors.background : color },
          ]}
        />
      )}
      <Text
        style={[
          styles.label,
          { color: active ? colors.background : colors.textPrimary },
        ]}
      >
        {label}
        {count !== undefined ? ` ${count}` : ''}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
});
