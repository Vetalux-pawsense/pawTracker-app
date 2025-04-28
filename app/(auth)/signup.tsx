import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const SignupSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9]+$/, 'Must be a valid number').required('Phone is required'), 
  password: Yup.string().min(6, 'Too Short!').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null as any], 'Passwords must match')
    .required('Confirm Password is required'),
  otp: Yup.string().length(4, 'OTP must be 4 digits').required('OTP is required')
});

export default function Signup() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleSendOtp = async (email: string) => {
    setIsSendingOtp(true);
    setApiError('');
    try {
      const response = await fetch('https://canine-dog.vercel.app/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!response.ok) throw new Error('Failed to send OTP');
      setStep(4);
    } catch (error: any) {
      setApiError(error.message || 'Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handlePickImage = async (setFieldValue: any) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        let uri = result.assets[0].uri;
        
        if (uri.toLowerCase().endsWith('.heic')) {
          const manipResult = await manipulateAsync(
            uri,
            [],
            { compress: 1, format: SaveFormat.JPEG }
          );
          uri = manipResult.uri;
        }

        setFieldValue('profileImgUrl', uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      setApiError('Error selecting image');
    }
  };

  const handleRegister = async (values: any) => {
    try {
      console.log('--- Starting registration ---');
      console.log('Form values:', values);
  
      const [firstName, ...lastNameParts] = values.fullName.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      console.log('Name split:', { firstName, lastName });
  
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('username', values.username);
      formData.append('email', values.email);
      formData.append('phoneNumber', values.phone);
      formData.append('password', values.password);
      formData.append('otp', values.otp);
  
      console.log('FormData (before file):');
      // @ts-ignore - temporary debugging
      for (const [key, value] of formData._parts) {
        console.log(`  ${key}:`, value);
      }
  
      if (values.profileImgUrl) {
        console.log('Processing image:', values.profileImgUrl);
        const filename = values.profileImgUrl.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1] === 'jpg' ? 'jpeg' : match[1]}` : 'image/jpeg';
        
        formData.append('file', {
          uri: values.profileImgUrl,
          type,
          name: filename || 'profile.jpg',
        } as any);
  
        console.log('File details:', {
          uri: values.profileImgUrl,
          type,
          name: filename || 'profile.jpg'
        });
      }
  
   
      console.log('Sending FormData:');
      // @ts-ignore - temporary debugging
      for (const [key, value] of formData._parts) {
        console.log(`  ${key}:`, value);
      }
  
    
      console.log('Sending request to server...');
      const response = await fetch('https://canine-dog.vercel.app/api/auth/register', {
        method: 'POST',
        body: formData,
      });
  
      console.log('Received response, status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error(errorText);
      }
  
      const responseData = await response.json();
      console.log('Registration successful:', responseData);
      router.back();
    } catch (error: any) {
      console.error('Registration failed:');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      setApiError(
        error.message || 
        'Registration failed - please check image format and try again'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <MaterialCommunityIcons
              name="paw"
              size={80}
              color="rgba(33,28,132,0.1)"
              style={[styles.topPaw, { transform: [{ rotate: '-240deg' }] }]}
            />
            <MaterialCommunityIcons
              name="paw"
              size={80}
              color="rgba(33,28,132,0.1)"
              style={[styles.centerPaw, { transform: [{ rotate: '-50deg' }] }]}
            />
            <MaterialCommunityIcons
              name="paw"
              size={80}
              color="rgba(0,0,0,0.1)"
              style={[styles.bottomPaw, { transform: [{ rotate: '40deg' }] }]}
            />

            <View style={styles.headers}>
              <Text style={styles.title}>Create an account</Text>
              <Text style={styles.subtitle}>AI-powered tracking to ensure your dog stays happy, healthy, and safe</Text>
            </View>

            {apiError ? <Text style={styles.error}>{apiError}</Text> : null}

            <Formik
              initialValues={{
                fullName: '',
                username: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
                otp: '',
                profileImgUrl: ''
              }}
              validationSchema={SignupSchema}
              onSubmit={handleRegister}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
                <View style={styles.formContainer}>
                  {step === 1 && (
                    <>

                      <Text style={styles.inputHeading}>Full Name</Text>
                      {touched.fullName && errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}
                      <TextInput
                        placeholder="Enter your name"
                        placeholderTextColor="gray"
                        style={styles.input}
                        onChangeText={handleChange('fullName')}
                        onBlur={handleBlur('fullName')}
                        value={values.fullName}
                      />


                      <Text style={styles.inputHeading}>Username</Text>
                      {touched.username && errors.username && <Text style={styles.error}>{errors.username}</Text>}

                      <TextInput
                        placeholder="Username"
                        placeholderTextColor="gray"
                        style={styles.input}
                        onChangeText={handleChange('username')}
                        onBlur={handleBlur('username')}
                        value={values.username}
                      />

                      <TouchableOpacity onPress={() => setStep(2)} style={styles.button}><Text style={styles.buttonText}>Next</Text></TouchableOpacity>
                    </>
                  )}

                  {step === 2 && (
                
                    <>
                    {console.log("setp2")}
                      <Text style={styles.inputHeading}>Email</Text>
                      {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

                      <TextInput
                        placeholder="Enter your Email"
                        placeholderTextColor="gray"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                      />


                      <Text style={styles.inputHeading}>Contact Number</Text>
                      {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

                      <TextInput
                        placeholder="Phone Number"
                        placeholderTextColor="gray"
                        style={styles.input}
                        keyboardType="numeric"
                        onChangeText={handleChange('phone')}
                        onBlur={handleBlur('phone')}
                        value={values.phone}
                      />

                      <TouchableOpacity onPress={() => setStep(3)} style={styles.button}><Text style={styles.buttonText}>Next</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => setStep(step - 1)} style={[styles.button, { backgroundColor: '#ccc' }]}>
                        <Text style={[styles.buttonText, { color: '#000' }]}>Back</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <Text style={styles.inputHeading}>Password</Text>
                      {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

                      <TextInput
                        placeholder="Password"
                        placeholderTextColor="gray"
                        style={styles.input}
                        secureTextEntry
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                      />

                      <Text style={styles.inputHeading}>Confirm Password</Text>
                      {touched.confirmPassword && errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword}</Text>}

                      <TextInput
                        placeholder="Confirm Password"
                        placeholderTextColor="gray"
                        style={styles.input}
                        secureTextEntry
                        onChangeText={handleChange('confirmPassword')}
                        onBlur={handleBlur('confirmPassword')}
                        value={values.confirmPassword}
                      />

                      <TouchableOpacity
                        onPress={async () => {
                          handleBlur('email');
                          if (!values.email || errors.email) return;
                          handleSendOtp(values.email);
                        }}
                        style={styles.button}
                        disabled={isSendingOtp}
                      >
                        <Text style={styles.buttonText}>
                          {isSendingOtp ? 'Sending...' : 'Next'}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setStep(step - 1)} style={[styles.button, { backgroundColor: '#ccc' }]}>
                        <Text style={[styles.buttonText, { color: '#000' }]}>Back</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {step === 4 && (
                    <>
                      <TextInput
                        placeholder="OTP"
                        placeholderTextColor="gray"
                        style={styles.input}
                        keyboardType="numeric"
                        onChangeText={handleChange('otp')}
                        onBlur={handleBlur('otp')}
                        value={values.otp}
                      />
                      {touched.otp && errors.otp && <Text style={styles.error}>{errors.otp}</Text>}

                      <TouchableOpacity onPress={() => setStep(5)} style={styles.button}>
                        <Text style={styles.buttonText}>Next</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setStep(step - 1)} style={[styles.button, { backgroundColor: '#ccc' }]}>
                        <Text style={[styles.buttonText, { color: '#000' }]}>Back</Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {step === 5 && (
                    <>
                      <TouchableOpacity onPress={() => handlePickImage(setFieldValue)} style={styles.avatarContainer}>
                        {values.profileImgUrl ? (
                          <Image source={{ uri: values.profileImgUrl }} style={styles.avatar} />
                        ) : (
                          <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>Add Photo</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                      <Text style={styles.avatarNote}>Tap to add a profile picture (optional)</Text>

                      <TouchableOpacity onPress={() => handleSubmit()} style={styles.button}>
                        <Text style={styles.buttonText}>Submit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => setStep(4)} style={[styles.button, { backgroundColor: '#ccc' }]}>
                        <Text style={[styles.buttonText, { color: '#000' }]}>Back</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              )}
            </Formik>


          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.push('/(auth)')}>
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginLink}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: 
  { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  keyboardAvoidingContainer: 
  { 
    flex: 1 
  },
  scrollViewContent: 
  { 
    flexGrow: 1, 
    justifyContent: 'center', 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  },

  topPaw: 
  { 
    position: 'absolute', 
    top: 20, 
    left: 1 
  },
  bottomPaw: 
  { 
    position: 'absolute', 
    bottom: 0, 
    left: 0 
  },
  centerPaw: 
  { 
    position: 'absolute', 
    bottom: 180,
    right: 0, 
    zIndex: -1 
  },

  headers: 
  { 
    justifyContent: 'center', 
    textAlign: 'center' 
  },
  title: 
  { 
    fontSize: 32, 
    fontFamily: 'Poppins-Regular', 
    marginVertical: 20, 
    textAlign: 'center', 
    color: '#4D55CC' 
  },
  subtitle: 
  { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 40 
  },

  formContainer: 
  { 
    marginBottom: 20 
  },
  inputHeading: 
  { 
    paddingBottom: 5 
  },
  input: {
    height: 50, borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8,
    paddingHorizontal: 15, 
    marginBottom: 25, 
    fontSize: 16,
  },

  button: {
    backgroundColor: '#4D55CC', 
    height: 50, 
    borderRadius: 8,
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  buttonText: 
  { 
    fontFamily:'Poppins-Regular',
    color: '#fff',
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  error: 
  { 
    color: 'red', 
    fontSize: 10
  },

  footer: 
  { 
    alignItems: 'center', 
    paddingBottom: 20 
  },
  loginText: 
  {
    fontFamily:'Poppins-Regular',
    fontSize: 14, 
    color: '#666'
  },
  loginLink: 
  { 
    color: '#4D55CC', 
    fontWeight: 'bold' 
  },

  avatarContainer: 
  { 
    alignItems: 'center', 
    marginBottom: 20 
  },
  avatar: 
  { 
    width: 100,
    height: 100,
    borderRadius: 50
  },
  avatarPlaceholder: {
    width: 100, 
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  avatarText: 
  { 
    color: '#666', 
    fontSize: 16 
  },
  avatarNote: 
  { 
    textAlign: 'center', 
    color: '#666', 
    marginBottom: 20 
  },
});
