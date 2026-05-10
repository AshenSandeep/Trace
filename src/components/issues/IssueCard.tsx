import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Issue } from '../../types';
import { useTheme } from '../../theme';
import { Badge } from '../common/Badge';
import { Avatar } from '../common/Avatar';

interface IssueCardProps {
  issue: Issue;
  onPress: () => void;
  queueType?: 'create' | 'update';
}

const formatCardDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onPress, queueType }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Row 1: ID · (QueueChip | Priority) · spacer · (dot | Date) */}
      <View style={styles.topRow}>
        <Text style={[styles.issueId, { color: colors.textTertiary }]}>{issue.id}</Text>
        {queueType ? (
          <View style={styles.queueChip}>
            <Text style={styles.queueChipText}>
              Queued · {queueType === 'create' ? 'Create' : 'Edit'}
            </Text>
          </View>
        ) : (
          <Badge priority={issue.priority} />
        )}
        <View style={styles.spacer} />
        {queueType ? (
          <View style={styles.queueDot} />
        ) : (
          <Text style={[styles.date, { color: colors.textTertiary }]}>
            {formatCardDate(issue.createdAt)}
          </Text>
        )}
      </View>

      {/* Row 2: Title */}
      <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
        {issue.title}
      </Text>

      {/* Row 3: Status · Assignee */}
      <View style={styles.bottomRow}>
        <Badge status={issue.status} />
        <View style={styles.assigneeWrap}>
          {issue.assignee ? (
            <>
              <Avatar initials={issue.assignee.initials} size="sm" />
              <Text style={[styles.assigneeName, { color: colors.textSecondary }]}>
                {issue.assignee.name.split(' ')[0]}
              </Text>
            </>
          ) : (
            <Text style={[styles.unassigned, { color: colors.textTertiary }]}>Unassigned</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    gap: 7,
  },
  issueId: {
    fontSize: 12,
    fontWeight: '500',
  },
  spacer: { flex: 1 },
  date: {
    fontSize: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  assigneeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  assigneeName: {
    fontSize: 13,
  },
  unassigned: {
    fontSize: 13,
  },
  queueChip: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  queueChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  queueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
});
