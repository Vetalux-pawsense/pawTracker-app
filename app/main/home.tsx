import { RefreshControl, View, Text, StyleSheet, BackHandler, Image, SafeAreaView, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProfileDetails from '../component/profileDetails';
import Moodcard from '../component/Moodcard';
import PetCard from '../component/PetCard';
import HeartRateGraph from '../component/HeartRateGraph';
import MoodGraph from '../component/MoodGraph';
import BodyTemperature from '../component/BodyTemperature';
import { useLocalSearchParams } from 'expo-router';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const Home = () => {
  const [weeklyStats, setWeeklyStats] = useState({
    minData: [] as number[],
    maxData: [] as number[],
    days: [] as string[],
    dateRange: '',
    minHR: 300,
    maxHR: 0
  });
  const [moodStats, setMoodStats] = useState({
    emotionData: [] as Array<{ date: string; emotionBreakdown: Record<string, number> }>,
    latestMood: 'Relax',
    dateRange: ''
  });

  const [timestamp, setTimestamp] = useState(null);

  const { userProfile } = useLocalSearchParams();
  const parsedProfile = typeof userProfile === 'string' ? JSON.parse(userProfile) : null;
  const animal = parsedProfile.animalData[0];
  const [temperature, setTemperature] = React.useState(null);
  const [minimumHeartRate, setminimumHeartRate] = React.useState(null);
  const [maximumHeartRate, setmaximumHeartRate] = React.useState(null);

  const petName = 'Buddy 🐶';
  const selectedDate = 'April 5, 2025';
  const selectedMood = 'Relax';
  const dataPoints = [4, 5, 6, 5, 3, 6, 4];
  const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = useState(null);
  const [minHR, setMinHR] = useState(40);
  const [maxHR, setMaxHR] = useState(189);

  const fetchData = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) return;

      const [response1, response2] = await Promise.all([
        fetch('https://canine-dog.vercel.app/api/animal/latest', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('https://canine-dog.vercel.app/api/animal/stats?type=weekly', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
      ]);

      const data1 = await response1.json();
      const data2 = await response2.json();

      const weeklyData = data2.stats;
      const weeklyMoodData = data2.stats.map((entry: any) => ({
        date: entry.date,
        emotionBreakdown: entry.emotionBreakdown,
        weekday: entry.weekday
      }));

      const latestEmotion = data1.latestData?.emotion || 'Relax';
      const latestEmotionTime = data1.latestData?.createdAt || 'undefined';
      
      // Format date without timezone conversion
      const formattedDate = latestEmotionTime !== 'undefined' 
        ? new Date(latestEmotionTime).toLocaleString('en-IN', {
            hour12: true,
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'undefined';

      setMoodStats({
        emotionData: weeklyMoodData,
        latestMood: latestEmotion,
        dateRange: formattedDate
      });
// In fetchData, when setting the timestamp:
if (data1.latestData?.createdAt) {
  setTimestamp(data1.latestData.createdAt);
} else {
  console.warn("No timestamp found in latest data");
}
      const allMinHR = weeklyData.map((entry: any) => entry.minHR);
      const allMaxHR = weeklyData.map((entry: any) => entry.maxHR);
      const calculatedMinHR = Math.floor(Math.min(...allMinHR));
      const calculatedMaxHR = Math.ceil(Math.max(...allMaxHR));

      setWeeklyStats({
        minData: allMinHR,
        maxData: allMaxHR,
        days: weeklyData.map((entry: any) => entry.weekday.substring(0, 2)),
        dateRange: getDateRange(weeklyData),
        minHR: calculatedMinHR,
        maxHR: calculatedMaxHR
      });
      setTemperature(data1.latestData.temperature);
      setminimumHeartRate(data1.minHR);
      setmaximumHeartRate(data1.maxHR);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDateRange = (weeklyData: any[]) => {
    if (!weeklyData.length) return '';
    const start = new Date(weeklyData[0].date);
    const end = new Date(weeklyData[weeklyData.length - 1].date);
    return `${start.toLocaleDateString()} – ${end.toLocaleDateString()}`;
  };

  const formatDateTime = (isoString: any) => {
    if (!isoString) return {};
    const date = new Date(isoString);
  
    if (isNaN(date.getTime())) {
      return { day: '--', date: '--', time: '--' };
    }
  
    // Remove timeZone to use device's local timezone
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const { day, date, time } = formatDateTime(timestamp);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
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
          mood={moodStats.latestMood}
        />
        <PetCard pet={animal} />

        <HeartRateGraph
          minData={weeklyStats.minData}
          maxData={weeklyStats.maxData}
          days={weeklyStats.days}
          dateRange={weeklyStats.dateRange}
          minHR={weeklyStats.minHR}
          maxHR={weeklyStats.maxHR}
        />
        <BodyTemperature
          day={day || '--'}
          date={date || '--'}
          temperature={temperature || 'Loading...'}
          range="37.7°C to 39.8°C"
        />

        <MoodGraph
          emotionData={moodStats.emotionData}
          latestMood={moodStats.latestMood}
          dateRange={moodStats.dateRange}
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