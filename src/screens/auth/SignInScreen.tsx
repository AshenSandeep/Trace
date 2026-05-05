import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';

const SignInScreen = () => {
  const { colors, typography, spacing } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[typography.h1, { color: colors.textPrimary }]}>Sign In</Text>
      <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.sm }]}>
        Placeholder — Feature 05
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default SignInScreen;
