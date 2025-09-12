/**
 * Password Reset Screen Component
 * Password recovery form with email validation
 * Following React Native styling patterns consistent with LoginScreen/SignUpScreen
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
import type { AuthStackScreenProps } from '@shared/types/navigation';
import { usePasswordReset } from '../../hooks/useAuth';

type Props = AuthStackScreenProps<'PasswordReset'>;

interface FormData {
  email: string;
}

interface FormErrors {
  email?: string;
}

export default function PasswordResetScreen({ navigation }: Props) {
  const passwordResetMutation = usePasswordReset();

  const [formData, setFormData] = useState<FormData>({
    email: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle password reset submission
   */
  const handlePasswordReset = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await passwordResetMutation.mutateAsync({
        email: formData.email.trim(),
      });

      if (result.success) {
        // Navigate to confirmation screen with email
        navigation.navigate('PasswordResetConfirmation', {
          email: formData.email.trim(),
        });
      } else {
        const errorMessage = getErrorMessage(result.error);
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

    if (message.includes('rate limit') || message.includes('too many')) {
      return 'Too many reset attempts. Please wait a few minutes and try again.';
    }

    if (
      message.includes('invalid email') ||
      message.includes('email not found')
    ) {
      return 'If an account with this email exists, we will send password reset instructions.';
    }

    if (message.includes('user not found')) {
      return 'If an account with this email exists, we will send password reset instructions.';
    }

    return 'Unable to send reset email. Please check your email address and try again.';
  };

  /**
   * Update form field
   */
  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isLoading = passwordResetMutation.isPending;

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
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we&apos;ll send you instructions to
              reset your password
            </Text>
          </View>

          {/* Reset Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter your email address"
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

            {/* Reset Button */}
            <TouchableOpacity
              style={[styles.resetButton, isLoading && styles.buttonDisabled]}
              onPress={handlePasswordReset}
              disabled={isLoading}
              testID="reset-button"
            >
              <Text style={styles.resetButtonText}>
                {isLoading ? 'Sending Reset Email...' : 'Send Reset Email'}
              </Text>
            </TouchableOpacity>

            {/* Back to Sign In Link */}
            <View style={styles.backToSignInContainer}>
              <Text style={styles.backToSignInText}>
                Remember your password?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                testID="back-to-signin-link"
              >
                <Text style={styles.backToSignInLink}>Sign In</Text>
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
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginTop: 4,
  },
  resetButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  backToSignInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  backToSignInText: {
    fontSize: 16,
    color: '#6b7280',
  },
  backToSignInLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
});
