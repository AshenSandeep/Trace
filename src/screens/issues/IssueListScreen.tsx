import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SectionList,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../theme';
import { useIssueStore } from '../../store/issueStore';
import { Issue, IssueStatus } from '../../types';
import { IssueCard } from '../../components/issues/IssueCard';
import { FilterChip } from '../../components/issues/FilterChip';
import { FilterSheet } from '../../components/issues/FilterSheet';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import type { IssuesStackParamList } from '../../navigation/types';

type IssueListNavProp = NativeStackNavigationProp<IssuesStackParamList, 'IssueList'>;

const STATUS_COLORS: Record<IssueStatus, string> = {
  Open: '#EF4444',
  'In Progress': '#3B82F6',
  Resolved: '#10B981',
  Closed: '#6B7280',
};

const QUICK_FILTER_STATUSES: IssueStatus[] = ['Open', 'In Progress', 'Resolved'];

const isToday = (iso: string): boolean => {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

const FilterIcon = ({ color }: { color: string }) => (
  <View style={styles.filterIconWrap}>
    {[16, 11, 6].map((w, i) => (
      <View key={i} style={[styles.filterBar, { width: w, backgroundColor: color }]} />
    ))}
  </View>
);

const IssueListScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<IssueListNavProp>();

  const {
    issues,
    filteredIssues,
    filters,
    isLoading,
    isRefreshing,
    error,
    syncQueue,
    isOnline,
    fetchIssues,
    setFilters,
    clearFilters,
  } = useIssueStore();

  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const load = async () => {
      await fetchIssues();
      setLastRefreshed(new Date());
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const queueMap = useMemo(() => {
    const m = new Map<string, 'create' | 'update'>();
    syncQueue.forEach(q => m.set(q.id, q.type));
    return m;
  }, [syncQueue]);

  const sections = useMemo(() => {
    if (!isOnline && syncQueue.length > 0) {
      const pending = filteredIssues.filter(i => queueMap.has(i.id));
      const cached = filteredIssues.filter(i => !queueMap.has(i.id));
      const result: { title: string; data: Issue[] }[] = [];
      if (pending.length > 0) result.push({ title: `PENDING SYNC · ${pending.length}`, data: pending });
      if (cached.length > 0) result.push({ title: 'CACHED', data: cached });
      return result;
    }
    const todayItems = filteredIssues.filter(i => isToday(i.createdAt));
    const earlierItems = filteredIssues.filter(i => !isToday(i.createdAt));
    const result: { title: string; data: Issue[] }[] = [];
    if (todayItems.length > 0) result.push({ title: 'TODAY', data: todayItems });
    if (earlierItems.length > 0) result.push({ title: 'EARLIER', data: earlierItems });
    return result;
  }, [filteredIssues, isOnline, syncQueue, queueMap]);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.assignee.length > 0;

  const isAllChipActive = filters.status.length === 0;

  const handleQuickFilter = (status: IssueStatus) => {
    if (filters.status.length === 1 && filters.status[0] === status) {
      setFilters({ status: [] });
    } else {
      setFilters({ status: [status] });
    }
  };

  const handleFilterApply = (partial: Partial<typeof filters>) => {
    setFilters(partial);
  };

  const getLastRefreshedText = () => {
    const diff = Math.floor((Date.now() - lastRefreshed.getTime()) / 60000);
    if (diff < 1) return 'Updated just now';
    return `Updated ${diff} min ago`;
  };

  const navigateToDetail = (issueId: string) => {
    navigation.navigate('IssueDetail', { issueId });
  };

  const navigateToCreate = () => {
    navigation.navigate('IssueForm', {});
  };

  const renderSkeletons = () => (
    <View style={styles.skeletonList}>
      {[...Array(5)].map((_, i) => (
        <View key={i} style={[styles.skeletonCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.skeletonTopRow}>
            <LoadingSkeleton width={60} height={11} borderRadius={4} />
            <LoadingSkeleton width={40} height={20} borderRadius={10} />
            <View style={{ flex: 1 }} />
            <LoadingSkeleton width={36} height={11} borderRadius={4} />
          </View>
          <LoadingSkeleton width="85%" height={14} borderRadius={4} style={{ marginBottom: 6 }} />
          <LoadingSkeleton width="60%" height={14} borderRadius={4} style={{ marginBottom: 12 }} />
          <View style={styles.skeletonBottomRow}>
            <LoadingSkeleton width={58} height={22} borderRadius={11} />
            <LoadingSkeleton width={70} height={14} borderRadius={4} />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Fixed header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          onPress={() => setFilterSheetVisible(true)}
          style={styles.headerBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <FilterIcon color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Issues</Text>
        <TouchableOpacity
          onPress={navigateToCreate}
          style={styles.headerBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.plusIcon, { color: colors.textPrimary }]}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Fixed search bar */}
      <View style={[styles.searchWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.searchIcon, { color: colors.textTertiary }]}>⌕</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search title, ID, assignee"
          placeholderTextColor={colors.textTertiary}
          value={filters.search}
          onChangeText={text => setFilters({ search: text })}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {filters.search.length > 0 ? (
          <TouchableOpacity onPress={() => setFilters({ search: '' })}>
            <Text style={[styles.clearIcon, { color: colors.textTertiary }]}>✕</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.kbdHint, { color: colors.textTertiary }]}>⌘K</Text>
        )}
      </View>

      {/* Fixed quick filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsContainer}
      >
        <FilterChip
          label="All"
          count={issues.length}
          active={isAllChipActive}
          onPress={() => setFilters({ status: [] })}
        />
        {QUICK_FILTER_STATUSES.map(status => (
          <FilterChip
            key={status}
            label={status}
            active={filters.status.length === 1 && filters.status[0] === status}
            color={STATUS_COLORS[status]}
            onPress={() => handleQuickFilter(status)}
          />
        ))}
      </ScrollView>

      {/* Scrollable list area */}
      {isLoading ? (
        <View style={styles.flex}>
          <View style={styles.updatedRow}>
            <LoadingSkeleton width={120} height={10} borderRadius={4} />
          </View>
          {renderSkeletons()}
        </View>
      ) : error ? (
        <ErrorState message={error} onRetry={() => { fetchIssues(); setLastRefreshed(new Date()); }} />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 80 },
          ]}
          stickySectionHeadersEnabled={false}
          ListHeaderComponent={
            <View style={styles.updatedRow}>
              {isRefreshing ? (
                <ActivityIndicator size="small" color={colors.textTertiary} />
              ) : (
                <Text style={[styles.updatedText, { color: colors.textTertiary }]}>
                  {'↻ '}{getLastRefreshedText()}
                </Text>
              )}
            </View>
          }
          renderSectionHeader={({ section }) => (
            <Text style={[styles.sectionHeader, { color: colors.textTertiary }]}>
              {section.title}
            </Text>
          )}
          renderItem={({ item }) => (
            <IssueCard
              issue={item}
              onPress={() => navigateToDetail(item.id)}
              queueType={queueMap.get(item.id)}
            />
          )}
          ListEmptyComponent={
            hasActiveFilters ? (
              <EmptyState
                title="No matching issues"
                subtitle="Try removing a filter, or create a new issue with this title."
                actionLabel="Clear filters"
                onAction={clearFilters}
                secondaryActionLabel="+ New issue"
                onSecondaryAction={navigateToCreate}
              />
            ) : (
              <EmptyState
                title="No issues yet"
                subtitle="Create your first issue to start tracking work."
                secondaryActionLabel="+ New issue"
                onSecondaryAction={navigateToCreate}
              />
            )
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.textPrimary, bottom: insets.bottom + 24 }]}
        onPress={navigateToCreate}
        activeOpacity={0.85}
      >
        <Text style={[styles.fabText, { color: colors.background }]}>+</Text>
      </TouchableOpacity>

      {/* Filter sheet */}
      <FilterSheet
        visible={filterSheetVisible}
        onClose={() => setFilterSheetVisible(false)}
        onApply={handleFilterApply}
        currentFilters={filters}
        issues={issues}
        searchQuery={filters.search}
      />
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
  headerBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  plusIcon: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '400',
  },
  filterIconWrap: {
    gap: 4,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  filterBar: {
    height: 1.5,
    borderRadius: 1,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchIcon: {
    fontSize: 17,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  clearIcon: {
    fontSize: 13,
    fontWeight: '600',
    padding: 2,
  },
  kbdHint: {
    fontSize: 11,
    fontWeight: '500',
  },
  chipsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 8,
  },
  updatedRow: {
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 4,
  },
  updatedText: {
    fontSize: 12,
    fontWeight: '400',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  fabText: {
    fontSize: 26,
    lineHeight: 30,
    fontWeight: '300',
  },
  skeletonList: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  skeletonCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  skeletonTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 10,
  },
  skeletonBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default IssueListScreen;
