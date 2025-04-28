import { View, Text, StyleSheet, BackHandler, Image, SafeAreaView, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProfileDetails from '../component/profileDetails';
import Moodcard from '../component/Moodcard';
import PetCard from '../component/PetCard';
import HeartRateGraph from '../component/HeartRateGraph';
import MoodGraph from '../component/MoodGraph';
import BodyTemperature from '../component/BodyTemperature';
import { router, useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

const Home = () => {
  const { userProfile } = useLocalSearchParams();
  const parsedProfile = typeof userProfile === 'string' ? JSON.parse(userProfile) : null;
  const animal = parsedProfile.animalData[0];
  console.log(animal);
  const petName = 'Buddy 🐶';
  const selectedDate = 'April 5, 2025';
  const selectedMood = 'Relax';
  const dataPoints = [4, 5, 6, 5, 3, 6, 4];
  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (

    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/main/profile',
              params: {
                userProfile: JSON.stringify(parsedProfile)  
              },
            })
          }
        >
          <ProfileDetails
            name={parsedProfile?.username || 'Prasad Pansare'}
            role={parsedProfile?.role || 'User'}
            avatarUrl={parsedProfile?.profileImgUrl || ''}
          />
        </TouchableOpacity>


        <Moodcard
          mood="The Cat is in playful mood. You have been consistently keeping its mood happy! Cheers!"
        />
        <PetCard pet={animal} />

        <HeartRateGraph />
        <BodyTemperature
          day="Thursday"
          date="20 Mar 2025"
          temperature={24}
          range="27°C - 10°C"
        />

        <MoodGraph
          petName={petName}
          selectedDate={selectedDate}
          selectedMood={selectedMood}
          dataPoints={dataPoints}
          weekLabels={weekLabels}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scroller: {
    gap: 20,
  },
  safeArea: {
    gap: 10,
    flex: 1,
    backgroundColor: '#FAFAFA', 
  },
  scrollContent: {
    padding: 30,
    paddingBottom: 50,
  },
});

export default Home;