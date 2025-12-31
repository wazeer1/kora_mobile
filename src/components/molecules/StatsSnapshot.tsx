import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/src/hooks';
import { Theme } from '@/src/theme';
import React from 'react';
import styled from 'styled-components/native';

interface StatsSnapshotProps {
    debates: number;
    winRate: number;
    followers: number;
    following: number;
}

const Container = styled.View<{ theme: Theme }>`
  flex-direction: row;
  flex-wrap: wrap;
  padding: ${props => props.theme.spacing.lg}px;
  background-color: ${props => props.theme.colors.surface};
  border-top-width: 1px;
  border-top-color: ${props => props.theme.colors.border};
`;

const StatItem = styled.View`
  width: 50%;
  margin-bottom: 20px;
  align-items: flex-start;
`;

const StatValue = styled(ThemedText)`
  font-size: 20px;
  font-weight: bold;
`;

const StatLabel = styled(ThemedText)`
  font-size: 14px;
  opacity: 0.6;
`;

export const StatsSnapshot: React.FC<StatsSnapshotProps> = ({
    debates,
    winRate,
    followers,
    following
}) => {
    const theme = useTheme();

    return (
        <Container theme={theme}>
            <StatItem>
                <StatValue>{debates}</StatValue>
                <StatLabel>Debates</StatLabel>
            </StatItem>
            <StatItem>
                <StatValue>{winRate}%</StatValue>
                <StatLabel>Win Rate</StatLabel>
            </StatItem>
            <StatItem>
                <StatValue>{followers}</StatValue>
                <StatLabel>Followers</StatLabel>
            </StatItem>
            <StatItem>
                <StatValue>{following}</StatValue>
                <StatLabel>Following</StatLabel>
            </StatItem>
        </Container>
    );
};
