import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';


interface MoodcardProps {
  
  mood?: string;
}

const Moodcard: React.FC<MoodcardProps> = ({  mood = 'Neutral' }) => {
  return (
    <View style={styles.card}>
  <View style={styles.cardContent}>
    <Image
      style={styles.avatar}
      source={{
        uri: 'https://t4.ftcdn.net/jpg/11/90/72/25/360_F_1190722589_o3jh9ojmAb97EjsPfIhQ2cRDB2fO7Oaw.jpg',
      }}
    />
    <View style={styles.textContainer}>
      <Text style={styles.title}>Mood Card</Text>
      <Text style={styles.mood}>{mood}</Text>
    </View>
  </View>
</View>

  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1, 
    flexShrink: 1,
  },
  
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontFamily:'Poppins-Medium',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontFamily:'Poppins-Medium',
    fontSize: 14,
    marginBottom: 10,
    
  },
  mood: {
    fontSize: 12,
    color: '#888',
    fontFamily:'Poppins-Medium',

  },
});

export default Moodcard;
