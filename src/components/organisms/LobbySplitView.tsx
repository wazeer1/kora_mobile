import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  flex-direction: row;
  position: relative;
`;

const Side = styled(LinearGradient)`
  flex: 1;
  align-items: center;
  padding-top: 40px;
`;

const LightningContainer = styled.View`
  position: absolute;
  left: ${(width / 2) - 10}px;
  top: 0;
  bottom: 0;
  width: 20px;
  align-items: center;
  z-index: 10;
`;

const LightningLine = styled(Animated.View)`
  width: 2px;
  height: 100%;
  background-color: white;
  shadow-color: white;
  shadow-offset: 0px 0px;
  shadow-opacity: 0.8;
  shadow-radius: 10px;
  elevation: 5;
`;

const VsBadge = styled.View`
  position: absolute;
  top: 45%;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #0A192F;
  border-width: 2px;
  border-color: #D4AF37;
  align-items: center;
  justify-content: center;
  z-index: 20;
`;

export const LobbySplitView = ({ children }: { children: React.ReactNode }) => {
    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withSequence(
                withTiming(1.5, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const glowStyle = useAnimatedStyle(() => ({
        shadowRadius: pulse.value * 10,
        opacity: 0.8 + (pulse.value * 0.2)
    }));

    return (
        <Container>
            <Side colors={['#0A192F', 'rgba(10, 25, 80, 0.8)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                {/* Left Content (Blue Team) */}
                {React.Children.toArray(children)[0]}
            </Side>

            <LightningContainer>
                <LightningLine style={glowStyle} />
                <VsBadge>
                    <ThemedText style={{ fontSize: 12, fontWeight: '900', color: '#D4AF37', fontStyle: 'italic' }}>VS</ThemedText>
                </VsBadge>
            </LightningContainer>

            <Side colors={['#0A192F', 'rgba(80, 10, 25, 0.6)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                {/* Right Content (Red Team) */}
                {React.Children.toArray(children)[1]}
            </Side>
        </Container>
    );
};
