import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { Button } from './Button';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  retryLabel?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, retryLabel }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
        <Text style={styles.iconText}>!</Text>
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>Something went wrong</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

      <Button
        variant="secondary"
        label={retryLabel ?? 'Try again'}
        onPress={onRetry}
        style={styles.btn}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 32,
    color: '#EF4444',
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  btn: {
    width: 160,
  },
});
