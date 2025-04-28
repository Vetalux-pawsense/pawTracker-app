import { View, Text, ScrollView, Dimensions, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import React, { useRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    image: require('../../assets/images/phone.png'),
    title: "Heart Rate Tracking",
    description: "Keep an eye on your dog's heart health with real-time monitoring and AI-driven alerts for any irregularities."
},
{
    image: require('../../assets/images/phone.png'),
    title: "Temperature Tracking",
    description: "Ensure your furry friend stays comfortable and healthy by tracking their body temperature with instant updates and insights."
},
{
    image: require('../../assets/images/phone.png'),
    title: "Mood Card",
    description: "Understand your pet’s emotions with AI-powered mood tracking, helping you create a happier, stress-free environment for them."
}

];

const welcome = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffset / width);
    setActiveIndex(currentIndex);
  };

  const handleSkip = () => {
    if (activeIndex < slides.length - 1) {
      scrollViewRef.current?.scrollTo({ x: width * (activeIndex + 1), animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
      style={styles.scroller}
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slideContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.description}>{slide.description}</Text>
            </View>

            <View style={styles.imageContainer}>
              <Image 
                source={slide.image} 
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.indicatorWrapper}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.indicator,
              activeIndex === i && styles.activeIndicator
            ]}
          />
        ))}
      </View>

      {activeIndex === slides.length - 1 && (
        <TouchableOpacity style={styles.getStartedButton}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scroller:{
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
  },
  slideContainer: {
    width,
    height: height - 100,
  },
  textContainer: {
   flex:0.5,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 34,
    color: '#333',
  },
  description: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  imageContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  indicatorWrapper: {
    position: 'absolute',
    top: height * 0.46,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  activeIndicator: {
    backgroundColor: '#333',
  },
  getStartedButton: {
    backgroundColor: '#FFA726',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#fff',
  },
});
export default welcome;