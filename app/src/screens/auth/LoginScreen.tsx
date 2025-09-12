/**
 * Login Screen Component
 * User authentication form with email/password validation
 * Following React Native styling patterns consistent with SignUpScreen
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthStackScreenProps } from '@shared/types/navigation';
import { useSignIn, usePasswordReset } from '../../hooks/useAuth';

type Props = AuthStackScreenProps<'SignIn'>;

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const REMEMBER_ME_KEY = 'remember_me_email';

export default function LoginScreen({ navigation }: Props) {
  const signInMutation = useSignIn();
  const passwordResetMutation = usePasswordReset();

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  // Load remembered email on component mount
  React.useEffect(() => {
    loadRememberedEmail();
  }, []);

  /**
   * Load remembered email from AsyncStorage
   */
  const loadRememberedEmail = async () => {
    try {
      const rememberedEmail = await AsyncStorage.getItem(REMEMBER_ME_KEY);
      if (rememberedEmail) {
        setFormData(prev => ({
          ...prev,
          email: rememberedEmail,
          rememberMe: true,
        }));
      }
    } catch (error) {
      console.warn('Failed to load remembered email:', error);
    }
  };

  /**
   * Save or clear remembered email based on remember me preference
   */
  const handleRememberMeToggle = async (remember: boolean) => {
    try {
      if (remember && formData.email.trim()) {
        await AsyncStorage.setItem(REMEMBER_ME_KEY, formData.email.trim());
      } else {
        await AsyncStorage.removeItem(REMEMBER_ME_KEY);
      }
    } catch (error) {
      console.warn('Failed to handle remember me preference:', error);
    }
  };

  /**
   * Validate email format
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Handle remember me preference
      await handleRememberMeToggle(formData.rememberMe);

      const result = await signInMutation.mutateAsync({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result.success && result.data) {
        // Navigation will be handled by the auth state change
        // The RootNavigator will automatically redirect to MainTabs or Onboarding
        console.log('Sign in successful');
      } else {
        const errorMessage = getErrorMessage(result.error);
        Alert.alert('Sign In Failed', errorMessage);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert(
        'Sign In Failed',
        'An unexpected error occurred. Please try again.'
      );
    }
  };

  /**
   * Handle forgot password
   */
  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      Alert.alert(
        'Email Required',
        'Please enter your email address to reset your password.'
      );
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address to reset your password.'
      );
      return;
    }

    try {
      const result = await passwordResetMutation.mutateAsync({
        email: formData.email.trim(),
      });

      if (result.success) {
        Alert.alert(
          'Password Reset Sent',
          'Check your email for password reset instructions.'
        );
      } else {
        const errorMessage =
          result.error?.message || 'Failed to send reset email';
        Alert.alert('Reset Failed', errorMessage);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      Alert.alert(
        'Reset Failed',
        'An unexpected error occurred. Please try again.'
      );
    }
  };

  /**
   * Get user-friendly error message
   */
  const getErrorMessage = (
    error: { message?: string } | null | undefined
  ): string => {
    if (!error?.message) {
      return 'An unexpected error occurred. Please try again.';
    }

    const message = error.message.toLowerCase();

    if (message.includes('invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }

    if (message.includes('email not confirmed')) {
      return 'Please check your email and click the verification link before signing in.';
    }

    if (message.includes('too many requests')) {
      return 'Too many sign in attempts. Please wait a few minutes and try again.';
    }

    if (message.includes('user not found')) {
      return 'No account found with this email address. Please check your email or sign up.';
    }

    return error.message;
  };

  /**
   * Update form field
   */
  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (typeof value === 'string' && errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isLoading = signInMutation.isPending || passwordResetMutation.isPending;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue tracking your habits and achieving your goals
            </Text>
          </View>

          {/* Sign In Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={value => updateField('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                editable={!isLoading}
                testID="email-input"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    errors.password && styles.inputError,
                  ]}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChangeText={value => updateField('password', value)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  textContentType="password"
                  editable={!isLoading}
                  testID="password-input"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  testID="toggle-password-visibility"
                >
                  <Text style={styles.eyeButtonText}>
                    {showPassword ? '👁️' : '🙈'}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Remember Me Checkbox */}
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => updateField('rememberMe', !formData.rememberMe)}
                testID="remember-me-checkbox"
              >
                <View
                  style={[
                    styles.checkboxBox,
                    formData.rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {formData.rememberMe && (
                    <Text style={styles.checkboxCheck}>✓</Text>
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Remember me</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.buttonDisabled]}
              onPress={handleSignIn}
              disabled={isLoading}
              testID="signin-button"
            >
              <Text style={styles.signInButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
              disabled={isLoading}
              testID="forgot-password-link"
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>
                Don&apos;t have an account?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                testID="signup-link"
              >
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  eyeButton: {
    padding: 12,
  },
  eyeButtonText: {
    fontSize: 18,
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginTop: 4,
  },
  checkboxContainer: {
    marginBottom: 8,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkboxCheck: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
  },
  signInButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signUpText: {
    fontSize: 16,
    color: '#6b7280',
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
});
