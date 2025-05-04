import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop, Line, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface HeartRateGraphProps {
  minData: number[];
  maxData: number[];
  days: string[];
  dateRange: string;
  minHR: number;
  maxHR: number;
}

const BAR_WIDTH = 18;
const BAR_SPACING = 28;
const CHART_HEIGHT = 180;

const HeartRateGraph = ({
  minData = [],
  maxData = [],
  days = [],
  dateRange,
  minHR,
  maxHR
}: HeartRateGraphProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const range = maxHR - minHR;
  const SCROLL_WIDTH = days.length * (BAR_WIDTH + BAR_SPACING);

  const gridLevels = useMemo(() => {
    const steps = 4;
    const stepSize = (maxHR - minHR) / steps;
    return Array.from({ length: steps + 1 }, (_, i) =>
      Math.round(minHR + i * stepSize)
    );
  }, [minHR, maxHR]);

  const getBarY = (value: number) => {
    const percent = (value - minHR) / range;
    return CHART_HEIGHT - (percent * CHART_HEIGHT);
  };

  const getBarHeight = (min: number, max: number) => {
    return Math.max(getBarY(min) - getBarY(max), 1);
  };

  if (!minData.length || !maxData.length) {
    return (
      <View style={styles.card}>
        <Text>Loading heart rate data...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.card}>
        <Text style={styles.title}>Heart Rate</Text>
        <Text style={styles.description}>
  This graph displays your daily heart rate fluctuations. Each vertical bar shows your pet's minimum and maximum recorded heart rates for that day, with taller bars indicating greater variation.
</Text>
        <Text style={styles.range}>{minHR}–{maxHR} bpm</Text>
        <Text style={styles.date}>{dateRange || '10 – 17 Sep 2024'}</Text>

        <View style={styles.chartRow}>
          <View style={styles.yAxisLabels}>
            {gridLevels.map((level, index) => (
              <Text
                key={index}
                style={[styles.yLabel, { top: getBarY(level) - 6 }]}
              >
                {level}
              </Text>
            ))}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableWithoutFeedback onPress={() => setSelectedIndex(null)}>
              <View>
                <Svg height={CHART_HEIGHT} width={SCROLL_WIDTH}>
                  <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <Stop offset="0" stopColor="#4D55CC" stopOpacity="0.8" />
                      <Stop offset="1" stopColor="#7A73D1" stopOpacity="0.2" />
                    </LinearGradient>
                  </Defs>

                  {gridLevels.map((level, index) => (
                    <Line
                      key={`h-${index}`}
                      x1="0"
                      y1={getBarY(level)}
                      x2={SCROLL_WIDTH}
                      y2={getBarY(level)}
                      stroke="#eee"
                      strokeWidth="1"
                    />
                  ))}

                  {days.map((_, index) => {
                    const x = index * (BAR_WIDTH + BAR_SPACING);
                    const y = getBarY(maxData[index]);
                    const height = getBarHeight(minData[index], maxData[index]);
                    const showDot = height <= 1;

                    return (
                      <React.Fragment key={index}>
                        <Rect
                          x={x}
                          y={y}
                          rx={BAR_WIDTH / 2}
                          ry={BAR_WIDTH / 2}
                          width={BAR_WIDTH}
                          height={height}
                          fill={selectedIndex === index ? '#4D55CC' : 'url(#grad)'}
                          opacity={selectedIndex === index ? 0.8 : 1}
                        />
                        {showDot && (
                          <Circle
                            cx={x + BAR_WIDTH / 2}
                            cy={y + height / 2}
                            r={2}
                            fill="#4D55CC"
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </Svg>

                <View style={{ 
                  position: 'absolute', 
                  width: SCROLL_WIDTH, 
                  height: CHART_HEIGHT,
                  pointerEvents: 'box-none'
                }}>
                  {days.map((_, index) => {
                    const x = index * (BAR_WIDTH + BAR_SPACING);
                    return (
                      <TouchableWithoutFeedback
                        key={`touchable-${index}`}
                        onPress={() => {
                          setSelectedIndex(current => current === index ? null : index);
                        }}
                      >
                        <View
                          style={{
                            position: 'absolute',
                            left: x,
                            top: 0,
                            width: BAR_WIDTH,
                            height: CHART_HEIGHT,
                            backgroundColor: 'transparent',
                          }}
                        />
                      </TouchableWithoutFeedback>
                    );
                  })}
                </View>

                <View style={[styles.dayLabels, { width: SCROLL_WIDTH }]}>
                  {days.map((day, index) => (
                    <Text key={index} style={styles.dayText}>
                      {day}
                    </Text>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </View>

        <View style={styles.hrRow}>
          <Text style={styles.hrLabel}>Avg Min Heart Rate for the week</Text>
          <Text style={styles.hrValue}>
            {selectedIndex !== null 
              ? minData[selectedIndex].toFixed(0)
              : Math.min(...minData).toFixed(0)}
          </Text>
        </View>
        <View style={styles.hrRow}>
          <Text style={styles.hrLabel}>Avg Max Heart Rate for the week</Text>
          <Text style={styles.hrValue}>
            {selectedIndex !== null
              ? maxData[selectedIndex].toFixed(0)
              : Math.max(...maxData).toFixed(0)}
          </Text>
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
  description: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: '#999',
    lineHeight: 14,
    textAlign:'justify',
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
    height: 180,
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
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10,
    marginLeft:-11,
    width: '100%',
  },

  dayText: {
    fontFamily:"Poppins-Medium",
    fontSize: 10,
    color: '#4D55CC',
    width: BAR_WIDTH + BAR_SPACING,
    textAlign: 'center',
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

export default HeartRateGraph;
