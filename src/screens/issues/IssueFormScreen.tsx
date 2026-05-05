import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { IssuesStackParamList } from '../../navigation/types';
import { useTheme } from '../../theme';

type Props = NativeStackScreenProps<IssuesStackParamList, 'IssueForm'>;

const IssueFormScreen = ({ route }: Props) => {
  const { colors, typography, spacing } = useTheme();
  const isEditing = !!route.params?.issueId;
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[typography.h1, { color: colors.textPrimary }]}>
        {isEditing ? 'Edit Issue' : 'New Issue'}
      </Text>
      <Text style={[typography.body, { color: colors.textSecondary, marginTop: spacing.sm }]}>
        Placeholder — Feature 09
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default IssueFormScreen;
