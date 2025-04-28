
import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator,StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { storeToken } from '../utils/auth';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);  // <- NEW State

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await SecureStore.getItemAsync('authToken');
                console.log('Logged Token: ', token);

                if (token) {
                    const profileRes = await fetch('https://canine-dog.vercel.app/api/auth/profile', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    const profileData = await profileRes.json();

                    if (profileRes.ok) {
                        if (profileData.userProfile.isAnimal === true) {
                            router.replace({
                                pathname: '/main/home',
                                params: {
                                    userProfile: JSON.stringify(profileData.userProfile),
                                },
                            });
                        } else {
                            router.replace('/petSignup/PetData');
                        }
                        return;  // Don't continue, already redirected
                    } else {
                        console.log('Invalid token, staying on login.');
                    }
                } else {
                    console.log('No token, staying on login.');
                }
            } catch (error) {
                console.log('Error verifying token:', error);
            } finally {
                setIsCheckingAuth(false);  // <- Done checking
            }
        };

        checkAuth();
    }, []);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };


    const handleLogin = async () => {
        if (!email || !password) {
            setApiError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setApiError('');

        try {
            const response = await fetch('https://canine-dog.vercel.app/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            await storeToken(data.accessToken);
            await SecureStore.setItemAsync('authToken', data.accessToken);

            const animalRes = await fetch('https://canine-dog.vercel.app/api/auth/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.accessToken}`,
                },
            });

            const animalData = await animalRes.json();

            if (!animalRes.ok) {
                throw new Error(animalData.message || 'Animal status check failed');
            }

            if (animalData.userProfile.isAnimal === true) {
                router.replace({
                    pathname: '/main/home',
                    params: {
                        userProfile: JSON.stringify(animalData.userProfile),
                    },
                });
            } else {
                router.replace('/petSignup/PetData');
            }
        } catch (error: any) {
            setApiError(error.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // 👇 If still checking token, show a simple loader
    if (isCheckingAuth) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4D55CC" />
            </SafeAreaView>
        );
    }

    


    return (
        <SafeAreaView style={styles.container}>
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
      
        <KeyboardAvoidingView
            style={styles.keyboardAvoid}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.subContainer}>
                <Text style={styles.title}>Log In</Text>
                <Text style={styles.subtitle}>AI-powered tracking to ensure your dog stays happy, healthy, and safe</Text>

                <View style={styles.inputContainer}>
                    {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

                    <Text style={styles.inputHeading}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#666"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />

                    <Text style={styles.inputHeading}>Password</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#666"
                            secureTextEntry={!isPasswordVisible}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity
                            style={styles.toggleButton}
                            onPress={togglePasswordVisibility}
                        >
                            <Ionicons
                                name={isPasswordVisible ? "eye-off" : "eye"}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.passwordHint}>must be 8 characters</Text>
                </View>

                <TouchableOpacity style={styles.googleButton}>
                    <Ionicons name="logo-google" size={20} color="black" />
                    <Text style={styles.googleButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.loginButton, isLoading && styles.disabledButton]} 
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    <Text style={styles.loginButtonText}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                        <Text style={styles.signupLink}>Create one</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
    )
};
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    topPaw: {
        zIndex: 1,
        position: 'absolute',
        top: 1,
        left: 1,
    },
    bottomPaw: {
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    centerPaw: {
        position: 'absolute',
        bottom: 180,
        right: 0,
        zIndex: -1,
    },
    subContainer:
    {
        margin: 20,

    },
    keyboardAvoid: {
        flex: 1,

    },
    title: {
        color: '#4D55CC',
        fontFamily: 'Poppins-Regular',
        fontSize: 32,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        marginBottom: 30,
    },

    passwordInputContainer: {
        zIndex:1,
        position: 'relative',
    },
    toggleButton: {
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 1,
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
        paddingRight: 40,
    },
    inputHeading: {
        fontFamily: 'Poppins-SemiBold',
        paddingBottom: 5,


    },
    passwordHint: {
        fontFamily: 'Poppins-Regular',
        color: '#666',
        fontSize: 12,
        marginLeft: 5,
        marginTop: -10,
        marginBottom: 15,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 20,
        gap: 10,
    },
    googleButtonText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 16,
        fontWeight: '500',
    },
    loginButton: {
        fontFamily: 'Poppins-Regular',
        backgroundColor: '#4D55CC',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    loginButtonText: {
        fontFamily: 'Poppins-Regular',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
    },
    signupText: {
        fontFamily: 'Poppins-Regular',
        color: '#666',
    },
    signupLink: {
        fontFamily: 'Poppins-Regular',

        color: 'blue',
        fontWeight: '500',
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