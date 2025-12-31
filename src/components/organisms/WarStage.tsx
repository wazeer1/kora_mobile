import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const { width, height } = Dimensions.get('window');
const STAGE_HEIGHT = height * 0.6; // Occupies top 60% of screen

interface WarStageProps {
    avatar1: string;
    avatar2: string;
    name1: string;
    name2: string;
    isSpeaking: '1' | '2' | null;
}

const Container = styled.View`
  height: ${STAGE_HEIGHT}px;
  width: 100%;
  background-color: black;
`;

const SplitContainer = styled.View`
  flex: 1;
`;

const SidePanel = styled.View<{ isTop: boolean }>`
  flex: 1;
  position: relative;
  border-bottom-width: ${props => props.isTop ? 2 : 0}px;
  border-top-width: ${props => !props.isTop ? 2 : 0}px;
  border-color: #D4AF37;
`;

const AvatarBg = styled(Image)`
  width: 100%;
  height: 100%;
  opacity: 0.6;
`;

const Overlay = styled(LinearGradient)`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  justify-content: flex-end;
  padding: 20px;
`;

const SpeakingIndicator = styled(Animated.View)`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(255, 0, 0, 0.8);
  padding: 4px 12px;
  border-radius: 12px;
`;

const CenterBadge = styled(Animated.View)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -30px;
  margin-left: -30px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #0A192F;
  border-width: 3px;
  border-color: #D4AF37;
  align-items: center;
  justify-content: center;
  z-index: 20;
`;

export const WarStage = ({ avatar1, avatar2, name1, name2, isSpeaking }: WarStageProps) => {
    const pulse = useSharedValue(1);

    useEffect(() => {
        pulse.value = withRepeat(
            withTiming(1.1, { duration: 800 }),
            -1,
            true
        );
    }, []);

    const pulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }]
    }));

    return (
        <Container>
            <SplitContainer>
                {/* Side A (Top) */}
                <SidePanel isTop>
                    <AvatarBg source={{ uri: avatar1 }} contentFit="cover" />
                    <Overlay colors={['transparent', 'rgba(10,25,47,0.8)']}>
                        <ThemedText style={styles.name}>{name1}</ThemedText>
                        <ThemedText style={styles.role}>TEAM CAPTAIN (A)</ThemedText>
                    </Overlay>
                    {isSpeaking === '1' && (
                        <SpeakingIndicator entering={Animated.FadeIn}>
                            <ThemedText style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>SPEAKING</ThemedText>
                        </SpeakingIndicator>
                    )}
                </SidePanel>

                {/* Side B (Bottom) */}
                <SidePanel isTop={false}>
                    <AvatarBg source={{ uri: avatar2 }} contentFit="cover" />
                    <Overlay colors={['transparent', 'rgba(10,25,47,0.8)']}>
                        <ThemedText style={styles.name}>{name2}</ThemedText>
                        <ThemedText style={styles.role}>TEAM CAPTAIN (B)</ThemedText>
                    </Overlay>
                    {isSpeaking === '2' && (
                        <SpeakingIndicator entering={Animated.FadeIn}>
                            <ThemedText style={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}>SPEAKING</ThemedText>
                        </SpeakingIndicator>
                    )}
                </SidePanel>
            </SplitContainer>

            <CenterBadge style={pulseStyle}>
                <ThemedText style={{ fontSize: 16, fontWeight: '900', color: '#D4AF37' }}>VS</ThemedText>
            </CenterBadge>
        </Container>
    );
};

const styles = StyleSheet.create({
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        fontFamily: 'serif'
    },
    role: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#D4AF37',
        letterSpacing: 1
    }
});
