import React, { useState, useEffect, useMemo } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, Modal, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';

interface Complaint {
  name: string;
  email: string;
  phone: string;
  complaintType: string;
  date: Date;
  description: string;
  attachments: ImagePicker.ImagePickerAsset[];
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  complaintType?: string;
  description?: string;
}

const complaintOptions = [
  'App Bug / Crash',
  'Wrong Pet Emotion Prediction',
  'Slow Response Time',
  'Image Upload Issue',
  'Login / Account Issue',
  'Suggestions for Improvement',
  'Other',
];

const Complaints: React.FC = () => {
  const { userProfile } = useLocalSearchParams();
  const parsedProfile = useMemo(() => {
    return typeof userProfile === 'string' ? JSON.parse(userProfile) : null;
  }, [userProfile]);

  const [formData, setFormData] = useState<Complaint>({
    name: '',
    email: '',
    phone: '',
    complaintType: '',
    date: new Date(),
    description: '',
    attachments: [],
  });

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (parsedProfile) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || `${parsedProfile.firstName} ${parsedProfile.lastName}`,
        email: prev.email || parsedProfile.email,
        phone: prev.phone || parsedProfile.phoneNumber,
      }));
    }
  }, [parsedProfile]);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.complaintType) newErrors.complaintType = 'Please select a complaint type';
    if (!formData.description) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log('Form submitted:', formData);
      // Submit logic here
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...result.assets],
      }));
    }
  };

  const handleComplaintSelect = (type: string) => {
    setFormData((prev) => ({ ...prev, complaintType: type }));
    setShowDropdown(false);
  };

  return (
<SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
   <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{  flex: 1,
                backgroundColor: 'white',}}
        >

            <ScrollView
                contentContainerStyle={{  flexGrow: 1,
                   padding:20,}}
                showsVerticalScrollIndicator={false}
            >

        <Text style={styles.header}>File a Complaint</Text>

        {/* Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}
        </View>

        {/* Email & Phone */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          </View>

          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="+1 234 567 890"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
            {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
          </View>
        </View>

        {/* Complaint Type & Date */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Complaint Type</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDropdown(true)}>
              <Text style={formData.complaintType ? {} : { color: '#999' }}>
                {formData.complaintType || 'Select Type'}
              </Text>
              <Feather name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {errors.complaintType && <Text style={styles.error}>{errors.complaintType}</Text>}
          </View>

          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>Incident Date</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text>{formData.date.toLocaleDateString()}</Text>
              <Feather name="calendar" size={20} color="#666" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.date}
                mode="date"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setFormData({ ...formData, date });
                }}
              />
            )}
          </View>
        </View>

        {/* Dropdown Modal */}
        <Modal visible={showDropdown} transparent animationType="slide">
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowDropdown(false)}>
            <View style={styles.modalContent}>
              <FlatList
                data={complaintOptions}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => handleComplaintSelect(item)} style={styles.modalItem}>
                    <Text style={styles.modalItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
            placeholder="Describe your complaint in detail..."
            multiline
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
          />
          {errors.description && <Text style={styles.error}>{errors.description}</Text>}
        </View>

        {/* Attachments */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Attachments (Optional)</Text>
          <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
            <MaterialIcons name="attach-file" size={24} color="#6C63FF" />
            <Text style={styles.attachText}>Add Files</Text>
          </TouchableOpacity>

          <ScrollView horizontal style={styles.attachmentPreview}>
            {formData.attachments.map((asset, index) => (
              <Image
                key={index}
                source={{ uri: asset.uri }}
                style={styles.previewImage}
              />
            ))}
          </ScrollView>
        </View>

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Complaint</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
  header: { fontFamily:'Poppins-Medium', fontSize: 28, color: '#2D2D2D', marginBottom: 30, fontWeight: '600' },
  inputContainer: { marginBottom: 20,fontFamily:'Poppins-Regular',  },
  label: {fontFamily:'Poppins-SemiBold',  fontSize: 14, color: '#4A4A4A', marginBottom: 8, fontWeight: '500' },
  input: { flexDirection: 'row', alignItems: 'center', fontFamily:'Poppins-Regular', justifyContent: 'space-between', backgroundColor: '#F7F7F7', borderRadius: 10, paddingHorizontal: 15, paddingVertical: 12, fontSize: 14 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  error: {fontFamily:'Poppins-Regular',  color: '#FF4444', fontSize: 12, marginTop: 5 },
  attachButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F7F7F7', borderRadius: 10, padding: 15, marginTop: 5 },
  attachText: {fontFamily:'Poppins-Regular',  color: '#6C63FF', marginLeft: 10, fontWeight: '600' },
  attachmentPreview: { marginTop: 10 },
  previewImage: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  submitButton: { backgroundColor: '#6C63FF', paddingVertical: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  submitText: {fontFamily:'Poppins-Regular',  color: '#FFF', fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 10, padding: 20, maxHeight: '70%' },
  modalItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalItemText: { fontFamily:'Poppins-Regular', fontSize: 16, color: '#333' },
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
    fontFamily:'Poppins-Regular', 
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Complaints;
