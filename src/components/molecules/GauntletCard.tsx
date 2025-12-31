import { ThemedText } from '@/components/themed-text';
import { Button } from '@/src/components/atoms/Button';
import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

const CardContainer = styled.View`
  width: 280px;
  height: 140px;
  background-color: #1A2744; 
  margin-right: 16px;
  border-radius: 12px;
  flex-direction: row;
  overflow: hidden;
  border-right-width: 4px;
  border-right-color: #D4AF37;
`;

const LeftSection = styled.View`
  width: 80px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0,0.2);
  padding: 8px;
`;

const Avatar = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border-width: 2px;
  border-color: rgba(255,255,255,0.2);
  margin-bottom: 8px;
`;

const RatingBadge = styled.View`
  background-color: #D4AF37;
  padding: 2px 6px;
  border-radius: 4px;
`;

const RatingText = styled(ThemedText)`
  font-size: 10px;
  font-weight: bold;
  color: #0A192F;
`;

const MainSection = styled.View`
  flex: 1;
  padding: 12px;
  justify-content: space-between;
`;

const TopicText = styled(ThemedText)`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  line-height: 20px;
`;

const ChallengerName = styled(ThemedText)`
  font-size: 12px;
  color: #B0B3B8;
  margin-bottom: 8px;
`;

// Ticket Stub "tear" effect on right side could be complex, keeping simple border for now.

interface GauntletCardProps {
    challenger: {
        name: string;
        avatar: string;
        rating: number;
    };
    topic: string;
    onAccept: () => void;
}

export const GauntletCard: React.FC<GauntletCardProps> = ({ challenger, topic, onAccept }) => {
    return (
        <CardContainer>
            <LeftSection>
                <Avatar source={{ uri: challenger.avatar }} />
                <RatingBadge>
                    <RatingText>{challenger.rating}</RatingText>
                </RatingBadge>
            </LeftSection>

            <MainSection>
                <View>
                    <TopicText numberOfLines={2}>{topic}</TopicText>
                    <ChallengerName>vs {challenger.name}</ChallengerName>
                </View>

                <Button
                    label="Accept Duel"
                    size="sm"
                    onPress={onAccept}
                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', borderWidth: 1, borderColor: '#D4AF37' }}
                    labelStyle={{ color: '#D4AF37', fontSize: 12 }}
                />
            </MainSection>
        </CardContainer>
    );
};
