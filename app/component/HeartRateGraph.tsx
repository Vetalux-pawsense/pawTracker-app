import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop, Line } from 'react-native-svg';

const { width } = Dimensions.get('window');

const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu'];
const minData = [90, 85, 80, 95, 88, 77, 67, 82, 76];
const maxData = [140, 130, 125, 145, 135, 133, 120, 150, 138];

const BAR_WIDTH = 18;
const BAR_SPACING = 28;
const CHART_HEIGHT = 180;
const SCROLL_WIDTH = days.length * (BAR_WIDTH + BAR_SPACING);

const maxHR = 189;
const minHR = 40;
const range = maxHR - minHR;

const gridLevels = [40, 80, 120, 160, 189];

const HeartRateBarChart = () => {
  const getBarY = (value: number) => {
    const percent = (value - minHR) / range;
    return CHART_HEIGHT - percent * CHART_HEIGHT;
  };

  const getBarHeight = (min: number, max: number) => {
    return getBarY(min) - getBarY(max);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Heart Rate</Text>
        <Text style={styles.range}>40–189 bpm</Text>
        <Text style={styles.date}>10 – 17 Sep 2024</Text>

        <View style={styles.chartRow}>
          <View style={styles.yAxisLabels}>
            {gridLevels.map((level, index) => {
              const top = getBarY(level) - 6;
              return (
                <Text key={index} style={[styles.yLabel, { top }]}>{level}</Text>
              );
            })}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              <Svg height={CHART_HEIGHT} width={SCROLL_WIDTH}>
                <Defs>
                  <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor="#4D55CC" stopOpacity="0.8" />
                    <Stop offset="1" stopColor="#7A73D1" stopOpacity="0.2" />
                    <Stop offset="1" stopColor="black" stopOpacity="0.8" />
                  </LinearGradient>
                </Defs>

                {gridLevels.map((level, index) => {
                  const y = getBarY(level);
                  return (
                    <Line
                      key={`h-${index}`}
                      x1="0"
                      y1={y}
                      x2={SCROLL_WIDTH}
                      y2={y}
                      stroke="#eee"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Vertical grid lines (one per bar)
{days.map((_, index) => {
  const x = index * (BAR_WIDTH + BAR_SPACING) + BAR_WIDTH / 2;
  return (
    <Line
      key={`v-${index}`}
      x1={x}
      y1={0}
      x2={x}
      y2={CHART_HEIGHT}
      stroke="#eee"
      strokeWidth="1"
    />
  );
})} */}


                {days.map((day, index) => {
                  const x = index * (BAR_WIDTH + BAR_SPACING);
                  const y = getBarY(maxData[index]);
                  const height = getBarHeight(minData[index], maxData[index]);
                  return (
                    <Rect
                      key={index}
                      x={x}
                      y={y}
                      rx={BAR_WIDTH / 2}
                      ry={BAR_WIDTH / 2}
                      width={BAR_WIDTH}
                      height={height}
                      fill="url(#grad)"
                    />
                  );
                })}
              </Svg>

              <View style={[styles.dayLabels, { width: SCROLL_WIDTH }]}>
                {days.map((day, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.dayText,
                      {
                        position: 'absolute',
                        left: index * (BAR_WIDTH + BAR_SPACING),
                        width: BAR_WIDTH,
                        textAlign: 'center',
                      },
                    ]}
                  >
                    {day}
                  </Text>

                ))}
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={styles.hrRow}>
          <Text style={styles.hrLabel}>Today (00:00)</Text>
          <Text style={styles.hrValue}>125</Text>
        </View>
        <View style={styles.hrRow}>
          <Text style={styles.hrLabel}>Today (00:00)</Text>
          <Text style={styles.hrValue}>110</Text>
        </View>
      </View>



    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderColor: '#f4f4f4',
    borderWidth: 1,
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  Tempcard:
  {
    margin: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    fontWeight: '600',
    color: '#000',
  },
  range: {
    fontFamily: 'Poppins-Bold',
    marginTop: 10,

    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  date: {
    fontSize: 10,
    color: '#999',
    marginTop: 10,
    marginBottom: 20,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  yAxisLabels: {
    width: 60,
    marginRight: 4,
    height: CHART_HEIGHT,
    position: 'relative',
  },
  yLabel: {
    position: 'absolute',
    fontSize: 10,
    color: '#aaa',
    width: 30,
    textAlign: 'right',
  },
  dayLabels: {
    height: 20,
    position: 'relative',
  },

  dayText: {
    fontSize: 12,
    color: '#4D55CC',
  },
  hrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  hrLabel: {
    fontSize: 12,
    color: '#999',
  },
  hrValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

});

export default HeartRateBarChart;
