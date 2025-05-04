import React from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import Svg, { Circle, Path, Line } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;
const CHART_HEIGHT = 250;
const CHART_WIDTH = screenWidth * 1.5;

type MoodGraphProps = {
    emotionData: Array<{
        date: string;
        emotionBreakdown: Record<string, number>;
        weekday?: string;  // Make optional
      }>;    latestMood: string;
    dateRange: string;
};
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
const moodLabels = [
    'Aggression',
    'Stress',
    'Jealousy',
    'Fear', 
    'Sad',
    'Curious',
    'Relax',
    'Happy' // Positive emotions at the top
  ];// Check for empty data first
  const MoodGraph: React.FC<MoodGraphProps> = ({ emotionData, latestMood, dateRange }) => {
    
if (!emotionData || emotionData.length === 0) {
    return <Text>No mood data available.</Text>;
}

console.log(emotionData);
// Process data
const weekLabels = emotionData.map((entry) => 
    entry.weekday 
  );
 

  // Process data points with emotion mapping
  const dataPoints = emotionData.map((entry) => {
    const emotions = Object.entries(entry.emotionBreakdown);
    if (emotions.length === 0) return 0;
    
    const dominantEmotion = emotions.reduce((a, b) => (a[1] > b[1] ? a : b))[0];
    const simplifiedEmotion = emotionMap[dominantEmotion] || 'Unknown';
    
    return moodLabels.indexOf(simplifiedEmotion);
  });

  const maxMood = moodLabels.length - 1;
  const minMood = 0;
  const pointSpacing = 70;
  const yLabelSpacing = CHART_HEIGHT / (moodLabels.length - 1);
const getY = (value: number) => {
    const range = maxMood - minMood;
    const percent = (value - minMood) / range;
    return CHART_HEIGHT - percent * CHART_HEIGHT;
};

// Generate points array
const points = dataPoints.map((value, index) => ({
    x: index * pointSpacing + 50,
    y: getY(value),
}));
   

    const generateSmoothPath = (pts: { x: number; y: number }[]) => {
        if (pts.length < 2) return '';

        let d = `M ${pts[0].x} ${pts[0].y}`;

        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i - 1] || pts[i];
            const p1 = pts[i];
            const p2 = pts[i + 1];
            const p3 = pts[i + 2] || p2;

            const control1X = p1.x + (p2.x - p0.x) / 6;
            const control1Y = p1.y + (p2.y - p0.y) / 6;
            const control2X = p2.x - (p3.x - p1.x) / 6;
            const control2Y = p2.y - (p3.y - p1.y) / 6;

            d += ` C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${p2.x} ${p2.y}`;
        }

        return d;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Weekly Mood Analysis</Text>


            <Text style={styles.tooltipText}>This chart presents a weekly overview of your pet’s emotional patterns, helping you better understand their behavior.
            </Text>


            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                    <View style={{   width: 80, height: CHART_HEIGHT, position: 'relative' }}>
                        {[...moodLabels].reverse().map((label, index) => {
                            const y = index * yLabelSpacing - 6; 
                            return (
                                <Text
                                    key={index}
                                    style={[
                                        styles.yAxisLabel,
                                        {
                                            position: 'absolute',
                                            top: y,
                                            left: 0,
                                        },
                                    ]}
                                >
                                    {label}
                                </Text>
                            );
                        })}
                    </View>



                    <View>
                        <Svg height={CHART_HEIGHT} width={CHART_WIDTH}>
                            {dataPoints.map((_, i) => {
                                const x = i * pointSpacing + 50;
                                return (
                                    <Line
                                        key={`grid-${i}`}
                                        x1={x}
                                        y1="0"
                                        x2={x}
                                        y2={CHART_HEIGHT}
                                        stroke="#E0E0E0"
                                        strokeWidth="1"
                                        strokeDasharray="4"
                                    />
                                );
                            })}

                            {moodLabels.map((_, i) => {
                                const y = i * yLabelSpacing;
                                return (
                                    <Line
                                        key={`hgrid-${i}`}
                                        x1="0"
                                        y1={y}
                                        x2={CHART_WIDTH}
                                        y2={y}
                                        stroke="#F0F0F0"
                                        strokeWidth="1"
                                    />
                                );
                            })}

                            <Path d={generateSmoothPath(points)} fill="none" stroke="#5AA3FF" strokeWidth="3" />


                            {points.map((pt, i) => (
                                <Circle key={i} cx={pt.x} cy={pt.y} r="4" fill="#5AA3FF" />
                            ))}
                        </Svg>

                        <View style={[styles.xLabels, { width: CHART_WIDTH }]}>
                            {weekLabels.map((label, i) => (
                                <Text
                                    key={i}
                                    style={[
                                        styles.axisLabel,
                                        {
                                            left: i * pointSpacing + 35,
                                            width: pointSpacing,
                                            position: 'absolute',
                                            textAlign: 'center',
                                        },
                                    ]}
                                >
                                    {label}
                                </Text>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
            <View style={styles.summaryRow}>
                <View style={styles.summaryBlockLeft}>
                    <Text style={styles.summaryLabel}>Today</Text>
                    <Text style={styles.summaryValue}>{dateRange}</Text>
                </View>
                <View style={styles.summaryBlockRight}>
                    <Text style={styles.summaryLabel}>Mood</Text>
                    <Text style={styles.summaryValue}>{emotionMap[latestMood] || "unavaulabe"}</Text>
                    </View>
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginVertical: 20,
        elevation: 3,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        fontFamily: 'Poppins',
        marginBottom: 12,
    },
    tooltipBox: {
        backgroundColor: '#F0F4F8',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    tooltipText: {
        marginTop: 10,
        marginBottom: 20,
        fontSize: 10,
        fontFamily: 'Poppins-Medium',
        fontWeight: '600',
        color: 'gray',
    },
    xLabels: {
        height: 24,
        position: 'relative',
        marginTop: 8,
    },
    axisLabel: {
        fontSize: 12,
        color: '#7F8C8D',
        fontFamily: 'Poppins',
    },
    yAxisLabel: {
        fontSize: 12,
        color: '#7F8C8D',
        fontFamily: 'Poppins',
        textAlign: 'left', 
    },


    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingHorizontal: 8,
        alignItems: 'flex-start',
    },

    summaryBlockLeft: {
        alignItems: 'flex-start',
    },

    summaryBlockRight: {
        alignItems: 'flex-end',
    },

    summaryLabel: {
        fontSize: 14,
        color: '#95A5A6',
        fontFamily: 'Poppins',
        marginBottom: 4,
    },

    summaryValue: {
        fontSize: 16,
        color: '#2C3E50',
        fontWeight: '600',
        fontFamily: 'Poppins',
    },

});

export default MoodGraph;
