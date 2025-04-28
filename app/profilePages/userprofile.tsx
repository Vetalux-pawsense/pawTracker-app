import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const UserProfile = () => {
  const router = useRouter();
  const { userProfile } = useLocalSearchParams();
  const parsedProfile = typeof userProfile === 'string' ? JSON.parse(userProfile) : null;
  console.log(userProfile);
  const [firstName, setFirstName] = useState(parsedProfile?.firstName || '');
  const [lastName, setLastName] = useState(parsedProfile?.lastName || '');
  const [updatedPhone, setUpdatedPhone] = useState(parsedProfile?.phone || '');
  const [updatedEmail] = useState(parsedProfile?.email || '');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  console.log("Image URL:", parsedProfile?.profileImgUrl);

  const handleSave = () => {
    Alert.alert('Profile Updated', 'Your changes have been saved successfully.');
    router.back();
  };

  const handleImageChange = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Please grant camera roll permissions.");
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled && result.assets.length > 0) {
      let selectedAsset = result.assets[0];
  
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        selectedAsset.uri,
        [],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
  
      setProfileImage(manipulatedImage.uri); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
  >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Edit Profile</Text>

        <TouchableOpacity style={styles.imageContainer} onPress={handleImageChange}>
        <Image
  source={
    profileImage
      ? { uri: profileImage }
      : parsedProfile?.profileImgUrl
      ? { uri: parsedProfile.profileImgUrl }
      : { uri: 'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg' }
  }
  style={styles.avatar}
  resizeMode="cover"
/>


          <View style={styles.cameraIcon}>
            <FontAwesome name="camera" size={18} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          placeholder="Enter your first name"
          onChangeText={setFirstName}
          placeholderTextColor="grey"
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          placeholder="Enter your last name"
          onChangeText={setLastName}
          placeholderTextColor="grey"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={updatedPhone}
          onChangeText={setUpdatedPhone}
          placeholder="Enter your phone"
          keyboardType="phone-pad"
          placeholderTextColor="grey"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, { backgroundColor: '#F0F0F0' }]}
          value={updatedEmail}
          editable={false}
          placeholder="Your email"
          placeholderTextColor="grey"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Feather name="save" size={20} color="white" />
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scroll: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontFamily:'Poppins-Regular',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  label: {
    fontFamily:'Poppins-Regular',
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  input: {
    fontFamily:'Poppins-Regular',
    width: '100%',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  imageContainer: {
    marginVertical: 20,
    position: 'relative',
  },
  avatar: {
    width: screenWidth * 0.35,
    height: screenWidth * 0.35,
    borderRadius: screenWidth * 0.175,
    backgroundColor: '#e0e0e0',
  },
  cameraIcon: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: '#6B6AED',
    borderRadius: 20,
    padding: 6,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    backgroundColor: '#6B6AED',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    width: '100%',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '600',
  },  
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#c6c1c1',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    width: '100%',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
