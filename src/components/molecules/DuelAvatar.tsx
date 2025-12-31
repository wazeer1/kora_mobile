import { ThemedText } from '@/components/themed-text';
import { Image } from 'expo-image';
import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  align-items: center;
  margin-right: 16px;
`;

const RingsContainer = styled.View`
  width: 60px;
  height: 40px; 
  margin-bottom: 8px;
  position: relative;
`;

const AvatarRing = styled.View<{ active?: boolean; offset: number; zIndex: number }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border-width: 2px;
  border-color: #D4AF37;
  overflow: hidden;
  position: absolute;
  left: ${props => props.offset}px;
  z-index: ${props => props.zIndex};
  background-color: #112240;
`;

const AvatarImg = styled(Image)`
  width: 100%;
  height: 100%;
`;

const Badge = styled.View`
  background-color: #FF4757;
  padding: 2px 6px;
  border-radius: 4px;
  position: absolute;
  bottom: -4px;
  align-self: center;
  z-index: 10;
`;

const BadgeText = styled(ThemedText)`
  font-size: 8px;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
`;

interface DuelAvatarProps {
    avatar1: string;
    avatar2: string;
    isLive?: boolean;
}

export const DuelAvatar: React.FC<DuelAvatarProps> = ({ avatar1, avatar2, isLive }) => {
    return (
        <Container>
            <RingsContainer>
                {/* User A */}
                <AvatarRing offset={0} zIndex={1}>
                    <AvatarImg source={{ uri: avatar1 }} />
                </AvatarRing>
                {/* User B - Interlocking */}
                <AvatarRing offset={24} zIndex={2}>
                    <AvatarImg source={{ uri: avatar2 }} />
                </AvatarRing>

                {isLive && (
                    <Badge style={{ left: 16 }}>
                        <BadgeText>LIVE</BadgeText>
                    </Badge>
                )}
            </RingsContainer>
        </Container>
    );
};
