import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActionSheetIOS,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, ThemeMode } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { Avatar } from '../../components/common/Avatar';

const THEME_LABELS: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
};

const APP_VERSION = '1.0.0';

const ProfileScreen = () => {
  const { colors, typography, spacing, themeMode, setThemeMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();

  const handleAppearance = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Light', 'Dark', 'System'],
          cancelButtonIndex: 0,
        },
        (index) => {
          if (index === 1) setThemeMode('light');
          if (index === 2) setThemeMode('dark');
          if (index === 3) setThemeMode('system');
        },
      );
    } else {
      Alert.alert('Appearance', 'Choose a theme', [
        { text: 'Light', onPress: () => setThemeMode('light') },
        { text: 'Dark', onPress: () => setThemeMode('dark') },
        { text: 'System (default)', onPress: () => setThemeMode('system') },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign out of Trace?',
      "You'll need to sign in again.",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign out', style: 'destructive', onPress: logout },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + user info */}
        <View style={styles.userSection}>
          <Avatar initials={user?.initials ?? '?'} size="xl" />
          <Text style={[styles.userName, { color: colors.textPrimary }]}>
            {user?.name ?? 'Unknown'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user?.email ?? ''}
          </Text>
        </View>

        {/* Settings rows */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SettingRow
            label="Notifications"
            colors={colors}
            onPress={() => Alert.alert('Coming soon', 'Notification settings are not yet available.')}
          />
          <SettingRow
            label="Appearance"
            value={THEME_LABELS[themeMode]}
            colors={colors}
            onPress={handleAppearance}
            divider
          />
          <SettingRow
            label="Export issues"
            colors={colors}
            onPress={() => Alert.alert('Coming soon', 'Export will be available in the next update.')}
            divider
          />
          <SettingRow
            label="About"
            value={`Version ${APP_VERSION}`}
            colors={colors}
            onPress={() => {}}
            chevron={false}
            divider
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: '#EF4444' }]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

interface RowProps {
  label: string;
  value?: string;
  colors: any;
  onPress: () => void;
  chevron?: boolean;
  divider?: boolean;
}

const SettingRow: React.FC<RowProps> = ({
  label,
  value,
  colors,
  onPress,
  chevron = true,
  divider = false,
}) => (
  <TouchableOpacity
    style={[styles.row, divider && { borderTopWidth: 1, borderTopColor: colors.border }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{label}</Text>
    <View style={styles.rowRight}>
      {value ? (
        <Text style={[styles.rowValue, { color: colors.textTertiary }]}>{value}</Text>
      ) : null}
      {chevron ? (
        <Text style={[styles.chevron, { color: colors.textTertiary }]}>›</Text>
      ) : null}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  userSection: {
    alignItems: 'center',
    marginBottom: 36,
    gap: 8,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
  },
  userEmail: {
    fontSize: 15,
  },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 28,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  rowLabel: {
    fontSize: 15,
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowValue: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '300',
  },
  logoutBtn: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
});

export default ProfileScreen;
