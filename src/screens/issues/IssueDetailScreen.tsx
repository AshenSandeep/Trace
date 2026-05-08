import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme';
import { useIssueStore } from '../../store/issueStore';
import { useAuthStore } from '../../store/authStore';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ErrorState } from '../../components/common/ErrorState';
import { ConfirmSheet } from '../../components/common/ConfirmSheet';
import { formatRelativeTime } from '../../utils/dateUtils';
import type { IssuesStackParamList } from '../../navigation/types';
import type { ColorPalette } from '../../theme/colors';

type Props = NativeStackScreenProps<IssuesStackParamList, 'IssueDetail'>;

const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${date}, ${time}`;
};

const IssueDetailScreen = ({ route, navigation }: Props) => {
  const { issueId } = route.params;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const { issues, isLoading, resolveIssue, closeIssue, updateIssue } = useIssueStore();
  const { user } = useAuthStore();

  const [resolveVisible, setResolveVisible] = useState(false);
  const [closeVisible, setCloseVisible] = useState(false);

  const issue = issues.find(i => i.id === issueId);

  // Keep a stable ref so the header button always sees latest state
  const closeVisibleRef = useRef(setCloseVisible);
  closeVisibleRef.current = setCloseVisible;

  const handleMenu = useCallback(() => {
    if (!issue) return;
    Alert.alert('', '', [
      {
        text: 'Edit',
        onPress: () => navigation.navigate('IssueForm', { issueId: issue.id }),
      },
      {
        text: 'Close issue',
        style: 'destructive',
        onPress: () => closeVisibleRef.current(true),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [issue, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: issue?.id ?? issueId,
      headerRight: () => (
        <TouchableOpacity
          onPress={handleMenu}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.menuIcon, { color: colors.textPrimary }]}>···</Text>
        </TouchableOpacity>
      ),
    });
  }, [issue?.id, issueId, navigation, colors, handleMenu]);

  if (isLoading && !issue) {
    return <SkeletonDetail colors={colors} />;
  }

  if (!issue) {
    return (
      <ErrorState
        message={`Issue ${issueId} could not be found.`}
        onRetry={() => navigation.goBack()}
      />
    );
  }

  const reporterDisplay =
    user && issue.reporter.id === user.id ? 'You' : issue.reporter.name;

  const canResolve = issue.status === 'Open' || issue.status === 'In Progress';
  const canReopen = issue.status === 'Resolved' || issue.status === 'Closed';

  const attachmentLabel =
    issue.attachments.length === 0
      ? 'None'
      : `${issue.attachments.length} file${issue.attachments.length !== 1 ? 's' : ''}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 92 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Status + priority */}
        <View style={styles.badgeRow}>
          <Badge status={issue.status} />
          <Badge priority={issue.priority} />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.textPrimary }]}>{issue.title}</Text>

        {/* Description */}
        {Boolean(issue.description) && (
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {issue.description}
          </Text>
        )}

        {/* Metadata card */}
        <View style={[styles.metaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MetaRow label="Assignee" colors={colors}>
            {issue.assignee ? (
              <View style={styles.metaValueRow}>
                <Avatar initials={issue.assignee.initials} size="sm" />
                <Text style={[styles.metaValue, { color: colors.textPrimary }]}>
                  {issue.assignee.name}
                </Text>
              </View>
            ) : (
              <Text style={[styles.metaValue, { color: colors.textTertiary }]}>
                Unassigned
              </Text>
            )}
          </MetaRow>

          <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />

          <MetaRow label="Reporter" colors={colors}>
            <Text style={[styles.metaValue, { color: colors.textPrimary }]}>
              {reporterDisplay}
            </Text>
          </MetaRow>

          <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />

          <MetaRow label="Created" colors={colors}>
            <Text style={[styles.metaValue, { color: colors.textPrimary }]}>
              {formatDateTime(issue.createdAt)}
            </Text>
          </MetaRow>

          <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />

          <MetaRow label="Updated" colors={colors}>
            <Text style={[styles.metaValue, { color: colors.textPrimary }]}>
              {formatRelativeTime(issue.updatedAt)}
            </Text>
          </MetaRow>

          <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />

          <MetaRow label="Attachments" colors={colors}>
            <TouchableOpacity
              onPress={() =>
                Alert.alert('Coming soon', 'Attachments are not yet available.')
              }
            >
              <Text style={[styles.metaLink]}>
                {issue.attachments.length > 0 ? '📎 ' : ''}{attachmentLabel}
              </Text>
            </TouchableOpacity>
          </MetaRow>
        </View>

        {/* Activity */}
        {issue.activity.length > 0 && (
          <View>
            <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>
              ACTIVITY
            </Text>
            {[...issue.activity].reverse().map((act, idx, arr) => (
              <View key={act.id}>
                <View style={styles.activityRow}>
                  <Avatar initials={act.actorInitials} size="md" />
                  <View style={styles.activityBody}>
                    <Text
                      style={[styles.activityText, { color: colors.textPrimary }]}
                    >
                      <Text style={styles.bold}>
                        {user && act.actor === user.name
                          ? 'You'
                          : act.actor.split(' ')[0]}
                      </Text>
                      {'  '}{act.action}
                    </Text>
                    <Text style={[styles.activityTime, { color: colors.textTertiary }]}>
                      {formatRelativeTime(act.timestamp)}
                    </Text>
                  </View>
                </View>
                {idx < arr.length - 1 && (
                  <View
                    style={[styles.activityDivider, { backgroundColor: colors.border }]}
                  />
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom action bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom + 10,
          },
        ]}
      >
        {canReopen ? (
          <>
            {issue.status === 'Resolved' && (
              <TouchableOpacity
                style={[styles.editBtn, { borderColor: colors.border }]}
                onPress={() =>
                  navigation.navigate('IssueForm', { issueId: issue.id })
                }
              >
                <Text style={[styles.editBtnText, { color: colors.textSecondary }]}>
                  Edit
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
              ]}
              onPress={() => updateIssue(issue.id, { status: 'Open' })}
              activeOpacity={0.85}
            >
              <Text style={[styles.actionBtnText, { color: colors.textPrimary }]}>
                Reopen
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.editBtn, { borderColor: colors.border }]}
              onPress={() =>
                navigation.navigate('IssueForm', { issueId: issue.id })
              }
            >
              <Text style={[styles.editBtnText, { color: colors.textSecondary }]}>
                ✎  Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.resolveBtn]}
              onPress={() => setResolveVisible(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.resolveBtnText}>✓  Mark Resolved</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <ConfirmSheet
        visible={resolveVisible}
        title="Mark this issue resolved?"
        subtitle="The reporter will be notified. You can reopen it any time from the issue detail."
        confirmLabel="Resolve"
        onConfirm={() => {
          resolveIssue(issue.id);
          setResolveVisible(false);
        }}
        onCancel={() => setResolveVisible(false)}
      />

      <ConfirmSheet
        visible={closeVisible}
        title="Close this issue?"
        subtitle="The issue will be archived. You can reopen it any time."
        confirmLabel="Close"
        confirmVariant="danger"
        onConfirm={() => {
          closeIssue(issue.id);
          setCloseVisible(false);
        }}
        onCancel={() => setCloseVisible(false)}
      />
    </View>
  );
};

/* Sub-components */

const MetaRow = ({
  label,
  children,
  colors,
}: {
  label: string;
  children: React.ReactNode;
  colors: ColorPalette;
}) => (
  <View style={styles.metaRow}>
    <Text style={[styles.metaLabel, { color: colors.textSecondary }]}>{label}</Text>
    {children}
  </View>
);

const SkeletonDetail = ({ colors }: { colors: ColorPalette }) => (
  <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 80 }]}>
    <View style={[styles.badgeRow, { marginBottom: 14 }]}>
      <LoadingSkeleton width={62} height={24} borderRadius={12} />
      <LoadingSkeleton width={50} height={24} borderRadius={12} />
    </View>
    <LoadingSkeleton width="85%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
    <LoadingSkeleton width="60%" height={18} borderRadius={4} style={{ marginBottom: 18 }} />
    <LoadingSkeleton width="100%" height={13} borderRadius={4} style={{ marginBottom: 6 }} />
    <LoadingSkeleton width="92%" height={13} borderRadius={4} style={{ marginBottom: 6 }} />
    <LoadingSkeleton width="70%" height={13} borderRadius={4} style={{ marginBottom: 24 }} />
    <View
      style={[
        styles.metaCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {[...Array(5)].map((_, i) => (
        <View key={i}>
          <View style={styles.metaRow}>
            <LoadingSkeleton width={80} height={12} borderRadius={4} />
            <LoadingSkeleton width={110} height={12} borderRadius={4} />
          </View>
          {i < 4 && (
            <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />
          )}
        </View>
      ))}
    </View>
  </ScrollView>
);

/* Styles */

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  menuIcon: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 20,
  },
  metaCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  metaLabel: {
    fontSize: 14,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  metaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  metaLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  metaDivider: {
    height: 1,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  activityRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 12,
  },
  activityBody: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 12,
  },
  activityDivider: {
    height: 1,
    marginLeft: 42,
  },
  bold: { fontWeight: '600' },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  editBtn: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: '500',
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  resolveBtn: {
    backgroundColor: '#10B981',
  },
  resolveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default IssueDetailScreen;
