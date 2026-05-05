import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityItem as ActivityItemType } from '../../types';
import { Avatar } from '../common/Avatar';
import { formatRelativeTime } from '../../utils/dateUtils';
import { useTheme } from '../../theme';

interface ActivityItemProps {
  item: ActivityItemType;
  loggedInUserName?: string;
}

const getShortAction = (action: string): string => {
  if (action.includes('created')) return 'created';
  if (action.toLowerCase().includes('resolved')) return 'resolved';
  if (action.toLowerCase().includes('closed')) return 'closed';
  if (action.includes('assigned')) return 'assigned';
  if (action.includes('In Progress')) return 'started';
  if (action.includes('Open')) return 'reopened';
  return 'updated';
};

const getActionDotColor = (action: string): string => {
  if (action.toLowerCase().includes('resolved')) return '#10B981';
  if (action.toLowerCase().includes('closed')) return '#6B7280';
  if (action.includes('In Progress')) return '#3B82F6';
  if (action.includes('assigned')) return '#3B82F6';
  if (action.includes('created')) return '#EF4444';
  return '#6B7280';
};

export const ActivityItem: React.FC<ActivityItemProps> = ({ item, loggedInUserName }) => {
  const { colors } = useTheme();
  const firstName = item.actor.split(' ')[0];
  const displayName = loggedInUserName && item.actor === loggedInUserName ? 'You' : firstName;
  const shortAction = getShortAction(item.action);
  const dotColor = getActionDotColor(item.action);
  const timeAgo = formatRelativeTime(item.timestamp);

  return (
    <View style={styles.row}>
      <Avatar initials={item.actorInitials} size="md" />
      <View style={styles.textWrap}>
        <Text style={[styles.text, { color: colors.textPrimary }]} numberOfLines={1}>
          <Text style={styles.bold}>{displayName}</Text>
          {` ${shortAction} `}
          <Text style={{ color: colors.textSecondary }}>{item.issueId}</Text>
        </Text>
      </View>
      <View style={styles.meta}>
        <View style={[styles.metaDot, { backgroundColor: dotColor }]} />
        <Text style={[styles.time, { color: colors.textTertiary }]}>{timeAgo}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 10,
  },
  textWrap: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
  },
  bold: {
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
  },
});
