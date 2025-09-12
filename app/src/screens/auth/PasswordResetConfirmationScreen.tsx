/**
 * Password Reset Confirmation Screen Component
 * Displays success message after password reset email is sent
 * Following React Native styling patterns consistent with auth screens
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import type { AuthStackScreenProps } from '@shared/types/navigation';

type Props = AuthStackScreenProps<'PasswordResetConfirmation'>;

export default function PasswordResetConfirmationScreen({
  navigation,
  route,
}: Props) {
  const { email } = route.params;

  const handleBackToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.successIcon}>✉️</Text>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Check Your Email</Text>
            <Text style={styles.subtitle}>
              We&apos;ve sent password reset instructions to:
            </Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Next Steps:</Text>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>1.</Text>
              <Text style={styles.stepText}>
                Check your email inbox (and spam folder)
              </Text>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>2.</Text>
              <Text style={styles.stepText}>
                Click the reset link in the email
              </Text>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>3.</Text>
              <Text style={styles.stepText}>
                Create a new password when prompted
              </Text>
            </View>
            <View style={styles.stepContainer}>
              <Text style={styles.stepNumber}>4.</Text>
              <Text style={styles.stepText}>
                Return to the app and sign in with your new password
              </Text>
            </View>
          </View>

          {/* Important Notes */}
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Important:</Text>
            <Text style={styles.notesText}>
              • The reset link will expire in 24 hours
            </Text>
            <Text style={styles.notesText}>
              • If you don&apos;t receive the email, check your spam folder
            </Text>
            <Text style={styles.notesText}>
              • Contact support if you continue having issues
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.backToSignInButton}
              onPress={handleBackToSignIn}
              testID="back-to-signin-button"
            >
              <Text style={styles.backToSignInButtonText}>Back to Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resendButton}
              onPress={() => navigation.navigate('PasswordReset')}
              testID="resend-email-button"
            >
              <Text style={styles.resendButtonText}>
                Didn&apos;t receive the email? Try again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 64,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    textAlign: 'center',
  },
  instructionsContainer: {
    marginBottom: 24,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    marginRight: 8,
    minWidth: 20,
  },
  stepText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    lineHeight: 20,
  },
  notesContainer: {
    marginBottom: 32,
    backgroundColor: '#fef3cd',
    padding: 16,
    borderRadius: 8,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#92400e',
    marginBottom: 4,
    lineHeight: 18,
  },
  actionsContainer: {
    gap: 16,
  },
  backToSignInButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backToSignInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  resendButton: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
});
