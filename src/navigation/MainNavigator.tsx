import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
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
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          if (route.name === 'DashboardTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'IssuesTab') {
            iconName = focused ? 'list' : 'list-outline';
          } else {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Icon name={iconName} size={22} color={color} />;
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
  );
};

export default MainNavigator;
