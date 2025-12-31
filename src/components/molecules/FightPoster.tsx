import { ThemedText } from '@/components/themed-text';
import { AudioWaveform } from '@/src/components/molecules/AudioWaveform';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 0.75; // 4:3 Aspect Ratio

interface FightPosterProps {
  title: string;
  viewers: string;
  avatar1: string;
  avatar2: string;
  isFocused: boolean;
  onPress: () => void;
  onLongPress?: () => void;
}

const Container = styled.TouchableOpacity`
  width: ${CARD_WIDTH}px;
  height: ${CARD_HEIGHT}px;
  margin-right: 16px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background-color: #0A192F;
  border-width: 1px;
  border-color: rgba(255,255,255,0.1);
`;

const SplitBackground = styled.View`
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

const SideImage = styled(Image)`
  flex: 1;
  height: 100%;
`;

const Overlay = styled(LinearGradient)`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  justify-content: flex-end;
  padding: 16px;
`;

const VsBolt = styled.View`
  position: absolute;
  top: 40%;
  left: 50%;
  margin-left: -20px;
  width: 40px;
  height: 40px;
  z-index: 10;
  align-items: center;
  justify-content: center;
  background-color: #0A192F;
  border-width: 2px;
  border-color: #D4AF37;
  transform: rotate(45deg);
`;

const VsText = styled(ThemedText)`
  font-weight: 900;
  color: #D4AF37;
  transform: rotate(-45deg);
  font-size: 12px;
`;

const LiveTag = styled.View`
  position: absolute;
  top: 16px;
  left: 16px;
  background-color: rgba(255, 0, 0, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
`;

const InfoBlock = styled.View`
  margin-bottom: 8px;
`;

const FooterRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SpectateButton = styled.View`
  background-color: #D4AF37;
  padding: 6px 16px;
  border-radius: 20px;
`;

export const FightPoster = ({ title, viewers, avatar1, avatar2, isFocused, onPress, onLongPress }: FightPosterProps) => {
  return (
    <Container onPress={onPress} onLongPress={onLongPress} delayLongPress={500} activeOpacity={0.9}>

      {/* Visual Dimming for Audio Peek if focused */}
      {isFocused && <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 5 }} pointerEvents="none" />}

      <SplitBackground>
        <SideImage source={{ uri: avatar1 }} />
        <SideImage source={{ uri: avatar2 }} />
      </SplitBackground>

      <VsBolt>
        <VsText>VS</VsText>
      </VsBolt>

      <Overlay colors={['transparent', 'transparent', 'rgba(10, 25, 47, 0.95)']}>
        <LiveTag>
          <ThemedText style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>🔴 ROUND 2/3</ThemedText>
        </LiveTag>

        <InfoBlock>
          <ThemedText style={{ fontSize: 18, fontWeight: 'bold', fontFamily: 'serif', marginBottom: 4 }}>
            {title}
          </ThemedText>
          <ThemedText style={{ fontSize: 12, color: '#B0B3B8' }}>
            🎧 {viewers} Listening
          </ThemedText>
        </InfoBlock>

        <FooterRow>
          <AudioWaveform active={isFocused} />
          <SpectateButton>
            <ThemedText style={{ color: '#0A192F', fontWeight: 'bold', fontSize: 12 }}>SPECTATE</ThemedText>
          </SpectateButton>
        </FooterRow>
      </Overlay>
    </Container>
  );
};
