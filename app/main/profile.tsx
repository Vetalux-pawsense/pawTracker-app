import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const ProfileScreen = () => {
  const router = useRouter();
  const { userProfile } = useLocalSearchParams();
  const parsedProfile = typeof userProfile === 'string' ? JSON.parse(userProfile) : null;
  console.log(userProfile);

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      router.replace('/(auth)'); // Replace with your login page route
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  const options = [
    {
      id: '1',
      label: 'Profile',
      icon: <Ionicons name="person-circle-outline" size={24} color="#6B6AED" />,
      route: '/profilePages/userprofile' as const,
    },
    {
      id: '2',
      label: "Edit Dog's Information",
      icon: <Feather name="edit" size={24} color="#6BCB77" />,
      route: '/profilePages/editdog' as const,
    },
    {
      id: '3',
      label: 'About Us',
      icon: <Ionicons name="help-circle-outline" size={24} color="#F7C948" />,
      route: '/profilePages/about' as const,
    },
     {
      id: '4',
      label: 'Raise a concern',
      icon: <Ionicons name="help-circle-outline" size={24} color="#F7C948" />,
      route: '/profilePages/complaints' as const,
    },
    {
      id: '5',
      label: 'Settings',
      icon: <Feather name="settings" size={24} color="#A0D995" />,
      route: '/profilePages/settings' as const,
    },
    {
      id: '6',
      label: 'Logout',
      icon: <Feather name="log-out" size={24} color="#FF6B6B" />,
      action: 'logout',
    },
  ];
  

  const renderOption = ({ item }: { item: typeof options[number] }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => {
        if (item.action === 'logout') {
          console.log('Logging out...');
          handleLogout();
   
        } else if (item.route) {
          router.push({
            pathname: item.route,
            params: {
              userProfile: JSON.stringify(parsedProfile),
            },
          });
        }
      }}
    >
      <View style={styles.iconContainer}>{item.icon}</View>
      <Text style={styles.optionText}>{item.label}</Text>
      <Feather name="chevron-right" size={20} color="#aaa" style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
  );
  
  

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <View style={styles.backgroundCircle} />
        <Image
          source={{
            uri: parsedProfile.profileImgUrl as string,
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {parsedProfile.firstName} {parsedProfile.lastName}

        </Text>
        <Text style={styles.userId}>{parsedProfile.username}</Text>
      </View>

      <FlatList
        data={options}
        keyExtractor={(item) => item.id}
        renderItem={renderOption}
        contentContainerStyle={styles.optionsList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFDFD',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: '#F6F6FF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'relative',
  },
  backgroundCircle: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#DCD6FF',
    opacity: 0.4,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 10,
  },
  name: {
    fontFamily: 'Poppins-Medium',
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  userId: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#888',
  },
  optionsList: {
    marginTop: 30,
    paddingHorizontal: 25,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    marginRight: 15,
  },
  optionText: {
    fontFamily: 'Poppins-Medium',

    fontSize: 16,
    color: '#333',
  },
});

export default ProfileScreen;
