import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/src/hooks';
import { Theme } from '@/src/theme';
import React from 'react';
import styled from 'styled-components/native';

interface RankBadgeProps {
    rank: number;
    division: string; // e.g., 'Gold III'
    rating: number;
}

const Container = styled.View<{ theme: Theme }>`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.primary}20; 
  padding: 4px 12px;
  border-radius: 16px;
  align-self: flex-start;
`;

const DivisionText = styled(ThemedText) <{ theme: Theme }>`
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
  font-size: 12px;
  margin-right: 8px;
`;

const RatingText = styled(ThemedText) <{ theme: Theme }>`
  font-size: 12px;
  opacity: 0.8;
`;

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, division, rating }) => {
    const theme = useTheme();

    return (
        <Container theme={theme}>
            <DivisionText theme={theme}>{division}</DivisionText>
            <RatingText theme={theme}>{rating}</RatingText>
        </Container>
    );
};
