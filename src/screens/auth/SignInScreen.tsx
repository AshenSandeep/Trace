import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';

const SignInScreen = () => {
  const { colors } = useTheme();
  const { login, isLoading, error } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let valid = true;

    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Please enter a valid work email');
      valid = false;
    } else {
      setEmailError('');
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleContinue = async () => {
    if (!validate()) return;
    await login(email, password);
  };

  const handleComingSoon = () => {
    Alert.alert('Coming soon', 'This feature is not yet available.');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 40 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <View style={styles.logoInner} />
          </View>
          <Text style={[styles.logoText, { color: colors.textPrimary }]}>Trace</Text>
        </View>

        {/* Heading */}
        <Text style={[styles.heading, { color: colors.textPrimary }]}>
          {'Sign in to your\nworkspace'}
        </Text>
        <Text style={[styles.subheading, { color: colors.textSecondary }]}>
          Track issues, ship fixes. Keep momentum.
        </Text>

        {/* Auth error banner */}
        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        ) : null}

        {/* Email field */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>WORK EMAIL</Text>
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: colors.surface,
                borderColor: emailError ? '#EF4444' : colors.border,
              },
            ]}
          >
            <Text style={[styles.inputIcon, { color: colors.textTertiary }]}>✉</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="alex@northwind.co"
              placeholderTextColor={colors.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>
          {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}
        </View>

        {/* Password field */}
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>PASSWORD</Text>
          <View
            style={[
              styles.inputRow,
              {
                backgroundColor: colors.surface,
                borderColor: passwordError ? '#EF4444' : colors.border,
              },
            ]}
          >
            <Text style={[styles.inputIcon, { color: colors.textTertiary }]}>⚿</Text>
            <TextInput
              style={[styles.input, { color: colors.textPrimary }]}
              placeholder="••••••••••"
              placeholderTextColor={colors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(v => !v)}
              style={styles.showToggle}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.showText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.fieldError}>{passwordError}</Text> : null}
          <TouchableOpacity onPress={handleComingSoon} style={styles.forgotRow}>
            <Text style={[styles.forgotText, { color: colors.textSecondary }]}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Continue */}
        <Button
          variant="primary"
          label="Continue  →"
          onPress={handleContinue}
          loading={isLoading}
          disabled={isLoading}
          style={styles.fullWidth}
        />

        {/* OR divider */}
        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textTertiary }]}>OR</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* SSO */}
        <Button
          variant="secondary"
          label="Continue with SSO"
          onPress={handleComingSoon}
          style={styles.fullWidth}
        />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>New here? </Text>
          <TouchableOpacity onPress={handleComingSoon}>
            <Text style={[styles.footerLink, { color: colors.textPrimary }]}>Create account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoMark: {
    width: 30,
    height: 30,
    borderRadius: 7,
    backgroundColor: '#1E3A5F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoInner: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#3B82F6',
  },
  logoText: {
    fontSize: 16,
    fontWeight: '600',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 32,
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorBannerText: {
    color: '#991B1B',
    fontSize: 14,
    lineHeight: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  inputIcon: {
    fontSize: 15,
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  showToggle: {
    paddingLeft: 8,
  },
  showText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3B82F6',
  },
  fieldError: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 5,
  },
  forgotRow: {
    marginTop: 10,
  },
  forgotText: {
    fontSize: 14,
  },
  fullWidth: {
    width: '100%',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 36,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default SignInScreen;
