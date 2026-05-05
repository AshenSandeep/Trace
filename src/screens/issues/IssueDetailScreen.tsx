import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IssuesStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<IssuesStackParamList, 'IssueDetail'>;

const IssueDetailScreen = ({ route }: Props) => {
  const { colors, typography, spacing } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[typography.h1, { color: colors.textPrimary }]}>Issue Detail</Text>
      <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.sm }]}>
        {route.params.issueId}
      </Text>
      <Text style={[typography.small, { color: colors.textTertiary, marginTop: spacing.xs }]}>
        Placeholder — Feature 08
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default IssueDetailScreen;
