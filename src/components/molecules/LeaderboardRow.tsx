import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/src/hooks';
import { Theme } from '@/src/theme';
import { Image } from 'expo-image';
import React from 'react';
import styled from 'styled-components/native';

interface LeaderboardRowProps {
    rank: number;
    name: string;
    avatar: string;
    rating: number;
    trend?: 'up' | 'down' | 'flat';
    isCurrentUser?: boolean;
}

const RowContainer = styled.View<{ theme: Theme; isCurrentUser?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: ${props => props.isCurrentUser ? props.theme.colors.primary + '15' : 'transparent'};
  border-radius: ${props => props.isCurrentUser ? '8px' : '0'};
  margin-bottom: 4px;
`;

const RankText = styled(ThemedText)`
  width: 30px;
  font-weight: bold;
  opacity: 0.7;
`;

const Avatar = styled(Image)`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  margin-right: 12px;
`;

const NameText = styled(ThemedText)`
  flex: 1;
  font-weight: 500;
`;

const RatingContainer = styled.View`
  align-items: flex-end;
`;

const RatingText = styled(ThemedText)`
  font-weight: bold;
`;

export const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
    rank,
    name,
    avatar,
    rating,
    trend,
    isCurrentUser
}) => {
    const theme = useTheme();

    return (
        <RowContainer theme={theme} isCurrentUser={isCurrentUser}>
            <RankText>{rank}</RankText>
            <Avatar source={{ uri: avatar }} />
            <NameText>{name} {isCurrentUser && '(You)'}</NameText>
            <RatingContainer>
                <RatingText>{rating}</RatingText>
                {/* Trend icon could go here */}
            </RatingContainer>
        </RowContainer>
    );
};
