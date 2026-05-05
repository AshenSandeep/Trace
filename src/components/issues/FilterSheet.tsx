import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../theme';
import { Issue, IssueFilters, IssueStatus, IssuePriority } from '../../types';

const STATUS_OPTIONS: { label: IssueStatus; color: string }[] = [
  { label: 'Open', color: '#EF4444' },
  { label: 'In Progress', color: '#3B82F6' },
  { label: 'Resolved', color: '#10B981' },
  { label: 'Closed', color: '#6B7280' },
];

const PRIORITY_OPTIONS: IssuePriority[] = ['High', 'Medium', 'Low'];

const ASSIGNEE_OPTIONS = [
  { label: 'Me', value: 'u4' },
  { label: 'Maya', value: 'u1' },
  { label: 'Jin', value: 'u2' },
  { label: 'Tomas', value: 'u3' },
  { label: 'Unassigned', value: 'unassigned' },
];

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Partial<IssueFilters>) => void;
  currentFilters: IssueFilters;
  issues: Issue[];
  searchQuery: string;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
  issues,
  searchQuery,
}) => {
  const { colors } = useTheme();

  const [tempStatus, setTempStatus] = useState<IssueStatus[]>([]);
  const [tempPriority, setTempPriority] = useState<IssuePriority[]>([]);
  const [tempAssignee, setTempAssignee] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setTempStatus([...currentFilters.status]);
      setTempPriority([...currentFilters.priority]);
      setTempAssignee([...currentFilters.assignee]);
    }
  }, [visible, currentFilters]);

  const matchingCount = useMemo(() => {
    return issues.filter(issue => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!issue.title.toLowerCase().includes(q) && !issue.id.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (tempStatus.length > 0 && !tempStatus.includes(issue.status)) return false;
      if (tempPriority.length > 0 && !tempPriority.includes(issue.priority)) return false;
      if (tempAssignee.length > 0) {
        const key = issue.assignee ? issue.assignee.id : 'unassigned';
        if (!tempAssignee.includes(key)) return false;
      }
      return true;
    }).length;
  }, [issues, tempStatus, tempPriority, tempAssignee, searchQuery]);

  const toggleStatus = (s: IssueStatus) =>
    setTempStatus(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]));

  const togglePriority = (p: IssuePriority) =>
    setTempPriority(prev => (prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]));

  const toggleAssignee = (id: string) =>
    setTempAssignee(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const handleReset = () => {
    setTempStatus([]);
    setTempPriority([]);
    setTempAssignee([]);
  };

  const handleDone = () => {
    onApply({ status: tempStatus, priority: tempPriority, assignee: tempAssignee });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        {/* Sheet header */}
        <View style={styles.sheetHeader}>
          <TouchableOpacity onPress={handleReset} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[styles.resetText, { color: colors.textSecondary }]}>Reset</Text>
          </TouchableOpacity>
          <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>Filters</Text>
          <TouchableOpacity onPress={handleDone} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[styles.doneText, { color: '#3B82F6' }]}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Status */}
          <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>STATUS</Text>
          <View style={styles.pillsRow}>
            {STATUS_OPTIONS.map(({ label, color }) => {
              const active = tempStatus.includes(label);
              return (
                <TouchableOpacity
                  key={label}
                  onPress={() => toggleStatus(label)}
                  activeOpacity={0.75}
                  style={[
                    styles.pill,
                    {
                      backgroundColor: active ? colors.textPrimary : colors.background,
                      borderColor: active ? colors.textPrimary : colors.border,
                    },
                  ]}
                >
                  <View style={[styles.pillDot, { backgroundColor: active ? colors.background : color }]} />
                  <Text style={[styles.pillText, { color: active ? colors.background : colors.textPrimary }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Priority */}
          <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>PRIORITY</Text>
          <View style={styles.pillsRow}>
            {PRIORITY_OPTIONS.map(p => {
              const active = tempPriority.includes(p);
              return (
                <TouchableOpacity
                  key={p}
                  onPress={() => togglePriority(p)}
                  activeOpacity={0.75}
                  style={[
                    styles.pill,
                    {
                      backgroundColor: active ? colors.textPrimary : colors.background,
                      borderColor: active ? colors.textPrimary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.pillText, { color: active ? colors.background : colors.textPrimary }]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Assignee */}
          <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>ASSIGNEE</Text>
          <View style={styles.pillsRow}>
            {ASSIGNEE_OPTIONS.map(({ label, value }) => {
              const active = tempAssignee.includes(value);
              return (
                <TouchableOpacity
                  key={value}
                  onPress={() => toggleAssignee(value)}
                  activeOpacity={0.75}
                  style={[
                    styles.pill,
                    {
                      backgroundColor: active ? colors.textPrimary : colors.background,
                      borderColor: active ? colors.textPrimary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.pillText, { color: active ? colors.background : colors.textPrimary }]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: colors.textPrimary }]}
          onPress={handleDone}
          activeOpacity={0.85}
        >
          <Text style={[styles.ctaText, { color: colors.background }]}>
            Show {matchingCount} {matchingCount === 1 ? 'result' : 'results'}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: '70%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  resetText: {
    fontSize: 15,
    fontWeight: '400',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  doneText: {
    fontSize: 15,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 4,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  ctaButton: {
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
