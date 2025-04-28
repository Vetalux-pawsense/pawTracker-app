import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

interface BodyTemperatureProps {
  day: string;
  date: string;
  temperature: number;
  range: string;
}

const BodyTemperature: React.FC<BodyTemperatureProps> = ({ day, date, temperature, range }) => {
  return (
    <View style={styles.tempCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.dayText}>{day}</Text>
        <Text style={styles.dateText}>{date}</Text>
      </View>

      <View style={styles.bodySection}>
        <Text style={styles.tempLabel}>Body Temp</Text>
        <Text style={styles.tempValue}>{temperature}°C</Text>
        <Text style={styles.rangeText}>Normal Range: {range}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tempCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6D4C41',
    fontFamily: 'Poppins',
  },

  dateText: {
    fontSize: 14,
    color: '#8D6E63',
    fontFamily: 'Poppins',
  },

  bodySection: {
    alignItems: 'center',
  },

  tempLabel: {
    fontSize: 14,
    color: '#A1887F',
    fontFamily: 'Poppins',
  },

  tempValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#D84315',
    fontFamily: 'Poppins',
    marginVertical: 4,
  },

  rangeText: {
    fontSize: 12,
    color: '#6D4C41',
    fontFamily: 'Poppins',
  },
});

export default BodyTemperature;
