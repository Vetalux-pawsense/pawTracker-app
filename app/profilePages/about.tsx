import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { useWindowDimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we load fonts
SplashScreen.preventAutoHideAsync();

interface InnovationItem {
  id: string;
  title: string;
  description: string;
}

const about: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { width } = useWindowDimensions();
  
  // Responsive scaling function
  const scale = (size: number) => (width / 375) * size;




  const innovations: InnovationItem[] = [
    { id: '1', title: '87% Accuracy', description: 'AI emotion detection powered by Bidirectional LSTM neural networks' },
    { id: '2', title: 'Real-time Feedback', description: 'Instant LED color changes reflecting pet\'s emotional state' },
    { id: '3', title: 'Cloud Connected', description: 'Historical health tracking via ThingSpeak integration' },
  ];

  const techStack = ['AI/ML', 'IoT', 'React-Flask', 'Embedded Systems'];

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#f8f9fa'}}>
    <ScrollView contentContainerStyle={styles.container}>
      {/* Hero Section */}
      <View style={[styles.hero, { marginBottom: scale(40) }]}>
        <Text style={[styles.heroTitle, { fontSize: scale(28) }]}>About PawSense</Text>
        <Text style={[styles.heroTagline, { fontSize: scale(16) }]}>Where Technology Meets Compassion</Text>
      </View>

      {/* Mission Section */}
      <View style={[styles.section, { marginBottom: scale(30) }]}>
        <Text style={[styles.sectionTitle, { fontSize: scale(22) }]}>Our Mission</Text>
        <Text style={[styles.text, { fontSize: scale(14) }]}>
          At PawSense, we believe every wag, purr, and tail flick tells a story. Born from a passion for bridging the gap between humans and their furry companions...
        </Text>
      </View>

      {/* Innovation Grid */}
      <FlatList
        data={innovations}
        renderItem={({ item }) => (
          <View style={[styles.innovationCard, { width: width * 0.9, margin: scale(8) }]}>
            <Text style={[styles.innovationTitle, { fontSize: scale(18) }]}>{item.title}</Text>
            <Text style={[styles.innovationText, { fontSize: scale(12) }]}>{item.description}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        numColumns={width > 600 ? 2 : 1}
        contentContainerStyle={styles.innovationGrid}
      />

      {/* Journey Section */}
      <View style={[styles.section, { marginVertical: scale(30) }]}>
        <Text style={[styles.sectionTitle, { fontSize: scale(22) }]}>Our Journey</Text>
        <Text style={[styles.text, { fontSize: scale(14) }]}>
          Pets are family—yet their emotions often remain a mystery. Stress, anxiety, or excitement can go unnoticed...
        </Text>
        <View style={styles.techStack}>
          {techStack.map((tech, index) => (
            <View key={index} style={[styles.techItem, { padding: scale(7) }]}>
              <Text style={{  alignContent:'center',justifyContent:'center',  fontFamily: 'Poppins-Regular',
 fontSize: scale(12) }}>{tech}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA Section */}
      <View style={[styles.ctaSection, { padding: scale(20) }]}>
        <Text style={[styles.ctaTitle, { fontSize: scale(22) }]}>Join Our Mission</Text>
        <Text style={[styles.ctaText, { fontSize: scale(14) }]}>PawSense isn't just a product—it's a movement toward empathetic pet care.</Text>
        <TouchableOpacity style={[styles.ctaButton, { padding: scale(12) }]}>
          <Text style={[styles.ctaButtonText, { fontSize: scale(14) }]}>Get Involved</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { fontSize: scale(14) }]}>Because every pet deserves to be heard. 🐾</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 60,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#2d3436',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroTagline: {
    fontFamily: 'Poppins-Regular',
    color: '#636e72',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#2d3436',
    marginBottom: 16,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    color: '#636e72',
    lineHeight: 22,
  },
  innovationGrid: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innovationCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#00cec9',
    elevation: 2,
  },
  innovationTitle: {
    fontFamily: 'Poppins-SemiBold',
    color: '#00cec9',
    marginBottom: 8,
  },
  innovationText: {
    fontFamily: 'Poppins-Regular',
    color: '#636e72',
    lineHeight: 18,
  },
  techStack: {
    alignContent:'center',justifyContent:'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  },
  techItem: {
    alignContent:'center',justifyContent:'center',
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#dfe6e9',
    borderRadius: 20,
  },
  ctaSection: {
    backgroundColor: '#00cec9',
    borderRadius: 12,
    marginVertical: 30,
    alignItems: 'center',
  },
  ctaTitle: {
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 12,
  },
  ctaText: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 24,
  },
  ctaButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#00cec9',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#dfe6e9',
    paddingTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    color: '#636e72',
  },
});

export default about;