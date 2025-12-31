import { ThemedText } from '@/components/themed-text';
import { Button } from '@/src/components/atoms/Button';
import { Image } from 'expo-image';
import React from 'react';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

const Card = styled.View`
  background-color: #112240;
  border-radius: 12px;
  border-width: 1px;
  border-color: rgba(212, 175, 55, 0.2);
  margin-bottom: 20px;
  overflow: hidden;
`;

const BattleArea = styled.View`
  flex-direction: row;
  height: 140px;
  position: relative;
`;

const ContenderSide = styled.View`
  flex: 1;
  position: relative;
`;

const ContenderImage = styled(Image)`
  width: 100%;
  height: 100%;
  opacity: 0.8;
`;

const VSContainer = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  margin-left: -20px;
  width: 40px;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

// Jagged line simulation using a simple view for now, could be SVG
const JaggedLine = styled.View`
  width: 2px;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  transform: rotate(15deg);
`;

const VSText = styled(ThemedText)`
  position: absolute;
  font-weight: 900;
  font-style: italic;
  font-size: 20px;
  color: #D4AF37;
  text-shadow: 0px 2px 4px rgba(0,0,0,0.5);
  background-color: #112240;
  padding: 4px;
`;

const InfoArea = styled.View`
  padding: 16px;
`;

const Title = styled(ThemedText)`
  font-family: serif; 
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  color: white;
`;

const MetaRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const MetaText = styled(ThemedText)`
  font-size: 12px;
  color: #B0B3B8;
  font-weight: 600;
`;

const SentimentBar = styled.View`
  height: 6px;
  background-color: rgba(255,255,255,0.1);
  border-radius: 3px;
  flex-direction: row;
  overflow: hidden;
  margin-bottom: 16px;
`;

const SentimentFill = styled.View<{ percent: number; color: string }>`
  width: ${props => props.percent}%;
  height: 100%;
  background-color: ${props => props.color};
`;

interface ArenaLiveCardProps {
  title: string;
  viewers: string;
  time: string;
  contender1: { name: string; image: string; sentiment: number };
  contender2: { name: string; image: string };
  onSpectate?: () => void;
  onAvatarPress?: () => void;
}

export const ArenaLiveCard: React.FC<ArenaLiveCardProps> = ({
  title,
  viewers,
  time,
  contender1,
  contender2,
  onSpectate,
  onAvatarPress
}) => {
  return (
    <Card>
      <BattleArea onTouchEnd={onAvatarPress}>
        <ContenderSide>
          <ContenderImage source={{ uri: contender1.image }} contentFit="cover" />
        </ContenderSide>
        <ContenderSide>
          <ContenderImage source={{ uri: contender2.image }} contentFit="cover" />
        </ContenderSide>

        <VSContainer>
          <JaggedLine />
          <VSText>VS</VSText>
        </VSContainer>
      </BattleArea>

      <InfoArea>
        <Title numberOfLines={2}>{title}</Title>

        <MetaRow>
          <MetaText>🎧 {viewers} listening</MetaText>
          <MetaText>{time}</MetaText>
        </MetaRow>

        {/* Tug of War Sentiment */}
        <SentimentBar>
          <SentimentFill percent={contender1.sentiment} color="#4ECDC4" />
          <SentimentFill percent={100 - contender1.sentiment} color="#FF6B6B" />
        </SentimentBar>

        <Button
          label="SPECTATE"
          onPress={onSpectate || (() => { })}
          fullWidth
          style={{ backgroundColor: '#D4AF37' }}
          labelStyle={{ color: '#0A192F', fontWeight: '900' }}
        />
      </InfoArea>
    </Card>
  );
};
