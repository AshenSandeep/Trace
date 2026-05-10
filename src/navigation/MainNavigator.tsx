import React from 'react';
import { Platform, View, Image } from 'react-native';
import { OfflineBanner } from '../components/common/OfflineBanner';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';

const TAB_ICONS = {
  home:           require('../icons/home.png'),
  home_outline:   require('../icons/home_outline.png'),
  issues:         require('../icons/issues.png'),
  issues_outline: require('../icons/issues_outline.png'),
  person:         require('../icons/person.png'),
  person_outline: require('../icons/person_outline.png'),
};
import { MainTabParamList, IssuesStackParamList } from './types';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import IssueListScreen from '../screens/issues/IssueListScreen';
import IssueDetailScreen from '../screens/issues/IssueDetailScreen';
import IssueFormScreen from '../screens/issues/IssueFormScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const IssuesStack = createNativeStackNavigator<IssuesStackParamList>();

const headerScreenOptions = (colors: any, typography: any) => ({
  headerStyle: { backgroundColor: colors.background },
  headerTitleStyle: { ...typography.h3, color: colors.textPrimary },
  headerShadowVisible: false,
  headerBackTitle: '',
  headerTintColor: colors.textPrimary,
});

const IssuesNavigator = () => {
  const { colors, typography } = useTheme();
  return (
    <IssuesStack.Navigator screenOptions={headerScreenOptions(colors, typography)}>
      <IssuesStack.Screen
        name="IssueList"
        component={IssueListScreen}
        options={{ title: 'Issues' }}
      />
      <IssuesStack.Screen
        name="IssueDetail"
        component={IssueDetailScreen}
        options={{ title: 'Issue Detail' }}
      />
      <IssuesStack.Screen
        name="IssueForm"
        component={IssueFormScreen}
        options={({ route }) => ({
          title: route.params?.issueId ? 'Edit Issue' : 'New Issue',
          presentation: 'modal',
        })}
      />
    </IssuesStack.Navigator>
  );
};

const MainNavigator = () => {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <OfflineBanner />
      <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          height: 60 + (Platform.OS === 'ios' ? 0 : 8),
          paddingBottom: Platform.OS === 'ios' ? 8 : 12,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused, color }) => {
          let source;
          if (route.name === 'DashboardTab') {
            source = focused ? TAB_ICONS.home : TAB_ICONS.home_outline;
          } else if (route.name === 'IssuesTab') {
            source = focused ? TAB_ICONS.issues : TAB_ICONS.issues_outline;
          } else {
            source = focused ? TAB_ICONS.person : TAB_ICONS.person_outline;
          }
          return <Image source={source} style={{ width: 24, height: 24, tintColor: color }} />;
        },
      })}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="IssuesTab"
        component={IssuesNavigator}
        options={{ title: 'Issues' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
    </View>
  );
};

export default MainNavigator;
