import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';

const { width } = Dimensions.get('window');

type StepComponentProps = {
  onNext: () => void;
  onBack?: () => void;
  currentStep: number;
  email: string;
  setEmail: (text: string) => void;
  otp: string;
  setOtp: (text: string) => void;
  newPassword: string;
  setNewPassword: (text: string) => void;
  confirmPassword: string;
  setConfirmPassword: (text: string) => void;
  isLoading: boolean;
};

const Step1 = ({ onNext, email, setEmail, isLoading }: StepComponentProps) => (
  <View style={styles.stepContainer}>
    <Text style={styles.title}>Forgot Password</Text>
    <Text style={styles.subtitle}>Please enter your registered email address to reset your password. We'll send a one-time password (OTP) to your email for verification. Once verified, you'll be able to set a new password and regain access to your account.</Text>
    <TextInput
      style={styles.input}
      placeholder="Email address"
      placeholderTextColor="#999"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />
    <Pressable 
      style={[styles.button, isLoading && styles.disabledButton]} 
      onPress={onNext}
      disabled={isLoading}
    >
      <Text style={styles.buttonText}>
        {isLoading ? 'Sending...' : 'Continue'}
      </Text>
    </Pressable>
    <Pressable style={styles.backButton} onPress={() => router.back()}>
      <Text style={styles.buttonText}>Back</Text>
    </Pressable>
  </View>
);

const Step2 = ({ onNext, onBack, otp, setOtp, email, isLoading }: StepComponentProps) => {
  const [resendTimer, setResendTimer] = useState(30);
  const [resending, setResending] = useState(false);

  React.useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleResend = async () => {
    if (resendTimer > 0 || resending) return;
    setResending(true);
    try {
      const response = await fetch('https://canine-dog.vercel.app/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'forgot-password' }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setResendTimer(30);
      } else {
        alert(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.stepContainer}>
      <Text style={styles.title}>Verification</Text>
      <Text style={styles.subtitle}>
        We've sent a one-time password (OTP) to your registered email address.
        Please check your inbox and enter the code below to verify your identity
        and continue resetting your password.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit code"
        placeholderTextColor="#999"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />

      <Pressable
        onPress={handleResend}
        disabled={resendTimer > 0 || resending}
        style={{ marginTop: 10 }}
      >
        <Text style={{
          color: resendTimer > 0 ? 'gray' : '#4D55CC',
          fontSize: 14,
          textAlign: 'center',
        }}>
          {resendTimer > 0
            ? `Resend OTP in ${resendTimer}s`
            : resending
              ? 'Sending...'
              : 'Resend OTP'}
        </Text>
      </Pressable>

      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Verify</Text>
        </Pressable>
        {onBack && (
          <Pressable style={[styles.button, styles.backButton]} onPress={onBack}>
            <Text style={styles.buttonText}>Back</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const Step3 = ({ onNext, onBack, newPassword, setNewPassword, confirmPassword, setConfirmPassword, isLoading }: StepComponentProps) => (
  <View style={styles.stepContainer}>
    <Text style={styles.title}>New Password</Text>
    <Text style={styles.subtitle2}>Create a new password for your account. Make sure it’s strong and secure.</Text>
    <Text style={styles.subtitle}>Your password should be at least 8 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters.</Text>

    <TextInput
      style={styles.input}
      placeholder="New password"
      placeholderTextColor="#999"
      value={newPassword}
      onChangeText={setNewPassword}
      secureTextEntry
    />
    <TextInput
      style={styles.input}
      placeholder="Confirm password"
      placeholderTextColor="#999"
      value={confirmPassword}
      onChangeText={setConfirmPassword}
      secureTextEntry
    />
    <View style={styles.buttonRow}>
      <Pressable 
        style={[styles.button, isLoading && styles.disabledButton]} 
        onPress={onNext}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </Text>
      </Pressable>
      {onBack && (
        <Pressable style={[styles.button, styles.backButton]} onPress={onBack}>
          <Text style={styles.buttonText}>Back</Text>
        </Pressable>
      )}
    </View>
  </View>
);

const ForgetPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = async () => {
    if (isLoading) return;

    // Step validations
    if (currentStep === 1) {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Please enter a valid email address');
        return;
      }
    } else if (currentStep === 2) {
      if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
        alert('Please enter a valid 6-digit OTP');
        return;
      }
    } else if (currentStep === 3) {
      if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      if (newPassword.length < 8) {
        alert('Password must be at least 8 characters');
        return;
      }
    }

    // API calls
    if (currentStep === 1) {
      setIsLoading(true);
      try {
        const response = await fetch('https://canine-dog.vercel.app/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, type: 'forgot-password' }),
        });
        const data = await response.json();
        if (response.ok) {
          setCurrentStep(prev => prev + 1);
        } else {
          console.log(data);
          alert(data.message || 'Failed to send OTP');
        }
      } catch (error) {
        alert('Network error');
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 2) {
      setCurrentStep(prev => prev + 1);
    } else if (currentStep === 3) {
      setIsLoading(true);
      try {
        const response = await fetch('https://canine-dog.vercel.app/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, newPassword, otp }),
        });
        const data = await response.json();
        if (response.ok) {
          alert('Password reset successfully!');
          router.back();
        } else {
          alert(data.message || 'Failed to reset password');
        }
      } catch (error) {
        alert('Network error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const steps = [
    { title: 'Email', component: Step1 },
    { title: 'Verification', component: Step2 },
    { title: 'Password', component: Step3 },
  ];

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.pagination}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                currentStep > index && styles.activeDot,
                currentStep === index + 1 && styles.currentDot
              ]}
            />
          ))}
        </View>

        <CurrentStepComponent
          onNext={handleNext}
          onBack={currentStep > 1 ? handleBack : undefined}
          currentStep={currentStep}
          email={email}
          setEmail={setEmail}
          otp={otp}
          setOtp={setOtp}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          isLoading={isLoading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 50,
  },
  stepContainer: {
    flex: 1,
    width: '100%',
  },
  title: {
    color: '#4D55CC',
    fontFamily: 'Poppins-Regular',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 20,

  },
  subtitle2: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'justify',
    marginBottom: 1,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
    textAlign: 'justify',
    marginBottom: 40,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  inputHeading: {
    fontFamily: 'Poppins-SemiBold',
    paddingBottom: 5,
    color: '#333',
  },
  button: {
    backgroundColor: '#4D55CC',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    backgroundColor: '#D3D3D3',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonRow: {

    justifyContent: 'flex-start',
    marginTop: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  currentDot: {
    backgroundColor: '#4D55CC',
    width: 20,
  },
  activeDot: {
    backgroundColor: '#4D55CC',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
});

export default ForgetPassword;