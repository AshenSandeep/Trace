import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActionSheetIOS,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../theme';
import { useIssueStore } from '../../store/issueStore';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../../components/common/Avatar';
import { MOCK_USERS } from '../../api/issues';
import type { IssuesStackParamList } from '../../navigation/types';
import type { IssueStatus, IssuePriority, User } from '../../types';
import type { ColorPalette } from '../../theme/colors';

type Props = NativeStackScreenProps<IssuesStackParamList, 'IssueForm'>;

const STATUS_OPTIONS: IssueStatus[] = ['Open', 'In Progress', 'Resolved', 'Closed'];
const PRIORITY_OPTIONS: IssuePriority[] = ['High', 'Medium', 'Low'];

const IssueFormScreen = ({ route, navigation }: Props) => {
  const { issueId } = route.params ?? {};
  const isEditing = !!issueId;

  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { issues, createIssue, updateIssue } = useIssueStore();
  const { user } = useAuthStore();

  const existing = isEditing ? issues.find(i => i.id === issueId) : null;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [status, setStatus] = useState<IssueStatus>(existing?.status ?? 'Open');
  const [priority, setPriority] = useState<IssuePriority>(existing?.priority ?? 'Medium');
  const [assignee, setAssignee] = useState<User | null>(existing?.assignee ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const [titleError, setTitleError] = useState('');

  const titleRef = useRef<TextInput>(null);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    if (!isEditing) {
      const t = setTimeout(() => titleRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }
  }, [isEditing]);

  const isDirty =
    title !== (existing?.title ?? '') ||
    description !== (existing?.description ?? '') ||
    status !== (existing?.status ?? 'Open') ||
    priority !== (existing?.priority ?? 'Medium') ||
    (assignee?.id ?? null) !== (existing?.assignee?.id ?? null);

  const isSaveEnabled = title.trim().length >= 3 && !isSaving;

  const handleCancel = useCallback(() => {
    if (isDirty) {
      Alert.alert('Discard changes?', 'Your unsaved changes will be lost.', [
        { text: 'Keep editing', style: 'cancel' },
        { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
      ]);
    } else {
      navigation.goBack();
    }
  }, [isDirty, navigation]);

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 3) {
      setTitleError('Title must be at least 3 characters.');
      return;
    }
    setTitleError('');
    setIsSaving(true);
    try {
      if (isEditing && issueId) {
        await updateIssue(issueId, {
          title: trimmedTitle,
          description: description.trim(),
          status,
          priority,
          assignee,
        });
      } else {
        await createIssue({
          title: trimmedTitle,
          description: description.trim(),
          status,
          priority,
          assignee,
          reporter: user ?? undefined,
        });
      }
      navigation.goBack();
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: [...STATUS_OPTIONS, 'Cancel'], cancelButtonIndex: STATUS_OPTIONS.length },
        idx => { if (idx < STATUS_OPTIONS.length) setStatus(STATUS_OPTIONS[idx]); },
      );
    } else {
      Alert.alert('Status', '', [
        ...STATUS_OPTIONS.map(s => ({ text: s, onPress: () => setStatus(s) })),
        { text: 'Cancel', style: 'cancel' as const },
      ]);
    }
  };

  const handlePriorityPress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: [...PRIORITY_OPTIONS, 'Cancel'], cancelButtonIndex: PRIORITY_OPTIONS.length },
        idx => { if (idx < PRIORITY_OPTIONS.length) setPriority(PRIORITY_OPTIONS[idx]); },
      );
    } else {
      Alert.alert('Priority', '', [
        ...PRIORITY_OPTIONS.map(p => ({ text: p, onPress: () => setPriority(p) })),
        { text: 'Cancel', style: 'cancel' as const },
      ]);
    }
  };

  const handleAssigneePress = () => {
    const names = [...MOCK_USERS.map(u => u.name), 'Unassigned'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: [...names, 'Cancel'], cancelButtonIndex: names.length },
        idx => {
          if (idx < MOCK_USERS.length) setAssignee(MOCK_USERS[idx]);
          else if (idx === MOCK_USERS.length) setAssignee(null);
        },
      );
    } else {
      Alert.alert('Assignee', '', [
        ...MOCK_USERS.map(u => ({ text: u.name, onPress: () => setAssignee(u) })),
        { text: 'Unassigned', onPress: () => setAssignee(null) },
        { text: 'Cancel', style: 'cancel' as const },
      ]);
    }
  };

  const statusColor = getStatusColor(status, colors);
  const priorityColor = getPriorityColor(priority, colors);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Custom header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 12, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={handleCancel}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.headerSide}
        >
          <Text style={[styles.cancelText, { color: colors.textPrimary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {isEditing ? 'Edit issue' : 'New issue'}
        </Text>
        <View style={[styles.headerSide, styles.headerSideRight]}>
          <TouchableOpacity
            onPress={handleSave}
            disabled={!isSaveEnabled}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <Text
                style={[
                  styles.saveText,
                  { color: isSaveEnabled ? '#3B82F6' : colors.textTertiary },
                ]}
              >
                Save
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* TITLE */}
          <Text style={[styles.fieldLabel, { color: colors.textTertiary }]}>TITLE</Text>
          <View
            style={[
              styles.inputBox,
              {
                backgroundColor: colors.surface,
                borderColor: titleError ? '#EF4444' : colors.border,
              },
            ]}
          >
            <TextInput
              ref={titleRef}
              style={[styles.titleInput, { color: colors.textPrimary }]}
              placeholder="Brief, specific summary of the issue"
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={t => {
                setTitle(t);
                if (titleError) setTitleError('');
              }}
              multiline
              autoCapitalize="sentences"
              autoCorrect={false}
            />
          </View>
          {titleError ? (
            <Text style={styles.fieldError}>{titleError}</Text>
          ) : null}

          {/* DESCRIPTION */}
          <Text style={[styles.fieldLabel, { color: colors.textTertiary, marginTop: 20 }]}>
            DESCRIPTION
          </Text>
          <View
            style={[
              styles.inputBox,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <TextInput
              style={[styles.descriptionInput, { color: colors.textPrimary }]}
              placeholder="Steps to reproduce, expected vs. actual behaviour…"
              placeholderTextColor={colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline
              autoCapitalize="sentences"
              autoCorrect={false}
              textAlignVertical="top"
            />
          </View>

          {/* STATUS + PRIORITY row */}
          <View style={styles.twoColRow}>
            <View style={styles.twoColItem}>
              <Text style={[styles.fieldLabel, { color: colors.textTertiary }]}>STATUS</Text>
              <TouchableOpacity
                style={[
                  styles.selectBox,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                onPress={handleStatusPress}
                activeOpacity={0.75}
              >
                <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                <Text
                  style={[styles.selectValue, { color: colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {status}
                </Text>
                <Text style={[styles.chevron, { color: colors.textTertiary }]}>⌄</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.twoColItem}>
              <Text style={[styles.fieldLabel, { color: colors.textTertiary }]}>PRIORITY</Text>
              <TouchableOpacity
                style={[
                  styles.selectBox,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
                onPress={handlePriorityPress}
                activeOpacity={0.75}
              >
                <Text
                  style={[styles.selectValue, { color: priorityColor, fontWeight: '600' }]}
                  numberOfLines={1}
                >
                  {priority}
                </Text>
                <Text style={[styles.chevron, { color: colors.textTertiary }]}>⌄</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ASSIGNEE */}
          <Text style={[styles.fieldLabel, { color: colors.textTertiary, marginTop: 20 }]}>
            ASSIGNEE{' '}
            <Text style={[styles.optionalText, { color: colors.textTertiary }]}>· optional</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.selectBox,
              styles.assigneeBox,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={handleAssigneePress}
            activeOpacity={0.75}
          >
            {assignee ? (
              <>
                <Avatar initials={assignee.initials} size="sm" />
                <Text style={[styles.selectValue, { color: colors.textPrimary, flex: 1 }]}>
                  {assignee.name}
                </Text>
              </>
            ) : (
              <Text style={[styles.selectValue, { color: colors.textTertiary, flex: 1 }]}>
                Unassigned
              </Text>
            )}
            <Text style={[styles.chevron, { color: colors.textTertiary }]}>⌄</Text>
          </TouchableOpacity>

          {/* Attachment row */}
          <TouchableOpacity
            style={styles.attachmentRow}
            onPress={() => Alert.alert('Coming soon', 'Attachments are not yet available.')}
            activeOpacity={0.75}
          >
            <Text style={[styles.attachmentIcon, { color: colors.textTertiary }]}>📎</Text>
            <Text style={[styles.attachmentText, { color: colors.textTertiary }]}>
              Add screenshot or attachment
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const getStatusColor = (status: IssueStatus, colors: ColorPalette): string => {
  switch (status) {
    case 'Open': return colors.statusOpen;
    case 'In Progress': return colors.statusInProgress;
    case 'Resolved': return colors.statusResolved;
    case 'Closed': return colors.statusClosed;
  }
};

const getPriorityColor = (priority: IssuePriority, colors: ColorPalette): string => {
  switch (priority) {
    case 'High': return colors.priorityHigh;
    case 'Medium': return colors.priorityMedium;
    case 'Low': return colors.priorityLow;
  }
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerSide: {
    width: 64,
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  cancelText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.7,
    marginBottom: 8,
  },
  inputBox: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  titleInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 48,
  },
  descriptionInput: {
    fontSize: 15,
    lineHeight: 22,
    minHeight: 90,
  },
  fieldError: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 5,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  twoColItem: {
    flex: 1,
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 13,
    gap: 7,
  },
  assigneeBox: {
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  selectValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 16,
    lineHeight: 18,
    flexShrink: 0,
  },
  optionalText: {
    fontSize: 11,
    fontWeight: '400',
    letterSpacing: 0,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 18,
    marginTop: 4,
  },
  attachmentIcon: {
    fontSize: 16,
  },
  attachmentText: {
    fontSize: 15,
  },
});

export default IssueFormScreen;
