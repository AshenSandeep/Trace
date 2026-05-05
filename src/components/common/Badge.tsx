import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../theme';
import { IssueStatus, IssuePriority } from '../../types';

interface BadgeProps {
  status?: IssueStatus;
  priority?: IssuePriority;
  label?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, priority, label }) => {
  const { colors } = useTheme();

  if (status) {
    const statusColor = {
      Open: colors.statusOpen,
      'In Progress': colors.statusInProgress,
      Resolved: colors.statusResolved,
      Closed: colors.statusClosed,
    }[status];

    return (
      <View style={[styles.statusPill, { backgroundColor: statusColor + '26' }]}>
        <View style={[styles.dot, { backgroundColor: statusColor }]} />
        <Text style={[styles.statusText, { color: statusColor }]}>{label ?? status}</Text>
      </View>
    );
  }

  if (priority) {
    const priorityColor = {
      High: colors.priorityHigh,
      Medium: colors.priorityMedium,
      Low: colors.priorityLow,
    }[priority];

    return (
      <View style={[styles.priorityPill, { backgroundColor: priorityColor + '1A' }]}>
        <Text style={[styles.priorityText, { color: priorityColor }]}>{label ?? priority}</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  priorityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
  },
});