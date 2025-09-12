import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import type { OnboardingStackScreenProps } from '../../../../shared/types/navigation';

type Props = OnboardingStackScreenProps<'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  const handleGetStarted = () => {
    navigation.navigate('GoalSetup');
  };

  const handleSignIn = () => {
    navigation.getParent()?.navigate('Auth', { screen: 'SignIn' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Logo/Brand Icon Placeholder */}
          <View style={styles.logoContainer}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <Text style={styles.logoEmoji}>🌱</Text>
              </View>
            </View>
          </View>

          {/* Main Headline */}
          <View style={styles.header}>
            <Text style={styles.title}>AI-Guided Habit Formation</Text>
            <Text style={styles.subtitle}>
              Your personal growth companion that adapts to your journey
            </Text>
          </View>

          {/* Value Proposition */}
          <View style={styles.valueProposition}>
            <Text style={styles.description}>
              Unlike traditional habit trackers that focus on rigid streaks, we
              guide you through a shame-free approach to building lasting
              habits. Our AI adapts to your struggles and celebrates your
              progress, creating a sustainable path to your goals.
            </Text>

            {/* Key Benefits */}
            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <View style={[styles.benefitDot, styles.emeraldDot]} />
                <Text style={styles.benefitText}>
                  Personalized guidance that learns from your patterns
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={[styles.benefitDot, styles.blueDot]} />
                <Text style={styles.benefitText}>
                  Weekly stages that build gradually toward success
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <View style={[styles.benefitDot, styles.emeraldDot]} />
                <Text style={styles.benefitText}>
                  Adaptive recalibration when life gets in the way
                </Text>
              </View>
            </View>
          </View>

          {/* Call-to-Action Buttons */}
          <View style={styles.buttonContainer}>
            {/* Primary CTA */}
            <TouchableOpacity
              onPress={handleGetStarted}
              style={styles.primaryButton}
              activeOpacity={0.9}
              testID="get-started-button"
            >
              <Text style={styles.primaryButtonText}>Start Your Journey</Text>
            </TouchableOpacity>

            {/* Secondary CTA */}
            <TouchableOpacity
              onPress={handleSignIn}
              style={styles.secondaryButton}
              activeOpacity={0.7}
              testID="sign-in-link"
            >
              <Text style={styles.secondaryButtonText}>
                Already have an account? Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom decorative element */}
        <View style={styles.bottomDecorator}>
          <View style={styles.decoratorDots}>
            <View style={[styles.decoratorDot, styles.emeraldLight]} />
            <View style={[styles.decoratorDot, styles.blueLight]} />
            <View style={[styles.decoratorDot, styles.emeraldLight]} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoOuter: {
    width: 80,
    height: 80,
    backgroundColor: '#d1fae5',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoInner: {
    width: 48,
    height: 48,
    backgroundColor: '#10b981',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 24,
  },
  valueProposition: {
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  benefitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  emeraldDot: {
    backgroundColor: '#10b981',
  },
  blueDot: {
    backgroundColor: '#3b82f6',
  },
  benefitText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  bottomDecorator: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  decoratorDots: {
    flexDirection: 'row',
    gap: 8,
  },
  decoratorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emeraldLight: {
    backgroundColor: '#a7f3d0',
  },
  blueLight: {
    backgroundColor: '#93c5fd',
  },
});
