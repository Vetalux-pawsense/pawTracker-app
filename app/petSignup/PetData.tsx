import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

interface FormData {
    petType?: 'DOG' | 'CAT';
    petBreed?: string;
    petName?: string;
    age?: string;
    weight?: string;
    gender?: string;
    imageUri?: string;
    dob?: string;
    [key: string]: any;
}
const PetData = () => {

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({});
    const [breeds, setBreeds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const steps = [
        { title: 'Select Pet Type', step: 1 },
        { title: 'Pet Information', step: 2 },
        { title: 'Pet Details', step: 3 },
    ];
    const genderData = [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' }
    ];

    useEffect(() => {
        if (currentStep === 2 && formData.petType === 'DOG') {
            fetch('https://api.thedogapi.com/v1/breeds')
                .then(response => response.json())
                .then(data => setBreeds(data.map((breed: any) => breed.name)))
                .catch(console.error);
        }
    }, [currentStep]);

    const calculateAge = (year: string, month: string, day: string) => {
        const birthDate = new Date(Number(year), Number(month) - 1, Number(day));
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    };

    useEffect(() => {
        if (formData.year && formData.month && formData.day) {
            const age = calculateAge(formData.year, formData.month, formData.day);
            setFormData(prev => ({ ...prev, age: age.toString() }));
        }
    }, [formData.year, formData.month, formData.day]);


    const handleImagePick = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
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

                setFormData({ ...formData, imageUri: uri });
            }
        } catch (error) {
            console.error('Image picker error:', error);
            alert('Error selecting image');
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <View style={styles.stepContainer}>
                        <MaterialCommunityIcons
                            name="paw"
                            size={80}
                            color="rgba(33,28,132,0.1)"
                            style={[styles.bottomPaw, { transform: [{ rotate: '40deg' }] }]}
                        />
                        <View style={styles.imageContainer}>
                            <Image
                                source={{
                                    uri: formData.petType === 'CAT'
                                        ? 'https://images.unsplash.com/photo-1611267254323-4db7b39c732c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGN1dGUlMjBjYXR8ZW58MHx8MHx8fDA%3D'
                                        : 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMDAzMzh8MHwxfHNlYXJjaHw1NXx8ZXhjaXRlZHxlbnwwfHx8fDE2OTYyNDAyODR8MA&ixlib=rb-4.0.3&q=80&w=1080'
                                }} style={styles.petImage}
                                resizeMode="cover"
                            />
                        </View>

                        <Text style={styles.selectionTitle}>Select the pet of your choice from below</Text>

                        <View style={styles.petTypeContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.petTypeButton,
                                    formData.petType === 'DOG' && styles.selectedPetType
                                ]}
                                onPress={() => setFormData({ ...formData, petType: 'DOG' })}>
                                <Text style={[
                                    styles.petTypeText,
                                    formData.petType === 'DOG' && styles.selectedPetTypeText
                                ]}>
                                    DOG
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.petTypeButton,
                                    formData.petType === 'CAT' && styles.selectedPetType
                                ]}
                                onPress={() => setFormData({ ...formData, petType: 'CAT' })}>
                                <Text style={[
                                    styles.petTypeText,
                                    formData.petType === 'CAT' && styles.selectedPetTypeText
                                ]}>
                                    CAT
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );

            case 2:
                return (
                    <View style={styles.stepContainer}>

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
                        <Image
                            source={{
                                uri: formData.petType === 'CAT'
                                    ? 'https://images.unsplash.com/photo-1611267254323-4db7b39c732c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGN1dGUlMjBjYXR8ZW58MHx8MHx8fDA%3D'
                                    : 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMDAzMzh8MHwxfHNlYXJjaHw1NXx8ZXhjaXRlZHxlbnwwfHx8fDE2OTYyNDAyODR8MA&ixlib=rb-4.0.3&q=80&w=1080'
                            }}
                            style={styles.backgroundImage}
                            resizeMode="cover"
                        />

                        <View style={styles.imageOverlay} />

                        <ScrollView contentContainerStyle={styles.step2Content}>
                            <View style={styles.dogProfile}>
                                <TouchableOpacity onPress={handleImagePick} style={styles.imageUploadContainer}>
                                    {formData.imageUri ? (
                                        <Image source={{ uri: formData.imageUri }} style={styles.petProfileImage} />
                                    ) : (
                                        <View style={styles.imagePlaceholder}>
                                            <Text style={styles.uploadText}>Tap to upload pet photo</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>

                                <TextInput
                                    style={styles.input}
                                    placeholder={`Enter ${formData.petType === 'DOG' ? 'Dog' : 'Cat'} Breed`}
                                    placeholderTextColor="#888"
                                    value={formData.petBreed}
                                    onChangeText={text => setFormData({ ...formData, petBreed: text })}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Your Pet's Name"
                                    placeholderTextColor="#888"
                                    value={formData.petName}
                                    onChangeText={text => setFormData({ ...formData, petName: text })}
                                />
                            </View>
                        </ScrollView>
                    </View>
                );


            case 3:
                return (
                    <View style={styles.stepContainer}>
                        <Image
                            source={{
                                uri: formData.petType === 'CAT'
                                    ? 'https://images.unsplash.com/photo-1611267254323-4db7b39c732c?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGN1dGUlMjBjYXR8ZW58MHx8MHx8fDA%3D'
                                    : 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzMDAzMzh8MHwxfHNlYXJjaHw1NXx8ZXhjaXRlZHxlbnwwfHx8fDE2OTYyNDAyODR8MA&ixlib=rb-4.0.3&q=80&w=1080'
                            }}
                            style={styles.topImage3}
                            resizeMode="cover"
                        />

                        <ScrollView
                            contentContainerStyle={styles.step3Content}
                            style={styles.scrollWrapper}
                        ><View style={styles.inputsContainer}>
                                <View style={styles.genderContainer}>
                                    <Text style={styles.heading}>Gender and Weight</Text>

                                    <View style={styles.rowContainer}>
                                        <View style={styles.dropdownWrapper}>
                                            <Dropdown
                                                style={styles.dropdown}
                                                placeholderStyle={styles.placeholderStyle}
                                                selectedTextStyle={styles.selectedTextStyle}
                                                data={genderData}
                                                maxHeight={200}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Select Gender"
                                                value={formData.gender}
                                                onChange={item => setFormData({ ...formData, gender: item.value })}
                                                itemTextStyle={styles.itemTextStyle}
                                                itemContainerStyle={styles.itemContainer}
                                                containerStyle={styles.dropdownContainer}
                                            />
                                        </View>

                                        <View style={styles.inputWrapper}>
                                            <TextInput
                                                style={styles.weightinput}
                                                placeholder="Weight (kg)"
                                                value={formData.weight}
                                                onChangeText={text => setFormData({ ...formData, weight: text })}
                                                placeholderTextColor="#888"
                                                keyboardType="numeric"
                                            />
                                        </View>
                                    </View>
                                </View>
                                <Text style={styles.heading}>Enter Birth Date</Text>

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TextInput
                                        style={[styles.input, { flex: 1, marginRight: 5 }]}
                                        placeholder="Year"
                                        value={formData.year}
                                        onChangeText={text => setFormData({ ...formData, year: text })}
                                        placeholderTextColor="#888"
                                        keyboardType="numeric"
                                    />
                                    <TextInput
                                        style={[styles.input, { flex: 1, marginHorizontal: 5 }]}
                                        placeholder="Month"
                                        value={formData.month}
                                        onChangeText={text => setFormData({ ...formData, month: text })}
                                        placeholderTextColor="#888"
                                        keyboardType="numeric"
                                    />
                                    <TextInput
                                        style={[styles.input, { flex: 1, marginLeft: 5 }]}
                                        placeholder="Day"
                                        value={formData.day}
                                        onChangeText={text => setFormData({ ...formData, day: text })}
                                        placeholderTextColor="#888"
                                        keyboardType="numeric"
                                    />
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Age (years)"
                                    value={formData.age}
                                    editable={false}
                                    placeholderTextColor="#888"
                                    keyboardType="numeric"
                                />


                            </View>



                        </ScrollView>
                    </View>
                );



            default:
                return null;
        }
    };

    const handleNext = async () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        } else {
            try {
                const requiredFields = [
                    'age',
                    'petType',
                    'petBreed',
                    'weight',
                    'gender',
                    'imageUri',
                    'petName'
                ];
    
                const missingFields = requiredFields.filter(field => !formData[field]);
                if (missingFields.length > 0) {
                    alert(`Missing required fields: ${missingFields.join(', ')}`);
                    return;
                }
    
                setIsSubmitting(true);
                const token = await SecureStore.getItemAsync('authToken');
    
                if (!token) {
                    throw new Error('No authentication token found');
                }
    
                const formDataToSend = new FormData();
                if (formData.year && formData.month && formData.day) {
                    const dob = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`;
                    const age = calculateAge(formData.year, formData.month, formData.day);
                    setFormData(prev => ({ ...prev, age: age.toString() }));
    
                    formDataToSend.append('dob', dob);
                    formDataToSend.append('age', age.toString());
                } else {
                    formDataToSend.append('dob', '');
                    formDataToSend.append('age', '');
                }
    
                formDataToSend.append('type', formData.petType || '');
                formDataToSend.append('breed', formData.petBreed || '');
                formDataToSend.append('name', formData.petName || '');
                formDataToSend.append('weight', formData.weight || '');
                formDataToSend.append('gender', formData.gender || '');
    
                if (formData.imageUri) {
                    const filename = formData.imageUri.split('/').pop();
                    const match = /\.(\w+)$/.exec(filename || '');
                    const type = match ? `image/${match[1] === 'jpg' ? 'jpeg' : match[1]}` : 'image/jpeg';
    
                    formDataToSend.append('image', {
                        uri: formData.imageUri,
                        name: filename || 'pet.jpg',
                        type: type,
                    } as any);
                }
    
                const numericFields = ['age', 'weight'];
                for (const field of numericFields) {
                    if (isNaN(Number(formData[field]))) {
                        throw new Error(`${field} must be a valid number`);
                    }
                }
    
                const response = await fetch('https://canine-dog.vercel.app/api/animal', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                    },
                    body: formDataToSend
                });
    
                const responseText = await response.text();
                if (!response.ok) {
                    throw new Error(responseText || 'Submission failed');
                }
    
                const data = responseText ? JSON.parse(responseText) : {};
                console.log('Submission successful:', data);
                alert('Pet data saved successfully!');
    
                // ✅ Move to next page AFTER successful submission
                router.push('/main/scan');
    
            } catch (error: any) {
                console.error('Submission failed:', error);
    
                const allKeys = await AsyncStorage.getAllKeys();
                console.log('All storage keys:', allKeys);
    
                const storedToken = await AsyncStorage.getItem('authToken');
                console.log('Stored token:', storedToken);
    
                alert(`Error: ${error.message}`);
            } finally {
                setIsSubmitting(false);
            }
        }
    };
    

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >

            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >


                {renderStepContent()}

                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNext}
                    disabled={isSubmitting}
                >
                    <Text style={styles.nextButtonText}>
                        {currentStep === 3 ?
                            (isSubmitting ? 'Submitting...' : 'Complete') :
                            'Next'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    heading: {
        fontFamily: 'Poppins-Medium',
        marginVertical: 10,
    },

    stepContainer: {
        flex: 1,
    },
    step2Content: {

        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
        bottom: 150,
        right: 0,
        zIndex: 1,
    },
    dogProfile: {

        width: '90%',
        maxWidth: 400,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: 15,
        padding: 25,
        alignItems: 'center',
        marginTop: 140,
    },
    imageUploadContainer: {
        marginTop: -95,
        marginBottom: 20,
    },
    petProfileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: '#fff',
    },
    imagePlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#DDD',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    input: {
        fontFamily: 'Poppins-Medium',
        width: '100%',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#DDD',
        marginBottom: 15,
    },
    weightinput: {
        fontFamily: 'Poppins-Medium',
        width: '100%',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        fontSize: 14,
        borderWidth: 1,
        borderColor: '#DDD',
    },

    searchContainer: {
        width: '100%',
        marginBottom: 15,
        zIndex: 2,
    },
    breedList: {
        maxHeight: 200,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 8,
        marginTop: 5,
        position: 'absolute',
        top: 50,
        width: '100%',
        elevation: 3,
    },
    breedItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    selectedBreed: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginVertical: 15,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 10,
        borderRadius: 8,
        width: '100%',
        zIndex: 1,
    },


    searchInput: {
        backgroundColor: 'rgb(255, 255, 255)',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        zIndex: 2,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 0,
    },

    header: {
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    stepIndicator: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },

    imageContainer: {
        height: '80%',
        width: '100%',
        overflow: 'hidden',
        marginHorizontal: 0,
    },
    petImage: {
        width: '100%',
        height: '100%',
    },
    selectionTitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        marginVertical: 20,
    },
    petTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 10,
    },
    petTypeButton: {
        width: 150,
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#F0F0F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedPetType: {
        backgroundColor: '#4A90E2',
    },
    petTypeText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
    },
    selectedPetTypeText: {
        color: 'white',
    },

    uploadText: {
        color: '#666',
        textAlign: 'center',
    },

    backgroundImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '60%',
    },
    imageOverlay: {

    },

    breedText: {
        fontSize: 16,
        color: '#333',
    },
    nextButton: {
        backgroundColor: '#5551FF',
        padding: 15,
        borderRadius: 50,
        marginBottom: 30,
        textAlign: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        width: '60%',
    },

    nextButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },


    topImage: {
        width: '100%',
        height: '40%',
    },
    topImage3: {
        width: '100%',
        height: '50%',
        position: 'absolute',
        top: 0,
        zIndex: 0,
    },
    scrollWrapper: {
        marginTop: '100%',
        flex: 1,
    },
    step3Content: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 0,
    },
    inputsContainer: {
        borderRadius: 15,

        marginTop: 20,
    },

    genderContainer: {
        marginBottom: 20,
    },

    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
    },

    dropdownWrapper: {
        flex: 1,
    },

    inputWrapper: {
        flex: 1,
    },

    dropdown: {
        height: 50,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        paddingHorizontal: 10,
    },



    placeholderStyle: {
        fontFamily: 'Poppins-Medium',

        fontSize: 16,
        color: '#888',
    },
    selectedTextStyle: {
        fontSize: 16,
        fontFamily: 'Poppins-Medium',

        color: '#333',
    },
    dropdownContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DDD',
        marginTop: 5,
    },
    itemTextStyle: {
        color: '#333',
        fontSize: 16,
        fontFamily: 'Poppins-Medium',

    },
    itemContainer: {
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
});

export default PetData;             