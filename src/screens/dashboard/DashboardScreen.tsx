import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../theme';
import { useIssueStore } from '../../store/issueStore';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../../components/common/Avatar';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { StatCard } from '../../components/dashboard/StatCard';
import { ActivityItem } from '../../components/dashboard/ActivityItem';
import type { MainTabParamList } from '../../navigation/types';

type DashboardNavProp = BottomTabNavigationProp<MainTabParamList, 'DashboardTab'>;

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const getFormattedDate = (): string => {
  const d = new Date();
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  return `${weekday}, ${monthDay}`;
};

const generateBarData = (count: number, seed: number): number[] =>
  Array.from({ length: 7 }, (_, i) => ((count * 3 + seed * 11 + i * 7) % 8) + 2);

const getDelta = (statusIndex: number, count: number): number | null => {
  if (statusIndex === 3) return null;
  if (statusIndex === 1) return 0;
  return (count % 4) + 1;
};

const DashboardScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DashboardNavProp>();

  const { issues, isLoading, isRefreshing, error, fetchIssues, refreshIssues } = useIssueStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchIssues();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openCount = useMemo(() => issues.filter(i => i.status === 'Open').length, [issues]);
  const inProgressCount = useMemo(
    () => issues.filter(i => i.status === 'In Progress').length,
    [issues],
  );
  const resolvedCount = useMemo(
    () => issues.filter(i => i.status === 'Resolved').length,
    [issues],
  );
  const closedCount = useMemo(() => issues.filter(i => i.status === 'Closed').length, [issues]);

  const recentActivity = useMemo(
    () =>
      issues
        .flatMap(issue => issue.activity)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5),
    [issues],
  );

  const firstName = user?.name.split(' ')[0] ?? 'there';
  const greeting = getGreeting();
  const dateStr = getFormattedDate();

  const statsData = [
    { label: 'Open', count: openCount, color: colors.statusOpen, index: 0 },
    { label: 'In Progress', count: inProgressCount, color: colors.statusInProgress, index: 1 },
    { label: 'Resolved', count: resolvedCount, color: colors.statusResolved, index: 2 },
    { label: 'Closed', count: closedCount, color: colors.statusClosed, index: 3 },
  ];

  const navigateToIssues = () =>
    navigation.navigate('IssuesTab', { screen: 'IssueList' });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Avatar initials={user?.initials ?? 'AM'} size="md" />
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Dashboard</Text>
        <TouchableOpacity
          onPress={refreshIssues}
          style={styles.refreshBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color={colors.textSecondary} />
          ) : (
            <Text style={[styles.refreshIcon, { color: colors.textSecondary }]}>↻</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <Text style={[styles.date, { color: colors.textSecondary }]}>{dateStr}</Text>
        <Text style={[styles.greeting, { color: colors.textPrimary }]}>
          {greeting}, {firstName}
        </Text>

        {/* Error banner */}
        {error && !isLoading && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchIssues} style={styles.retryLink}>
              <Text style={styles.retryLinkText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Stats 2×2 grid */}
        <View style={styles.statsGrid}>
          {isLoading ? (
            <>
              <View style={styles.statsRow}>
                <View style={styles.skeletonCardWrap}>
                  <LoadingSkeleton width="100%" height={110} borderRadius={12} />
                </View>
                <View style={styles.skeletonCardWrap}>
                  <LoadingSkeleton width="100%" height={110} borderRadius={12} />
                </View>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.skeletonCardWrap}>
                  <LoadingSkeleton width="100%" height={110} borderRadius={12} />
                </View>
                <View style={styles.skeletonCardWrap}>
                  <LoadingSkeleton width="100%" height={110} borderRadius={12} />
                </View>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statsRow}>
                {statsData.slice(0, 2).map(s => (
                  <StatCard
                    key={s.label}
                    label={s.label}
                    count={s.count}
                    delta={getDelta(s.index, s.count)}
                    color={s.color}
                    barData={generateBarData(s.count, s.index)}
                  />
                ))}
              </View>
              <View style={styles.statsRow}>
                {statsData.slice(2, 4).map(s => (
                  <StatCard
                    key={s.label}
                    label={s.label}
                    count={s.count}
                    delta={getDelta(s.index, s.count)}
                    color={s.color}
                    barData={generateBarData(s.count, s.index)}
                  />
                ))}
              </View>
            </>
          )}
        </View>

        {/* Recent activity */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recent activity</Text>
          <TouchableOpacity onPress={navigateToIssues}>
            <Text style={[styles.seeAll, { color: colors.statusInProgress }]}>See all</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.activityCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <View key={i} style={styles.skeletonActivityRow}>
                <LoadingSkeleton width={32} height={32} borderRadius={16} />
                <View style={styles.skeletonTextWrap}>
                  <LoadingSkeleton width="65%" height={12} />
                </View>
                <LoadingSkeleton width={28} height={10} />
              </View>
            ))
          ) : recentActivity.length === 0 ? (
            <Text style={[styles.emptyActivity, { color: colors.textTertiary }]}>
              No recent activity
            </Text>
          ) : (
            recentActivity.map((act, idx) => (
              <View key={act.id}>
                <ActivityItem item={act} loggedInUserName={user?.name} />
                {idx < recentActivity.length - 1 && (
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))
          )}
        </View>

        {/* Backlog CTA */}
        <TouchableOpacity
          style={[styles.backlogCard, { backgroundColor: colors.textPrimary }]}
          onPress={navigateToIssues}
          activeOpacity={0.85}
        >
          <View style={styles.backlogContent}>
            <Text style={[styles.backlogLabel, { color: colors.background, opacity: 0.55 }]}>
              Backlog
            </Text>
            <Text style={[styles.backlogTitle, { color: colors.background }]}>
              Triage {openCount} open {openCount === 1 ? 'issue' : 'issues'}
            </Text>
          </View>
          <View style={[styles.arrowCircle, { backgroundColor: colors.background }]}>
            <Text style={[styles.arrowText, { color: colors.textPrimary }]}>→</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  refreshBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    fontSize: 22,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  date: {
    fontSize: 13,
    marginBottom: 2,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#991B1B',
    fontSize: 14,
    flex: 1,
  },
  retryLink: {
    marginLeft: 12,
  },
  retryLinkText: {
    color: '#991B1B',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  statsGrid: {
    gap: 10,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  skeletonCardWrap: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 20,
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
  skeletonActivityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  skeletonTextWrap: {
    flex: 1,
  },
  separator: {
    height: 1,
    marginLeft: 42,
  },
  emptyActivity: {
    textAlign: 'center',
    paddingVertical: 24,
    fontSize: 14,
  },
  backlogCard: {
    borderRadius: 14,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  backlogContent: {
    flex: 1,
  },
  backlogLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  backlogTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  arrowText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;
