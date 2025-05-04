import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';

interface MoodcardProps {
  mood?: string;
}

const emotionMap: Record<string, string> = {
  'Aggression': 'Aggression',
  'Curiosity / Alertness': 'Curious',
  'Excitement / Happiness': 'Happy',
  'Fear / Submission': 'Fear',
  'Jealousy / Possessiveness': 'Jealousy',
  'Relaxation / Contentment': 'Relax',
  'Sadness / Depression': 'Sad',
  'Stress / Anxiety': 'Stress'
};

const moodMessages: Record<string, string> = {
  'Aggression': 'Your Pet is feeling assertive. Keep monitoring interactions to maintain harmony!',
  'Curious': 'Your Pet is exploring curiously. New toys might channel this energy positively!',
  'Happy': 'Your Pet is in playful mood. You have been consistently keeping its mood happy! Cheers!',
  'Fear': 'Your Pet seems cautious. Providing safe spaces will help build confidence!',
  'Jealousy': 'Your Pet appears possessive. Extra attention might help ease tension!',
  'Relax': 'Your Pet is completely chilled out. Perfect time for bonding moments!',
  'Sad': 'Your Pet seems withdrawn. Gentle affection could help lift spirits!',
  'Stress': 'Your Pet looks overwhelmed. Quiet time might help restore balance!',
  'Neutral': 'Your Pet is in steady spirits. Consistent care maintains this balance!'
};

const Moodcard: React.FC<MoodcardProps> = ({ mood = 'Neutral' }) => {
  const mappedMood = emotionMap[mood] || mood;
  const message = moodMessages[mappedMood] || `Your Pet is feeling ${mappedMood.toLowerCase()}.`;

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
          <Text style={styles.mood}>{message}</Text>
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
