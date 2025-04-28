import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ProfileDetailsProps {
  name?: string;
  role?: string;
  avatarUrl?: string;
  age?:string;
}

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good Morning,';
  if (hour < 18) return 'Good Afternoon,';
  return 'Good Night,';
};

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ name = 'User', role = 'Owner', avatarUrl }) => {
  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Image
          style={styles.avatar}
          source={{
            uri: avatarUrl || 'https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg',
          }}
        />
        <View>
          <Text style={styles.ownerLabel}>{getGreeting()}</Text>
          <Text style={styles.ownerText}>{name}</Text>
        </View>
      </View>

      <MaterialCommunityIcons name="bell-outline" size={24} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderColor:'#d9d9d9',
    borderWidth:0.5,
    marginRight: 10,
  },
  ownerText: {
    fontFamily:'Poppins-Medium',
    fontSize: 16,
    fontWeight: '500',
  },
  ownerLabel:{
    fontFamily:'Poppins-Medium',
    fontSize: 12,
    fontWeight: '500',
    color:'rgb(84, 84, 84)'
  },
});

export default ProfileDetails;
