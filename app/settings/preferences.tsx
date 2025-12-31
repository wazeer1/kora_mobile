import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Switch, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: #020C1B; 
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #0A192F;
`;

const HeaderTitle = styled(ThemedText)`
  font-size: 18px;
  font-weight: bold;
  color: white;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 24px;
`;

const SectionTitle = styled(ThemedText)`
  font-size: 12px;
  color: #D4AF37;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 24px;
  margin-bottom: 12px;
  font-weight: bold;
`;

const Card = styled.View`
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border-width: 1px;
  border-color: rgba(255,255,255,0.05);
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Label = styled(ThemedText)`
  color: #B0B3B8;
  font-size: 14px;
`;

// Audio Visualizer Mock
const WaveformContainer = styled.View`
  height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-bottom: 20px;
  background-color: rgba(0,0,0,0.3);
  border-radius: 8px;
`;

const Bar = styled(Animated.View)`
  width: 4px;
  background-color: #4ECDC4;
  border-radius: 2px;
`;

// Gain Slider Mock
const SliderTrack = styled.View`
  height: 4px;
  background-color: #333;
  border-radius: 2px;
  flex: 1;
  margin-horizontal: 10px;
  position: relative;
`;

const SliderFill = styled.View<{ widthPct: number }>`
  height: 100%;
  width: ${props => props.widthPct}%;
  background-color: #D4AF37;
  border-radius: 2px;
`;

const SliderThumb = styled.View<{ leftPct: number }>`
  width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: #D4AF37;
  position: absolute;
  top: -6px;
  left: ${props => props.leftPct}%;
  shadow-color: #D4AF37;
  shadow-radius: 5px;
  shadow-opacity: 0.8;
  elevation: 5;
`;

const AnimatedBar = ({ delay }: { delay: number }) => {
    const height = useSharedValue(10);

    useEffect(() => {
        height.value = withRepeat(
            withTiming(Math.random() * 40 + 10, { duration: 500 + Math.random() * 500 }),
            -1,
            true
        );
    }, []);

    const style = useAnimatedStyle(() => ({ height: height.value }));
    return <Bar style={style} />;
};

export default function PreferencesScreen() {
    const router = useRouter();

    // States
    const [gain, setGain] = useState(70); // 0-100
    const [noiseSuppression, setNoiseSuppression] = useState(true);
    const [lowData, setLowData] = useState(false);
    const [reducedMotion, setReducedMotion] = useState(false);
    const [haptics, setHaptics] = useState(true);

    return (
        <Container>
            <Header>
                <TouchableOpacity onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <IconSymbol name="chevron.left" size={20} color="#D4AF37" />
                    <ThemedText style={{ color: '#D4AF37', marginLeft: 4 }}>Back</ThemedText>
                </TouchableOpacity>
                <HeaderTitle>CALIBRATION</HeaderTitle>
                <View style={{ width: 40 }} />
            </Header>

            <Content>
                <SectionTitle>Audio Input (The Mic)</SectionTitle>
                <Card>
                    <WaveformContainer>
                        {[...Array(20)].map((_, i) => <AnimatedBar key={i} delay={i * 50} />)}
                    </WaveformContainer>

                    <Row>
                        <Label>Input Gain</Label>
                        <Label style={{ color: '#D4AF37' }}>{gain}%</Label>
                    </Row>

                    {/* Mock Slider Interaction */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <IconSymbol name="speaker.fill" size={16} color="#666" />
                        <SliderTrack>
                            <SliderFill widthPct={gain} />
                            <SliderThumb leftPct={gain} />
                        </SliderTrack>
                        <IconSymbol name="speaker.wave.3.fill" size={16} color="#D4AF37" />
                    </View>

                    <Row style={{ marginBottom: 0 }}>
                        <View>
                            <Label style={{ color: 'white', fontWeight: 'bold' }}>Noise Suppression</Label>
                            <Label style={{ fontSize: 10, marginTop: 4 }}>AI removes background hum</Label>
                        </View>
                        <Switch
                            value={noiseSuppression}
                            onValueChange={setNoiseSuppression}
                            trackColor={{ false: "#767577", true: "#D4AF37" }}
                        />
                    </Row>
                </Card>

                <SectionTitle>Game Display</SectionTitle>
                <Card>
                    <Row>
                        <Label>Low Data Mode</Label>
                        <Switch
                            value={lowData}
                            onValueChange={setLowData}
                            trackColor={{ false: "#767577", true: "#D4AF37" }}
                        />
                    </Row>
                    <Row>
                        <Label>Reduced Motion</Label>
                        <Switch
                            value={reducedMotion}
                            onValueChange={setReducedMotion}
                            trackColor={{ false: "#767577", true: "#D4AF37" }}
                        />
                    </Row>
                    <Row style={{ marginBottom: 0 }}>
                        <Label>Haptic Feedback</Label>
                        <Switch
                            value={haptics}
                            onValueChange={setHaptics}
                            trackColor={{ false: "#767577", true: "#D4AF37" }}
                        />
                    </Row>
                </Card>
            </Content>
        </Container>
    );
}
