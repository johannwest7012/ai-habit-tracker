import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthStackScreenProps } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';

type Props = AuthStackScreenProps<'SignUp'>;

export const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { signUp, isLoading, error, clearError } = useAuth();

  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase and lowercase letter';
    }
    if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
    return undefined;
  };

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return undefined;
  };

  const validateForm = (): boolean => {
    const errors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password),
    };

    setValidationErrors(errors);
    return !Object.values(errors).some(error => error !== undefined);
  };

  const handleSignUp = async () => {
    // Clear any previous auth errors
    clearError();

    if (!validateForm()) {
      return;
    }

    const result = await signUp({ email: email.trim().toLowerCase(), password });

    if (result.success) {
      if (result.needsVerification) {
        // Show email verification screen
        Alert.alert(
          'Check Your Email',
          'We\'ve sent you a confirmation link. Please check your email and click the link to verify your account before signing in.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        // User is automatically signed in
        // Navigation will be handled by the RootNavigator auth state change
      }
    }
  };

  const handleNavigateToLogin = () => {
    clearError();
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us to start tracking your habits</Text>
        </View>

        <View style={styles.form}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (validationErrors.email) {
                setValidationErrors(prev => ({ ...prev, email: undefined }));
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            leftIcon={<Icon name="email" size={20} color="#666" />}
            errorMessage={validationErrors.email}
            disabled={isLoading}
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (validationErrors.password) {
                setValidationErrors(prev => ({ ...prev, password: undefined }));
              }
            }}
            secureTextEntry={!showPassword}
            leftIcon={<Icon name="lock" size={20} color="#666" />}
            rightIcon={
              <Icon
                name={showPassword ? 'visibility-off' : 'visibility'}
                size={20}
                color="#666"
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            errorMessage={validationErrors.password}
            disabled={isLoading}
          />

          <Input
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (validationErrors.confirmPassword) {
                setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }));
              }
            }}
            secureTextEntry={!showConfirmPassword}
            leftIcon={<Icon name="lock-outline" size={20} color="#666" />}
            rightIcon={
              <Icon
                name={showConfirmPassword ? 'visibility-off' : 'visibility'}
                size={20}
                color="#666"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            errorMessage={validationErrors.confirmPassword}
            disabled={isLoading}
          />

          {error && (
            <View style={styles.errorContainer}>
              <Icon name="error" size={20} color="#f44336" />
              <Text style={styles.errorText}>{error.message}</Text>
            </View>
          )}

          <Button
            title="Create Account"
            onPress={handleSignUp}
            loading={isLoading}
            disabled={isLoading}
            buttonStyle={styles.signUpButton}
            titleStyle={styles.signUpButtonText}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button
            title="Sign In"
            type="clear"
            onPress={handleNavigateToLogin}
            disabled={isLoading}
            titleStyle={styles.linkButtonText}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    marginBottom: 30,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 15,
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  signUpButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 10,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  linkButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
});