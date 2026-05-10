import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import { useAuthStore } from '../store/authStore';
import { useIssueStore } from '../store/issueStore';
import { useTheme } from '../theme';
import { RootStackParamList } from './types';
import SignInScreen from '../screens/auth/SignInScreen';
import MainNavigator from './MainNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator();

const AuthNavigator = () => {
  const { colors, typography } = useTheme();
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { ...typography.h3, color: colors.textPrimary },
        headerShadowVisible: false,
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
    </AuthStack.Navigator>
  );
};

const RootNavigator = () => {
  const { isAuthenticated, restoreSession } = useAuthStore();
  const { loadPersistedIssues, setOnlineStatus } = useIssueStore();
  const { colors } = useTheme();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const init = async () => {
      await restoreSession();
      await loadPersistedIssues();
      setIsRestoring(false);
    };
    init();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setOnlineStatus(state.isConnected ?? true);
    });
    return unsubscribe;
  }, []);

  if (isRestoring) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
